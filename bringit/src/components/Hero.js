import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      {/* Small Badge at the top */}
      <div className="badge">
        <span className="badge-new">NEW</span>
        <span className="badge-text">Peer-to-peer delivery made simple and fast</span>
      </div>

      {/* Main Big Text */}
      <div className="hero-content">
        <h1>
          Fresh from <span className="icon-placeholder">📦</span> the shop <br />
          to your doorstep <span className="icon-placeholder">🤝</span> an <br />
          easy <span className="icon-placeholder">✨</span> community solution
        </h1>
        
        <p className="hero-description">
          Need something brought to you? Or traveling and want to earn by helping others? 
          Join our community-driven delivery network today.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="register-hero-btn">
            Register Now
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;