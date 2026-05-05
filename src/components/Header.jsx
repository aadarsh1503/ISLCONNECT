import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="isl-header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo-section">
            <h1 className="logo-text">ISL Connect</h1>
            <p className="tagline">Bridging Communication Gaps with AI & Sign Language</p>
          </div>
        </div>
        <div className="header-right">
          <div className="empowerment-section">
            <div className="avatar-icon">👋</div>
            <div className="empowerment-text">
              <h3>Empowering Deaf & Mute Community with Technology</h3>
              <p>Learn. Communicate. Connect.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="header-banner">
        ISL Connect – Bridging Communication Gaps with AI & Sign Language
      </div>
    </header>
  );
};

export default Header;
