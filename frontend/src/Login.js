import React from "react";

const Login = () => {
    return (
        <form>
            <nav className="navbar">
            <h1> Login </h1>
            </nav>
            <label htmlFor="username">Username: </label>
            <input type="text" id="username" name="username" /><br />
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" name="password" /><br />
            <button type="submit">Login</button>
            <br />
            <a href="/register">Don't have a account?</a>
            <br />
            <h>&nbsp;&nbsp;</h>
            <a href="/forget-password">I forget password.</a>
        </form>
    );  
};

export default Login;