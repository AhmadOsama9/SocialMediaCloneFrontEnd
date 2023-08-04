import { useState } from "react";

export const useShowCommunities = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [communities, setCommunities] = useState([]);

    const showCommunities = async () => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`https://merngymprojectbackend.onrender.com/api/community/getall`, {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        })

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        } else {
            setCommunities(json);
            setIsLoading(false);
        }

    }
    
    return { isLoading, error, communities, showCommunities };
}