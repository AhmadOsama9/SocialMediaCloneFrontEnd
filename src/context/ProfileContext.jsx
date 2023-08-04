import { createContext, useReducer } from "react";

const initialState = {
    nickname: "",
    age: 0,
    gender: "",
    bio: "",
    image: null,
};

const profileReducer = (state, action) => {
    switch(action.type) {
        case "UPDATE_NICKNAME":
            return {...state, nickname: action.payload.nickname};
        case "UPDATE_AGE":
            return {...state, age: action.payload.age};
        case "UPDATE_GENDER":
            return {...state, gender: action.payload.gender};
        case "UPDATE_BIO":
            return {...state, bio: action.payload.bio};
        case "UPDATE_IMAGE":
            return {...state, image: action.payload.image};
        default:
            return state;
    }
}

export const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(profileReducer, initialState);

    return (
        <ProfileContext.Provider value={{ profile: state, dispatch}}>
            { children }
        </ProfileContext.Provider>
    )
}