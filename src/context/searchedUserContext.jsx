import { createContext, useReducer } from "react";

const initialState = {
  nickname: "",
  age: 0,
  gender: "",
  bio: "",
  image: null,
  message: "", // Add the message state
  friendStatus: "", // Add the friend status state
};

const actions = {
  UPDATE_USER_CONNECTION: "UPDATE_USER_CONNECTION"
}

const searchedUserReducer = (state, action) => {
  switch (action.type) {
    case actions.UPDATE_USER_CONNECTION:
      return { ...state, friendStatus: action.payload.friendStatus };
    default:
      return state;
  }
};

export const SearchedUserContext = createContext();

export const SearchedUserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchedUserReducer, initialState);

  return (
    <SearchedUserContext.Provider value={{ profile: state, dispatch }}>
      {children}
    </SearchedUserContext.Provider>
  );
};
