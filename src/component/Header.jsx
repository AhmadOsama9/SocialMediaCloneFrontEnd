import AuthNav from "./AuthNav";
import Nav from "./Nav";

import "../CSS/header.css";

const Header = () => {
  return (
    <header>
        <nav>
            <h1 className="logo">Logo</h1>
            <AuthNav />
            <Nav />
        </nav>
    </header>
  )
}

export default Header