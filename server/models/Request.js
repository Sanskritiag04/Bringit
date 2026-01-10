const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    item: { type: String, required: true },
    location: { type: String, required: true },
    reward: { type: String, required: true }, // e.g., "A coffee" or "50 Rupees"
    description: { type: String },
    status: { type: String, default: 'pending' }, // pending, accepted, completed
    postedBy: { 
        name: String,
        email: String 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);