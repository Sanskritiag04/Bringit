import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateRequest.css';

function CreateRequest() {
  // 1. Create state to hold form data
  const [item, setItem] = useState('');
  const [category, setCategory] = useState('Food'); // Default value
  const [location, setLocation] = useState('');
  const [reward, setReward] = useState('');
  const navigate = useNavigate();

  // 2. Function to handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the logged-in user from LocalStorage
    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    if (!loggedInUser) {
      alert("Please login first!");
      return navigate('/login');
    }

    const newRequest = {
      item,
      category,
      location, // Matches our Backend model
      reward,
      postedBy: {
        name: loggedInUser.name,
        email: loggedInUser.email
      }
    };

    try {
      await axios.post('http://127.0.0.1:5000/api/requests', newRequest);
      alert("Request Posted to Campus!");
      navigate('/explore'); // Redirect to feed to see it!
    } catch (err) {
      console.error(err);
      alert("Error posting request. Check terminal.");
    }
  };

  return (
    <div className="form-page">
      <div className="form-box">
        <h2>What do you need?<span>.</span></h2>
        
        {/* 3. Add onSubmit to the form */}
        <form className="simple-form" onSubmit={handleSubmit}>
          
          <label>Item Description</label>
          <input 
            type="text" 
            placeholder="e.g. 2 Pens and a notebook" 
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required 
          />

          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Food</option>
            <option>Stationery</option>
            <option>Personal Care</option>
            <option>Other</option>
          </select>

          <label>Deliver to</label>
          <input 
            type="text" 
            placeholder="e.g. Hostel 4, Room 10" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <label>Reward/Tip (Optional)</label>
          <input 
            type="text" 
            placeholder="e.g. ₹20" 
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />

          <button type="submit" className="post-btn">Post Request</button>
        </form>
      </div>
    </div>
  );
}

export default CreateRequest;