import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Tagline */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Bringit<span>.</span></Link>
          <p>The easiest way to get things delivered or earn while you travel.</p>
        </div>

        </div>
    </footer>
  );
}

export default Footer;