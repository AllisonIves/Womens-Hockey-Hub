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
            socket.emit('new message', {message: inputMessage });
            //Revert the input
            setInputMessage('');
        }
    };
    //Handling for change of input (typing the message)
    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };


    //Create a container and div to store the messages in. Map the messages by index so they're chronological
    return (
        <div className="chat-container">
            <div className="chat">
                <h2>Chat</h2>
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div key={index} className="message">
                            {msg.message}
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
        </div>
    );
}

export default Chat;