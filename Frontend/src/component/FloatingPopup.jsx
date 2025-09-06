import React from "react";
import UserListPanel from "./UserListPanel";
import { X } from "lucide-react"; // Close icon (optional)

const FloatingPopup = ({ onClose }) => {
  return (
    <div className="floating-overlay">
      <div className="floating-popup">
        {/* Header */}
        <div className="popup-header">
          <h3 className="popup-title">Payments</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* User List */}
        <div className="popup-content">
          <UserListPanel />
        </div>
      </div>
    </div>
  );
};

export default FloatingPopup;
