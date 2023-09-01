import { useState, useEffect } from "react";

import { useSearchUser } from "../hooks/useSearchUser";

import OtherUserProfile from "../pages/OtherUserProfile";
import Loader from "../helperComponent/Loader";


import "../CSS/searchuser.css";

const SearchUser = ({ nickname }) => {
  const { isLoading, error, user, searchUser } = useSearchUser();
  const [ showUserProfile, setShowUserProfile ] = useState(false);
  
  const userString = localStorage.getItem("user");
  const userId = JSON.parse(userString).userId;

  useEffect(() => {
    searchUser(nickname);
  }, [])

  if (isLoading || (!user && !error)) {
    return <Loader />;
  }

  if (error) {
    return <h3 className=".error">Error: {error}</h3>;
  }

  if (user.user === userId) {
    return <h3>Error: Can't search for yourself</h3>
  }

  return (
    <div className="searched-user">
      <h3 className="h3">Searched User</h3>
      <span className="span">Nickname: {user.nickname}</span>
      <button onClick={() => setShowUserProfile(prv => !prv)}  className="btn">Show Profile</button>

      {showUserProfile && <OtherUserProfile otherUser={user} relation="None"/>}

    </div>
  );
}

export default SearchUser;