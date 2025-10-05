import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

const PageHeader = ({ 
  title, 
  subtitle = '', 
  showBack = true, 
  showHome = false,
  fallbackPath = '/',
  customActions = null,
  className = ''
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className={`page-header ${className}`}>
      <div className="page-header-content">
        <div className="page-header-left">
          {showBack && (
            <button 
              className="back-button"
              onClick={handleBack}
              title="Go back to previous page"
            >
              <span className="back-icon">←</span>
              Back
            </button>
          )}
          
          <div className="page-title-section">
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
        </div>

        <div className="page-header-right">
          {customActions}
          
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
      </div>
    </div>
  );
};

export default PageHeader;
