import { createContext, useContext, useState} from "react";

export const ChatContext = createContext();

export const useChatContext = () => {
    const context = useContext(ChatContext);

    if (!context) {
        throw Error("Cannot use chatContext outside of the chatcontext provider");
    }

    return context;
}

export const ChatContextProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    const addMessage = (message) => {
        setMessages((prvMessages) => [...prvMessages, message]);
    }
    
    return (
        <ChatContext.Provider value={{ messages, addMessage, setMessages}}>
            {children}
        </ChatContext.Provider>
    );
}
