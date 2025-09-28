import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <Logo size="medium" />
        </Link>
        
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/client" className="nav-link">Clients</Link>
          <Link to="/add-property" className="nav-link">Add Property</Link>
        </nav>
        
        <div className="header-actions">
          <div className="contact-info">
            <span className="phone-number">📞 9266730401</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
