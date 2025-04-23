import { useState, useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import Loader from "../helperComponent/Loader";
import io from "socket.io-client";
import socket from "./socket";
import { formatDate } from "./formDate";

import "../CSS/showchats.css";
import notification from "./notification";

const ShowChats = () => {
    const { isLoading, chatError, chats, getChatMessageByChatId, messages, setMessages } = useChat();
    const [ showChat, setShowChat ] = useState(false);
    const [ newMessage, setNewMessage] = useState("");
    const [ chatId, setChatId] = useState();
    const [activeChat, setActiveChat] = useState(null);

    const socketRef = useRef(null);

    const userString = localStorage.getItem("user");
    const userId = JSON.parse(userString).userId;

    const chatContainerRef = useRef(null);
    const [otherUserTyping, setOtherUserTyping] = useState(false);

    // Socket setup using your existing configuration
    useEffect(() => {
        if (!socketRef.current) {
            const socket = io("https://socialmediaclonebackend.onrender.com");
            socketRef.current = socket;
        }
        
        socketRef.current.on("chat-message", (message) => {
            setMessages(prevState => [...prevState, message]); 
        });

        socketRef.current.on("typing", (otherUserId) => {
            if (otherUserId !== userId)
                setOtherUserTyping(true);
        });        

        socketRef.current.on("stop typing", (otherUserId) => {
            if (otherUserId !== userId)
                setOtherUserTyping(false);
        });

        return () => {
            if (socketRef.current) {
                if (newMessage.trim() !== "") {
                    socketRef.current.emit("stop typing", { chatId, userId });
                }
                
                socketRef.current.disconnect();
            }
        };
    }, []);

    // Auto scroll on new messages
    useEffect(() => {
        if (chatContainerRef.current) {
            setTimeout(() => {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }, 0);
        }
    }, [messages, otherUserTyping]);

    const handleSendMessage = async () => {
        const socketInstance = socketRef.current;

        if (socketInstance && newMessage.trim()) {
            const message = {sender: userId, content: newMessage};
            const data = {chatId, message: newMessage, userId};
            socketInstance.emit("chat-message", data);
            socketInstance.emit("stop typing", {chatId, userId});

            setMessages(prevState => [...prevState, message]);
            setNewMessage("");
        }
        else if (!socketInstance) {
            notification.error("Chat connection not available");
        }
    };

    const handleShowChat = async (chat) => {
        const socketInstance = socketRef.current;

        if (socketInstance) {
            socketInstance.emit("join-chat", chat.chatId);

            getChatMessageByChatId(chat.chatId);
            setShowChat(true);
            setChatId(chat.chatId);
            setActiveChat(chat);
        }
        else {
            notification.warning("Chat connection not available");
        }
    };

    const handleCloseChat = () => {
        const socketInstance = socketRef.current;
    
        if (socketInstance) {
            if (newMessage.trim() !== "") {
                socketInstance.emit("stop typing", { chatId, userId });
            }
            socketInstance.emit("leave-chat", chatId);
            setShowChat(false);
            setChatId(null);
            setActiveChat(null);
        } else {
            notification.warning("Chat connection not available");
        }
    };
    
    const handleTyping = () => {
        if (socketRef.current) {
            socketRef.current.emit("typing", {chatId, userId});
        }
    };

    const handleStopTyping = () => {
        if (socketRef.current) {
            socketRef.current.emit("stop typing", {chatId, userId});
        }
    };

    if (isLoading) {
        return <Loader />;
    }
    
    if (chatError) {
        return <div className="error">Error: {chatError}</div>;
    }

    if (chats.length === 0) {
        return (
            <div className="chats">
                <h3>Your Conversations</h3>
                <h3>You don't have any conversations yet</h3>
            </div>
        );
    }

    return (
        <div>
            {!showChat && (
                <div className="chats">
                    <h3>Your Conversations</h3>
                    {chats.map((chat) => (
                        <div className="chat-info" key={chat.chatId}>
                            <div className="chat-user">
                                <div 
                                    className="chat-avatar" 
                                    style={{ 
                                        backgroundColor: getAvatarColor(chat.otherUserNickname)
                                    }}
                                >
                                    {chat.otherUserNickname.charAt(0).toUpperCase()}
                                </div>
                                <span>{chat.otherUserNickname}</span>
                            </div>
                            <button onClick={() => handleShowChat(chat)}>Open Chat</button>
                        </div>
                    ))}
                </div>
            )}
            {showChat && activeChat && (
                <div className="chat">
                    <div className="chat-header">
                        <div className="chat-user-info">
                            <div 
                                className="chat-avatar"
                                style={{ 
                                    backgroundColor: getAvatarColor(activeChat.otherUserNickname)
                                }}
                            >
                                {activeChat.otherUserNickname.charAt(0).toUpperCase()}
                            </div>
                            <h3>{activeChat.otherUserNickname}</h3>
                        </div>
                        <button onClick={handleCloseChat}>✕</button>
                    </div>
                    <div ref={chatContainerRef} className="chat-container">
                        {messages.length === 0 ? (
                            <div className="no-messages">
                                <p>No messages yet. Start a conversation with {activeChat.otherUserNickname}!</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`chat-message ${msg.sender === userId ? 'outgoing' : 'incoming'}`}
                                >
                                    <div className="message-content">
                                        <p>{msg.content}</p>
                                        {msg.createdAt && (
                                            <span className="message-timestamp">{formatDate(msg.createdAt)}</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        {otherUserTyping && 
                            <div className="chat-bubble incoming">
                                <div className="typing">
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                    <div className="dot"></div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="message-input">
                        <input
                            type="text"
                            value={newMessage}
                            placeholder="Type a message..."
                            onChange={(e) => {
                                setNewMessage(e.target.value);
                                if (e.target.value.trim() === "") {
                                    handleStopTyping();
                                } else {
                                    handleTyping();
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && newMessage.trim()) {
                                    handleSendMessage();
                                }
                            }}
                        />
                        <button 
                            onClick={handleSendMessage} 
                            disabled={!newMessage.trim()}
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

// Helper function for avatar colors
const getAvatarColor = (nickname) => {
    const colors = [
        '#89B4FA', // blue
        '#A6E3A1', // green
        '#F9E2AF', // yellow
        '#F38BA8', // red
        '#CBA6F7', // purple
        '#FAB387', // orange
    ];
    
    let hash = 0;
    for (let i = 0; i < nickname.length; i++) {
        hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

export default ShowChats;