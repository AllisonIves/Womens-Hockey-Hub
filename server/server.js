const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const projectRoutes = require('./routes/project');
const communityEventRoutes = require('./routes/communityevent');

mongoose.connect('mongodb+srv://dleduc1:PWgzHeunLWNH22a3@cluster0.moibf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Multer will handle file uploads before `express.json()`
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Serve uploaded images
app.use('/api/communityevent', communityEventRoutes);  // Register event routes

app.use(express.urlencoded({ extended: true })); // Parses form-data
app.use(express.json()); // Parses JSON

// Initialize server and socket
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});

// Import and use the chat controller
const chatController = require('./controllers/chatController');
chatController(io);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}
