import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const BACKEND = 'http://localhost:3000';

const LoginPage = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/text-to-sign');
        }
    }, [navigate]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            const endpoint = isSignup ? '/api/users/signup' : '/api/users/login';
            const body = isSignup
                ? { username: form.username, email: form.email, password: form.password }
                : { email: form.email, password: form.password };

            const response = await fetch(`${BACKEND}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Something went wrong');
                return;
            }

            if (!isSignup) {
                localStorage.setItem('token', data.token);
                navigate('/text-to-sign');
            } else {
                setIsSignup(false);
                setError('✓ Registered successfully! Please log in.');
            }
        } catch (err) {
            setError('Cannot connect to server. Make sure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-animated-bg"></div>
            
            <nav className="login-navbar">
                <div className="nav-brand">ISL Connect</div>
                <div className="nav-links">
                    <a href="/" className="active">Home</a>
                    <a href="/about">About</a>
                </div>
            </nav>
            
            <div className="login-wrapper">
                <div className="login-left">
                    <div className="login-card">
                        <div className="logo-section">
                            <h1 className="logo-title">ISL Connect</h1>
                            <p className="logo-subtitle">Sign Language Translation Platform</p>
                        </div>

                        <div className="form-section">
                            <h2 className="form-title">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
                            
                            <form onSubmit={handleSubmit} className="login-form">
                                {isSignup && (
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Username"
                                            value={form.username}
                                            onChange={handleChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                )}
                                
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className={`alert-message ${error.includes('✓') ? 'success-message' : 'error-message'}`}>
                                        {error}
                                    </div>
                                )}

                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? (
                                        <span className="btn-spinner"></span>
                                    ) : (
                                        isSignup ? 'Sign Up' : 'Login'
                                    )}
                                </button>
                            </form>

                            <div className="toggle-auth">
                                <p>
                                    {isSignup ? 'Already have an account?' : "Don't have an account?"}
                                    <span 
                                        className="auth-link" 
                                        onClick={() => { setIsSignup(!isSignup); setError(''); }}
                                    >
                                        {isSignup ? ' Login' : ' Sign Up'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="login-right">
                    <div className="feature-box">
                        <div className="feature-icon">🎥</div>
                        <h3>Video Translation</h3>
                        <p>Convert YouTube videos to ISL</p>
                    </div>
                    <div className="feature-box">
                        <div className="feature-icon">🤖</div>
                        <h3>AI Powered</h3>
                        <p>Advanced speech recognition</p>
                    </div>
                    <div className="feature-box">
                        <div className="feature-icon">⚡</div>
                        <h3>Real-time</h3>
                        <p>Instant sign language output</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
