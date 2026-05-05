# BringIt 🚀 - Real-Time Peer-to-Peer Request & Help Platform

BringIt is a full-stack real-time web application where users can post requests for items/help, and other users in the community can accept (claim) them instantly. Built with the MERN stack and Socket.io for real-time, event-driven communication.

## Live Demo & Links
- **Backend API:** [https://bringit-8tbc.onrender.com](https://bringit-8tbc.onrender.com)
- **Frontend App:**[https://bringit-blond.vercel.app](https://bringit-blond.vercel.app/)

## Key Features
- **Real-Time Notifications:** Instant popups (Toasts) when someone claims/accepts your request, powered by **Socket.io**.
- **Interactive Feed:** Browse live requests and claim them on the fly.
- **Cloud Database:** Real-time data persistence with **MongoDB Atlas**.
- **Secure Architecture:** Production-ready environment variables (`.env`) safeguarding database credentials.

## Tech Stack
- **Frontend:** React.js, React-Toastify, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Real-Time Protocol:** WebSockets (Socket.io)
- **Hosting:** Render (Backend), Vercel (Frontend)

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sanskritiag04/Bringit.git