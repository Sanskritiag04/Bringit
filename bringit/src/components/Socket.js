// import io from 'socket.io-client';
// const socket = io.connect("http://localhost:5000");
// export default socket;

import { io } from 'socket.io-client';

const socket = io("https://bringit-8tbc.onrender.com", {
  transports: ["websocket", "polling"] // Transports add karne se connection stable rehta hai
});

export default socket;