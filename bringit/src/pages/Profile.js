import React from 'react';
import './Profile.css';

function Profile() {
  // Mock data for the student's own activity
  const myActiveRequests = [
    { id: 101, item: "Scientific Calculator", category: "Stationery", status: "Pending", reward: "₹20" },
  ];

  const myContributions = [
    { id: 201, item: "Chicken Roll", deliveredTo: "Hostel A", earned: "₹25" },
    { id: 202, item: "Printouts", deliveredTo: "Admin Block", earned: "₹10" },
  ];

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="user-info">
          <div className="profile-pic">JD</div>
          <h2>John Doe</h2>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>
        <div className="stats-box">
          <div className="stat-item">
            <span>Earned</span>
            <strong>₹35</strong>
          </div>
          <div className="stat-item">
            <span>Deliveries</span>
            <strong>02</strong>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <section className="profile-section">
          <h3>My Active Requests</h3>
          <div className="profile-list">
            {myActiveRequests.map(req => (
              <div key={req.id} className="profile-card">
                <div>
                  <h4>{req.item}</h4>
                  <span className="p-tag">{req.category}</span>
                </div>
                <div className="p-action">
                  <span className="p-status">{req.status}</span>
                  <button className="delete-btn">Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h3>Past Contributions</h3>
          <div className="profile-list">
            {myContributions.map(con => (
              <div key={con.id} className="profile-card completed">
                <div>
                  <h4>{con.item}</h4>
                  <p>Delivered to {con.deliveredTo}</p>
                </div>
                <div className="earned-text">+{con.earned}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;