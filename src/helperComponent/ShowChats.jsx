import { useState, useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import Loader from "../helperComponent/Loader";
import io from "socket.io-client";
import socket from "./socket";

import "../CSS/showchats.css";

const ShowChats = () => {
    const { isLoading, chatError, chats, getChatMessageByChatId, sendMessageByChatId, messages, setMessages } = useChat();
    const [ showChat, setShowChat ] = useState(false);
    const [ newMessage, setNewMessage] = useState("");
    const [ chatId, setChatId] = useState();

    const socketRef = useRef(null);

    const userString = localStorage.getItem("user");
    const userId = JSON.parse(userString).userId;

    const chatContainerRef = useRef(null);
    const [otherUserTyping, setOtherUserTyping] = useState(false);

    useEffect(() => {

        if (!socketRef.current) {
            const socket = io("https://socialmediaclonebackend.onrender.com");
            socketRef.current = socket;
        }
        
        socketRef.current.on("chat-message", (message) => {
            setMessages(prvState => [...prvState, message]); 
        })

        socketRef.current.on("typing", (otherUserId) => {
           
                setOtherUserTyping(true);
        })        

        socketRef.current.on("stop typing", (otherUserId) => {
           
                setOtherUserTyping(false);
        })

        return () => {
            if (socketRef.current) 
                socket.disconnect();
        }
    }, [])

    useEffect(() => {
        if (chatContainerRef.current) {
            setTimeout(() => {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }, 0);
        }
    }, [messages]);

    const handleSendMessage = async () => {
        const socket = socketRef.current;

        if (socket) {

            const message = {sender: userId, content: newMessage}
            const data = {chatId, message: newMessage, userId};
            socket.emit("chat-message", data);
            socket.emit("stop typing", {chatId, userId});

            setMessages(prvState => [...prvState, message]);

            setNewMessage("");

        }
        else {
            alert("The socket is null");
        }
    }

    const handleShowChat = async (chatId) => {
        const socket = socketRef.current;

        if (socket) {
            socket.emit("join-chat", chatId);

            getChatMessageByChatId(chatId);
            setShowChat(prv => !prv);
            setChatId(chatId);
        }
        else {
            alert("The socket is null");
        }
    }

    const handleCloseChat = () => {
        const socket = socketRef.current;

        if (socket) {
            socket.emit("leave-chat", chatId);
            setShowChat(false);
            setChatId(null);
        }
        else {
            alert("The socket is null");
        }
    }

    const handleTyping = () => {
        socket.emit("typing", {chatId, userId});
    }

    const handleStopTyping = () => {
        socket.emit("stop typing", {chatId, userId});
    }

    if (isLoading) {
        return <Loader />;
    }
    
    if (chatError) {
        return <h3 className="error">Error: {error}</h3>;
    }

    if (chats.length === 0) {
        return <h3>You have no chats</h3>;
    }

    return (
        <div>
            {!showChat && (
                <div className="chats">
                    <h3>Chats</h3>
                    {chats.map((chat) => (
                        <div className="chat-info" key={chat.chatId}>
                            <span>Nickname: {chat.otherUserNickname}</span>
                            <button onClick={() => handleShowChat(chat.chatId)}>Open Chat</button>
                        </div>
                    ))}
                </div>
            )}
            {showChat && (
                <div className="chat">
                <button onClick={handleCloseChat}>X</button>
                <div ref={chatContainerRef} className="chat-container">
                    {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${msg.sender === userId ? 'outgoing' : 'incoming'}`}
                    >
                        <p>{msg.content}</p>
                    </div>
                    ))}
                </div>
                {otherUserTyping && <p>Other user is typing...</p>}
                <div className="message-input">
                 <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                        setNewMessage(e.target.value);
                        if (e.target.value.trim() === "") {
                        handleStopTyping();
                        } else {
                        handleTyping();
                        }
                    }}
                    />
                    <button 
                     onClick={handleSendMessage} disabled={!newMessage.trim()}
                     className={`${newMessage.trim() === "" ? "faded": ""}`} 
                    >
                        Send
                    </button>
                </div>
              </div>
            )}
       </div>
    );
}

export default ShowChats;
