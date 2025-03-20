import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import "../styles/chat.css";

function Chat() {

    //Initialize states
    const socket = useRef(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messageEndRef = useRef(null);
    const [username, setUsername] = useState('');
    const [isUsernameNull, setIsUsernameNull] = useState(true);
    const [users, setUsers] = useState([]);

    const inactivityTimeout = useRef(null);
    useEffect(() => {
        socket.current = io('http://localhost:5000');  //Initialize socket connection

        //Receive message event
        socket.current.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        //Updating user list
        socket.current.on('userList', (userList) => {
            setUsers(userList);
        });
        //Banned word handling
        socket.current.on('bannedWord', (message) => {
            console.log('Received banned word message:', message);
            alert(message);
        });
        //User limit handling (maximum users and repeat names)
        socket.current.on('userLimit', (message) => {
            console.log(message); //Debug log
            alert(message);  //Alert the user
            setIsUsernameNull(true);  //Reset the state to show the username inpyut again
        });

        socket.current.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsUsernameNull(true);
            setUsername('');
            setMessages([]);
        });
        
        const resetInactivityTimer = () => {
            if (inactivityTimeout.current) {
                clearTimeout(inactivityTimeout.current);
            }
            inactivityTimeout.current = setTimeout(() => {
                socket.current.emit('disconnectUser');
                socket.current.disconnect();
                setIsUsernameNull(true); //Reset the state to show the username inpyut again
                alert('You have been disconnected due to inactivity.');
            }, 10 * 60 * 1000); //10 minutes timer
        };

        const activityEvents = ['keydown', 'input'];
        activityEvents.forEach((event) => {
            window.addEventListener(event, resetInactivityTimer);
        });


        return () => {
            socket.current.disconnect(); //Cleanup socket
            activityEvents.forEach((event) => {
                window.removeEventListener(event, resetInactivityTimer);
            });
            if (inactivityTimeout.current) {
                clearTimeout(inactivityTimeout.current);
            }
        };
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            const messageData = { message: inputMessage, username };
            socket.current.emit('sendMessage', messageData);
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
            socket.current.emit('setUsername', username);
        }
    };

    //Handle disconnecting the current user
    const handleDisconnectUser = () => {
        socket.current.emit('disconnectUser');
        socket.current.disconnect();
        setIsUsernameNull(true); //Reset the state to show the username inpyut again
    };

    //Handle disconnecting all users (to be removed)
    const handleDisconnectAllUsers = () => {
        socket.current.emit('disconnectAll');
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

                    {/* Disconnect Buttons */}
                    <div className="disconnect-buttons">
                        <button onClick={handleDisconnectUser}>Disconnect Me</button>
                        <button onClick={handleDisconnectAllUsers}>Disconnect All Users</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Chat;
