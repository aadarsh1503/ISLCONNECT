import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TextToSign.css';
import HandAvatar3D from './HandAvatar3D';

const PYTHON_API_URL = 'http://127.0.0.1:5000';

const TextToSign = () => {
  const [inputText, setInputText] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [currentLetter, setCurrentLetter] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const avatarRef = useRef(null);
  const navigate = useNavigate();

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Add blur effect when scrolled
      if (currentScrollY > 50) {
        setNavbarScrolled(true);
      } else {
        setNavbarScrolled(false);
      }
      
      // Hide/show navbar
      if (currentScrollY < 10) {
        setNavbarVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setNavbarVisible(false);
      } else {
        // Scrolling up
        setNavbarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleConvert = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text');
      return;
    }

    setError('');
    setIsPlaying(true);

    // Split by spaces to get words
    const words = inputText.trim().toUpperCase().split(/\s+/);
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/[^A-Z]/g, ''); // Remove non-letters
      if (word) {
        setCurrentWord(word);
        
        // Show each character in the word
        for (let j = 0; j < word.length; j++) {
          setCurrentLetter(word[j]);
          await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5 seconds per letter (much slower)
        }
        
        // Pause between words
        await new Promise(resolve => setTimeout(resolve, 800)); // 1 second pause between words
      }
    }

    setIsPlaying(false);
    setCurrentWord('');
    setCurrentLetter('');
  };

  return (
    <div className="text-to-sign-page">
      <div className="text-sign-animated-bg"></div>

      <nav className={`text-sign-navbar ${navbarVisible ? 'navbar-visible' : 'navbar-hidden'} ${navbarScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-brand">ISL Connect</div>
        <div className="nav-links">
          <a href="/text-to-sign" className="active">Text to Sign</a>
          <a href="/about">About</a>
          <button onClick={handleLogout} className="logout-btn">
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="text-sign-content">
        <div className="text-sign-header">
          <h1>Text to Sign Language</h1>
          <p>Type your message and see it in Indian Sign Language</p>
        </div>

        <div className="text-sign-container">
          <div className="input-section">
            <h2>Your Message</h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here..."
              className="text-input"
              rows="10"
            />
            <button 
              onClick={handleConvert} 
              className="convert-btn"
              disabled={isPlaying}
            >
              {isPlaying ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <span>🤟</span>
                  <span>Convert to Sign Language</span>
                </>
              )}
            </button>
            {currentWord && (
              <div className="current-letter-display">
                Currently signing word: <strong>{currentWord}</strong>
                {currentLetter && (
                  <span className="current-char"> - Letter: <strong>{currentLetter}</strong></span>
                )}
              </div>
            )}
          </div>

          <div className="avatar-section">
            <h2>ISL Sign Language</h2>
            <div className="avatar-container-3d">
              {!isPlaying && !currentWord ? (
                <div className="avatar-idle-message">
                  <div className="idle-icon">🤟</div>
                  <p>Type a message and click "Convert" to see ISL gestures for each letter!</p>
                </div>
              ) : (
                <>
                  {currentLetter && (
                    <div className="isl-image-display">
                      <div className="particle particle-1"></div>
                      <div className="particle particle-2"></div>
                      <div className="particle particle-3"></div>
                      <div className="particle particle-4"></div>
                      <div className="particle particle-5"></div>
                      <div className="particle particle-6"></div>
                      <img 
                        key={currentLetter}
                        src={`http://127.0.0.1:5000/isl_image/${currentLetter}`}
                        alt={`ISL sign for ${currentLetter}`}
                        className="isl-gesture-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  {currentLetter && (
                    <div className="letter-display-badge">
                      <div className="letter-badge">{currentLetter}</div>
                      <div className="word-context">in word: {currentWord}</div>
                      <div className="signing-indicator">
                        <span className="pulse-dot"></span>
                        <span>Signing...</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="error-alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="info-card">
          <h3>💡 How it works</h3>
          <p>Type your message and watch as each letter is demonstrated using real ISL (Indian Sign Language) gestures from our dataset. Each character in every word is shown one by one!</p>
        </div>
      </div>
    </div>
  );
};

export default TextToSign;
