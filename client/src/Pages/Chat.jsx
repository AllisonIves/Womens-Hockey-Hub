import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

function Chat() {
    const socket = io('http://localhost:5000', {
        transports: ['websocket'],
    });

    //Initialize states
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messageEndRef = useRef(null);
    const [username, setUsername] = useState('');
    const [isUsernameNull, setIsUsernameNull] = useState(true);
    const [users, setUsers] = useState([]);

    const inactivityTimeout = useRef(null); //Track the timer of inactivity

    useEffect(() => {
        //Handle new messages
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on('userList', (userList) => {
            setUsers(userList);
        });

        socket.on('bannedWord', (message) => {
            alert(message);  //Display alert with message of banend word to the user
        });

        //Event listener to reset inactivity timer
        const resetInactivityTimer = () => {
            if (inactivityTimeout.current) {
                clearTimeout(inactivityTimeout.current); //Clear previous timeout
            }
            inactivityTimeout.current = setTimeout(() => {
                console.log('You have been disconnected due to inactivity.');
                socket.emit('disconnectUser'); //Emit event to disconnect user
                alert('You have been disconnected due to inactivity.');
            }, 10 * 60 * 1000); //10 minutes in milliseconds
        };

        //Event listeners for user interaction (using keydown so typing counts as activity)
        const activityEvents = ['keydown', 'input'];
        activityEvents.forEach((event) => {
            window.addEventListener(event, resetInactivityTimer);
        });

        //Listen for socket disconnection event
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsUsernameNull(true);  //Reset to show the username input screen
            setUsername('');
            setMessages([]);
        });

        //Cleanup event listeners
        return () => {
            activityEvents.forEach((event) => {
                window.removeEventListener(event, resetInactivityTimer);
            });
            if (inactivityTimeout.current) {
                clearTimeout(inactivityTimeout.current);
            }
            socket.off('receiveMessage');
            socket.off('bannedWord');
            socket.off('userList');
        };
    }, []);
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            //Emit the message to the backend
            socket.emit('sendMessage', { message: inputMessage, username });
            setInputMessage('');
        }
    };
    //Handle input change (typing message)
    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            setIsUsernameNull(false);
            socket.emit('setUsername', username);
        }
    };

    return (
        <div className="chat-container">
            {isUsernameNull ? (
                <div className="username-selection">
                    <h2>Enter Your Username</h2>
                    <form onSubmit={handleUsernameSubmit}>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <button type="submit">Enter Chat</button>
                    </form>
                </div>
            ) : (
                <div className="chat">
                    <h2>Chat</h2>
                    <div className="users">
                        <h3>Connected Users:</h3>
                        <ul>
                            {users.map((user, index) => (
                                <li key={index}>{user}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className="message">
                                <strong>{msg.username}: </strong>{msg.message}
                            </div>
                        ))}
                        <div ref={messageEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={inputMessage}
                            onChange={handleInputChange}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Chat;