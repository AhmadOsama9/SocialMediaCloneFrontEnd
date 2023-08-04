import { useState, useEffect } from 'react';
import { useShowJoinedCommunities } from '../hooks/useShowJoinedCommunities';
import CommunityProfile from '../pages/CommunityProfile';

import "../CSS/showCommunities.css";

const ShowJoinedCommunities = () => {
  const { isLoading, error, communities, showJoinedCommunities } = useShowJoinedCommunities();
  const [showCommunityProfile, setShowCommunityProfile] = useState(false); 

  useEffect(() => {
    showJoinedCommunities();
    
  }, []);

  if ( isLoading ) {
    return (<h3>Loading</h3>);
  }
  if (error) {
    return (<h3>Error: {error}</h3>);
  }

  if (communities.length === 0) {
    return <h3>You didn't join any communities</h3>
  }

  return (
    <div className="joined-communities">
      <h2 className="h2">Communities</h2>
      {communities.map((community) => (
        <div className="community-info" key={community._id}>
            <span className="span">Name: {community.name}</span>
            <span className="span">Desciption: {community.description}</span>
            <button className="bttn" onClick={() => setShowCommunityProfile(prv => !prv)}>Show Communitiy</button>
          
            {showCommunityProfile && <CommunityProfile community={community} />}
        </div>
      ))}
    </div>
  )
}

export default ShowJoinedCommunities;