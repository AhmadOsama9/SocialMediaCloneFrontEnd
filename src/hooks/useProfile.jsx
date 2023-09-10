import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { actions } from "../context/profileAction";
import { useProfileContext } from "./useProfileContext";

export const useProfileInfo = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuthContext();
  const { dispatch } = useProfileContext();

  const updateProfileField = async (field, value) => {
    setIsLoading(true);
    setError(null);

    const userId = user.userId;

    const response = await fetch(
      `https://merngymprojectbackend.onrender.com/api/user/updateprofile/${field}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, [field]: value }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }

    if (response.ok) {
      setIsLoading(false);
      dispatch({ type: actions[field], payload: json });
    }
  };
  
  const checkPassword = async (password) => {
    setIsLoading(true);
    setError(null);

    const userId = user.userId;

    const response = await fetch(
      `https://merngymprojectbackend.onrender.com/api/user/checkpassword`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      }
    );
    setIsLoading(false);
    if (!response.ok) {
      const json = await response.json();
      setError(json.error);
    }
    return response.ok;
  };
  const updatePassword = async (newPassword) => {
    setIsLoading(true);
    setError(null);

    const userId = user.userId;

    const response = await fetch(
      `https://merngymprojectbackend.onrender.com/api/user/updatepassword`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword }),
      }
    );
    setIsLoading(false);
    if (!response.ok) {
      const json = await response.json();
      setError(json.error);
    }

    return response.ok;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
        setIsLoading(true);
        setError(null);

        const userId = user.userId;

        try {
            const response = await fetch(`https://merngymprojectbackend.onrender.com/api/user/getprofileinfo?userId=${userId}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });

            const json = await response.json();


            if(!response.ok) {
                setIsLoading(false);
                setError(json.error)
            }
            
            if(response.ok) {
                dispatch({ type: actions.nickname, payload: json});
                dispatch({ type: actions.age, payload: json});
                dispatch({ type: actions.gender, payload: json});
                dispatch( { type: actions.bio, payload: json});
                dispatch({ type: actions.image, payload: json});
            }
            
            setIsLoading(false);

        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    }
    fetchProfileData();
  }, [user.userId, dispatch]);

  

  return {
    error,
    isLoading,
    updateNickname: (nickname) => updateProfileField("nickname", nickname),
    updateAge: (age) => updateProfileField("age", age),
    updateGender: (gender) => updateProfileField("gender", gender),
    updateBio: (bio) => updateProfileField("bio", bio),
    updateImage: (image) => updateProfileField("image", image),
    checkPassword,
    updatePassword,
  };
};
