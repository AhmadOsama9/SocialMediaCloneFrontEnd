import { useState, useEffect } from 'react';
import { useShowFriends } from '../hooks/useShowFriends';


import OtherUserProfile from '../pages/OtherUserProfile';
import Loader from "../helperComponent/Loader";


import "../CSS/friends.css";

const Friends = () => {
  const { isLoading, error, friends, showFriends, setIsLoading, setError } = useShowFriends(); 
  const [ showProfile, setShowProfile ] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    showFriends();
  }, []);

  const searchUserAndReturn = async (nickname) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/getprofilebynickname?nickname=${nickname}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    })

    const json = await response.json();

    if(!response.ok) {
        setIsLoading(false);
        setError(json.error);
    } else {
        const friend = json;
        setIsLoading(false);
    }

    setShowProfile(prv => !prv);

    setUser(json);
  }



  if ( isLoading ) {
    return <Loader />;
  }
  if (error) {
    return (<h3 className=".error">Error: {error}</h3>);
  }

  if (friends.length === 0) {
    return <h3>You have no friends</h3>
  }

  return (
    <div className="friends">
      <h2>Friends</h2>
      {friends.map((friend) => (
        <div key={friend.userId} className="friend">
            <span>{friend.nickname}</span>
            <button onClick={() => searchUserAndReturn(friend.nickname)}>Show Profile</button>
            {showProfile && <OtherUserProfile otherUser={user} relation={"friend"}/>}
        </div>
      ))}
    </div>
  )
}

export default Friends