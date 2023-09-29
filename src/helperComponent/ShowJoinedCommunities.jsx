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
    setShowCommunityProfile(prv => !prv);
  }

  if ( isLoading ) {
    return <Loader />;
  }
  if (error) {
    return (<h3 className="error">Error: {error}</h3>);
  }

  if (communities.length === 0) {
    return <h3>You didn't join any communities</h3>
  }

  return (
    <div className="joined-communities">
      <h2 className="section-title">Communities</h2>
      {!showCommunityProfile && communities.map((community) => (
        <div className="community-info" key={community._id}>
          <span className="community-name">Name: {community.name}</span>
          <span className="community-description">Description: {community.description}</span>
          <button onClick={() => handleShowCommunity(community)} className="toggle-button">
            {showCommunityProfile ? "Go back" : "Show Community"}
          </button>
        </div>
      ))}
      <div className="opened-community">
        {showCommunityProfile && <button className="toggle-button" onClick={() => setShowCommunityProfile(prv => !prv)}>Go back</button>}
        {showCommunityProfile && <CommunityProfile community={community} />}
      </div>
</div>

  )
}

export default ShowJoinedCommunities;