import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
    const [settings, setSettings] = useState({
        language: 'english',
        theme: 'dark',
        notifications: true,
        username: ''
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save settings logic here
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="settings-page">
            <div className="settings-animated-bg"></div>
            
            <nav className="settings-navbar">
                <div className="nav-brand">ISL Connect</div>
                <div className="nav-links">
                    <a href="/youtube">Converter</a>
                    <a href="/about">About</a>
                    <a href="/settings" className="active">Settings</a>
                </div>
            </nav>

            <div className="settings-content">
                <div className="settings-header">
                    <h1>Settings</h1>
                    <p>Customize your ISL Connect experience</p>
                </div>

                <form onSubmit={handleSubmit} className="settings-form">
                    <div className="settings-section">
                        <h2>Preferences</h2>
                        
                        <div className="form-group">
                            <label htmlFor="language">Preferred Language</label>
                            <select 
                                id="language" 
                                name="language" 
                                value={settings.language}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="english">English</option>
                                <option value="isl">Indian Sign Language</option>
                                <option value="asl">American Sign Language</option>
                                <option value="bsl">British Sign Language</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="theme">Theme</label>
                            <select 
                                id="theme" 
                                name="theme" 
                                value={settings.theme}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                            </select>
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    name="notifications" 
                                    checked={settings.notifications}
                                    onChange={handleChange}
                                    className="form-checkbox"
                                />
                                <span className="checkbox-text">
                                    <strong>Enable Notifications</strong>
                                    <small>Get notified about new features and updates</small>
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h2>Account</h2>
                        
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter your username"
                                value={settings.username}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="your.email@example.com"
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="settings-actions">
                        {saved && (
                            <div className="success-message">
                                ✓ Settings saved successfully!
                            </div>
                        )}
                        <button type="submit" className="save-btn">
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
