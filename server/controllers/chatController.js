module.exports = function(io) {

    let users = []; // Array to track the users

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
    
        // Send the list of users to the new client
        socket.emit('userList', users);
    
        // Handle new user joining
        socket.on('setUsername', (username) => {
            if (!users.includes(username)) {
                users.push(username);  // Add the new user to the list
                socket.username = username; // Store the username in the socket object
            }
            
            // Notify all clients about the updated user list
            io.emit('userList', users);
        });
    
        // Handle message sending
        socket.on('sendMessage', (data) => {
            io.emit('receiveMessage', data);
        });
    
        // Handle user disconnecting
        socket.on('disconnect', () => {
            // Remove the username from the list when a user disconnects
            users = users.filter(user => user !== socket.username);
            io.emit('userList', users); // Update the user list on all clients
            console.log('User disconnected:', socket.id);
        });
    });
};