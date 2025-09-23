import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./axios";

// Pages
import LoginPage from "./login";
import ConfirmEmail from "./confirmemail";
import ResetPassword from "./ResetPassword";
import Logout from "./logout";
import Dashboard from "./dashboard";
import { WalletPage, TransactionHistoryPage } from "./component/Component";
import MessagingPage from "./component/MessagingPage";
import ProfilePage from "./component/ProfilePage";
import "./app.css";
import MarketTrendPage from "./component/MarketTrendPage";
import SettingsPage from "./component/SettingsPage";

// Wrapper for protected routes
function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) return <Navigate to="/u/login" replace />;
  return children;
}

// Wrapper for public routes
function PublicRoute({ isAuthenticated, children }) {
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      if (isAuthenticated) {
        try {
          const res = await axios.post("/u/islogin");
          if (!res.data) navigate("/u/logout");
        } catch (error) {
          navigate("/u/logout");
        }
      }
      setLoader(false); // Stop loader after check
    };

    checkLogin();
  }, [isAuthenticated]);

  if (loader) {
    return (
      <div className="loader-container">
        <svg
          className="infinity-path"
          viewBox="0 0 300 150"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Infinity path */}
          <path
            id="infinity"
            d="M50,75 
             C50,20 120,20 150,75 
             C180,130 250,130 250,75 
             C250,20 180,20 150,75 
             C120,130 50,130 50,75 Z"
            stroke="url(#grad)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            className="animated-path"
          />

          {/* Gradient animation */}
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

        <p className="loading-text">TimeCoins Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/u/settings"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <SettingsPage user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/u/transactions"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TransactionHistoryPage user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/u/message"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MessagingPage user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/u/market/trends"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MarketTrendPage user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/u/wallet"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <WalletPage user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/u/logout"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Logout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/:username"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ProfilePage user={user} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/:username/message"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MessagingPage user={user} />
          </ProtectedRoute>
        }
      />

      {/* Public Routes */}
      <Route
        path="/u/login"
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/u/verify"
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <ConfirmEmail />
          </PublicRoute>
        }
      />
      <Route
        path="/u/reset-password"
        element={
          <PublicRoute isAuthenticated={isAuthenticated}>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Catch-all route */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/u/login"} replace />}
      />
    </Routes>
  );
}

export default App;
