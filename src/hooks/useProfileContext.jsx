import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";

export const useProfileContext = () => {
    const context = useContext(ProfileContext);

    if(!context) {
        throw Error("useProfileContext must be used inside of a useProfileProvider");
    }

    return context;
}