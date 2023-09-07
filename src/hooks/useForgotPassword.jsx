import { useState } from "react";

export const useForgotPassword = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const forgotPassword = async (email) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch ('https://merngymprojectbackend.onrender.com/api/user/forgotPassword', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email}),
    })


    if (!response.ok) {
        const json = await response.json();
        setError(json.error);
    }
    setIsLoading(false);
    return response.ok;
  }

  const validateOTP = async (email, otp) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch ('https://merngymprojectbackend.onrender.com/api/user/validateotp', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, otp}),
    })

    if (!response.ok) {
        const json = await response.json();
        setError(json.error);
    }
    setIsLoading(false);
    return response;

  }

  return { error, isLoading, forgotPassword, validateOTP};
}
