import { useAuthContext } from "./useAuthContext";
import { actions } from "../context/AuthContext";

export const useLogout = () => {
    const { dispatch } = useAuthContext();

    const logout = () => {
        localStorage.removeItem("user");
        dispatch({type: actions.logout});
    }

    return { logout };
}