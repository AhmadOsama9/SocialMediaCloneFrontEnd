import { useState } from "react";

export const useShowJoinedCommunities = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [communities, setCommunities] = useState([]);

    const userString = localStorage.getItem("user");
    const userId = JSON.parse(userString).userId;

    const showJoinedCommunities = async () => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`https://merngymprojectbackend.onrender.com/api/user/getjoinedcommunities?userId=${userId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        } else {
            setCommunities(json);
        }
        setIsLoading(false);

    }
    
    return { isLoading, error, communities, showJoinedCommunities };
}