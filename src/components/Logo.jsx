import React from 'react';
import './Logo.css';

const Logo = ({ size = 'medium', showText = true }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'logo-small';
      case 'large': return 'logo-large';
      default: return 'logo-medium';
    }
  };

  return (
    <div className={`logo-container ${getSizeClass()}`}>
      <div className="logo-icon">
        <div className="logo-hexagon">
          <div className="logo-inner">
            <span className="logo-text">DB</span>
          </div>
        </div>
      </div>
      {showText && (
        <div className="logo-text-container">
          <div className="logo-main-text">DEVBHOOMI</div>
          <div className="logo-sub-text">PROPERTIES</div>
        </div>
      )}
    </div>
  );
};

export default Logo;
