import { NavLink } from "react-router-dom"

const AuthNav = () => {
  return (
    <>
        <NavLink to="/Register" className="nav">Register</NavLink>
        <NavLink to="/Login" className="nav">Login</NavLink>
    </>
  )
}

export default AuthNav