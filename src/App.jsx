import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Sold } from './components/Sold';
import { Abilable } from './components/Abilable';
import React, { useState, useEffect } from 'react';
import './App.css';
import { AddProperty } from "./components/AddProperty";
import { PropertyList } from "./components/Propertylist";
import { RentSold } from "./components/sold/RentSold";
import { SellSold } from "./components/sold/SellSold";
import { Editproperty } from "./components/Editproperty";
import { SellAvaliable } from "./components/Available/SellAvaliable";
import { RentAvaliable } from "./components/Available/RentAvailable";

// PWA Install Button Component
function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    console.log('🔧 PWA Install Component Loaded');
    
    // Check if already running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isPWAiOS = window.navigator.standalone === true;
    
    console.log('📱 Device Check:', {
      isStandalone,
      isIOS,
      isPWAiOS,
      userAgent: navigator.userAgent
    });

    if (isStandalone || isPWAiOS) {
      console.log('✅ Already running as PWA - hiding install button');
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('🎉 beforeinstallprompt event triggered!');
      console.log('Event details:', e);
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
      console.log('✅ Install button should now be visible');
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('🎊 App installed successfully!');
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Debug timer - Check if event fires within 5 seconds
    const debugTimer = setTimeout(() => {
      console.log('⏰ 5 seconds passed - beforeinstallprompt status:', {
        eventFired: !!deferredPrompt,
        buttonVisible: showInstallButton
      });
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(debugTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    console.log('🔄 Install button clicked');
    
    if (!deferredPrompt) {
      console.log('❌ No deferred prompt available');
      return;
    }

    console.log('🚀 Showing install prompt...');
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    
    console.log('📊 User choice result:', result.outcome);
    
    if (result.outcome === 'accepted') {
      console.log('✅ PWA installation accepted');
    } else {
      console.log('❌ PWA installation dismissed');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  // Debug render
  console.log('🎨 PWAInstallButton render - showInstallButton:', showInstallButton);

  // Force show button for testing (temporarily)
  // Remove this after testing
  const forceShowForTesting = true;

  if (!showInstallButton && !forceShowForTesting) return null;

  return (
    <button 
      onClick={handleInstallClick}
      className="pwa-install-btn"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: showInstallButton ? '#007bff' : '#ff6b6b', // Red if forced, blue if real
        color: 'white',
        border: 'none',
        padding: '12px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: 9999, // Increased z-index
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      📱 Install App {showInstallButton ? '(Ready)' : '(Testing)'}
    </button>
  );
}

function Home() {
  return (
    <div className="home-container">
      <Link to="/sold" className="card">
        Sold
      </Link>

      <Link to="/abilable" className="card">
        Available
      </Link>

      <Link to="/add-property" className="card add-card">
        Add Property
      </Link>
    </div>
  )
}

function App() {
  useEffect(() => {
    console.log('🏠 App component loaded');
    console.log('🌐 Current URL:', window.location.href);
    console.log('🔒 Protocol:', window.location.protocol);
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sold" element={<Sold />} />
          <Route path="/abilable" element={<Abilable />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/sellSold" element={<SellSold />} />
          <Route path="/rentSold" element={<RentSold />} />
          {/* <Route path="/All" element={<PropertyList />} /> */}
          <Route path="/edit-property" element={<Editproperty />} />
          <Route path="/SellAvaliable" element={<SellAvaliable />} />
          <Route path="/rentAvaliable" element={<RentAvaliable />} />
        </Routes>
        
        {/* PWA Install Button - shows on all pages */}
        <PWAInstallButton />
      </div>
    </Router>
  )
}

export default App;