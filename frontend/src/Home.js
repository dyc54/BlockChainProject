import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to Our Website</h1>
      <Link to ="/login">Let's begin</Link>
    </div>
  );
}

export default Home;