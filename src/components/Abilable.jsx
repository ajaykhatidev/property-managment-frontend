import React from 'react'
import { Link } from 'react-router-dom'

export const Abilable = () => {
  return (
    <div className="abilable-container">
      <h2>Available Properties</h2>

      <div className="card-container">
        <Link to="/SellAvaliable" className="card">
          Sell
        </Link>

        <Link to="/rentAvaliable" className="card">
          Rent
        </Link>
      </div>
    </div>
  )
}
