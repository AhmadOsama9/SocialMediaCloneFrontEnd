import { useState, useEffect } from 'react';
import { useShowCommunities } from '../hooks/showCommunities';
import CommunityProfile from '../pages/CommunityProfile';
import Loader from "../helperComponent/Loader";

import "../CSS/showCommunities.css";

const ShowJoinedCommunities = () => {
  const { isLoading, error, communities, showJoinedCommunities } = useShowCommunities();
  const [showCommunityProfile, setShowCommunityProfile] = useState(false); 
  const [community, setCommunity] = useState(null);

  useEffect(() => {
    showJoinedCommunities();
  }, []);

  const handleShowCommunity = (community) => {
    setCommunity(community);
    setShowCommunityProfile(true);
  }
  
  const handleGoBack = () => {
    setShowCommunityProfile(false);
    setCommunity(null);
  }

  if (isLoading) {
    return <Loader />;
  }
  
  if (error) {
    return (<div className="error">Error: {error}</div>);
  }

  if (communities.length === 0) {
    return (
      <div className="joined-communities">
        <h2 className="section-title">My Communities</h2>
        <div className="empty-communities">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <p>You haven't joined any communities yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="joined-communities">
      <h2 className="section-title">My Communities</h2>
      
      {!showCommunityProfile ? (
        <div className="communities-grid">
          {communities.map((community) => (
            <div className="community-info" key={community._id}>
              <div className="community-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <span className="community-name">{community.name}</span>
              <p className="community-description">{community.description}</p>
              
              <div className="community-stats">
                <div className="stat">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                  <span>{community.members?.length || 0} members</span>
                </div>
                <div className="stat">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <span>{community.posts?.length || 0} posts</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleShowCommunity(community)} 
                className="toggle-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                View Community
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="opened-community">
          <button className="toggle-button" onClick={handleGoBack}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Communities
          </button>
          <CommunityProfile community={community} />
        </div>
      )}
    </div>
  );
}

export default ShowJoinedCommunities;