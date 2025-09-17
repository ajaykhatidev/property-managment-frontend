import React from 'react'
import { Link } from 'react-router-dom'

export const Sold = () => {
  return (
    <div className="abilable-container">
      <h2>Sold Properties</h2>

      <div className="card-container">
        <Link to="/sellSold" className="card">
          Sell
        </Link>

        <Link to="/rentSold" className="card">
          Rent
        </Link>
      </div>
    </div>
  )
}
