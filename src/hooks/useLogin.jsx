import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNicknameContext } from "../context/NicknameContext";

import { actions } from "../context/AuthContext";

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();
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

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/user/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        })

        const json = await response.json();

        if(!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }

        if(response.ok) {
            const user = {
                email: json.email,
                token: json.token,
                role: json.role,
                userId: json.userId,
            };

            localStorage.setItem("user", JSON.stringify(user));
            dispatch({type: actions.login, payload: json});
            getNickname(user.userId);
            setIsLoading(false);

            console.log("LoggedIn Successfully");
        }
    } 
    const googleLogin = async () => {
        window.location.href = "https://socialmediaclonebackend.onrender.com/api/user/auth/google";
        
    } 

    return { login, googleLogin, isLoading, error};

}