import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Login = () => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        fetch("http://localhost:8080/api/login?email=" + email + "&password=" + password, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.success) {
                    localStorage.setItem("id", responseData.userId);
                    localStorage.setItem("userType", responseData.userType);
                    alert("Login successful");
                    if (responseData.userType === "Supplier") {
                        navigate("/user=supplier");
                    } else if (responseData.userType === "Patient") {
                        navigate("/user=patient");
                    } else if (responseData.userType === "Hospital") {
                        navigate("/user=hospital");
                    }
                } else {
                    alert("Invalid email or password");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    return (
        <div className="mycontainer">
            <form className="login-form">
                <h1 className="h3 mb-3 fw-normal">&#128138;</h1>
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="btn btn-success" onClick={handleLogin}>Login</button>
                <br /><br />
                <Link to="/register">Don't have an account</Link>
                <br /><br />
                <Link to="/forgetpassword">I forget password</Link>
            </form>
        </div>
    );
};

export default Login;
