import React from 'react';
import './assets/css/SettingsPage.css';
import { HeadNav } from './component/Component';

const SettingsPage = ({user}) => {
  return (
    <>
    <HeadNav/>
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-section">
        <h2 className="section-title">Profile Information</h2>
        <div className="settings-group">
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" />
        </div>
        <div className="settings-group">
          <label>Username</label>
          <input type="text" placeholder="Enter your username" />
        </div>
        <div className="settings-group">
          <label>Email Address</label>
          <input type="email" placeholder="you@example.com" />
        </div>
      </div>

      <div className="settings-section">
        <h2 className="section-title">Change Password</h2>
        <div className="settings-group">
          <label>Current Password</label>
          <input type="password" placeholder="Current password" />
        </div>
        <div className="settings-group">
          <label>New Password</label>
          <input type="password" placeholder="New password" />
        </div>
        <div className="settings-group">
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm new password" />
        </div>
      </div>

      <div className="settings-section">
        <h2 className="section-title">Preferences</h2>
        <div className="settings-toggle">
          <label>Enable Notifications</label>
          <input type="checkbox" />
        </div>
        <div className="settings-toggle">
          <label>Receive TimeCoin Updates</label>
          <input type="checkbox" />
        </div>
      </div>

      <button className="save-settings-button">Save Changes</button>
    </div>
    </>
  );
};

export default SettingsPage;
