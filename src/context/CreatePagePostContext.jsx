import { createContext, useContext, useState } from "react";

const CreatePagePostContext = createContext();

export const useCreatePagePostContext = () => {
    const context = useContext(CreatePagePostContext);
    if (!context) {
        throw Error("Cannot use CreatePagePosts outside of it's profile ");
    }

    return context;
}

export const CreatePagePostContextProvider = ({ children }) => {
    const [createPost, setCreatePost] = useState(false);

    return (
        <CreatePagePostContext.Provider value={{ createPost, setCreatePost }}>
            { children }
        </CreatePagePostContext.Provider>
    )
}