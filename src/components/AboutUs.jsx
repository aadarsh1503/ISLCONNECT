import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css';

const AboutUsPage = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const aboutData = {
        mission: "Our mission is to break down communication barriers by providing accessible Indian Sign Language (ISL) translation tools. We believe everyone deserves to communicate freely and be understood.",
        offerings: [
            "Text to Sign Language Conversion - Type any message and see it translated into ISL gestures",
            "Real-time ISL Demonstrations - Watch authentic sign language gestures for each letter",
            "Educational Platform - Learn ISL alphabet through interactive demonstrations",
            "Accessible Design - User-friendly interface designed for everyone"
        ],
        whyChooseUs: "We combine cutting-edge technology with authentic ISL datasets to provide accurate and reliable sign language translations. Our platform is designed to be intuitive, fast, and accessible to everyone, whether you're learning ISL or need quick translations."
    };

    return (
        <div className="about-page">
            <div className="about-animated-bg"></div>
            
            <nav className="about-navbar">
                <div className="nav-brand">ISL Connect</div>
                <div className="nav-links">
                    {isLoggedIn ? (
                        <>
                            <a href="/text-to-sign">Text to Sign</a>
                            <a href="/about" className="active">About</a>
                            <button onClick={handleLogout} className="logout-btn">
                                <span>🚪</span>
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <a href="/">Home</a>
                            <a href="/about" className="active">About</a>
                            <a href="/" className="login-link">Login</a>
                        </>
                    )}
                </div>
            </nav>

            <div className="about-content-wrapper">
                <header className="about-hero">
                    <h1>About ISL Connect</h1>
                    <p>Bridging Communication Through Technology</p>
                </header>

                <section className="about-sections">
                    <div className="about-card">
                        <div className="card-icon">🎯</div>
                        <h2>Our Mission</h2>
                        <p>{aboutData.mission}</p>
                    </div>

                    <div className="about-card">
                        <div className="card-icon">✨</div>
                        <h2>What We Offer</h2>
                        <ul>
                            {aboutData.offerings.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="about-card">
                        <div className="card-icon">💡</div>
                        <h2>Why Choose Us?</h2>
                        <p>{aboutData.whyChooseUs}</p>
                    </div>
                </section>

                <footer className="about-footer">
                    <p>&copy; 2024 ISL Connect | Designed for Inclusion</p>
                </footer>
            </div>
        </div>
    );
};

export default AboutUsPage;
