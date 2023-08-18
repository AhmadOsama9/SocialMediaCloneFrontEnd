import { createContext, useContext, useState } from "react";

const UserPostsContext = createContext();

export const useUserPostsContext = () => {
    const context = useContext(UserPostsContext);
    if (!context) {
        throw Error("Cannot use UserPostsContext outside of the userPostsContext provider");
    }
    return context;
}

export const UserPostsContextProvider = ({ children }) => {
    const [userPosts, setUserPosts] = useState([]);
    const [sharedPosts, setSharedPosts] = useState([]);

    return (
        <UserPostsContext.Provider value={{ userPosts, setUserPosts, sharedPosts, setSharedPosts }}>
            {children}
        </UserPostsContext.Provider>
    );
}