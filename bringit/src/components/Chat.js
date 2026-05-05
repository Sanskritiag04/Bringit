import React, { useState, useEffect, useRef } from 'react';
import socket from './Socket'; // Ensure this matches your filename
import './Chat.css';
import axios from 'axios';

function Chat({ requestId, user, recipientName, onClose }) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever history updates
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);


  useEffect(() => {
  const fetchHistory = async () => {
    const res = await axios.get(`https://bringit-8tbc.onrender.com/api/messages/${requestId}`);
    setChatHistory(res.data);
  };
  fetchHistory();
  
  socket.emit('join_room', requestId);

  // Define the handler
  const onMessageReceived = (data) => {
    // CRITICAL: Check if message is for THIS room 
    // AND check if the message ID/timestamp already exists in state to prevent duplicates
    setChatHistory((prev) => {
      const exists = prev.find(m => m.time === data.time && m.text === data.text);
      if (exists) return prev; 
      return [...prev, data];
    });
  };

  socket.on('receive_message', onMessageReceived);

  return () => {
    socket.off('receive_message', onMessageReceived);
  };
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
      setMessage("");
    }
  };

  return (
    <div className="chat-overlay">
      <div className="chat-window">
        <div className="chat-header">
          <span>Chat with {recipientName || "User"}</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="chat-messages">
          {chatHistory.map((msg, index) => (
            <div 
              key={index} 
              className={msg.senderEmail === user.email ? "message sent" : "message received"}
            >
              <div className="msg-text">{msg.text}</div>
              <span className="msg-time">{msg.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;