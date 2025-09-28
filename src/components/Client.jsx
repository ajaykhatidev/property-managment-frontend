import React from 'react';
import { Link } from 'react-router-dom';
import './Client.css';

function Client() {
  return (
    <div className="client-container">
      <h2>Client Management</h2>
      
      <div className="client-cards">
        <Link to="/client/add" className="card add-card">
          Add Client
        </Link>

        <Link to="/client/list" className="card">
          View Clients
        </Link>

        <Link to="/client/list" className="card">
          Search Client
        </Link>
      </div>
    </div>
  );
}

export { Client };
