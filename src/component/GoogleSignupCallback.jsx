import { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { actions } from '../context/AuthContext';

function GoogleSignupCallback() {
  const [userInfoIsLoading, setUserInfoIsLoading] = useState(null);
  const [userInfoError, setUserInfoError] = useState(null);
  const [user, setUser] = useState({});
  const [failed, setFailed] = useState(null);
  const {dispatch} = useAuthContext();
  

  const getUserInfoAndValidate = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get('email');
    const role = queryParams.get("role");
    const token = queryParams.get("token");
    const userId = queryParams.get("userId");

    if (!email || !role || !token || !userId) {
      console.error("There's missing information");
      setFailed(true);
      return;
    }

    setUserInfoIsLoading(true);
    setUserInfoError(null);
    setFailed(false);

    const response = await fetch(`https://merngymprojectbackend.onrender.com/api/user/userinfo?userId=${userId}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    })
    const json = await response.json();

    if(!response.ok) {
        setUserInfoError(json.error);
        setFailed(true);
    }

    if(response.ok) {
        const userInfo = {
            email: json.email,
            token: json.token,
            role: json.role,
            userId: json.userId,
        };
        setUser(userInfo);
        console.log("The userinfo is: ", userInfo);
        setUserInfoIsLoading(false);

    
    
      try {

        if (token !== userInfo.token) {
          console.error("The token is not valid");

          setFailed(true);
          return;
        }
        if (email !== userInfo.email) {
          console.error("The email is not the same");
          setFailed(true);
          return;
        }
        if (role !== userInfo.role) {
          console.error("Your role is not valid");
          setFailed(true);
          return;
        }

        localStorage.setItem("user", JSON.stringify(userInfo));
      dispatch({type: actions.login, payload: userInfo});
      } catch (error) {
        console.error("Error fetching user info:", error);
        setFailed(true);
      }
    };
  }


  useEffect(() => {
    console.log("It enters the useEffect of the GoogleLoginCallback");

    getUserInfoAndValidate();
    
  }, []);

  if (userInfoError) {
    return <h3>Error: {userInfoError}</h3>;
  }
  if (userInfoIsLoading) {
    return <h3>Loading...</h3>
  }

  if (failed) {
    return <h3>Failed...</h3>;
  }

  return (
    <div>Processing Google callback...</div>
  );
}

export default GoogleSignupCallback;
