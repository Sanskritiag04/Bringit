import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateRequest.css';

function CreateRequest() {
  const [item, setItem] = useState('');
  const [category, setCategory] = useState('Food');
  const [location, setLocation] = useState('');
  const [reward, setReward] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // To prevent double-clicks
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. FRONTEND VALIDATION
    if (!item.trim() || !location.trim()) {
      alert("Please fill in both the item and the delivery location!");
      return;
    }

    setIsSubmitting(true); // Start loading

    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      alert("Please login first!");
      navigate('/login');
      return;
    }

    const newRequest = {
      item,
      category,
      location,
      reward: reward || "Thank you!", // Default reward if empty
      description,
      postedBy: {
        name: loggedInUser.name,
        email: loggedInUser.email
      }
    };

    try {
      await axios.post('http://127.0.0.1:5000/api/requests', newRequest);
      alert("Request Posted Successfully! 🚀");
      navigate('/explore');
    } catch (err) {
      console.error("Post Error:", err.response?.data);
      alert("Error: " + (err.response?.data?.message || "Server is down"));
    } finally {
      setIsSubmitting(false); // Stop loading regardless of success/fail
    }
  };

  return (
    <div className="form-page">
      <div className="form-box">
        <h2>What do you need?<span>.</span></h2>
        <form className="simple-form" onSubmit={handleSubmit}>
          <label>Item Description *</label>
          <input 
            type="text" 
            placeholder="e.g. 2 Pens and a notebook" 
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />

          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Food</option>
            <option>Stationery</option>
            <option>Personal Care</option>
            <option>Other</option>
          </select>

          <label>Deliver to *</label>
          <input 
            type="text" 
            placeholder="e.g. Hostel 4, Room 10" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <label>Reward/Tip (Optional)</label>
          <input 
            type="text" 
            placeholder="e.g. ₹20" 
            value={reward}
            onChange={(e) => setReward(e.target.value)}
          />

          <button 
            type="submit" 
            className="post-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRequest;