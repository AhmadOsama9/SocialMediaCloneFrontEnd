import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import Loader from "../helperComponent/Loader";

import "../CSS/form.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const {signup, createAndSendOTP, validateOTP, error, isLoading} = useSignup();

  const [showvalidateOTP, setShowValidateOTP] = useState(false);
  const [OTP, setOTP] = useState("");
  const [showSignupForm, setShowSignupForm] = useState(false);

  const handleSentOTP = async () => {
    const sent = await createAndSendOTP(email);
    setShowValidateOTP(true)
    if (!sent) {
      return <h3 className="error">Error: {error}</h3>
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault();

    if(secretKey === "")
      {
        await signup(email, password, "");
      }
      else if(secretKey === process.env.secret_Key)
      {
        await signup(email, password, "admin");
      }
      else if(secretKey !== "vcemkRG!aza2lk276_7W?SGebw4")
      {
        alert("Wrong Secret Key \n");
        return;
      }
  }

  const handleValidateOTP = async () => {
    const valid = await validateOTP(email, OTP);
    if (valid) {
      setShowValidateOTP(false);
      setShowSignupForm(true); 
    }
  }

  if (isLoading) {
    return <Loader />;
  }
  if (error === "That email is already registered") {
    return <h3 className="error">Error: {error}</h3>
  }

  return (
    <div>
      {!showvalidateOTP && !showSignupForm && (
      <div>
        <div className="group">
          <label>Email</label>
          <input 
              type="email" 
              name="Email"
              value={email}
              placeholder="Enter your Email"
              onChange={(event) => {setEmail(event.target.value)}}
          />
        </div>
        <div className="group">
          <label>Password</label>
          <input 
              type="password"
              name="password"
              value={password}
              placeholder="Enter a strong Password"
              onChange={(event) => {setPassword(event.target.value)}}
          />
        </div>
        <div className="group">
          <label>Admin only</label>
          <input 
              type="password"
              name="secretKey"
              value={secretKey}
              placeholder="Leave it empty if you are not an admin"
              onChange={(event) => {setSecretKey(event.target.value)}}
          />
        </div>
            
        <button disabled={isLoading} onClick={handleSentOTP} className="submit-btn">Verify Email</button>
        {error && <div className="error">{error}</div>}
      </div>
      )}
      {(showvalidateOTP && (
        <div>
          <h3>The OTP has been sent</h3>
          <h4>NOTE::It'll expire in 5 minutes</h4>
          <label>Enter OTP</label>
          <input 
            type="text"
            value={OTP}
            onChange={(e) => setOTP(e.target.value)}
          />
          <button onClick={handleValidateOTP}>Validate</button>
          {error && <div className="error">{error}</div>}
        </div>
      ))}
      {showSignupForm && (
        <div>
        <div className="group">
          <label>Email</label>
          <input 
              type="email" 
              name="Email"
              value={email}
              placeholder="Enter your Email"
              onChange={(event) => {setEmail(event.target.value)}}
          />
        </div>
        <div className="group">
          <label>Password</label>
          <input 
              type="password"
              name="password"
              value={password}
              placeholder="Enter a strong Password"
              onChange={(event) => {setPassword(event.target.value)}}
          />
        </div>
        <div className="group">
          <label>Admin only</label>
          <input 
              type="password"
              name="secretKey"
              value={secretKey}
              placeholder="Leave it empty if you are not an admin"
              onChange={(event) => {setSecretKey(event.target.value)}}
          />
        </div>
            
        <button disabled={isLoading} onClick={handleSignup} className="submit-btn">Submit</button>
        {error && <div className="error">{error}</div>}
      </div>
      )}
    </div>
  )
}

export default Signup