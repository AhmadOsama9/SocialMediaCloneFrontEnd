import { useState, useEffect } from 'react';
import { useShowFriends } from '../hooks/useShowFriends';
import { useSearchUser } from '../hooks/useSearchUser';
import { useChat } from "../hooks/useChat";
import OtherUserProfile from '../pages/OtherUserProfile';
import Loader from "../helperComponent/Loader";
import { formatDate } from "../helperComponent/formDate";

import "../CSS/friends.css";

const Friends = () => {
  const { isLoading, error, friends, showFriends } = useShowFriends(); 
  const { searchUserAndReturn } = useSearchUser();
  const { messages, chatId, sendMessageByChatId, getChatMessages, chatError } = useChat();
  
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);
  
  // Chat states
  const [showChat, setShowChat] = useState(false);
  const [activeChatFriend, setActiveChatFriend] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const userString = localStorage.getItem("user");
  const userId = JSON.parse(userString).userId;

  useEffect(() => {
    showFriends();
  }, []);

  useEffect(() => {
    if (friends && friends.length > 0) {
      setFilteredFriends(friends);
    }
  }, [friends]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter(friend => 
        friend.nickname.toLowerCase().includes(query)
      );
      setFilteredFriends(filtered);
    }
  };

  const handleViewProfile = async (nickname) => {
    const user = await searchUserAndReturn(nickname);
    setSelectedFriend(user);
    setViewingProfile(true);
  };

  const handleBackToFriends = () => {
    setViewingProfile(false);
    setSelectedFriend(null);
  };
  
  // Chat functionality
  const handleShowChat = (friend) => {
    setActiveChatFriend(friend);
    setShowChat(true);
    getChatMessages(friend.userId);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setActiveChatFriend(null);
  };

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
  
  // Function to get a color based on nickname (consistently)
  const getAvatarColor = (nickname) => {
    // Simple hash function to generate consistent color for same name
    const colors = [
      '#89B4FA', // blue
      '#A6E3A1', // green
      '#F9E2AF', // yellow
      '#F38BA8', // red
      '#CBA6F7', // purple
      '#FAB387', // orange
    ];
    
    // Get a number from the string
    let hash = 0;
    for (let i = 0; i < nickname.length; i++) {
      hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert to color index
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };
  
  if (isLoading) {
    return <Loader />;
  }
  
  if (error) {
    return (
      <div className="friends-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  if (chatError) {
    return (
      <div className="friends-container">
        <div className="error-message">Chat Error: {chatError}</div>
      </div>
    );
  }

  if (!friends || friends.length === 0) {
    return (
      <div className="friends-container">
        <div className="empty-friends-container">
          <div className="empty-friends">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <h3 className="empty-title">No Friends Yet</h3>
            <p className="empty-description">
              Your friends list is empty. Connect with others to see them here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="friends-container">
      {showChat && activeChatFriend ? (
        <div className="chat-overlay">
          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-user-info">
                <div 
                  className="chat-avatar" 
                  style={{ backgroundColor: getAvatarColor(activeChatFriend.nickname) }}
                >
                  {activeChatFriend.nickname.charAt(0).toUpperCase()}
                </div>
                <h3 className="chat-user-name">{activeChatFriend.nickname}</h3>
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
                  <p>No messages yet. Start a conversation with {activeChatFriend.nickname}!</p>
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
        </div>
      ) : viewingProfile && selectedFriend ? (
        <div className="friend-profile-view">
          <button onClick={handleBackToFriends} className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Friends</span>
          </button>
          <OtherUserProfile otherUser={selectedFriend} relation="Friends"/>
        </div>
      ) : (
        <div className="friends-dashboard">
          <div className="friends-header">
            <h2 className="section-title">My Friends</h2>
            <div className="search-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Search friends..." 
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            <div className="friends-count">
              <span>{friends.length}</span>
              <p>Friends</p>
            </div>
          </div>
          
          {filteredFriends.length === 0 && searchQuery ? (
            <div className="no-results">
              <p>No friends found matching "<strong>{searchQuery}</strong>"</p>
            </div>
          ) : (
            <div className="friends-grid">
              {filteredFriends.map((friend) => (
                <div key={friend.userId} className="friend-card">
                  <div className="friend-avatar-container">
                    <div 
                      className="friend-initial-avatar" 
                      style={{ backgroundColor: getAvatarColor(friend.nickname) }}
                    >
                      {friend.nickname.charAt(0).toUpperCase()}
                    </div>
                    <div className="online-indicator"></div>
                  </div>
                  <div className="friend-details">
                    <h3 className="friend-name">{friend.nickname}</h3>
                    <p className="friend-status">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <span>Friend</span>
                    </p>
                  </div>
                  <div className="friend-actions">
                    <button 
                      onClick={() => handleViewProfile(friend.nickname)} 
                      className="profile-button"
                      aria-label={`View ${friend.nickname}'s profile`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>View Profile</span>
                    </button>
                    <button 
                      onClick={() => handleShowChat(friend)}
                      className="message-button"
                      aria-label={`Message ${friend.nickname}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Friends;