import { NavLink } from "react-router-dom";
import { Home, User, MessageCircle, Users, Layers, UserPlus } from "lucide-react";
import { useAuthContext } from "../hooks/useAuthContext";
import "../CSS/navbar.css";

const Nav = () => {
  const { user } = useAuthContext();
  
  return (
    <div className="nav-bar">
      {user && <NavLink to="/feed" className="nav-icon"><Layers size={22} /></NavLink>}
      <NavLink to="/" className="nav-icon"><Home size={22} /></NavLink>
      {user && <NavLink to="/profile" className="nav-icon"><User size={22} /></NavLink>}
      {user && <NavLink to="/receivedrequests" className="nav-icon"><UserPlus size={22} /></NavLink>}
      {user && <NavLink to="/chats" className="nav-icon"><MessageCircle size={22} /></NavLink>}
      {user && <NavLink to="/friends" className="nav-icon"><Users size={22} /></NavLink>}
    </div>
  );
};

export default Nav;