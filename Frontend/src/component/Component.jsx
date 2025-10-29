import React, { useState, useRef, useEffect } from "react";
import { User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/image/logosite-removebg-preview.png";
import axiosInstance from "../axios";
import { useSelector } from "react-redux";

const HeadNav = () => {
  const user = useSelector((state) => state.auth.user);
  const username = user.username;
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close profile menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Header */}
      <header className="dashboard-header">
        <div className="logo-section">
          {/* Hamburger visible only on mobile */}
          <Menu
            className="hamburger-icon"
            onClick={() => setSidebarOpen(true)}
          />
          <img
            src={Logo}
            alt="TimeCoins Logo"
            className="logo-image pointer"
            onClick={() => {
              navigate("/");
            }}
          />
          <span
            className="logo-title pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            TimeCoins
          </span>
        </div>

        {/* Tabs hidden on mobile */}
        <nav className="nav-tabs">
          <button
            className="nav-tab"
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </button>
          <button
            className="nav-tab"
            onClick={() => {
              navigate(`/u/wallet`);
            }}
          >
            Wallet
          </button>
          <button
            className="nav-tab"
            onClick={() => {
              navigate(`/u/transactions`);
            }}
          >
            Transactions
          </button>
          <button
            className="nav-tab"
            onClick={() => {
              navigate("/u/market/trends");
            }}
          >
            Market
          </button>
          <button
            className="nav-tab"
            onClick={() => {
              navigate("/u/support");
            }}
          >
            Support
          </button>
        </nav>

        <div className="profile-section" ref={dropdownRef}>
          <div
            className="profile-dropdown"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <User className="profile-icon" />
            {menuOpen && (
              <div className="profile-menu">
                <button
                  onClick={() => {
                    navigate(`/${username}`);
                  }}
                >
                  My Profile
                </button>
                {user.admin && (
                  <button
                  onClick={() => {
                    navigate(`/u/admin`);
                  }}
                >
                  Admin Panel
                </button>
                )}
                <button
                  onClick={() => {
                    navigate(`/u/settings`);
                  }}
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    navigate(`/u/logout`);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}>
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <h3 className="sidebar-title">Navigation</h3>
            <button
              className="sidebar-item"
              onClick={() => {
                navigate("/");
              }}
            >
              Home
            </button>
            <button
              className="sidebar-item"
              onClick={() => {
                navigate(`/u/wallet`);
              }}
            >
              Wallet
            </button>
            <button
              className="sidebar-item"
              onClick={() => {
                navigate(`/u/transactions`);
              }}
            >
              Transactions
            </button>
            <button
              className="sidebar-item"
              onClick={() => {
                navigate("/u/market");
              }}
            >
              Market
            </button>
            <button
              className="sidebar-item"
              onClick={() => {
                navigate("/u/support");
              }}
            >
              Support
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const TransactionHistoryPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [transactions, setTransactions] = useState([]);

  const loadTransaction = async (page) => {
    try {
      const res = await axiosInstance.post(
        `/u/process/transaction_list?page=${page}&size=20`
      );

      setTransactions([...transactions, ...res.data.content]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadTransaction(0);
  }, []);

  const getType = (id, s) => {
    if (s == "TRANSFER") {
      if (id == user.id) return "debit";
      else return "credit";
    }else return s;
  };

  function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString("en-GB", { hour12: false });
  }

  return (
    <div className="dashboard-bg">
      <HeadNav user={user} />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Transaction History</h1>

        <div className="wallet-transactions">
          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <ul>
              {transactions.map((tx) => (
                <li key={tx.id} className="transaction-item">
                  <div>
                    <strong>Transation ID:</strong> {tx.id}
                  </div>
                  <div>
                    <strong>Type:</strong>{" "}
                    <span
                      className={`tx-type ${getType(tx.senderId, tx.type)}`}
                    >
                      {getType(tx.senderId, tx.type)}
                    </span>
                  </div>
                  <div>
                    <strong>Amount:</strong> {tx.amount} TC
                  </div>
                  <div>
                    <strong>Date:</strong> {formatDateTime(tx.transactionDate)}
                  </div>
                  <div>
                    <strong>Payer:</strong> {tx.senderUsername}
                  </div>
                  <div>
                    <strong>Receiver:</strong> {tx.receiverUsername}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};



export { HeadNav, TransactionHistoryPage };
