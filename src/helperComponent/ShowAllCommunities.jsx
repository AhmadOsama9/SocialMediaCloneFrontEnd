import React, { useState, useEffect } from 'react';
import { useShowCommunities } from '../hooks/useShowCommunities';
import CommunityProfile from "../pages/CommunityProfile";
import Loader from "../helperComponent/Loader";


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
    return <h3>Error: {error}</h3>;
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
        <div className="communities">
          <h2>Communities</h2>
          {communities.map((community) => (
            <div key={community._id}>
              <span>Name: {community.name}</span>
              <span>Description: {community.description}</span>
              <button onClick={() => handleShowCommunity(community)}>Show Community</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowAllCommunities;
