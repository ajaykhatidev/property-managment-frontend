import React from 'react'
import { Link } from 'react-router-dom'
import PageHeader from './Navigation/PageHeader'
import Breadcrumb from './Navigation/Breadcrumb'

export const Abilable = () => {
  return (
    <div className="abilable-container">
      <Breadcrumb />
      <PageHeader 
        title="Available Properties" 
        subtitle="Browse properties available for sale, rent, or lease"
        fallbackPath="/"
      />

      <div className="card-container">
        <Link to="/SellAvaliable/sellAvailable" className="card">
          <div className="card-content">
            <h3>Sell</h3>
            <p>Properties for Sale</p>
          </div>
        </Link>

        <Link to="/rentAvaliable/rentAvailable" className="card">
          <div className="card-content">
            <h3>Rent</h3>
            <p>Properties for Rent</p>
          </div>
        </Link>

        <Link to="/leaseAvailable/leaseAvailable" className="card">
          <div className="card-content">
            <h3>Lease</h3>
            <p>Properties for Lease</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
