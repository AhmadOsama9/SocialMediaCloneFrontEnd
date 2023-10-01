import { BrowserRouter as Browser, Routes, Route, Navigate} from "react-router-dom";


import Header from "./component/Header";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import LoggedinUser from "./pages/LoggedinUser";
import Friends from "./helperComponent/Friends";
import Feed from "./pages/Feed";

import GoogleSignupCallback from "./component/GoogleSignupCallback";
import GoogleLoginCallback from "./component/GoogleLoginCallback";

//hooks
import { useAuthContext } from "./hooks/useAuthContext";
import { useNicknameContext } from "./context/NicknameContext";
import ShowReceivedRequests from "./helperComponent/ShowReceivedRequests";
import ShowChats from "./helperComponent/ShowChats";


function App() {
  
  const { user } = useAuthContext();
  const { userNickname } = useNicknameContext();


  return (
    <Browser>
      <Header />
      <Routes>
        <Route index element={!user? <Home /> : <LoggedinUser />} />
        <Route path="/profile" element={!user ? <Home /> : <Profile /> } />
        <Route path="/Receivedrequests" element={!user? <Home /> : <ShowReceivedRequests />} />
        <Route path="/Chats" element={!user? <Home /> : <ShowChats />} />
        <Route path="/friends" element={!user? <Home />: <Friends />} />
        <Route path="/feed" element={!user? <Home />: <Feed />} />
        <Route path="/signupcallback" element={!user? <GoogleSignupCallback /> : <LoggedinUser />} />
        <Route path="/logincallback" element={!user? <GoogleLoginCallback /> : <LoggedinUser />} />
        <Route path="*" element={<Navigate to="/" />} /> 
      </Routes>
    </Browser>
  );
}

export default App
