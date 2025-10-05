import React from 'react'
import { Link } from 'react-router-dom'
import PageHeader from './Navigation/PageHeader'
import Breadcrumb from './Navigation/Breadcrumb'

export const Sold = () => {
  return (
    <div className="abilable-container">
      <Breadcrumb />
      <PageHeader 
        title="Sold Properties" 
        subtitle="View properties that have been sold, rented, or leased"
        fallbackPath="/"
      />

      <div className="card-container">
        <Link to="/sellSold/sellSold" className="card">
          <div className="card-content">
            <h3>Sell</h3>
            <p>Properties Sold</p>
          </div>
        </Link>

        <Link to="/rentSold/rentSold" className="card">
          <div className="card-content">
            <h3>Rent</h3>
            <p>Properties Rented</p>
          </div>
        </Link>

        <Link to="/leaseSold/leaseSold" className="card">
          <div className="card-content">
            <h3>Lease</h3>
            <p>Properties Leased</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
