import React, { useState } from "react";
import "../assets/css/SettingsPage.css";
import { HeadNav } from "./Component";
import axiosInstance from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../store/authSlice";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(user?.bio || ""); // new state for bio
  const [darkMode, setDarkMode] = useState(user?.darkMode || false);
  const [enableNotifications, setEnableNotifications] = useState(
    user?.webNotification || false
  );
  const [receiveUpdates, setReceiveUpdates] = useState(
    user?.timeCoinsUpdateNotification || false
  );
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleSave = async () => {
  try {
    const updatedUser = {
      id: user.id,
      fullName,
      bio,
      darkMode,
      webNotification: enableNotifications,
      timeCoinsUpdateNotification: receiveUpdates,
    };

    const response = await axiosInstance.post("/u/setting", updatedUser);

    // update redux + localStorage
    dispatch(updateUser(response.data));
    alert("Settings saved successfully!");
  } catch (error) {
    console.error("Error updating settings:", error);
    alert("Failed to save settings. Please try again.");
  }
};


  return (
    <>
      <HeadNav user={user} />
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        {/* Profile Information */}
        <div className="settings-section">
          <h2 className="section-title">Profile Information</h2>

          <div className="settings-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="settings-group">
            <label>Username</label>
            <input
              type="text"
              value={user.username}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="settings-group">
            <label>Email Address</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="settings-group">
            <label>Bio</label>
            <textarea
              placeholder="Write something about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bio-textarea"
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="settings-section">
          <h2 className="section-title">Preferences</h2>

          <div className="settings-toggle">
            <label>Enable Notifications</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={enableNotifications}
                onChange={() => setEnableNotifications(!enableNotifications)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-toggle">
            <label>TimeCoin Updates</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={receiveUpdates}
                onChange={() => setReceiveUpdates(!receiveUpdates)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-toggle">
            <label>Dark Mode</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Security Section */}
        <div className="settings-section">
          <h2 className="section-title">Security</h2>
          <div className="settings-group">
            <label>Change Password</label>
            <button
              className="change-password-button"
              onClick={() => setShowPasswordModal(true)}
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Reset Your Password</h3>
              <p>
                We'll send a reset link to your email: <b>{user.email}</b>
              </p>
              <button className="send-link-button">Send Reset Link</button>
              <button
                className="close-button"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Save Button */}
        <button className="save-settings-button" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </>
  );
};

export default SettingsPage;
