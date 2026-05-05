import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AboutUsPage from './components/AboutUs';
import Settings from './components/setting';
import VideoToText from './components/videotext';
import YouTubeWithSignLanguage from './components/youtube';
import ThankYouPage from './components/thanks';
import TextToSign from './components/TextToSign';
import Footer from './components/Footer';

// Simple auth guard
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

// Layout wrapper for pages with footer only
const Layout = ({ children }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><LoginPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutUsPage /></Layout>} />
        <Route path="/text-to-sign" element={<PrivateRoute><Layout><TextToSign /></Layout></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
        <Route path="/video" element={<PrivateRoute><Layout><VideoToText /></Layout></PrivateRoute>} />
        <Route path="/youtube" element={<PrivateRoute><Layout><YouTubeWithSignLanguage /></Layout></PrivateRoute>} />
        <Route path="/thankyou" element={<PrivateRoute><Layout><ThankYouPage /></Layout></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
