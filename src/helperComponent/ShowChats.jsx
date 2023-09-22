import { useState, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import Loader from "../helperComponent/Loader";
import io from "socket.io-client";


import "../CSS/showchats.css";


const ShowChats = () => {
    const { isLoading, chatError, chats, getChatMessageByChatId, sendMessageByChatId, messages, setMessages } = useChat();
    const [ showChat, setShowChat ] = useState(false);
    const [ newMessage, setNewMessage] = useState("");
    const [ chatId, setChatId] = useState()

    const userString = localStorage.getItem("user");
    const userId = JSON.parse(userString).userId;

    const socket = io("https://socialmediaclonebackend.onrender.com");

    useEffect(() => {

        socket.on("chat-message", (message) => {
           setMessages(prvState => [...prvState, message]); 
        })

        return () => {
            socket.disconnect();
        }
    }, [])

    const handleSendMessage = async () => {
        // Emit a "chat-message" event to the server
        socket.emit("chat-message", {
        chatId,
        message: newMessage,
        userId,
        });

        setNewMessage("");
    }

    const handleShowChat = async (chatId) => {
        socket.emit("join-chat", chatId);

        getChatMessageByChatId(chatId);
        setShowChat(prv => !prv);
        setChatId(chatId);
    }

    const handleCloseChat = () => {
        socket.emit("leave-chat", chatId);
        setShowChat(false);
        setChatId(null);
    }

    if (isLoading) {
        return <Loader />;
    }
    
    if (chatError) {
        return <h3 className=".error">Error: {error}</h3>;
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
                        <div className="chat-info">
                            <span>Nickname: {chat.otherUserNickname}</span>
                            <button onClick={() => handleShowChat(chat.chatId)}>Open Chat</button>
                        </div>
                    ))}
                </div>
            )}
            {showChat && (
                <div className="chat">
                <button onClick={handleCloseChat}>X</button>
                <div className="chat-container">
                    {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${msg.sender === userId ? 'outgoing' : 'incoming'}`}
                    >
                        <p>{msg.content}</p>
                    </div>
                    ))}
                </div>
                <div className="message-input">
                    <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
              </div>
            )}
       </div>
    );
}

export default ShowChats;
