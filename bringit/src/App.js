import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Footer from './components/Footer';
import CreateRequest from './pages/CreateRequest';
import Feed from './pages/Feed';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        {/* This area changes when you click a link */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Feed />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-request" element={<CreateRequest />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;