import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const response = await axios.post('https://bringit-8tbc.onrender.com/api/login', { email, password });

    localStorage.setItem('token', response.data.token); // Save the "ID Card"
    localStorage.setItem('user', JSON.stringify(response.data.user)); // Save user details
      navigate('/profile');

    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back<span>.</span></h2>
        <p>Login to manage your requests and deliveries.</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {message && <p className="status-msg">{message}</p>}
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" 
            required value={password}
              onChange={(e) => setPassword(e.target.value)}/>
          </div>

          <button type="submit" className="login-submit-btn">
            Login
          </button>
        </form>

        <p className="register-prompt">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;