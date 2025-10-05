import React from 'react';
import { Link } from 'react-router-dom';
import './Client.css';
import PageHeader from './Navigation/PageHeader';
import Breadcrumb from './Navigation/Breadcrumb';

function Client() {
  return (
    <div className="client-container">
      <Breadcrumb />
      <PageHeader 
        title="Client Management" 
        subtitle="Manage your clients and their property requirements"
        fallbackPath="/"
      />
      
      <div className="client-cards">
        <Link to="/client/add" className="card add-card">
          <div className="card-content">
            <h3>Add Client</h3>
            <p>Add new client</p>
          </div>
        </Link>

        <Link to="/client/list" className="card">
          <div className="card-content">
            <h3>View Clients</h3>
            <p>View all clients</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export { Client };
