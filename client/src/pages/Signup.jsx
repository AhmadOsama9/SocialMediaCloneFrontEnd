import { useState } from "react";


const Signup = () => {
  const [userName, setUserName] = useState("Enter your Username");
  const [email, setEmail] = useState("Enter your Email");
  const [password, setPassword] = useState("enter your Passsword");
  

  const handleSubmit = (event) => {
    event.preventDefault();

    if(!email || !password || !userName) {
        alert("All the fields must be filled");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    //then we can send it to the server
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
        <label>UserName</label>
        <input 
            type="text" 
            name="userName"
            value={userName}
            onChange={(event) => {setUserName(event.target.value)}}
        >
            
        </input>

        <label>Email</label>
        <input 
            type="email" 
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

export default Signup