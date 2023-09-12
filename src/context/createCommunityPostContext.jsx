import { createContext, useContext, useState } from "react";

export const CreateCommunityPostContext = createContext();

export const useCreateCommunityPostContext = () => {
    const context = useContext(CreateCommunityPostContext);
    if (!context) {
        throw Error("Cannot use CreateCommunityContext outside of it's provider");
    }
    return context;
}

export const CreateCommunityPostContextProvider = ({ children }) => {
    const [createPost, setCreatePost] = useState(false);

    return (
        <CreateCommunityPostContext.Provider value={{ createPost, setCreatePost}}>
            { children }
        </CreateCommunityPostContext.Provider>
    )
}