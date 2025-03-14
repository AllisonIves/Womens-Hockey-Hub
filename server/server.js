const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

//Routes
const projectRoutes = require('./routes/project');

mongoose.connect('mongodb+srv://dleduc1:PWgzHeunLWNH22a3@cluster0.moibf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Initializing for socket
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    }
  });

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

//Support connection
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });

//Socket events
io.on('connection', (socket) => {

    //New message event handling
    socket.on('new message', (message) => {
      io.emit('new message', message);
    });

  });