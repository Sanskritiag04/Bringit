const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const Request = require('./models/Request'); 

require('dotenv').config();

const app = express();
// Middleware
app.use(cors());
app.use(express.json()); // This allows the server to read JSON data from React
// 1. DATABASE CONNECTION
// 'bringit' at the end of the URL is the name the database will have in Compass
mongoose.connect('mongodb://localhost:27017/bringit')
    .then(() => console.log("Connected to MongoDB Locally"))
    .catch((err) => console.error("Could not connect to MongoDB", err));

// 2. THE REGISTER ROUTE
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Student already registered!" });
        }
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create a new user instance
        const newUser = new User({ name, email, password: hashedPassword });

        // Save to the database
        await newUser.save();

        res.status(201).json({ message: "Student registered successfully in MongoDB!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration" });
    }
});


// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // It's better to keep the message vague for security, 
      // but for now let's be specific for debugging
      return res.status(400).json({ message: "User not found!" });
    }

    // 2. Compare the typed password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // 3. Successful Login
    // For now, we will send back the user details (minus password)
    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Route to create a new request
app.post('/api/requests', async (req, res) => {
    try {
        const { item, location, reward, description, postedBy } = req.body;

        const newRequest = new Request({
            item,
            location,
            reward,
            description,
            postedBy
        });

        await newRequest.save();
        res.status(201).json({ message: "Request posted successfully!", request: newRequest });
    } catch (error) {
        res.status(500).json({ message: "Error posting request" });
    }
});

// Route to get ALL requests (for the Explore/Feed page)
app.get('/api/requests', async (req, res) => {
    try {
        const allRequests = await Request.find().sort({ createdAt: -1 }); // Newest first
        res.json(allRequests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching requests" });
    }
});


// Route to accept a request
app.patch('/api/requests/:id/accept', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the request and update its status
        const updatedRequest = await Request.findByIdAndUpdate(
            id, 
            { status: 'Accepted' }, 
            { new: true } // This returns the updated version of the document
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.json({ message: "Status updated!", request: updatedRequest });
    } catch (error) {
        res.status(500).json({ message: "Error updating status" });
    }
});

// Route to delete a request
app.delete('/api/requests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRequest = await Request.findByIdAndDelete(id);

        if (!deletedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.json({ message: "Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting request" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));