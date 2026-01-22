const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    item: { type: String, required: true },
    category:{type: String, required: true},
    location: { type: String, required: true },
    reward: { type: String, default: "None" },
    description: { type: String },
    status: { type: String, default: 'pending' },
    postedBy: { 
        name: String,
        email: String 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);