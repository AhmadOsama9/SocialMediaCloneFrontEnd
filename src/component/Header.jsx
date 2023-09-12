import Nav from "./Nav";

import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

import { useNavigate, Link } from "react-router-dom";

import "../CSS/header.css";

const Header = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();

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
                <span className="email">{user.email}</span>
                <button onClick={handleClick}>Logout</button>
              </div>
            )}
        </nav>
    </header>
  )
}

export default Header