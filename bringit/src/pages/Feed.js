import React, { useState, useEffect } from 'react'; // Added useEffect and useState
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios
import './Feed.css';

function Feed() {
  // 1. Create a state to hold real requests from the database
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch data from the backend when the page loads
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/requests');
        setRequests(response.data); // Set the database items to our state
        setLoading(false);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []); // Empty array means this runs only once when the page opens

  if (loading) return <div className="feed-container"><h3>Loading Campus Feed...</h3></div>;

  const handleGrab = async (requestId,item) => {
  try {
      const response = await axios.patch(`http://127.0.0.1:5000/api/requests/${requestId}/accept`);
      
      if (response.status === 200) {
        alert(`Awesome! You've claimed: ${item}`);
        
        // 3. Update the UI locally so the button/status changes immediately
        setRequests(prevRequests => 
          prevRequests.map(req => 
            req._id === requestId ? { ...req, status: 'Accepted' } : req
          )
        );
      }
    } catch (err) {
      console.error("Error claiming request:", err);
      alert("Something went wrong!");
    }
};


  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>Campus Requests<span>.</span></h1>
        {/* Make sure this path matches your App.js route for the "Post Request" page */}
        <Link to="/create-request" className="create-new-btn">
          + Create New Request
        </Link>
      </div>

      <div className="requests-container">
        {requests.length > 0 ? (
          requests.map((req) => (
            <div key={req._id} className="student-request-card"> {/* Changed req.id to req._id for MongoDB */}
              <div className="card-top">
                {/* Fallback to 'General' if category isn't in your model yet */}
                <span className="category-pill">{req.category || "General"}</span>
                <span className="status-indicator">{req.status}</span>
              </div>
              
              <div className="card-body">
                <h3>{req.item}</h3>
                <p>📍 Deliver to: <strong>{req.location}</strong></p> {/* Changed deliverTo to location */}
                {req.description && <p className="desc">{req.description}</p>}
                <p className="posted-by">By: {req.postedBy?.name || "Unknown"}</p>
              </div>

              <div className="card-footer">
                <div className="reward">Tip: {req.reward}</div>
                <button className="help-btn" onClick={() => handleGrab(req._id,req.item)}
                  disabled={req.status==='Accepted'}>
                    {req.status==='Accepted'?"Claimed":"I'll do it!"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">☕</div>
            <h3>All caught up!</h3>
            <p>No one needs anything right now. Check back in a bit!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;