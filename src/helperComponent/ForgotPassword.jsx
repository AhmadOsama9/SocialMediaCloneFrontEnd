import { useState } from "react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import OTP from "./OTP";
import Loader from "../helperComponent/Loader";

const ForgotPassword = () => {

  const { error, isLoading, forgotPassword} = useForgotPassword();
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    const checkEmail = await forgotPassword(email);
    if (checkEmail) {
      return <OTP email={email}/>
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
      <h3>Forgot Passwrod</h3>
      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleForgotPassword}>Send OTP</button>
    </div>
  )
}

export default ForgotPassword