import React, { useState } from "react";

function Register() {

  const [password, setPassword] = useState("");
  const [email,setEmail] = useState("");

  const handleRegister = () => {
    
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
        <br />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
