import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  // 1. Create states for the input fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      setMessage(response.data.message);
      
      // If successful, wait 2 seconds then go to login
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // Show the error message from the server (e.g., "Student already registered")
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Join Bringit<span>.</span></h2>
        {message && <p className="status-msg">{message}</p>}
        
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              name="name" 
              type="text" 
              placeholder="Enter your name" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input 
              name="email" 
              type="email" 
              placeholder="email@example.com" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              name="password" 
              type="password" 
              placeholder="Create a password" 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="register-submit-btn">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;