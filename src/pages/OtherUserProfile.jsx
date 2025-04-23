import { useState, useEffect } from "react";
import { useRequest } from "../hooks/useRequest";
import { useChat } from "../hooks/useChat";
import OtherUserProfilePosts from "../helperComponent/otherUserProfilePosts";
import OtherUserSharedPosts from "../helperComponent/OtherUserSharedPosts";
import Loader from "../helperComponent/Loader";
import { formatDate } from "../helperComponent/formDate";

import { avatar1, avatar2, avatar3, avatar4, avatar0 } from "../assets/avatar";

import "../CSS/otheruserprofile.css";
import { useReceivedRequestsContext } from "../context/ReceivedRequestsContext";

const OtherUserProfile = ({ otherUser, relation }) => {
  const { isLoading, error, acceptRequest, declineRequest, setIsLoading, setError } = useRequest();
  const { relationshipStatus, setRelationshipStatus } = useReceivedRequestsContext();
  
  const [showChat, setShowChat] = useState(false);
  const { messages, chatId, sendMessageByChatId, getChatMessages, chatError } = useChat();
  const [newMessage, setNewMessage] = useState("");

  const userString = localStorage.getItem("user");
  const userId = JSON.parse(userString).userId;
  const otherUserId = otherUser.user;
  
  const [activePostsType, setActivePostsType] = useState("");

  useEffect(() => {
    getFriendRelationshipStatus(userId, otherUserId);
  }, [userId, otherUserId]);

  const getFriendRelationshipStatus = async (userId, otherUserId) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/getrelation?userId=${userId}&otherUserId=${otherUserId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      setRelationshipStatus(data.relation);
    } else {
      setError(data.error);
    }

    setIsLoading(false);
  };
  
  const handleSendFriendRequest = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("https://socialmediaclonebackend.onrender.com/api/user/sendrequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, otherUserId }),
    });

    const data = await response.json();

    if (response.ok) {
      setRelationshipStatus("Pending");
    } else {
      setError(data.error);
    }

    setIsLoading(false);
  };

  const handleRemoveFriend = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("https://socialmediaclonebackend.onrender.com/api/user/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, otherUserId }),
    });

    const data = await response.json();

    if (response.ok) {
      setRelationshipStatus("None");
    } else {
      setError(data.error);
    }
    setIsLoading(false);
  };

  const handleCancelRequest = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("https://socialmediaclonebackend.onrender.com/api/user/cancelrequest", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ userId, otherUserId}),
    });

    const data = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(data.error);
    } else {
      setRelationshipStatus("None");
    }
  }

  const handleShowChat = () => {
    setShowChat(true);
    getChatMessages(otherUserId);
  }

  const handleCloseChat = () => {
    setShowChat(false);
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessageByChatId(chatId, newMessage);
      setNewMessage("");
    }
  }; 
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePostsTypeToggle = (section) => {
    setActivePostsType(section);
  }
  
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (chatError) {
    return <div className="error-message">Error: {chatError}</div>
  }

  return (
    <div className="other-user-profile">
      {showChat ? (
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-user-info">
              <img
                src={
                  otherUser.image === "0" ? avatar0 :
                  otherUser.image === "1" ? avatar1 :
                  otherUser.image === "2" ? avatar2 :
                  otherUser.image === "3" ? avatar3 :
                  otherUser.image === "4" ? avatar4 : avatar0
                }
                alt={`${otherUser.nickname}'s avatar`}
                className="chat-avatar"
              />
              <h3 className="chat-user-name">{otherUser.nickname}</h3>
            </div>
            <button className="close-chat-button" onClick={handleCloseChat}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender === userId ? 'outgoing' : 'incoming'}`}>
                  <div className="message-content">{msg.content}</div>
                  {msg.createdAt && <span className="message-time">{formatDate(msg.createdAt)}</span>}
                </div>
              ))
            )}
          </div>
          
          <div className="message-input-container">
            <textarea
              className="message-input"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button className="send-button" onClick={handleSendMessage}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-avatar">
              <img
                src={
                  otherUser.image === "1" ? avatar1 :
                  otherUser.image === "2" ? avatar2 :
                  otherUser.image === "3" ? avatar3 :
                  otherUser.image === "4" ? avatar4 : avatar0
                }
                alt={`${otherUser.nickname}'s avatar`}
                className="avatar-image"
              />
            </div>
            <h2 className="profile-name">{otherUser.nickname}</h2>
            
            <div className="profile-relationship">
              {relationshipStatus === "Friends" ? (
                <div className="relationship-status friends">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Friends
                </div>
              ) : relationshipStatus === "Pending" ? (
                <div className="relationship-status pending">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Request Sent
                </div>
              ) : relationshipStatus === "Received" ? (
                <div className="relationship-status received">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  Request Received
                </div>
              ) : null}
            </div>
          </div>
          
          <div className="profile-info-container">
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Age</span>
                <span className="info-value">{otherUser.age}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Gender</span>
                <span className="info-value">{otherUser.gender}</span>
              </div>
              {otherUser.bio && (
                <div className="info-bio">
                  <span className="info-label">Bio</span>
                  <p className="bio-text">{otherUser.bio}</p>
                </div>
              )}
            </div>
            
            <div className="profile-actions">
              {relationshipStatus === "None" && (
                <button onClick={handleSendFriendRequest} className="action-button request-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  Send Friend Request
                </button>
              )}
              
              {relationshipStatus === "Pending" && (
                <button onClick={handleCancelRequest} className="action-button cancel-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                  Cancel Request
                </button>
              )}
              
              {relationshipStatus === "Received" && (
                <div className="action-group">
                  <button onClick={() => acceptRequest(otherUserId)} className="action-button accept-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Accept
                  </button>
                  <button onClick={() => declineRequest(otherUserId)} className="action-button decline-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Decline
                  </button>
                </div>
              )}
              
              {relationshipStatus === "Friends" && (
                <button onClick={handleRemoveFriend} className="action-button remove-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                  Remove Friend
                </button>
              )}
              
              <button onClick={handleShowChat} className="action-button message-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Message
              </button>
            </div>
          </div>
          
          <div className="profile-content-tabs">
            <div className="tabs-header">
              <button 
                className={`tab-button ${activePostsType === 'UserPosts' ? 'active' : ''}`} 
                onClick={() => handlePostsTypeToggle('UserPosts')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Posts
              </button>
              <button 
                className={`tab-button ${activePostsType === 'SharedPosts' ? 'active' : ''}`} 
                onClick={() => handlePostsTypeToggle('SharedPosts')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Shared Posts
              </button>
            </div>
            
            <div className="tab-content">
              {activePostsType === 'UserPosts' && <OtherUserProfilePosts otherUser={otherUser}/>}
              {activePostsType === 'SharedPosts' && <OtherUserSharedPosts otherUser={otherUser}/>}
              {!activePostsType && (
                <div className="empty-tab-content">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <p>Select a tab to view {otherUser.nickname}'s content</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
  
export default OtherUserProfile;