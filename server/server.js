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
// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1. Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       // It's better to keep the message vague for security, 
//       // but for now let's be specific for debugging
//       return res.status(400).json({ message: "User not found!" });
//     }

//     // 2. Compare the typed password with the hashed password in DB
//     const isMatch = await bcrypt.compare(password, user.password);
    
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials!" });
//     }

//     // 3. Successful Login
//     // For now, we will send back the user details (minus password)
//     res.status(200).json({
//       message: "Login successful!",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error during login" });
//   }
// });

const jwt = require('jsonwebtoken');

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 1. Create a Token (Secret key can be any random string for now)
    const token = jwt.sign(
      { userId: user._id }, 
      'SUPER_SECRET_KEY_123', 
      { expiresIn: '1d' }
    );

    // 2. Send token and user info back
    res.status(200).json({
      message: "Login successful!",
      token, 
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Route to create a new request
app.post('/api/requests', async (req, res) => {
    // console.log("Body received:", req.body);
    try {
        const { item,category, location, reward, description, postedBy } = req.body;

        const newRequest = new Request({
            item,
            category,
            location,
            reward: reward || "No reward",
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
        const allRequests = await Request.find({ status: { $ne: 'Completed' } }).sort({ createdAt: -1 });
        res.json(allRequests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching requests" });
    }
});


// Route to accept a request
app.patch('/api/requests/:id/accept', async (req, res) => {
    try {
        const { id } = req.params;
        const { helperEmail, name } = req.body;
        // Find the request and update its status
        const updatedRequest = await Request.findByIdAndUpdate(
            id, 
            { status: 'Accepted', acceptedBy: helperEmail, acceptedByName: name }, 
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

// Get requests posted by a specific user
app.get('/api/my-requests/:email', async (req, res) => { 
    try { const email = req.params.email; 
        const myRequests = await Request.find({ $or: [ { "postedBy.email": email }, { "acceptedBy": email } ] }).sort({ createdAt: -1 }); 
        res.json(myRequests); } 
        catch (error) { res.status(500).json({ message: "Error" }); 
    } 
});

app.patch('/api/requests/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;
        const userEmail = req.headers['user-email'];

        const request = await Request.findById(id);
        if (request.postedBy.email !== userEmail) {
            return res.status(403).json({ message: "Only the owner can complete this." });
        }

        request.status = 'Completed';
        await request.save();

        res.json({ message: "Request marked as completed!" });
    } catch (error) {
        res.status(500).json({ message: "Error completing request" });
    }
});

const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');
const server = http.createServer(app);
const io = new Server(server, {
cors: { origin: "http://localhost:3000" } // Your React URL
});

io.on('connection', (socket) => {
console.log('A user connected:', socket.id);

// Join a specific room based on Request ID
socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
});

// Listen for a message and send it to the specific room
socket.on('send_message', async(data) => {
    // io.to(data.roomId).emit('receive_message', data);
    try {
        console.log("Saving message for room:", data.roomId);
// 1. Save to Database
const newMessage = new Message({
requestId: data.roomId,
sender: data.sender,
senderEmail: data.senderEmail,
text: data.text,
time: data.time
});
await newMessage.save();

    // 2. Broadcast to everyone in the room
    io.to(data.roomId).emit('receive_message', data);
} catch (err) {
    console.log("Error saving message:", err);
}
});

socket.on('disconnect', () => {
    console.log('User disconnected');
});
});

app.get('/api/messages/:requestId', async (req, res) => {
try {
const messages = await Message.find({ requestId: req.params.requestId }).sort({ createdAt: 1 });
res.json(messages);
} catch (error) {
res.status(500).json({ message: "Error fetching history" });
}
});
// IMPORTANT: Change app.listen to server.listen
server.listen(5000, () => console.log('Server running on 5000'));