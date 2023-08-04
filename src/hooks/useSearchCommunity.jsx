import { useState } from "react";

export const useSearchCommunity = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [community, setCommunity] = useState(null);

  const searchCommunity = async (name) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`https://merngymprojectbackend.onrender.com/api/community/search?name=${name}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    })

    const json = await response.json();

    if(!response.ok) {
        setIsLoading(false);
        setError(json.error);
    } else {
        setCommunity(json);
        setIsLoading(false);
    }
  }

  return { isLoading, error, community, searchCommunity };
    
}