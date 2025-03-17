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

    useEffect(() => {
        //Handle new messages
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        //Update the connected users list
        socket.on('userList', (userList) => {
            setUsers(userList);
        });
        
        socket.on('bannedWord', (message) => {
            alert(message);  //Display the alert to the user
            console.log(message); //Log for debugging
        });


        return () => {
            socket.off('receiveMessage');
            socket.off('userList');
            socket.off('bannedWord');
        };
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
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