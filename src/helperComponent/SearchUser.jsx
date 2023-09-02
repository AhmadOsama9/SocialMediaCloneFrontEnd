import { useState, useEffect } from "react";

import { useSearchUser } from "../hooks/useSearchUser";

import OtherUserProfile from "../pages/OtherUserProfile";
import Loader from "../helperComponent/Loader";

import { avatar1, avatar2, avatar3, avatar4 } from "../assets/avatar";


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
    <div>
    {!showUserProfile && (
      <div className="searched-user">
      <h3 className="h3">Searched User</h3>
      <div className="selected-avatar">
      <img
        src={
          user.image === "1"
            ? avatar1
            : user.image === "2"
            ? avatar2
            : user.image === "3"
            ? avatar3
            : user.image === "4"
            ? avatar4
            : null
        }
        alt={`Avatar}`}
        className="selected-avatar-image"
      />
      </div>
      <span className="span">Nickname: {user.nickname}</span>
      <button onClick={() => setShowUserProfile(prv => !prv)}  className="btn">Show Profile</button>
      </div>
    )}
      {showUserProfile && <OtherUserProfile otherUser={user} relation="None"/>}
    
    </div>
  );
}

export default SearchUser;