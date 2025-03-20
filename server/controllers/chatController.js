const fs = require('fs');
const bannedWordsPath = 'bannedWords.json';
//Load banned words from JSON file
const bannedWords = JSON.parse(fs.readFileSync(bannedWordsPath)).bannedWords;

//Disconnect all users function for testing purposes, to be removed
function disconnectAllUsers(io) {
    io.sockets.sockets.forEach(socket => {
        console.log(`Disconnecting user with socket ID: ${socket.id}`);
        socket.disconnect(true); //Forcefully disconnect socket
    });
}

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
                //Check if the username is already taken
                if (users.includes(username)) {
                    socket.emit('userLimit', 'Username already taken. Please choose a different one.');
                    socket.disconnect(); //Disconnect the user if username is taken
                } else {
                    users.push(username);  //Add new user
                    socket.username = username;
                    console.log(`User ${username} joined`);

                    //Update userlist for all users
                    io.emit('userList', users);
                }
            } else {
                socket.emit('userLimit', 'The chat is full.'); //Notify that the chat is full
                socket.disconnect(); //Disconnect the user
            }
        });

        //Handle message sending
        socket.on('sendMessage', (data) => {
            let message = data.message.toLowerCase();

            //Check if the message contains any banned words
            let containsBannedWord = bannedWords.some(word => message.includes(word));

            if (containsBannedWord) {
                //Emit banned word only to the user who sent the message
                socket.emit('bannedWord', 'Your message contains a banned word. Try again.');
            } else {
                io.emit('receiveMessage', data);
            }
        });

        //Handle user disconnecting
        socket.on('disconnect', () => {
            //Remove the username from the list
            if (socket.username) {
                users = users.filter(user => user !== socket.username);
                io.emit('userList', users); //Update userlist for all users
                console.log(`User ${socket.username} disconnected: ${socket.id}`);
            }
        });

        //Handle disconnectAll event (to be removed)
        socket.on('disconnectAll', () => {
            disconnectAllUsers(io);
            users = []; //Clear users list after disconnecting everyone
            io.emit('userList', users); //Clear the user list for everyone
            console.log('All users have been disconnected.');
        });
    });
};