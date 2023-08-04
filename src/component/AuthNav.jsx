import { NavLink } from "react-router-dom"

import "../CSS/authnav.css";

const AuthNav = () => {
  return (
    <div className="auth-nav">
        <NavLink to="/signup" className="nav">Register</NavLink>
        <NavLink to="/Login" className="nav">Login</NavLink>
    </div>
  )
}

export default AuthNav