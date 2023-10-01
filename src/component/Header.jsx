import { useState, useEffect, useRef } from "react";
import Nav from "./Nav";

import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNicknameContext } from "../context/NicknameContext";

import { useNavigate, Link } from "react-router-dom";

import LogoutIcon from '@mui/icons-material/Logout';

import "../CSS/header.css";

const Header = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();


  const { userNickname } = useNicknameContext();

  const handleClick = () => {
    logout();
    navigate("/");
  }

  useEffect(() => {

  }, [userNickname])

  return (
    <header>
        <nav>
          <Link className="logo" to="/">
            <h1>SMC</h1>
          </Link>
            <Nav />
            {user && (
              <div className="logout">
                {userNickname && <span className="nickname">{userNickname}</span>}
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