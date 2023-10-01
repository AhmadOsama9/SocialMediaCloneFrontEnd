import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { actions } from '../context/AuthContext';
import { useNicknameContext } from '../context/NicknameContext';

import Loader from '../helperComponent/Loader';

function GoogleSignupCallback() {
  const [userInfoIsLoading, setUserInfoIsLoading] = useState(null);
  const [userInfoError, setUserInfoError] = useState(null);
  const [user, setUser] = useState({});
  const [failed, setFailed] = useState(null);
  const {dispatch} = useAuthContext();
  const { setUserNickname } = useNicknameContext();

  const getNickname = async (userId) => {
    if (userId) {
      const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/getnickname?userId=${userId}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
      });
  
      const json = await response.json();
  
      if (response.ok) {
        setUserNickname(json.nickname);
      }
    }
  };
  

  const getUserInfoAndValidate = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get('email');
    const role = queryParams.get("role");
    const token = queryParams.get("token");
    const userId = queryParams.get("userId");

    const error = queryParams.get("error");

    if (error) {
      setUserInfoError(error);
      return;
    }


    if (!email || !role || !token || !userId) {
      console.error("There's missing information");
      setFailed(true);
      return;
    }

    setUserInfoIsLoading(true);
    setUserInfoError(null);
    setFailed(false);

    const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/checkuserinfo`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({userId, email, role, token})
    });

    if(!response.ok) {
        setUserInfoError("The user Data is invalid");
    }

    if(response.ok) {
        const userInfo = {
            email: email,
            token: token,
            role: role,
            userId: userId,
        };

        localStorage.setItem("user", JSON.stringify(userInfo));
        dispatch({type: actions.login, payload: userInfo});
        getNickname(user.userId);
      }
      setUserInfoIsLoading(false);
  }


  useEffect(() => {
    console.log("It enters the useEffect of the GoogleLoginCallback");

    getUserInfoAndValidate();
    
  }, []);

  if (userInfoError) {
    return <h3 className="error">Error: {userInfoError}</h3>;
  }
  if (userInfoIsLoading) {
    return <Loader />
  }

  if (failed) {
    return <h3>Failed...</h3>;
  }

  return (
    <div>Processing Google callback...</div>
  );
}

export default GoogleSignupCallback;
