import { createContext, useReducer, useEffect, useState } from "react";
import { useNicknameContext } from "./NicknameContext";

import Loader from "../helperComponent/Loader";


export const actions = {
    login: "LOGIN",
    logout: "LOGOUT",
};

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case actions.login:
            return { user: action.payload };
        case actions.logout:
            return { user: null };
        default:
            return state;
    }
};

const validateToken = async (userId, token, email, role) => {
    const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/checkuserinfo`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({userId, email, role, token})
    });

    return response.ok;
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const { setUserNickname } = useNicknameContext();


    useEffect(() => {
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

        const checkUserAuth = async () => {
            const user = JSON.parse(localStorage.getItem("user"));

            if (user) {
                setIsLoading(true);
                if (!user.email || !user.role || !user.token || !user.userId) {
                    setError("Invalid user Data");
                    setIsLoading(false);
                    return;
                }
                const validToken = await validateToken(user.userId, user.token, user.email, user.role);
                setIsLoading(false);

                if (validToken) {
                    dispatch({ type: actions.login, payload: user });
                    getNickname(user.userId);
                }
            }
        };

        checkUserAuth();
    }, []);

    console.log("AuthContext state ", state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {isLoading ? <Loader /> : error ? <h3>Error: {error}</h3> : children}
        </AuthContext.Provider>
    );
};
