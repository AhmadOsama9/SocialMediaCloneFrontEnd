import { createContext, useContext, useState, useEffect } from "react";

export const NicknameContext = createContext();

export const useNicknameContext = () => {
    const context = useContext(NicknameContext);
    if (!context) {
        throw Error("The context cannot be used outside of it's provider");
    }
    return context;
}

export const NicknameContextProvider = ({ children }) => {
    const [userNickname, setUserNickname] = useState("");

    const userString = localStorage.getItem("user");
    const userId = JSON.parse(userString).userId;

    useEffect(() => {
        const getNickname = async () => {
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

          getNickname();
    })

    return (
        <NicknameContext.Provider value={{ userNickname, setUserNickname }}>
            { children }
        </NicknameContext.Provider>
    )
}