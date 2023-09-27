import { useState, useEffect, useRef } from "react";
import Nav from "./Nav";

import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

import { useNavigate, Link } from "react-router-dom";

import LogoutIcon from '@mui/icons-material/Logout';

import "../CSS/header.css";

const Header = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();


  const [userNickname, setUserNickname] = useState("");
  const isNicknameFetched = useRef(false);

  const getNickname = async () => {
    if (user && user.userId && !isNicknameFetched.current) {
      const response = await fetch(`https://socialmediaclonebackend.onrender.com/api/user/getnickname?userId=${user.userId}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
      });
  
      const json = await response.json();
  
      if (response.ok) {
        setUserNickname(json.nickname);
        isNicknameFetched.current = true;
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
                <span className="nickname">somethingannoyingmighthappenlikethishere</span>
                <div className="logout-btn">
                  <button onClick={handleClick}><LogoutIcon  className="logout-icon"/>Logout</button>
                </div>
              </div>
            )}
        </nav>
    </header>
  )
}

export default Header