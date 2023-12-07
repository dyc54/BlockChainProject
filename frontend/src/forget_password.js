import React, { useState } from "react";
import { Link } from "react-router-dom";

function ForgetPassword() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlereset = () => {
      
      if (password !== confirmPassword) {
        alert("Password and Confirm Password do not match");
        return;
      }
      if (password.length < 1) {
        alert("Password must not be empty");
        return;
      }
      if (email.length < 1) {
        alert("Email must not be empty");
        return;
      }
      const data = {
        email: email,
        password: password,
      };
    
      fetch("/api/forgetpassword", {
        method: "PUT",  // updated from POST to PUT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.success) {
            alert("reset success");
          } else {
            alert("reset failed");
          }
        })
        .catch((error) => {
          console.error("error:", error);
        });
    }

  return (
    <div className="mycontainer">
      <form className="login-form">
      <h1 className="h3 mb-3 fw-normal">&#128138;</h1>
      <h1 className="h3 mb-3 fw-normal">Reset your password</h1>
      <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div className="mb-3">
          <label for="exampleInputPassword1" className="form-label">New Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <div className="mb-3">
          <label for="exampleInputPassword1" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" value={confirmPassword} placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)}/>
      </div>
      <button className="btn btn-success" onClick={handlereset}>reset password</button>
      <br></br>
      <Link to ="/login">I want to log in</Link>
      </form>
    </div>
    
  );
}

export default ForgetPassword;
