const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
requestId: { type: String, required: true },
sender: String,
senderEmail: String,
text: String,
time: String,
createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);