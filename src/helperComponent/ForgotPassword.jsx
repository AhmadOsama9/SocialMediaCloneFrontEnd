import { useState } from "react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import OTP from "./OTP";
import Loader from "../helperComponent/Loader";

const ForgotPassword = () => {

  const { error, isLoading, forgotPassword} = useForgotPassword();
  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const handleForgotPassword = async () => {
    const checkEmail = await forgotPassword(email);
    if (checkEmail) {
      setShowOTP(true);
    }
  }

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <h3 className="error">Error: {error}</h3>
  }

  return (
    <div>
      {!showOTP && 
      (<div>
        <h3>Forgot Passwrod</h3>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleForgotPassword}>Send OTP</button>
      </div>
      )}
      {showOTP && (
        <div>
          <OTP email={email}/>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword