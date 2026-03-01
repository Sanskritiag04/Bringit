import React, { useState, useEffect ,useRef} from 'react';
import io from 'socket.io-client';
import './Chat.css';
import  axios  from 'axios';

// Connect to your backend port
const socket = io.connect("http://127.0.0.1:5000");

function Chat({ requestId, user, recipientName, onClose }) {
const [message, setMessage] = useState("");
const [chatHistory, setChatHistory] = useState([]);
const messagesEndRef = useRef(null); // Create a reference

const scrollToBottom = () => {
messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};


const fetchHistory = async () => {
const res = await axios.get(`http://localhost:5000/api/messages/${requestId}`);
setChatHistory(res.data);
};


useEffect(() => {
scrollToBottom(); // Scroll whenever chatHistory changes
}, [chatHistory]);

useEffect(() => {
fetchHistory();
// Join the unique room for this specific request
socket.emit('join_room', requestId);

// Listen for incoming messages
socket.on('receive_message', (data) => {
  setChatHistory((prev) => [...prev, data]);
});

// Cleanup when closing chat
return () => socket.off('receive_message');
}, [requestId]);

const sendMessage = () => {
if (message.trim() !== "") {
const messageData = {
roomId: requestId,
sender: user.name,
senderEmail: user.email,
text: message,
time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

  socket.emit('send_message', messageData);
  // setChatHistory((prev) => [...prev, messageData]);
  setMessage("");
}
};

return (
<div className="chat-overlay">
<div className="chat-header">
<span>Chat with {recipientName}</span>
<button onClick={onClose}>×</button>
</div>

  <div className="chat-messages">
    {chatHistory.map((msg, index) => (
      <div key={index} className={msg.senderEmail === user.email ? "message sent" : "message received"}>
        {msg.text}
        <span>{msg.time}</span>
      </div>
    ))}
    {/* Empty div at the bottom to "anchor" the scroll */}
    <div ref={messagesEndRef} />
  </div>

  <div className="chat-input">
    <input 
       // ... your input props ...
    />
    <button onClick={sendMessage}>➤</button>
  </div>
</div>
);
}

export default Chat;