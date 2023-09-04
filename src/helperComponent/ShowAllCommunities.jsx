import React, { useState, useEffect } from 'react';
import { useShowCommunities } from '../hooks/useShowCommunities';
import CommunityProfile from "../pages/CommunityProfile";
import Loader from "../helperComponent/Loader";

import "../CSS/allCommunities.css";

const ShowAllCommunities = () => {
  const { isLoading, error, communities, showCommunities } = useShowCommunities(); 
  const [showCommunity, setShowCommunity] = useState({});
  const [community, setCommunity] = useState({});

  useEffect(() => {
    showCommunities();
  }, []);

  const handleShowCommunity = (community) => {
    setCommunity(community);
  }

  const handleCloseShowCommunity = () => {
    setCommunity({}); 
  }

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <h3 className=".error">Error: {error}</h3>;
  }

  if (communities.length === 0) {
    return <h3>Currently no communities were created</h3>
  }

  return (
    <div>
      {community._id ? ( 
        <div>
          <button onClick={handleCloseShowCommunity}>Close</button>
          <CommunityProfile community={community} />
        </div>
      ) : (
        <div className="communities-container">
          <h2 className="communities-title">Communities</h2>
          {communities.map((community) => (
            <div key={community._id} className="community-card">
              <span className="community-name"><span className="span">Name: </span> {community.name}</span>
              <span className="community-description"><span className="span">Description: </span> {community.description}</span>
              <button className="show-community-button" onClick={() => handleShowCommunity(community)}>Show Community</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowAllCommunities;
