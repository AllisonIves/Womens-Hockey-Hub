const fs = require('fs');
const bannedWordsPath = 'bannedWords.json';
// Load banned words from JSON file
const bannedWords = JSON.parse(fs.readFileSync(bannedWordsPath)).bannedWords;

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
            socket.on('setUsername', (username) => {
                // Check if username is taken across all rooms
                for (const room in usersByRoom) {
                    if (usersByRoom[room].includes(username)) {
                        socket.emit('userLimit', 'Username already taken. Please choose a different one.');
                        socket.disconnect(); // Disconnect the user if username is taken
                        return;
                    }
                }

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
            let message = data.message.toLowerCase();

            // Check if the message contains any banned words
            let containsBannedWord = bannedWords.some(word => message.includes(word));

            if (containsBannedWord) {
                // Emit banned word only to the user who sent the message
                socket.emit('bannedWord', 'Your message contains a banned word. Try again.');
            } else {
                if (socket.room) {
                    io.to(socket.room).emit('receiveMessage', data);
                }
            }
        });

        // Handle user disconnecting
        socket.on('disconnect', () => {
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
            disconnectAllUsers(io);
            usersByRoom = {};
            io.emit('userList', []);
            console.log('All users have been disconnected.');
        });
    });
};
