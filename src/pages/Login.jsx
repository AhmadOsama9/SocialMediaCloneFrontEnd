import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

import "../CSS/form.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {login, googleLogin, error, isLoading} = useLogin();

  const handleSubmit = async (event) => {
    event.preventDefault();

    await login(email, password);
    
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
        <h3>Login</h3>
        <div>
          <label>Email</label>
          <input 
              type="text" 
              name="Email"
              value={email}
              placeholder="Enter your Email"
              onChange={(event) => {setEmail(event.target.value)}}
          />

          <label>Password</label>
          <input 
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={(event) => {setPassword(event.target.value)}}
          />

          <button type="submit" disabled={isLoading}>Submit</button>
          {error && <div className="error">{ error }</div>}
        </div>

        <button onClick={googleLogin}>Login With Google</button>


    </form>
  )
}

export default Login