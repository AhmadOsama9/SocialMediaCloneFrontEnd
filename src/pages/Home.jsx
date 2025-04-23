import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "../helperComponent/ForgotPassword";

import "../CSS/home.css";
import { useForgotPasswordContext } from "../context/ForgotPasswordContext";

const Home = () => {
  const [activeSection, setActiveSection] = useState("login");
  const { showForgotPassword, setShowForgotPassword } = useForgotPasswordContext();
  
  const handleSectionChange = (section) => {
    setActiveSection(section);
  }
  
  return (
    <div className="home-container">
      <div className="home-split">
        {/* Hero Section */}
        <div className="home-hero">
          <div className="hero-content">
            <h1>Connect with friends and the world around you</h1>
            <p>A modern social platform to share moments, connect with others, and build communities around shared interests.</p>
            
            <div className="hero-features">
              <div className="hero-feature">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Real-time messaging with friends</span>
              </div>
              <div className="hero-feature">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Join communities with shared interests</span>
              </div>
              <div className="hero-feature">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>Discover trending content</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Authentication Section */}
        <div className="auth-section">
          {!showForgotPassword ? (
            <div className="form">
              <div className="current-form">
                <button 
                  className={activeSection === "login" ? "active-section" : ""} 
                  onClick={() => handleSectionChange("login")}
                >
                  Sign In
                </button>
                <button 
                  className={activeSection === "signup" ? "active-section" : ""} 
                  onClick={() => handleSectionChange("signup")}
                >
                  Create Account
                </button>
              </div>
              
              {activeSection === "login" && <Login />}
              {activeSection === "signup" && <Signup />}
            </div>
          ) : (
            <div className="forgot-password-section">
              <button className="cancel-button" onClick={() => setShowForgotPassword(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Login
              </button>
              <ForgotPassword />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;