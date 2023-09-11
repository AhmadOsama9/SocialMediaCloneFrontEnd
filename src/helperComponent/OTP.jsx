import { useState } from "react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { Loader } from "three";


const OTP = ({ email }) => {
  const { error, isLoading, validateOTP, newPassword } = useForgotPassword();
  const [OTP, setOTP] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  

  const handleValidateOTP = async () => {
    const valid = validateOTP(email, OTP);
    if (valid) {
      setShowPassword(true);
    } 
  }

  if (error) {
    return <h3 className="error">Error: {error}</h3>
  }

  if (isLoading) {
    return <Loader />
  }

  if (showPassword) {
    return <h3>Your current Password is: {newPassword}</h3>;
  }
 
  return (
    <div className="otp-container">
      <h3 className="otp-heading">The OTP has been sent</h3>
      <h4 className="otp-note">NOTE: It'll expire in 5 minutes</h4>
      <label className="otp-label">Enter OTP</label>
      <input
        type="text"
        value={OTP}
        onChange={(e) => setOTP(e.target.value)}
        className="otp-input"
      />
      <button onClick={handleValidateOTP} className="otp-button">Validate</button>
    </div>

  )
}

export default OTP