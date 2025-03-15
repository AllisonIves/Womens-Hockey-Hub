import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

function Chat() {
    const socket = io('http://localhost:5000', {
        transports: ['websocket'],
    });

    //Initialize Use States
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messageEndRef = useRef(null);
    const [username, setUsername] = useState('');
    const [isUsernameNull, setIsUsernameNull] = useState(true);

    useEffect(() => {
        //Listen for messages
        socket.on('new message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('new message');
        };
        }, []);
    
    //Handling for send message
    const handleSendMessage = (e) => {
        e.preventDefault();
        //Ensure message is not empty
        if (inputMessage.trim()) {
            //Emit message
            socket.emit('new message', {message: inputMessage, username });
            //Revert the input
            setInputMessage('');
        }
    };

    
    //Handling for change of input (typing the message)
    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    //Handling for username submit
    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        //Ensure message is not empty
        if (username.trim()) {
            //Set isUserNameNull boolean to false
            setIsUsernameNull(false);
    };
}


    return (
        //username selection (will be removed when user log in is implemented)
        <div className="chat-container">
            {isUsernameNull ? (
                <div className="username-selection">
                    <h2>Enter Your Username</h2>
                    <form onSubmit={handleUsernameSubmit}>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} //set username value with change
                        />
                        <button type="submit">Enter Chat</button>
                    </form>
                </div>
            ) : (
                //Actual chat box
                <div className="chat">
                    <h2>Chat</h2>
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