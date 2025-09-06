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
import SettingsPage from "./SettingsPage";
import { WalletPage, TransactionHistoryPage, MarketTrendPage } from "./component/Component";
import MessagingPage from "./component/MessagingPage";
import ProfilePage from "./component/ProfilePage";
import "./app.css";
import Logo from './assets/image/logosite-removebg-preview.png';

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
    <div className="splash-loader">
      <div className="logo-container">
        <img src={Logo} alt="TimeCoins Logo" className="logo" />

        {/* Light wave ripples */}
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      {/* Animated Loading text */}
      <p className="loading-text">Loading<span className="dots"></span></p>
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
        path="/u/setting"
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
        path="/user/market/trends"
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
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/u/login"} replace />} />
    </Routes>
  );
}

export default App;
