import React, { useState } from "react";
import "../assets/css/FloatingPayment.css";
import axiosInstance from "../axios";

const FloatingPayment = ({ selectedUser, user, onClose }) => {
  const [step, setStep] = useState(1); // 1: Amount | 2: Password | 3: Processing | 4: Success
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handlePayClick = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("⚠ Please enter a valid amount");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError("⚠ Password is required");
      return;
    }
    setError("");
    setStep(3); // show processing animation

    try {
      const data = {
        amount: amount,
        type: "TRANSFER",
        senderId: user.id,
        receiverId: selectedUser.id,
        description: password,
      };

      const res = await axiosInstance.post("/u/process/transaction", data);
      if (res.data === "Transfer successful.") {
        setStep(4); // show success message
      } else {
        setError("❌ Payment failed. Please try again.");
        setStep(2); // go back to password step
      }
    } catch (err) {
      setError("⚠ Something went wrong. Try again.");
      setStep(2);
    }
  };

  return (
    <div className="floating-payment-overlay">
      <div className="floating-payment-card">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {/* Step 1: Amount */}
        {step === 1 && (
          <>
            <h2>
              {" "}
              Send <span className="coin-highlight">TC</span>
            </h2>
            <p className="recipient">
              To: @{selectedUser.username}{" "}
              <span>({selectedUser.fullName})</span>
            </p>

            <label className="input-label">Amount (TC):</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {error && <p className="error-msg">{error}</p>}

            <button className="primary-btn" onClick={handlePayClick}>
              Proceed
            </button>
          </>
        )}

        {/* Step 2: Password */}
        {step === 2 && (
          <>
            <h2>🔐 Confirm Payment</h2>
            <p className="confirm-text">
              You're sending <strong>{amount} TC</strong> to{" "}
              <strong>@{selectedUser.username}</strong>
            </p>

            <label className="input-label">Enter Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error-msg">{error}</p>}

            <button className="primary-btn" onClick={handleConfirm}>
              Confirm
            </button>
          </>
        )}

        {/* Step 3: Processing Animation */}
        {step === 3 && (
          <div className="processing-container">
            <div className="mini-loader-container">
              <svg
                className="mini-infinity-path"
                viewBox="0 0 300 150"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="mini-infinity"
                  d="M50,75 
         C50,20 120,20 150,75 
         C180,130 250,130 250,75 
         C250,20 180,20 150,75 
         C120,130 50,130 50,75 Z"
                  stroke="url(#grad)"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  className="mini-animated-path"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9">
                      <animate
                        attributeName="stop-color"
                        values="#0ea5e9; #38bdf8; #0ea5e9"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </stop>
                    <stop offset="100%" stopColor="#38bdf8">
                      <animate
                        attributeName="stop-color"
                        values="#38bdf8; #0ea5e9; #38bdf8"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2>Processing Payment...</h2>
            <p className="loading-text">
              Sending {amount} TC to @{selectedUser.username}
            </p>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <>
            <h2>✅ Payment Successful!</h2>
            <p className="success-text">
              You sent <strong>{amount} TC</strong> to{" "}
              <strong>@{selectedUser.username}</strong>
            </p>
            <button className="primary-btn" onClick={onClose}>
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FloatingPayment;
