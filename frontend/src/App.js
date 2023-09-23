import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from "./Home";
import Login from './Login';
import Register from './Register';
import Forgetpassword from './forget_password';


function App() {
  return (
    <div className='App'>
      <Navbar />
    <Router>
      <Routes>
         
        <Route path="/" element={<Home />} />
       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<Forgetpassword />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;