import { BrowserRouter as Browser, Routes, Route, Navigate} from "react-router-dom";


import Header from "./component/Header";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import LoggedinUser from "./pages/LoggedinUser";
import Friends from "./helperComponent/Friends";

import GoogleSignupCallback from "./component/GoogleSignupCallBack";
import GoogleLoginCallback from "./component/GoogleLoginCallback";

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
        <Route path="/Signup" element={!user ?  <Signup /> : <Navigate to="/" />} />
        <Route path="/Login" element={!user ?  <Login /> : <Navigate to="/" />} />
        <Route path="/profile" element={<Profile /> } />
        <Route path="/Receivedrequests" element={!user? <Home /> : <ShowReceivedRequests />} />
        <Route path="/Chats" element={!user? <Home /> : <ShowChats />} />
        <Route path="/friends" element={!user? <Home />: <Friends />} />
        <Route path="/signupcallback" element={!user? <GoogleSignupCallback /> : <LoggedinUser />} />
        <Route path="/logincallback" element={!user? <GoogleLoginCallback /> : <LoggedinUser />} />
        <Route path="*" element={<Navigate to="/" />} /> 
      </Routes>
    </Browser>
  );
}

export default App
