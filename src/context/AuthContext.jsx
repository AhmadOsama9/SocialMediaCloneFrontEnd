import { createContext, useReducer, useEffect } from "react";

export const actions = {
    login: "LOGIN", 
    logout: "LOGOUT"
}

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { user: action.payload};
        case "LOGOUT":
            return { user: null};
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    useEffect(() => {
        const checkUserAuth = async () => {
            const user = JSON.parse(localStorage.getItem("user"));

            //Here I must check that the Token is valid somehow

            if(user) {
                dispatch({ type: actions.login, payload: user});
            }
        }

        checkUserAuth();
    }, [])

    console.log("AuthContext state ", state);

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    );

}