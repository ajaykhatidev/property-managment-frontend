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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logo from "./components/Logo";
// import { SellSold } from "./components/sold/SellSold";


function Home() {
  return (
    <div className="home-container">
      <Link to="/sold" className="card">
        <div className="card-content">
          <h3>Sold</h3>
          <p>View sold properties</p>
        </div>
      </Link>

      <Link to="/abilable" className="card">
        <div className="card-content">
          <h3>Available</h3>
          <p>Browse available properties</p>
        </div>
      </Link>

      <Link to="/add-property" className="card add-card">
        <div className="card-content">
          <h3>Add Property</h3>
          <p>Add new property</p>
        </div>
      </Link>

      <Link to="/client" className="card">
        <div className="card-content">
          <h3>Client</h3>
          <p>Manage clients</p>
        </div>
      </Link>
    </div>
  )
}

function App() {
  useEffect(() => {
  }, []);

  return (
    <Router>
      <div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sold" element={<Sold />} />
          <Route path="/abilable" element={<Abilable />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/sellSold/:type" element={<SellSold />} />
          <Route path="/rentSold/:type" element={<RentSold />} />
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
