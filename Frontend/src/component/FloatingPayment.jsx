import React, { useState } from 'react';
import '../assets/css/FloatingPayment.css';
import axiosInstance from '../axios';

const FloatingPayment = ({ selectedUser, user, onClose }) => {
  const [step, setStep] = useState(1); // 1: Amount | 2: Password | 3: Processing | 4: Success
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handlePayClick = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('⚠ Please enter a valid amount');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError('⚠ Password is required');
      return;
    }
    setError('');
    setStep(3); // show processing animation

    try {
      const data = {
        amount: amount,
        type: "TRANSFER",
        senderId: user.id,
        receiverId: selectedUser.id,
        description: password
      }

      const res = await axiosInstance.post('/u/process/transaction', data);
      if (res.data === "Transfer successful.") {
        setStep(4); // show success message
      } else {
        setError('❌ Payment failed. Please try again.');
        setStep(2); // go back to password step
      }
    } catch (err) {
      setError('⚠ Something went wrong. Try again.');
      setStep(2);
    }
  };

  return (
    <div className="floating-payment-overlay">
      <div className="floating-payment-card">
        <button className="close-btn" onClick={onClose}>×</button>

        {/* Step 1: Amount */}
        {step === 1 && (
          <>
            <h2> Send <span className="coin-highlight">TC</span></h2>
            <p className="recipient">To: @{selectedUser.username} <span>({selectedUser.fullName})</span></p>

            <label className="input-label">Amount (TC):</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {error && <p className="error-msg">{error}</p>}

            <button className="primary-btn" onClick={handlePayClick}>Proceed</button>
          </>
        )}

        {/* Step 2: Password */}
        {step === 2 && (
          <>
            <h2>🔐 Confirm Payment</h2>
            <p className="confirm-text">
              You're sending <strong>{amount} TC</strong> to <strong>@{selectedUser.username}</strong>
            </p>

            <label className="input-label">Enter Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error-msg">{error}</p>}

            <button className="primary-btn" onClick={handleConfirm}>Confirm</button>
          </>
        )}

        {/* Step 3: Processing Animation */}
        {step === 3 && (
          <div className="processing-container">
            <div className="loader"></div>
            <h2>Processing Payment...</h2>
            <p className="loading-text">Sending {amount} TC to @{selectedUser.username}</p>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <>
            <h2>✅ Payment Successful!</h2>
            <p className="success-text">
              You sent <strong>{amount} TC</strong> to <strong>@{selectedUser.username}</strong>
            </p>
            <button className="primary-btn" onClick={onClose}>Done</button>
          </>
        )}
      </div>
    </div>
  );
};

export default FloatingPayment;
