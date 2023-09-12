import { createContext, useContext, useState} from "react";

export const ForgotPasswordContext = createContext();

export const useForgotPasswordContext = () => {
    const context = useContext(ForgotPasswordContext);
    if (!context) {
        throw Error("Cannot use the ForgotPasswordContext outside of it's provider");
    }
    return context;
}

export const ForgotPasswordContextProvider = ({ children}) => {
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    return (
        <ForgotPasswordContext.Provider value={({ showForgotPassword, setShowForgotPassword})}>
            { children }
        </ForgotPasswordContext.Provider>
    )
}