import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { FaGoogle } from "react-icons/fa";
import { useForgotPasswordContext } from "../context/ForgotPasswordContext";
import CryptoJS from "crypto-js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setShowForgotPassword } = useForgotPasswordContext();

  const { login, googleLogin, error, isLoading } = useLogin();

  function encryptPassword() {

    const encryptedPassword = CryptoJS.AES.encrypt(password, "H9YTaj6j8r%W*eIX").toString();
    return encryptedPassword;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const encryptedPassword = encryptPassword();
    await login(email, encryptedPassword);
  }

  return (
    <div className="login">
      <div>
        <div className="group">
          <label>Email</label>
          <input 
            type="text" 
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
            placeholder="Enter your password"
            onChange={(event) => {setPassword(event.target.value)}}
          />
        </div>

        <button disabled={isLoading} onClick={handleSubmit} className="submit-btn">Submit</button>
        {error && <div className="error">{ error }</div>}
        <div>
          <button onClick={googleLogin} className="google-button"><FaGoogle className="google-icon" /> Login With Google</button>
        </div>
        <hr />
        <span className="forgot-password-span" onClick={() => setShowForgotPassword(true)}>forgot password</span>
      </div>
    </div>
  )
}

export default Login;
