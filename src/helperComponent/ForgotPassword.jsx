import { useState } from "react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import OTP from "./OTP";
import Loader from "../helperComponent/Loader";

import "../CSS/forgotPassword.css";

const ForgotPassword = () => {
  const { error, isLoading, forgotPassword } = useForgotPassword();
  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleForgotPassword = async () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    setEmailError("");
    const checkEmail = await forgotPassword(email);
    if (checkEmail) {
      setShowOTP(true);
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="forgot-password">
        <h3>Error</h3>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="forgot-password">
      {!showOTP ? (
        <div>
          <svg className="forgot-password-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          
          <h3>Reset Your Password</h3>
          
          <div className="forgot-password-note">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>We'll send a verification code to this email address</span>
          </div>
          
          <label className="label">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            className="input"
            placeholder="Enter your registered email"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleForgotPassword();
              }
            }}
          />
          
          {emailError && <div className="error">{emailError}</div>}
          
          <button 
            onClick={handleForgotPassword} 
            className="send-button"
            disabled={isLoading || !email.trim()}
          >
            {isLoading ? "Sending..." : "Send Reset Code"}
          </button>
        </div>
      ) : (
        <OTP email={email} />
      )}
    </div>
  );
}

export default ForgotPassword;