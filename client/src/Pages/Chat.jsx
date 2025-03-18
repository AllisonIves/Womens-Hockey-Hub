import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import "../styles/chat.css";

function Chat() {
    const socket = io('http://localhost:5000', {
        transports: ['websocket'],
    });

    // Initialize states
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messageEndRef = useRef(null);
    const [username, setUsername] = useState('');
    const [isUsernameNull, setIsUsernameNull] = useState(true);
    const [users, setUsers] = useState([]);

    const inactivityTimeout = useRef(null);

    useEffect(() => {
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on('userList', (userList) => {
            setUsers(userList);
        });

        socket.on('bannedWord', (message) => {
            alert(message);
        });

        const resetInactivityTimer = () => {
            if (inactivityTimeout.current) {
                clearTimeout(inactivityTimeout.current);
            }
            inactivityTimeout.current = setTimeout(() => {
                console.log('You have been disconnected due to inactivity.');
                socket.emit('disconnectUser');
                alert('You have been disconnected due to inactivity.');
            }, 10 * 60 * 1000);
        };

        const activityEvents = ['keydown', 'input'];
        activityEvents.forEach((event) => {
            window.addEventListener(event, resetInactivityTimer);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsUsernameNull(true);
            setUsername('');
            setMessages([]);
        });

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
            socket.emit('sendMessage', { message: inputMessage, username });
            setInputMessage('');
        }
    };

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
        <div>
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
                <>
                    {/* Wrapper for chat and users */}
                    <div className="chat-wrapper">
                        {/* Chat Box */}
                        <div className="chat-container">
                            <h2>Chat</h2>
                            <div className="messages">
                                {messages.map((msg, index) => (
                                    <div 
                                        key={index} 
                                        className={`message ${msg.username === username ? "you" : "other"}`}
                                    >
                                        <strong>{msg.username}</strong>: {msg.message}
                                    </div>
                                ))}
                                <div ref={messageEndRef} />
                            </div>
                        </div>

                        {/* Connected Users Box */}
                        <div className="user-list-container">
                            <h3 className="user-list-title">Connected Users</h3>
                            <div className="user-list">
                                <ul>
                                    {users.map((user, index) => (
                                        <li key={index}>{user}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Message Input Box */}
                    <div className="message-input-container">
                        <form onSubmit={handleSendMessage} className="message-form">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={inputMessage}
                                onChange={handleInputChange}
                                className="message-input"
                            />
                            <button type="submit" className="send-button">Send</button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}

export default Chat;
