import { NavLink } from "react-router-dom";
import { FaHome, FaUser, FaEnvelope, FaComments, FaUserFriends } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";

import "../CSS/navbar.css";

const Nav = () => {
  const { user } = useAuthContext();

  return (
    <div className="nav-bar">
      <NavLink to="/" className="nav-icon"> <FaHome /> </NavLink>  
      {user && <NavLink to="/profile" className="nav-icon"> <FaUser /> </NavLink>}
      {user && <NavLink to="/receivedrequests" className="nav-icon"> <FaEnvelope /> </NavLink>}
      {user && <NavLink to="/chats" className="nav-icon"> <FaComments /> </NavLink>}
      {user && <NavLink to="/friends" className="nav-icon"> <FaUserFriends /> </NavLink>}
    </div>
  );
};

export default Nav;
