import { useState } from "react";


export const useShowFriends = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [friends, setFriends] = useState([]);

    const userString = localStorage.getItem("user");
    const userId = JSON.parse(userString).userId;

    const showFriends = async () => {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/getallfriends?userId=${userId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        } else {
            setFriends(json);
        }

        setIsLoading(false);
    }
    
    return { isLoading, error, friends, showFriends, setIsLoading, setError };
}