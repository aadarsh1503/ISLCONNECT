import React, { useState } from 'react';
import './youtube.css';

const PYTHON_API_URL = 'http://127.0.0.1:5000';

const YouTubeWithSignLanguage = () => {
  const [signLanguageVideo, setSignLanguageVideo] = useState('');
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setSignLanguageVideo('');
    setTranscription('');

    const requestBody = videoUrl.startsWith("http")
      ? { url: videoUrl }
      : { query: videoUrl };

    fetch(`${PYTHON_API_URL}/process_video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setSignLanguageVideo(data.video_path);
        setTranscription(data.transcription || '');
      }
    })
    .catch(error => {
      setError('Failed to process video: ' + error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="youtube-page">
      <div className="animated-bg"></div>
      
      <nav className="navbar glass">
        <div className="nav-brand neon-text">ISL Connect</div>
        <div className="nav-links">
          <a href="/youtube" className="nav-link">YouTube Converter</a>
          <a href="/text-to-sign" className="nav-link">Text to Sign</a>
          <a href="/about" className="nav-link">About</a>
        </div>
      </nav>

      <div className="content-wrapper">
        <div className="hero-section">
          <h1 className="hero-title">
            <span className="neon-text">YouTube</span> to ISL Converter
          </h1>
          <p className="hero-subtitle">Transform any YouTube video into Indian Sign Language</p>
        </div>

        <div className="search-container glass">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-input-wrapper">
              <span className="search-icon">🔗</span>
              <input 
                type="text" 
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste YouTube URL or search query..." 
                className="input-field search-input"
                disabled={loading}
              />
            </div>
            <button 
              type="submit"
              className="btn-primary search-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>Convert</span>
                </>
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="alert error-alert glass">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {signLanguageVideo && (
          <div className="results-grid">
            <div className="video-section card">
              <div className="section-header">
                <h2>ISL Translation</h2>
                <span className="badge">AI Generated</span>
              </div>
              <div className="video-wrapper">
                <video controls className="video-player">
                  <source src={signLanguageVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {transcription && (
              <div className="transcription-section card">
                <div className="section-header">
                  <h2>Transcription</h2>
                  <span className="badge">Whisper AI</span>
                </div>
                <div className="transcription-content">
                  <p>{transcription}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {!signLanguageVideo && !loading && (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h3>No video processed yet</h3>
            <p>Paste a YouTube URL above to get started</p>
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner-large"></div>
            <h3>Processing Video</h3>
            <p>Downloading, transcribing, and generating ISL...</p>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeWithSignLanguage;
