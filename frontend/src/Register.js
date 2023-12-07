import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register() {

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("Patient");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }
    if (password.length < 6) {
      alert("Password should be atleast 8 characters");
      return;
    }
    if (email.length < 1) {
      alert("Email cannot be empty");
      return;
    }
    const data = {
      email: email,
      password: password,
      userType: userType,
    };

    fetch("http://localhost:8080/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success) {
          alert("Registration successful");
        } else {
          alert("Registration failed");
        }
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };


  return (
    <div className="mycontainer">
      <form className="login-form">
        <h1 className="h3 mb-3 fw-normal">&#128138;</h1>
        <h1 className="h3 mb-3 fw-normal">Let's begin the journey</h1>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" className="form-control" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" value={confirmPassword} placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <select className="form-select" aria-label="Default select example" value={userType}
          onChange={(e) => setUserType(e.target.value)}>
          <option value="Patient" >Patient</option>
          <option value="Hospital">Hospital</option>
          <option value="Supplier">Supplier</option>
        </select>
        <br />
        <button className="btn btn-success" onClick={handleRegister}>Register</button>
        <br />
        <Link to="/login">Already have an account?</Link>
      </form>
    </div>
  );
}

export default Register;
