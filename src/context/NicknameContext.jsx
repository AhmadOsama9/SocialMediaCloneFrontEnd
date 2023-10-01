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

    return (
        <NicknameContext.Provider value={{ userNickname, setUserNickname }}>
            { children }
        </NicknameContext.Provider>
    )
}