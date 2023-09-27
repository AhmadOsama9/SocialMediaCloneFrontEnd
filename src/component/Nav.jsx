import { NavLink } from "react-router-dom";
import { Home, Person, Email, Chat, Group, Layers, PersonAdd } from '@mui/icons-material';
import { useAuthContext } from "../hooks/useAuthContext";

import "../CSS/navbar.css";

const Nav = () => {
  const { user } = useAuthContext();

  return (
    <div className="nav-bar">
      {user && <NavLink to="/feed" className="nav-icon"> <Layers /> </NavLink>} 
      <NavLink to="/" className="nav-icon"> <Home /> </NavLink>  
      {user && <NavLink to="/profile" className="nav-icon"> <Person /> </NavLink>}
      {user && <NavLink to="/receivedrequests" className="nav-icon"> <PersonAdd /> </NavLink>}
      {user && <NavLink to="/chats" className="nav-icon"> <Chat /> </NavLink>}
      {user && <NavLink to="/friends" className="nav-icon"> <Group /> </NavLink>}
    </div>
  );
};

export default Nav;
