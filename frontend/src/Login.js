const Login = () => {
    return (
        <form>
            <label htmlFor="username">Username: </label>
            <input type="text" id="username" name="username" /><br />
            <label htmlFor="password">Password: </label>
            <input type="password" id="password" name="password" /><br />
            <button type="submit">Login</button>
            <br />
            <a href="/register">Register</a>
            <h>&nbsp;&nbsp;</h>
            <a href="/change-password">Change Password </a>
        </form>
    );  
};

export default Login;