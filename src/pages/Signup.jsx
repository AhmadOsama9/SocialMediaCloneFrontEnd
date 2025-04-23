import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import Loader from "../helperComponent/Loader";

import "../CSS/form.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const {signup, createAndSendOTP, validateOTP, error, isLoading} = useSignup();

  const [showvalidateOTP, setShowValidateOTP] = useState(false);
  const [OTP, setOTP] = useState("");
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [sendError, setSendError] = useState(false);
  
  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
      return;
    }
    
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const score = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChar, isLongEnough].filter(Boolean).length;
    
    if (score <= 2) {
      setPasswordStrength("weak");
    } else if (score <= 4) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const handleSentOTP = async () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSendError(true);
      return;
    }
    
    const sent = await createAndSendOTP(email);
    setShowValidateOTP(true)
    if (!sent) {
      setSendError(true);
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault();

    if (secretKey === "") {
      await signup(email, password, "");
    } else if (secretKey === process.env.secret_Key) {
      await signup(email, password, "admin");
    } else if (secretKey !== process.env.SECRET_KEY) {
      notification.error("Wrong Secret Key");
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
    return <div className="error">Error: {error}</div>
  }
  
  if (sendError) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="signup">
      {!showvalidateOTP && !showSignupForm && (
      <div>
        <div className="group">
          <label>Email</label>
          <input 
              type="email" 
              name="Email"
              value={email}
              placeholder="Enter your email"
              onChange={(event) => {setEmail(event.target.value)}}
          />
        </div>
        <div className="group">
          <label>Password</label>
          <input 
              type="password"
              name="password"
              value={password}
              placeholder="Enter a strong password"
              onChange={(event) => {
                setPassword(event.target.value);
                checkPasswordStrength(event.target.value);
              }}
          />
          {password && (
            <>
              <div className="password-strength">
                <div className={`password-strength-bar ${passwordStrength}`}></div>
              </div>
              {passwordStrength && (
                <div className={`password-strength-text ${passwordStrength}`}>
                  {passwordStrength === "weak" && "Weak password"}
                  {passwordStrength === "medium" && "Medium strength password"}
                  {passwordStrength === "strong" && "Strong password"}
                </div>
              )}
            </>
          )}
        </div>
        <div className="group">
          <label>Admin only</label>
          <input 
              type="password"
              name="secretKey"
              value={secretKey}
              placeholder="Leave empty if you are not an admin"
              onChange={(event) => {setSecretKey(event.target.value)}}
          />
        </div>
            
        <button 
          disabled={isLoading || !email || !password || passwordStrength === "weak"} 
          onClick={handleSentOTP} 
          className="submit-btn"
        >
          Verify Email
        </button>
        {error && <div className="error">{error}</div>}
      </div>
      )}
      
      {(showvalidateOTP && (
        <div className="otp-container">
          <h3 className="otp-heading">Verification code sent</h3>
          <div className="otp-note">This code will expire in 5 minutes</div>
          <div className="otp-note">If you don't see the email, please check your spam folder</div>
          <label className="otp-label">Enter verification code</label>
          <input
            type="text"
            inputMode="numeric"
            value={OTP}
            onChange={(e) => setOTP(e.target.value)}
            className="otp-input"
            placeholder="• • • • • •"
            maxLength="6"
          />
          <button onClick={handleValidateOTP} className="otp-button">Verify Code</button>
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
                placeholder="Enter your email"
                onChange={(event) => {setEmail(event.target.value)}}
                disabled
            />
          </div>
          <div className="group">
            <label>Password</label>
            <input 
                type="password"
                name="password"
                value={password}
                placeholder="Enter a strong password"
                onChange={(event) => {
                  setPassword(event.target.value);
                  checkPasswordStrength(event.target.value);
                }}
            />
            {password && (
              <>
                <div className="password-strength">
                  <div className={`password-strength-bar ${passwordStrength}`}></div>
                </div>
                {passwordStrength && (
                  <div className={`password-strength-text ${passwordStrength}`}>
                    {passwordStrength === "weak" && "Weak password"}
                    {passwordStrength === "medium" && "Medium strength password"}
                    {passwordStrength === "strong" && "Strong password"}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="group">
            <label>Admin only</label>
            <input 
                type="password"
                name="secretKey"
                value={secretKey}
                placeholder="Leave empty if you are not an admin"
                onChange={(event) => {setSecretKey(event.target.value)}}
            />
          </div>
              
          <button 
            disabled={isLoading || !email || !password || passwordStrength === "weak"} 
            onClick={handleSignup} 
            className="submit-btn"
          >
            Create Account
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      )}
    </div>
  )
}

export default Signup