import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "../helperComponent/ForgotPassword";

import "../CSS/home.css";
import { useForgotPasswordContext } from "../context/ForgotPasswordContext";

const Home = () => {
  const [activeSection, setActiveSection] = useState("login");
  const { showForgotPassword } = useForgotPasswordContext();
  
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
          {activeSection === "login" && (
            <div className="login">
              <Login />
            </div>
          )}
          {activeSection === "signup" && (
            <div classname="signup">
              <Signup />
            </div>
          )}
      </div>) : (
        <div>
          <ForgotPassword />
        </div>
      )}
    </div>

  )
}

export default Home;
