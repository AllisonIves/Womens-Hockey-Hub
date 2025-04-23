/**
 * @file Socket.IO controller for handling real-time chat functionality.
 * Manages user connections, room assignments, messaging, and banned word filtering.
 * Also includes temporary admin functionality to disconnect all users (for testing only).
 */

const fs = require('fs');
const containsBannedWord = require('../utilities/checkBannedWords');

// Disconnect all users function for testing purposes, to be removed
function disconnectAllUsers(io) {
    io.sockets.sockets.forEach(socket => {
        console.log(`Disconnecting user with socket ID: ${socket.id}`);
        socket.disconnect(true); // Forcefully disconnect socket
    });
}

module.exports = function (io) {
    const MAX_USERS = 10; // Maximum users per room
    let usersByRoom = {}; // Tracks usernames per room

    // Find or create a room with space
    function assignRoom() {
        for (let i = 1; ; i++) {
            const roomName = `Room ${i}`;
            if (!usersByRoom[roomName]) {
                usersByRoom[roomName] = [];
                return roomName;
            }
            if (usersByRoom[roomName].length < MAX_USERS) {
                return roomName;
            }
        }
    }

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Send current room states
        socket.emit('roomList', usersByRoom);

        // Handle new user joining
        socket.on('userJoin', (username) => {
            console.log(`[JOIN] ${username} joined with socket ID: ${socket.id}`);
            const room = assignRoom(); // Get a room with space
            socket.room = room;
            socket.username = username;

            usersByRoom[room].push(username);
            socket.join(room);

            // Send room name back to user
            socket.emit('roomJoined', room);

            console.log(`User ${username} joined ${room}`);

            // Send updated user list for this room
            io.to(room).emit('userList', usersByRoom[room]);
        });

        // Handle message sending
        socket.on('sendMessage', (data) => {
            console.log(`[MESSAGE] From ${data.username}: "${data.message}"`);
            const message = data.message;

            if (containsBannedWord(message)) {
                console.log(`[BANNED] Message from ${data.username} blocked for banned word: "${data.message}"`);
                socket.emit('bannedWord', 'Your message contains a banned word. Try again.');
            } else {
                if (socket.room) {
                    io.to(socket.room).emit('receiveMessage', data);
                }
            }
        });

        // Handle user disconnecting
        socket.on('disconnect', () => {
            console.log(`[DISCONNECT] ${socket.username} disconnected from ${socket.room}`);
            if (socket.username && socket.room) {
                usersByRoom[socket.room] = usersByRoom[socket.room].filter(u => u !== socket.username);
                if (usersByRoom[socket.room].length === 0) {
                    delete usersByRoom[socket.room]; // Clean up empty rooms
                }
                io.to(socket.room).emit('userList', usersByRoom[socket.room]);
                console.log(`User ${socket.username} disconnected from ${socket.room}: ${socket.id}`);
            }
        });

        // Handle disconnectAll event (to be removed)
        socket.on('disconnectAll', () => {
            console.log('[ADMIN] DisconnectAll called');
            disconnectAllUsers(io);
            usersByRoom = {};
            io.emit('userList', []);
            console.log('All users have been disconnected.');
        });
    });
};
