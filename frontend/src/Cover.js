import React from "react";
import { Link } from "react-router-dom";
import "./Cover.css";
import blockchainImage from "./images/blockchain.png";

const Cover = () => {

  return (
    <div className="background-cover">
      <img src={blockchainImage} alt="blockchain" width="100%"/>
      <div className="pr-message">
        <h1>Medical System, In your own way</h1>
        <p className="text-lowercase">We are committed to building the best, easiest to use and most secure blockchain management platform.</p>
        <p className="fs-2">&#128138;</p>
      </div>
      <Link to ="/login" className="btn btn-outline-primary join-width">Join tody</Link>
    </div>
  );
}

export default Cover;