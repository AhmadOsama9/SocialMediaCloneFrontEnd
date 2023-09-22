import { createContext, useContext} from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const useSocketContext = () => {
    const context = useContext(SocketContext);

    if (!context) {
        throw Error("Cannot use SocketContext outside of it's provider");
    }

    return context;
}

export const SocketContextProvider = ({ children }) => {
    const socket = io("https://socialmediaclonebackend.onrender.com");

    return (
        <SocketContext.Provider value={({socket})}>
            {children}
        </SocketContext.Provider>
    )
    
}