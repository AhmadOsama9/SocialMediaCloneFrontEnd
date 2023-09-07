import { useState } from "react";

export const useShowCommunities = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [communities, setCommunities] = useState([]);
    const [userCommunities, setUserCommunities] = useState([]);

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
    const showUserCommunities = async () => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`https://merngymprojectbackend.onrender.com/api/user/getusercommunities?userId=${userId}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        } else {
            setUserCommunities(json);
        }
        setIsLoading(false);

    }
    
    return { isLoading, error, communities, userCommunities, showJoinedCommunities, showUserCommunities };
}