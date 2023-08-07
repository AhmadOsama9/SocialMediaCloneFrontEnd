import { NavLink } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext";

const Nav = () => {
  const {user} = useAuthContext();

  return (
    <>
    <NavLink to="/" className="nav">Home</NavLink>
    {user && <NavLink to="/profile" className="nav">Profile</NavLink>}
    {user && <NavLink to="/receivedrequests" className="nav">Received Requests</NavLink>}
    {user && <NavLink to="/chats" className="nav">Chats</NavLink>}
    {user && <NavLink to="/friends" className="nav">Friends</NavLink>}
    {user && <NavLink to="/posts" className="nav">Posts</NavLink>}
    </>
  )
}

export default Nav