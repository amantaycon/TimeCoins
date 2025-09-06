import React, { useState, useEffect } from "react";
import "./assets/css/dashboard.css";
import {
  LogOut,
  User,
  Wallet,
  TrendingUp,
  Send,
  Clock,
  MessageCircle as Message,
} from "lucide-react";
import { Link } from "react-router-dom";
import { HeadNav } from "./component/Component";
import axios from "./axios";
import AvatarColor from "./component/AvatarColor";
import FloatingPopup from "./component/FloatingPopup";

const Dashboard = ({ user }) => {
  const [freqUser, setFreqUser] = useState([]);

  useEffect(() => {
    const fetchFreqUsers = async () => {
      try {
        const response = await axios.post("/u/message/listpanel");
        setFreqUser(response.data.content); // assuming it's a Spring `Page` object
      } catch (error) {
        console.error(
          "Freq user History List API error:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchFreqUsers();
  }, []);

  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      {showPopup && (
        <FloatingPopup
          onClose={() => setShowPopup(false)}
        />
      )}
      <div className="dashboard-bg">
        <HeadNav user={user} />
        <div className="dashboard-container">
          <h1 className="dashboard-title">Welcome to TimeCoins Dashboard</h1>

          <div className="card-grid">
            <Link to={"/u/wallet"} className="card">
              <div className="card-content">
                <Wallet size={40} className="icon blue" />
                <h2 className="card-title">Wallet Balance</h2>
                <p className="card-text">Check your TimeCoin balance</p>
              </div>
            </Link>

            <div className="card pointer" onClick={() => setShowPopup(true)}>
              <div className="card-content">
                <Send size={40} className="icon green" />
                <h2 className="card-title">Send Coins</h2>
                <p className="card-text">Transfer TimeCoins to others</p>
              </div>
            </div>

            <Link to="/u/message" className="card">
              <div className="card-content">
                <Message size={40} className="icon green" />
                {/* <span className="badge">3</span> */}
                <h2 className="card-title">Messages</h2>
                <p className="card-text">Chat with other TimeCoin users</p>
              </div>
            </Link>

            <Link to={"/u/transactions"} className="card">
              <div className="card-content">
                <Clock size={40} className="icon purple" />
                <h2 className="card-title">Transaction History</h2>
                <p className="card-text">View your recent transactions</p>
              </div>
            </Link>

            <Link to={"/u/market/trends"} className="card">
              <div className="card-content">
                <TrendingUp size={40} className="icon orange" />
                <h2 className="card-title">Coin Value</h2>
                <p className="card-text">Check TimeCoin market trends</p>
              </div>
            </Link>

            <Link to={`/${user.username}`} className="card">
              <div className="card-content">
                <User size={40} className="icon indigo" />
                <h2 className="card-title">Profile</h2>
                <p className="card-text">Manage your account details</p>
              </div>
            </Link>

            <Link to={"/u/logout"} className="card">
              <div className="card-content">
                <LogOut size={40} className="icon red" />
                <h2 className="card-title">Logout</h2>
                <button className="logout-button">Log Out</button>
              </div>
            </Link>
          </div>

          <hr className="section-divider" />

          {/* User History Section */}
          {freqUser.length != 0 && (
            <>
              <div className="user-history-section">
                <h2 className="section-title">User History</h2>
                <div className="user-list">
                  {freqUser.map((user, index) => (
                    <Link to={`/${user.username}/message`} key={index} className="user-card pointer positionrelative">
                      {user.unreadCount != 0?<span className="badge">{user.unreadCount}</span>:<></>}
                      
                      <div
                        className="avatar"
                        style={{ backgroundColor: AvatarColor(user.userId) }}
                      >
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>

                      <div className="user-info">
                        <div className="user-name">{user.fullName}</div>
                        <div className="user-username">@{user.username}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <hr className="section-divider" />
            </>
          )}

          {/* Footer */}
          <footer className="dashboard-footer">
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/disclaimer">Disclaimer</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <p>© {new Date().getFullYear()} TimeCoins. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
