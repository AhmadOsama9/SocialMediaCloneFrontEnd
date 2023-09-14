import { useState } from "react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import Loader from "./Loader";

const OTP = ({ email }) => {
  const { error, isLoading, validateOTP, otpError } = useForgotPassword();
  const [OTP, setOTP] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  

  const handleValidateOTP = async () => {
    const valid = await validateOTP(email, OTP);
    if (typeof valid === "string") { 
      setNewPassword(valid);
      setShowPassword(true);
    } 
  }

  if (isLoading) {
    return <Loader />
  }

  if (showPassword) {
    return <h3>Your current Password is: {newPassword}</h3>;
  }

  if (error) {
    return <h3 className="error">Error: {error}</h3>
  }
 
  return (
    <div className="otp-container">
      <h3 className="otp-heading">The OTP has been sent</h3>
      <h4 className="otp-note">NOTE: It'll expire in 5 minutes</h4>
      <h4 className="otp-note">NOTE: Double check the spam</h4>
      <label className="otp-label">Enter OTP</label>
      <input
        type="text"
        value={OTP}
        onChange={(e) => setOTP(e.target.value)}
        className="otp-input"
      />
      <button onClick={handleValidateOTP} className="otp-button">Validate</button>
      {otpError && <div className="error">{otpError}</div>}
    </div>

  )
}

export default OTP