import React from "react";
import "../assets/css/loader.css";
import logo from "../assets/image/logosite-removebg-preview.png";

const Loader = () => {
  return (
    <div className="loader-wrapper" role="status" aria-live="polite">
      <div className="loader-core">
        <div className="sun-rays"></div>
        <img src={logo} alt="TimeCoins Logo" className="loader-logo" />
        <div className="orbit orbit1"></div>
        <div className="orbit orbit2"></div>
        <div className="orbit orbit3"></div>
      </div>
      <p className="loader-text">Loading TimeCoins...</p>
    </div>
  );
};

export default Loader;
