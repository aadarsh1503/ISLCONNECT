import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYouPage.css';

const ThankYouPage = () => {
    const navigate = useNavigate();
    return (
        <div className="container">
            <h1>Thank You for Visiting</h1>
            <p>We hope to see you again soon!</p>
            <button onClick={() => navigate('/')}>Back to Homepage</button>
        </div>
    );
};

export default ThankYouPage;
