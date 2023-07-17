import { NavLink } from "react-router-dom"

const Nav = () => {
  return (
    <>
    <NavLink to="/" className="nav">Home</NavLink>
    <NavLink to="/About" className="nav">About</NavLink>
    </>
  )
}

export default Nav