import React, { useState, useRef, useEffect } from "react";
import { User, Wallet, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Logo from "../assets/image/logosite-removebg-preview.png";
import axios from "../axios";
import axiosInstance from "../axios";

const HeadNav = ({ user }) => {
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
              navigate("/u/market");
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

const WalletPage = ({ user }) => {
  const [amount, setAmount] = useState();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.post("/u/balance");
        const userBalance = response.data.coin || 0;
        setBalance(userBalance);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        setBalance(0); // fallback
      }

      try {
        const res = await axios.post("/u/external/transation_list");
        // const data = res.data || null;
        // setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch Transation history:", error);
        // setTransactions(null);
      }
    };

    fetchBalance();
  }, []);

  // Add money handler
  const handleAddMoney = async () => {
    if (amount > 0) {
      try {
        await axios.post("/u/update_balance", { coin: amount });
        setAmount(0);
        // Re-fetch balance
        const response = await axios.post("/u/balance");
        const updatedBalance = response.data.coin || 0;
        setBalance(updatedBalance);
      } catch (error) {
        console.error("Failed to update balance:", error);
      }
    }
  };

  return (
    <div className="dashboard-bg">
      <HeadNav user={user} />
      <div className="dashboard-container">
        <h1 className="dashboard-title">My Wallet</h1>
        <div className="wallet-section">
          <div className="wallet-balance-card">
            <Wallet size={40} className="icon blue" />
            <h2>Current Balance</h2>
            <p className="wallet-amount">TC {balance}</p>
          </div>

          <div className="wallet-add-money">
            <h3>Add Money to Wallet</h3>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount"
            />
            <button onClick={handleAddMoney} className="wallet-add-button">
              Add Money
            </button>
          </div>
        </div>

        <div className="wallet-transactions">
          <h3>Transaction History</h3>
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <ul>
              {transactions.map((tx, idx) => (
                <li key={idx} className="transaction-item">
                  <span className={`tx-type ${tx.type.toLowerCase()}`}>
                    {tx.type}
                  </span>
                  <span>₹{tx.amount}</span>
                  <span>{tx.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const TransactionHistoryPage = ({ user }) => {
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
    }
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

const MarketTrendPage = ({ user }) => {
  const data = [
    { date: "Jul 01", value: 120 },
    { date: "Jul 05", value: 150 },
    { date: "Jul 10", value: 110 },
    { date: "Jul 15", value: 160 },
    { date: "Jul 20", value: 180 },
    { date: "Jul 25", value: 140 },
    { date: "Jul 30", value: 190 },
  ];

  return (
    <div className="dashboard-bg">
      <HeadNav user={user} />
      <div className="dashboard-container">
        <h1 className="dashboard-title">TimeCoin Market Trends</h1>

        <div className="market-chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#0288d1" />
              <YAxis stroke="#0288d1" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0288d1"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export { HeadNav, WalletPage, TransactionHistoryPage, MarketTrendPage };
