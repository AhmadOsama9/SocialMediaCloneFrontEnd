import { useState, useEffect } from "react";
import { useForgotPassword } from "../hooks/useForgotPassword";
import Loader from "./Loader";

import "../CSS/otp.css";

const OTP = ({ email }) => {
  const { error, isLoading, validateOTP, otpError } = useForgotPassword();
  const [otp, setOtp] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const handleValidateOTP = async () => {
    const valid = await validateOTP(email, otp);
    if (typeof valid === "string") { 
      setNewPassword(valid);
      setShowPassword(true);
    } 
  }
  
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  
  useEffect(() => {
    // Add input masking for OTP
    const handleInput = (e) => {
      const value = e.target.value;
      // Only allow digits
      const sanitized = value.replace(/[^0-9]/g, '');
      setOtp(sanitized);
    };
    
    const input = document.querySelector('.otp-input');
    if (input) {
      input.addEventListener('input', handleInput);
    }
    
    return () => {
      if (input) {
        input.removeEventListener('input', handleInput);
      }
    };
  }, []);

  if (isLoading) {
    return <Loader />
  }

  if (showPassword) {
    return (
      <div className="otp-container">
        <h3 className="otp-heading">Password Retrieved</h3>
        <p>Your current password is shown below. Please save it securely.</p>
        
        <div className="password-container">
          <span className="password-value">{newPassword}</span>
          <button 
            className="copy-button" 
            onClick={handleCopyPassword}
            aria-label="Copy password to clipboard"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>
        
        <p>You can now return to the login page and sign in with this password.</p>
      </div>
    );
  }

  if (error) {
    return <div className="otp-container">
      <h3 className="error">Error: {error}</h3>
    </div>
  }
 
  return (
    <div className="otp-container">
      <h3 className="otp-heading">Verification Code Sent</h3>
      
      <div className="otp-note">
        This code will expire in 5 minutes
      </div>
      
      <div className="otp-note">
        If you don't see the email, please check your spam folder
      </div>
      
      <label className="otp-label">Enter verification code</label>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength="6"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="otp-input"
        placeholder="• • • • • •"
      />
      
      <button 
        onClick={handleValidateOTP} 
        className="otp-button"
        disabled={otp.length < 4}
      >
        Verify Code
      </button>
      
      {otpError && <div className="error">{otpError}</div>}
    </div>
  )
}

export default OTP