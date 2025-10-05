import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

const BackButton = ({ 
  fallbackPath = '/', 
  customText = '← Back',
  className = '',
  showHome = false 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // If there's history, go back
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Otherwise go to fallback path
      navigate(fallbackPath);
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className={`navigation-bar ${className}`}>
      <button 
        className="back-button"
        onClick={handleBack}
        title="Go back to previous page"
      >
        <span className="back-icon">←</span>
        {customText}
      </button>
      
      {showHome && (
        <button 
          className="home-button"
          onClick={handleHome}
          title="Go to home page"
        >
          <span className="home-icon">🏠</span>
          Home
        </button>
      )}
    </div>
  );
};

export default BackButton;
