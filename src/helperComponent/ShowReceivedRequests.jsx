import { useState } from "react";
import { useRequest } from "../hooks/useRequest";
import { useSearchUser } from "../hooks/useSearchUser";
import OtherUserProfile from "../pages/OtherUserProfile";
import { useReceivedRequestsContext } from "../context/ReceivedRequestsContext";
import Loader from "../helperComponent/Loader";

import "../CSS/showReceivedRequests.css";

const ShowReceivedRequests = () => {
  const { isLoading, error, acceptRequest, declineRequest } = useRequest();
  const { pendingRequests } = useReceivedRequestsContext();
  const [viewProfileId, setViewProfileId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewProfile = async (userId) => {
    if (viewProfileId === userId) {
      setViewProfileId(null);
      setSelectedUser(null);
      return;
    }
    
    const request = pendingRequests.find(req => req.user === userId);
    if (request) {
      setSelectedUser(request);
      setViewProfileId(userId);
    }
  };

  const handleAccept = async (userId) => {
    await acceptRequest(userId);
    if (viewProfileId === userId) {
      setViewProfileId(null);
      setSelectedUser(null);
    }
  };

  const handleDecline = async (userId) => {
    await declineRequest(userId);
    if (viewProfileId === userId) {
      setViewProfileId(null);
      setSelectedUser(null);
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
    return <div className="error-message">Error: {error}</div>;
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="empty-requests-container">
        <div className="empty-requests">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="no-requests-icon">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
          <h3 className="empty-title">No Friend Requests</h3>
          <p className="empty-description">You don't have any pending friend requests at the moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="friend-requests-container">
      <div className="friend-requests">
        <h2 className="section-title">Pending Friend Requests</h2>
        
        <div className="requests-list">
          {pendingRequests.map((request) => (
            <div key={request.user} className={`request-card ${viewProfileId === request.user ? 'active' : ''}`}>
              <div className="request-header">
                <div className="avatar-container">
                  <div 
                    className="initial-avatar" 
                    style={{ backgroundColor: getAvatarColor(request.nickname) }}
                  >
                    {request.nickname.charAt(0).toUpperCase()}
                  </div>
                  <div className="request-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                  </div>
                </div>
                <div className="request-info">
                  <h3 className="user-nickname">{request.nickname}</h3>
                  <span className="request-status">Wants to connect with you</span>
                </div>
              </div>
              
              <div className="request-actions">
                <button 
                  onClick={() => handleAccept(request.user)} 
                  className="request-button accept-button"
                  aria-label={`Accept friend request from ${request.nickname}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Accept
                </button>
                
                <button 
                  onClick={() => handleDecline(request.user)} 
                  className="request-button decline-button"
                  aria-label={`Decline friend request from ${request.nickname}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Decline
                </button>
                
                <button 
                  onClick={() => handleViewProfile(request.user)} 
                  className="request-button profile-button"
                  aria-label={`View profile of ${request.nickname}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  {viewProfileId === request.user ? 'Hide Profile' : 'View Profile'}
                </button>
              </div>

              {viewProfileId === request.user && (
                <div className="profile-expanded">
                  <OtherUserProfile otherUser={selectedUser} relation="pending" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowReceivedRequests;