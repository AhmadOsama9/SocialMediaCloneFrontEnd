import { useState } from "react";
import { useChat } from "../hooks/useChat";

import "../CSS/showchats.css";


const ShowChats = () => {
    const { isLoading, error, chats, getChatMessageByChatId, sendMessageByChatId, messages } = useChat();
    const [ showChat, setShowChat ] = useState(false);
    const [ newMessage, setNewMessage] = useState("");
    const [ chatId, setChatId] = useState()

    const userString = localStorage.getItem("user");
    const userId = JSON.parse(userString).userId;

    const handleSendMessage = async () => {
        sendMessageByChatId(chatId, newMessage);
        setNewMessage("");
    }

    const handleShowChat = async (chatId) => {
        getChatMessageByChatId(chatId);
        setShowChat(prv => !prv);
        setChatId(chatId);
    }

    if (isLoading) {
        return <h3>Loading</h3>;
    }
    
    if (error) {
        return <h3>Error: {error}</h3>;
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
                <button onClick={() => setShowChat(prv => !prv)}>X</button>
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
