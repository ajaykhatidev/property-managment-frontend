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
import { LeaseAvailable } from "./components/Available/LeaseAvailable";
import { SellSold } from "./components/sold/SellSold";
import { LeaseSold } from "./components/sold/LeaseSold";
import { Client } from "./components/Client";
import { AddClient } from "./components/AddClient";
import { ViewClient } from "./components/ViewClient";
import { EditClient } from "./components/EditClient";
import ToastContainer from "./components/ToastContainer";
import Header from "./components/Header";
import Logo from "./components/Logo";
import { useToast } from "./hooks/useToast";
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

      <Link to="/client" className="card">
        Client
      </Link>
    </div>
  )
}

function App() {
  const { toasts, removeToast } = useToast();
  
  useEffect(() => {
    console.log('🏠 App component loaded');
    console.log('🌐 Current URL:', window.location.href);
    console.log('🔒 Protocol:', window.location.protocol);
  }, []);

  return (
    <Router>
      <div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
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
          <Route path="/leaseAvailable/:type" element={<LeaseAvailable />} />
          <Route path="/leaseSold/:type" element={<LeaseSold />} />
          <Route path="/client" element={<Client />} />
          <Route path="/client/add" element={<AddClient />} />
          <Route path="/client/list" element={<ViewClient />} />
          <Route path="/client/edit/:id" element={<EditClient />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
