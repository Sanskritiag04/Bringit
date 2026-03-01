import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import Chat from '../components/Chat';

function Profile() {
  const [myActiveRequests, setMyActiveRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

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
          'user-email': loggedInUser.email 
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

const myPostedRequests = myActiveRequests.filter(req => 
  req.postedBy?.email === user.email && req.status !== 'Completed'
);

const myAcceptedTasks = myActiveRequests.filter(req => 
  req.acceptedBy === user.email && req.status !== 'Completed'
);

const myHistory = myActiveRequests.filter(req =>
req.postedBy?.email === user?.email && req.status === 'Completed'
);
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
  
  {/* SECTION 1: POSTED BY ME */}
  <section className="profile-section">
    <h3>My Active Requests (Posted by Me)</h3>
    <div className="profile-list">
      {myPostedRequests.length > 0 ? (
        myPostedRequests.map(req => (
          <div key={req._id} className="profile-card">
            <div>
              <h4>{req.item}</h4>
              <span className="p-tag">{req.location}</span>
            </div>
            <div className="p-action">
              <span className={`p-status ${req.status}`}>{req.status}</span>
              {req.status === 'Accepted' ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                <button 
              className="chat-btn" 
              onClick={() => setActiveChat(req)}
            >
              Chat with Helper
            </button>
                <button 
                  className="complete-btn" 
                  onClick={() => handleComplete(req._id)}
                  style={{ backgroundColor: '#28a745', color: 'white' }}
                >
                  Mark Completed
                </button>
                </div>
              ) : (
                <button className="delete-btn" onClick={() => handleCancel(req._id)}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No active requests posted.</p>
      )}
    </div>
  </section>

  {/* SECTION 2: ACCEPTED BY ME */}
  <section className="profile-section" style={{ marginTop: '40px' }}>
    <h3>My Missions (Helping Others)</h3>
    <div className="profile-list">
      {myAcceptedTasks.length > 0 ? (
        myAcceptedTasks.map(req => (
          <div key={req._id} className="profile-card mission-card">
            <div>
              <h4>{req.item}</h4>
              <p>Requested by: {req.postedBy?.name}</p>
              <span className="p-tag">📍 {req.location}</span>
            </div>
            <div className="p-action">
              <span className="p-status in-progress">In Progress</span>
              {/* Future: Add 'Enter OTP' or 'Chat' button here */}
              <button className="chat-btn" onClick={() => setActiveChat(req)}>Contact {req.postedBy?.name.split(' ')[0]}</button>
            </div>
          </div>
        ))
      ) : (
        <p>You haven't picked up any requests yet.</p>
      )}
    </div>
  </section>

  
  <section className="history-section">
<h3 style={{ color: '#666' }}>Past History (Completed)</h3>
<div className="profile-list">
{myHistory.length > 0 ? (
myHistory.map(req => (
<div key={req._id} className="profile-card history-card" style={{ opacity: 0.6, backgroundColor: '#f9f9f9' }}>
<div>
<h4>{req.item}</h4>
<p style={{ fontSize: '0.8rem' }}>Delivered to: {req.location}</p>
</div>
<div className="p-action">
<span className="p-status completed">Done ✓</span>
</div>
</div>
))
) : (
<p style={{ fontStyle: 'italic', color: '#999' }}>No completed requests yet.</p>
)}
</div>
</section>
</div>
{activeChat && (
<Chat
requestId={activeChat._id}
user={user}
// If I posted it, show the helper's email. If I'm helping, show the poster's name.
recipientName={
activeChat.postedBy.email === user.email
? (activeChat.acceptedByName || activeChat.acceptedBy)
: activeChat.postedBy.name
}
onClose={() => setActiveChat(null)}
/>
)}
    </div>
  );
}

export default Profile;