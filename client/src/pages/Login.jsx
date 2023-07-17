import { useState } from "react";


const Login = () => {
  const [email, setEmail] = useState("Enter your Email");
  const [password, setPassword] = useState("enter your Passsword");

  const handleSubmit = (event) => {
    event.preventDefualt();

    if(!email || !password) {
        alert("All the fields must be filled");
        return;
    }

    

    //then we can send it to the server
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input 
            type="text" 
            name="Email"
            value={email}
            onChange={(event) => {setEmail(event.target.value)}}
        >
            
        </input>

        <label>Password</label>
        <input 
            type="password"
            name="password"
            value={password}
            onChange={(event) => {setPassword(event.target.value)}}
        >
            
        </input>

        <button type="submit">Submit</button>
    </form>
  )
}

export default Login