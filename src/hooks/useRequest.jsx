import { useState, useEffect } from "react";
import { useReceivedRequestsContext } from "../context/ReceivedRequestsContext";

export const useRequest = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const { setPendingRequests, setRelationshipStatus } = useReceivedRequestsContext();

  const userString = localStorage.getItem("user");
  const userId = JSON.parse(userString).userId;

  useEffect(() => {
    getPendingRequests();
  }, []);

  const getPendingRequests = async () => {
    setIsLoading(true);
    setError(null);
    const response = await fetch(`https://merngymprojectbackend.onrender.com/api/user/receivedrequests?userId=${userId}`, {
      method: "GET",
      headers: {"Content-Type": "application/json",},
    })
    const json = await response.json();
    setIsLoading(false);
    if (!response.ok) {
      setError(json.error);
    } else {
      setPendingRequests(json);
    }
  }

  const acceptRequest = async (otherUserId) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch("https://merngymprojectbackend.onrender.com/api/user/acceptrequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, otherUserId }),
    });

    const data = await response.json();

    if (response.ok) {
      getPendingRequests();
      setRelationshipStatus("Friends");
    } else {
      setError(data.error);
    }
    setIsLoading(false);
  };

  const declineRequest = async (otherUserId) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("https://merngymprojectbackend.onrender.com/api/user/decline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, otherUserId }),
    });

    const data = response.json();

    if (response.ok) {
      getPendingRequests();
      setRelationshipStatus("None");
    } else {
      setError(data.error);
    }
    setIsLoading(false);
  };


  return { getPendingRequests, acceptRequest, declineRequest, isLoading, error, setIsLoading, setError };
}
