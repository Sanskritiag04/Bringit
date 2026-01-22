import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();
  
  const isLoggedIn = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
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
        {isLoggedIn ? (
          <>
            {/* <span className="user-name">Hi, {user.name}</span> */}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login" className="login-btn">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;