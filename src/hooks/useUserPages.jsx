import { useState } from "react";

export const useUserPages = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [userPages, setUserPages] = useState([]);

  const userString = localStorage.getItem("user");
  const userId = JSON.parse(userString).userId;

  const getUserPages = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`https://merngymprojectbackend.onrender.com/api/user/getuserpages?userId=${userId}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    })

    const json = await response.json();

    if (!response.ok) {
        setError(json.error);
    } else {
        setUserPages(json);
    }
    setIsLoading(false);
  }

  return { isLoading, error, userPages, getUserPages };
}
