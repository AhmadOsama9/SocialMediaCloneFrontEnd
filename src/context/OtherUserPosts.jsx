import { createContext, useContext, useState} from "react";

export const OtherUserPostsContext = createContext();

export const useOtherUserPostsContext = () => {
    const context = useContext(OtherUserPostsContext);
    if (!context) {
        throw Error("Cannot use OtherUserPosts context outside of the OtherUserPosts provider");
    }
    return context;

}

export const OtherUserPostsContextProvider = ({ children }) => {
    const [reactions, setReactions] = useState({});
    const [comments, setComments] = useState({});
    

    return (
        <OtherUserPostsContext.Provider value={{ reactions, setReactions, comments, setComments}}>
            {children}
        </OtherUserPostsContext.Provider>
    );
}