import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Sold } from './components/Sold';
import { Abilable } from './components/Abilable';
import React, { useEffect } from 'react';
import './App.css';
import { AddProperty } from "./components/AddProperty";
import { PropertyList } from "./components/Propertylist";
import { RentSold } from "./components/sold/RentSold";
// import { SellSold } from "./components/sold/SellSold";
import { Editproperty } from "./components/Editproperty";
import { SellAvaliable } from "./components/Available/SellAvaliable";
import { RentAvaliable } from "./components/Available/RentAvailable";
import { SellSold } from "./components/sold/SellSold";
// import { SellSold } from "./components/sold/SellSold";


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
          <Route path="/sellSold/:type" element={<SellSold />} />
          <Route path="/rentSold/:type" element={<RentSold />} />
          {/* <Route path="/All" element={<PropertyList />} /> */}
          <Route path="/edit-property" element={<Editproperty />} />
          <Route path="/SellAvaliable/:type" element={<SellAvaliable />} />
          <Route path="/rentAvaliable/:type" element={<RentAvaliable />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
