/**
 * Entry point for the Express backend server.
 * 
 * Sets up:
 * - MongoDB connection
 * - Express routes and middleware
 * - WebSocket server with Socket.io for real-time chat
 * - Static file serving for uploaded images and production frontend
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Import routes
const communityEventRoutes = require('./routes/communityevent');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');
const postRoutes = require('./routes/postRoutes');

// Initialize app and server
const app = express();
const server = http.createServer(app);

// Setup WebSocket server with CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

/**
 * Connect to MongoDB using Mongoose
 * We should move this to a .env file to keep private
 */
mongoose.connect('mongodb+srv://dleduc1:PWgzHeunLWNH22a3@cluster0.moibf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/communityevent', communityEventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/forum', postRoutes);

// WebSocket for chat
const chatController = require('./controllers/chatController');
chatController(io);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}
