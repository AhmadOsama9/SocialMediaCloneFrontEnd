import { useState, useEffect } from "react";
import Nav from "./Nav";

import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

import { useNavigate, Link } from "react-router-dom";

import "../CSS/header.css";

const Header = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const [userNickname, setUserNickname] = useState("");
  const getNickname = async () => {
    if (user && user.userId) {
      const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/getnickname?userId=${user.userId}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
      });
  
      const json = await response.json();
  
      if (response.ok) {
        setUserNickname(json.nickname);
      }
    }
  };
  
  useEffect(() => {
    getNickname();
  }, [])

  const handleClick = () => {
    logout();
    navigate("/");
  }

  return (
    <header>
        <nav>
          <Link className="logo" to="/">
            <h1>SMC</h1>
          </Link>
            <Nav />
            {user && (
              <div className="logout">
                <span className="email">{userNickname}</span>
                <button onClick={handleClick}>Logout</button>
              </div>
            )}
        </nav>
    </header>
  )
}

export default Header