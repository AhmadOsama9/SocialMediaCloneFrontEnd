import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { actions } from "../context/authAction";

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (email, password, role) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch("https://merngymprojectbackend.onrender.com/api/user/signup", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password, role})
        })
        const json = await response.json();

        if(!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }
        if(response.ok) {
            const user = {
                email: json.email,
                token: json.token,
                role: json.role,
                userId: json.uesrId,
            };

            localStorage.setItem("user", JSON.stringify(user));
            dispatch({type: actions.login, payload: json});
            setIsLoading(false);

            console.log("Signup Successfully");
        }
    }

    return { signup, isLoading, error};

}