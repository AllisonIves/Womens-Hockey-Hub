module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Fix event name mismatch
        socket.on('sendMessage', (message) => {
            io.emit('receiveMessage', message);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};