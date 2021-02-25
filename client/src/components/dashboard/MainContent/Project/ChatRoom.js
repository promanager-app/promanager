import React, { useState, useEffect } from "react";
import axios from 'axios'

import "./ChatRoom.css";
import useChat from "./useChat";

const ChatRoom = (props) => {
    const { roomId, userId } = props.match.params; // Gets roomId from URL
    const { messages, sendMessage } = useChat(roomId); // Creates a websocket and manages messaging
    const [newMessage, setNewMessage] = React.useState(""); // Message to be sent

    const [chats, setChats] = useState([])

    useEffect(() => {
        axios.get(`/api/room/chats/${roomId}`, {
            // headers: {
            //     'Authorization' : `Bearer ${token}`
            // }
        })
        .then(res => {
            setChats(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    const handleNewMessageChange = (event) => {
        setNewMessage(event.target.value);
    };


    const handleSendMessage = () => {
        sendMessage(`${userId}: ` + newMessage);
        setNewMessage("");
    };
    
    return (
        <div className="chat-room-container">
            <h1 className="room-name">Room: {roomId}</h1>
            <div className="messages-container">
                <ol className="messages-list">
                    {chats.map((message, i) => (
                        <li
                            key={i}
                            className={`message-item ${message.username === userId ? "my-message" : "received-message"
                                }`}
                        >
                                {message.message}
                        </li>
                    ))}
                    {messages.map((message, i) => (
                        <li
                            key={i}
                            className={`message-item ${message.ownedByCurrentUser ? "my-message" : "received-message"
                                }`}
                        >
                                {message.body}
                        </li>
                    ))}
                </ol>
            </div>
            <textarea
                value={newMessage}
                onChange={handleNewMessageChange}
                placeholder="Write message..."
                className="new-message-input-field"
            />
            <button onClick={handleSendMessage} className="send-message-button">
                Send
            </button>
        </div>
    );
};

export default ChatRoom;