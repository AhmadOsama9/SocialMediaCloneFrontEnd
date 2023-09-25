import { useState } from "react";

export const useSearchUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [user, setUser] = useState(null);

  const searchUser = async (nickname) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/getprofilebyznickname?nickname=${nickname}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    })

    const json = await response.json();

    if(!response.ok) {
      setError(json.error);
    } else {
      setUser(json);
    }
    setIsLoading(false);
  }
  
  const searchUserAndReturn = async (nickname) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/getprofilebynickname?nickname=${nickname}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    })

    const json = await response.json();
    let user = null;
    
    if(!response.ok) {
        setError(json.error);
    } else {
      user = json;
    }
    setIsLoading(false);
    return user;
  }
  

  return { isLoading, error, user, searchUser, searchUserAndReturn, setError};
    
}