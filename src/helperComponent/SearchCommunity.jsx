import { useState, useEffect } from "react";
import { useSearchCommunity } from "../hooks/useSearchCommunity";
import CommunityProfile from "../pages/CommunityProfile";
import Loader from "../helperComponent/Loader";



import "../CSS/searchCommunity.css";

const SearchCommunity = ({ name }) => {
  const { isLoading, error, community, searchCommunity } = useSearchCommunity();
  const [showCommunityProfile, setShowCommunityProfile] = useState(false);
  
  useEffect(() => {
    searchCommunity(name);
  }, [])


  if (isLoading || (!community && !error)) {
    return <Loader />;
  }

  if (error) {
    return <h3>Error: {error}</h3>;
  }


  return (
    <div className="searched-community">
      <h3>Searched Community</h3>
      <span className="span">name: {community.name}</span>
      <span className="span">Description: {community.description}</span>
      <button className="btn" onClick={() => setShowCommunityProfile(prv => !prv)}>Show Community</button>

      {showCommunityProfile && <CommunityProfile community={community} />}
    </div>
  )
}

export default SearchCommunity;