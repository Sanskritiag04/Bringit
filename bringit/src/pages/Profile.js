import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [myActiveRequests, setMyActiveRequests] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Get user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
      fetchMyRequests(loggedInUser.email);
    }
  }, []);

  const fetchMyRequests = async (email) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/my-requests/${email}`);
      setMyActiveRequests(response.data);
    } catch (err) {
      console.error("Error loading profile data", err);
    }
  };

 const handleCancel = async (requestId) => {
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  if (window.confirm("Are you sure you want to cancel this request?")) {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/requests/${requestId}`, {
        headers: {
          'user-email': loggedInUser.email // Backend security check
        }
      });

      // Remove from the UI list immediately
      setMyActiveRequests(prev => prev.filter(req => req._id !== requestId));
      alert("Request cancelled successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Could not cancel request.");
    }
  }
};

const handleComplete = async (id) => {
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  try {
    await axios.patch(`http://127.0.0.1:5000/api/requests/${id}/complete`, {}, {
      headers: { 'user-email': loggedInUser.email }
    });
    
    // Refresh the list
    setMyActiveRequests(prev => 
      prev.map(r => r._id === id ? { ...r, status: 'Completed' } : r)
    );
    alert("Great! Glad you got your item.");
  } catch (err) {
    alert("Error updating status");
  }
};

  if (!user) return <div className="profile-container">Please login to view profile.</div>;

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="user-info">
          {/* Show initials from name */}
          <div className="profile-pic">{user.name.charAt(0)}</div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
        <div className="stats-box">
          <div className="stat-item">
            <span>Requests</span>
            <strong>{myActiveRequests.length}</strong>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <section className="profile-section">
          <h3>My Active Requests</h3>
          <div className="profile-list">
            {myActiveRequests.length > 0 ? (
              myActiveRequests.map(req => (
                <div key={req._id} className="profile-card">
                  <div>
                    <h4>{req.item}</h4>
                    <span className="p-tag">{req.location}</span>
                  </div>
                  <div className="p-action">
  <span className={`p-status ${req.status}`}>{req.status}</span>
  
  {req.status === 'Accepted' ? (
    <button 
      className="complete-btn" 
      onClick={() => handleComplete(req._id)}
      style={{ backgroundColor: '#28a745', color: 'white' }}
    >
      Mark Completed
    </button>
  ) : (
    <button className="delete-btn" onClick={() => handleCancel(req._id)}>
      Cancel
    </button>
  )}
</div>
                </div>
              ))
            ) : (
              <p>You haven't posted any requests yet.</p>
            )}
          </div>
        </section>
        
        {/* Contributions section can stay as mock data for now until we track 'acceptedBy' */}
      </div>
    </div>
  );
}

export default Profile;