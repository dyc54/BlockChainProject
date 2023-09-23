import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <form>
            <label htmlFor="username">Username: </label>
            <input type="text" id="username" name="username" /><br />
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" name="password" /><br />
            <button type="submit">Login</button>
            <br />
            <Link to ="/register">Don't have a account</Link>
            <br />
            <h>&nbsp;&nbsp;</h>
            <Link to ="/forget-password">Change Password</Link>
        </form>
    );  
};

export default Login;