import { BrowserRouter as Browser, Routes, Route, Navigate} from "react-router-dom";
import Header from "./component/Header";
import About from "./pages/About";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import LoggedinUser from "./pages/LoggedinUser";
import Friends from "./helperComponent/friends";
import UserPosts from "./helperComponent/UserPosts";


//hooks
import { useAuthContext } from "./hooks/useAuthContext";
import ShowReceivedRequests from "./helperComponent/ShowReceivedRequests";
import ShowChats from "./helperComponent/ShowChats";


function App() {
  
  const { user } = useAuthContext();

  return (
    <Browser>
      <Header />
      <Routes>
        <Route index element={!user? <Home /> : <LoggedinUser />} />
        <Route path='/About' element={<About />} />
        <Route path="/Signup" element={!user ?  <Signup /> : <Navigate to="/" />} />
        <Route path="/Login" element={!user ?  <Login /> : <Navigate to="/" />} />
        <Route path="/profile" element={<Profile /> } />
        <Route path="/Receivedrequests" element={!user? <Home /> : <ShowReceivedRequests />} />
        <Route path="/Chats" element={!user? <Home /> : <ShowChats />} />
        <Route path="/friends" element={!user? <Home />: <Friends />} />
        <Route path="/posts" element={!user? <Home />: <UserPosts />} />
        <Route path="*" element={<Navigate to="/" />} /> 
      </Routes>
    </Browser>
  );
}

export default App
