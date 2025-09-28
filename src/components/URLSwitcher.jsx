import React from 'react';
import './URLSwitcher.css';

const URLSwitcher = () => {
  const switchToLocal = () => {
    // This will require a page reload to take effect
    if (confirm('Switch to Local Development? This will reload the page.')) {
      // You can modify this to use localStorage or other methods
      window.location.reload();
    }
  };

  const switchToProduction = () => {
    if (confirm('Switch to Production? This will reload the page.')) {
      window.location.reload();
    }
  };

  return (
    <div className="url-switcher">
      <div className="switcher-header">
        <h4>🌍 Environment Switcher</h4>
        <p>Current: <strong>Production</strong></p>
      </div>
      
      <div className="switcher-buttons">
        <button 
          className="switch-btn local-btn"
          onClick={switchToLocal}
          title="Switch to localhost:3000"
        >
          🏠 Local
        </button>
        <button 
          className="switch-btn production-btn active"
          onClick={switchToProduction}
          title="Switch to production server"
        >
          🚀 Production
        </button>
      </div>
      
      <div className="switcher-info">
        <small>
          <strong>Production:</strong> https://property-managment-x0d8.onrender.com<br/>
          <strong>Local:</strong> http://localhost:3000
        </small>
      </div>
      
      <div className="switcher-note">
        <small>
          💡 To switch environments, edit <code>CURRENT_ENV</code> in <code>api-client.js</code>
        </small>
      </div>
    </div>
  );
};

export default URLSwitcher;
