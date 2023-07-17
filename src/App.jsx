import { BrowserRouter as Browser, Routes, Route} from "react-router-dom";
import Header from "./component/Header";
import About from "./pages/About";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

//hooks
import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  
  const { user } = useAuthContext();

  return (
    <Browser>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path='/About' element={<About />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </Browser>
  );
}

export default App
