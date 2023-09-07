import { useState } from "react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { Loader } from "three";

const OTP = ({ email }) => {
  const { error, isLoading, validateOTP } = useForgotPassword();
  const [OTP, setOTP] = useState(""); 
  

  const handleValidateOTP = async () => {
    const response = validateOTP(email, OTP);
    if (response.ok) {
        const json = await response.json(); 
        return <h3>Your current Password is: {json.password}</h3>
    } 
  }

  if (error) {
    return <h3 className="error">Error: {error}</h3>
  }

  if (isLoading) {
    return <Loader />
  }
 
  return (
    <div>
        <h5>The OTP has been sent</h5>
        <h6>NOTE::It'll expire in 5 minutes</h6>
        <label>Enter OTP</label>
        <input 
          type="text"
          value={OTP}
          onChange={(e) => setOTP(e.target.value)}
        />
        <button onClick={handleValidateOTP}>Validate</button>
    </div>
  )
}

export default OTP