import { useContext } from "react";
import { SearchedUserContext } from "../context/searchedUserContext";

export const useSearchedUserContext = () => {
    const context = useContext(SearchedUserContext);

    if (!context) {
        throw Error("useSearchedUserContext must be used inside the useSearchedUserProvider");
    }

    return context;
}