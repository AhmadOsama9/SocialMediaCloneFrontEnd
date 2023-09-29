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
    <div>
    {!showForgotPassword ? (
      <div className="form">
        <div className="current-form">
          <button className={activeSection === "login" ? "active-section" : ""} onClick={() => handleSectionChange("login")}>Login</button>
          <button className={activeSection === "signup" ? "active-section" : ""} onClick={() => handleSectionChange("signup")}>Signup</button>
        </div>
          {activeSection === "login" && 
              <Login />
          }
          {activeSection === "signup" &&
              <Signup />
          }
      </div>) : (
        <div>
          <button className="cancel-button" onClick={() => setShowForgotPassword(false)}>Cancel</button>
          <ForgotPassword />
        </div>
      )}
    </div>

  )
}

export default Home;
