import { createContext, useContext, useState } from "react";

const CreateCommunityContext = createContext();

export const useCreateCommunityContext = () => {
    const context = useContext(CreateCommunityContext);
    if (!context) {
        throw Error("Cannot use CreateCommunityContext outside of it's provider");
    }
    return context;
}

export const CreateCommunityContextProvider = ({ children }) => {
    const [createPost, setCreatePost] = useState(false);

    return (
        <CreateCommunityContext.Provider value={{ createPost, setCreatePost}}>
            { children }
        </CreateCommunityContext.Provider>
    )
}