import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import "../styles/chat.css";

/**
 * Chat component for real-time messaging using Socket.IO.
 * Handles connecting to the chat server, sending/receiving messages,
 * tracking connected users, and disconnecting users due to inactivity.
 *
 * @component
 * @returns {JSX.Element} Rendered chat UI including messages, users, and input form.
 */

function Chat() {

    //Initialize states
    const socket = useRef(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messageEndRef = useRef(null);

    const [isInLobby, setIsInLobby] = useState(true);
    const [users, setUsers] = useState([]);
    const [username, setDisplayName] = useState("");

    const inactivityTimeout = useRef(null);
    useEffect(() => {
        socket.current = io('http://localhost:5000');  //Initialize socket connection
        setDisplayName(sessionStorage.getItem("displayName"));

        //Receive message event
        socket.current.on('receiveMessage', (message) => {
            console.log('[CLIENT] Received message from server:', message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        //Updating user list
        socket.current.on('userList', (userList) => {
            console.log('[CLIENT] Updated user list received:', userList);
            setUsers(userList);
        });

        //Banned word handling
        socket.current.on('bannedWord', (message) => {
            console.log('[CLIENT] Banned word detected:', message);
            alert(message);
        });

        //User limit handling (maximum users and repeat names)
        socket.current.on('userLimit', (message) => {
            console.log('[CLIENT] User limit or duplicate name:', message); // Demo log
            alert(message);  //Alert the user
            setIsInLobby(true);  //Reset the state to show the username input again
        });

        socket.current.on('disconnect', () => {
            console.log('[CLIENT] Disconnected from server');
            setIsInLobby(true);
            setMessages([]);
        });

        const resetInactivityTimer = () => {
            if (inactivityTimeout.current) {
                clearTimeout(inactivityTimeout.current);
            }
            inactivityTimeout.current = setTimeout(() => {
                socket.current.emit('disconnectUser');
                socket.current.disconnect();
                setIsInLobby(true); //Reset the state to show the username input again
                alert('You have been disconnected due to inactivity.');
            }, 10 * 60 * 1000);
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

     /**
     * Sends a chat message to the server and clears the input.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - The form submit event
     */

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            const messageData = { message: inputMessage, username };
            console.log('[CLIENT] Sending message:', messageData);
            socket.current.emit('sendMessage', messageData);
            setInputMessage('');
        }
    };

    /**
     * Handles typing in the message input field.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event
     */

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    /**
     * Handles entering the chat lobby and emits 'userJoin' to the server.
     *
     * @param {React.MouseEvent<HTMLButtonElement>} e - The button click event
     */

    const handleEnterChat = (e) => {
        setIsInLobby(false);
        console.log('[CLIENT] Joining as:', username);
        socket.current.emit('userJoin', username);
    };

    /**
     * Disconnects the current user and resets chat state.
     */

    const handleDisconnectUser = () => {
        socket.current.emit('disconnectUser');
        socket.current.disconnect();
        setIsInLobby(true); //Reset the state to show the username input again
    };

     /**
     * Disconnects all users from the chat.
     * For demo/testing purposes only.
     */
    const handleDisconnectAllUsers = () => {
        socket.current.emit('disconnectAll');
    };

    return (
        <div>
            {isInLobby ? (
                <div className="chat-lobby">
                    <button className="page-button" type="submit" onClick={handleEnterChat}>
                        Enter Chat
                    </button>
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
