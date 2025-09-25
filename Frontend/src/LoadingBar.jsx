// src/components/LoadingBar.js
import React from "react";

const LoadingBar = ({ show }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 2000,
        textAlign: "center",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#fff",
      }}
    >
      {/* Progress Line */}
      <div
        style={{
          height: "4px",
          width: "100%",
          background: "#e0e0e0",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "#34dbdb",
            animation: "progressBar 2s ease-in-out forwards",
          }}
        ></div>
      </div>

      <style>
        {`
          @keyframes progressBar {
            from { width: 0; }
            to { width: 98%; }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingBar;
