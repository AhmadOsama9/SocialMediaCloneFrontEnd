import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { actions } from "../context/AuthContext";

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (email, password, role) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/user/signup", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password, role})
        })
        const json = await response.json();

        if(!response.ok) {
            setError(json.error);
        }
        if(response.ok) {
            const user = {
                email: json.email,
                token: json.token,
                role: json.role,
                userId: json.userId,
            };

            localStorage.setItem("user", JSON.stringify(user));
            dispatch({type: actions.login, payload: json});
        }
        setIsLoading(false);
    }
    const createAndSendOTP = async (email) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/otp/sendotp", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email})
        })
        const json = await response.json();

        if(!response.ok) {
            setError(json.error);
        }
        setIsLoading(false);
        return response.ok;
    }

    const validateOTP = async (email, otp) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch("https://socialmediaclonebackend.onrender.com/api/otp/validateotp", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, otp})
        })
        const json = await response.json();

        if(!response.ok) {
            setError(json.error);
        }
        setIsLoading(false);
        return response.ok;
    }


    return { signup, isLoading, error, createAndSendOTP, validateOTP};

}