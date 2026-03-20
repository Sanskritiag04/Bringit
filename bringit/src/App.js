import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateRequest from './pages/CreateRequest';
import Feed from './pages/Feed';
import Profile from './pages/Profile';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socket from './components/Socket';



function App() {
const [user, setUser] = useState(null);

// Load user from storage on boot
useEffect(() => {
const storedUser = JSON.parse(localStorage.getItem('user'));
if (storedUser) setUser(storedUser);
}, []);

// Global Notification Listener

useEffect(() => {
  // Listen for the special notification event
  socket.on('notify_new_message', (data) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    // Only show toast if:
    // 1. We are logged in
    // 2. The message isn't from us
    if (currentUser && data.senderEmail !== currentUser.email) {
      toast.info(`💬 ${data.sender}: ${data.text}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
        onClick: () => {
          window.dispatchEvent(new CustomEvent('openChat', { detail: data }));
        }
      });
    }
  });

  socket.on('status_updated', (data) => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    
    const currentUser = JSON.parse(storedUser);

    // DEBUG: Console mein check karo emails match ho rahi hain ya nahi
    console.log("Mera Email:", currentUser.email);
    console.log("Poster ka Email:", data.posterEmail);

    // LOGIC: Sirf POSTER ko notification dikhao
    if (currentUser.email === data.posterEmail) {
        toast.success(`🎉 Good news! ${data.helperName} ne aapka "${data.item}" accept kar liya hai!`, {
            position: "top-center",
            autoClose: 6000
        });
    }
});

   socket.on("connect", () => {
        console.log("Connected to Socket Server! ID:", socket.id);
    });

  return () =>{ socket.off('notify_new_message'); socket.off('status_updated');};

}, []);

return (
<Router>
<div className="App">
<Navbar />

    {/* The "Container" that actually draws the popups on screen */}
    <ToastContainer 
    position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover/>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Feed />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-request" element={<CreateRequest />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>

    <Footer />
  </div>
</Router>
);
}

export default App;