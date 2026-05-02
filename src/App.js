import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AboutUsPage from './components/AboutUs';
import Settings from './components/setting';
import VideoToText from './components/videotext';
import YouTubeWithSignLanguage from './components/youtube';
import ThankYouPage from './components/thanks';
import TextToSign from './components/TextToSign';

// Simple auth guard
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/text-to-sign" element={<PrivateRoute><TextToSign /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/video" element={<PrivateRoute><VideoToText /></PrivateRoute>} />
        <Route path="/youtube" element={<PrivateRoute><YouTubeWithSignLanguage /></PrivateRoute>} />
        <Route path="/thankyou" element={<PrivateRoute><ThankYouPage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
