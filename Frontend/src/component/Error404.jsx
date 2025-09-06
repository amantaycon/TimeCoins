import React from "react";
import { Link } from "react-router-dom";
import "./Error404.css";

const Error404 = () => {
  return (
    <div className="error-bg">
      <div className="error-card">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Oops! Page Not Found</h2>
        <p className="error-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="home-btn">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Error404;
