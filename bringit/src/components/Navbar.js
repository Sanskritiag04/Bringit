import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* Clicking the logo takes you back Home */}
        <Link to="/">Bringit<span>.</span></Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/profile">My Profile</Link>
        <Link to="/about">About us</Link>
      </div>

      <div className="navbar-actions">
        {/* <div className="cart-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div> */}
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;