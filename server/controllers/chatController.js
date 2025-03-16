module.exports = function(io) {
    const MAX_USERS = 10; //Maximum users
    let users = []; //Array to track the users

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
    
        //Send the list of users to the new user
        socket.emit('userList', users);
    
        //Handle new user joining
        socket.on('setUsername', (username) => {
            if (users.length < MAX_USERS) {
                if (!users.includes(username)) {
                    users.push(username);  //Add new jser
                    socket.username = username;
                }
                //Update userlist for all users
                io.emit('userList', users);
            } else {
                socket.emit('userLimitReached', 'The chat is full.'); //Temporary message to be replaced when new chat functionality added
                socket.disconnect();
            }
        });
        //Handle message sending
        socket.on('sendMessage', (data) => {
            io.emit('receiveMessage', data);
        });
    
        //Handle user disconnecting
        socket.on('disconnect', () => {
            //Remove the username from the list
            users = users.filter(user => user !== socket.username);
            io.emit('userList', users); //Update userlist for all users
            console.log('User disconnected:', socket.id);
        });
    });
};