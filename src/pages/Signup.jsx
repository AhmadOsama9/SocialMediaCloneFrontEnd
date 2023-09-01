import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

import "../CSS/form.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const {signup, googleSignup, error, isLoading} = useSignup();
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(secretKey === "")
    {
      await signup(email, password, "");
    }
    else if(secretKey === "vcemkRG!aza2lk276_7W?SGebw4")
    {
      await signup(email, password, "admin");
    }
    else if(secretKey !== "vcemkRG!aza2lk276_7W?SGebw4")
    {
      alert("Wrong SecretKey, you seem to not be an admin, I will block you soon \n");
      return;
    }
    
  }

  return (
    <div>
      <div className="group">
        <label>Email</label>
        <input 
            type="email" 
            name="Email"
            value={email}
            placeholder="Enter your Email"
            onChange={(event) => {setEmail(event.target.value)}}
        />
      </div>
      <div className="group">
        <label>Password</label>
        <input 
            type="password"
            name="password"
            value={password}
            placeholder="Enter a strong Password"
            onChange={(event) => {setPassword(event.target.value)}}
        />
      </div>
      <div className="group">
        <label>Admin only</label>
        <input 
            type="password"
            name="secretKey"
            value={secretKey}
            placeholder="Leave it empty if you are not an admin"
            onChange={(event) => {setSecretKey(event.target.value)}}
        />
      </div>
          
      <button disabled={isLoading} onClick={handleSubmit} className="submit-btn">Submit</button>
      {error && <div className="error">{error}</div>}
    </div>
  )
}

export default Signup