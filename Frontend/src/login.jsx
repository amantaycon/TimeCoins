import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from './axios';
import LoginAlert from './assets/loginalert';
import './assets/css/LoginPage.css';
import Logo from './assets/image/logosite-removebg-preview.png';

const AuthPage = () => {
  const [formType, setFormType] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState('');
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', {
        "login": email,
        password,
      });

      const data = response.data;
      const token = data.password; // token is store in password keyword
      localStorage.setItem('userdata', JSON.stringify(data));
      localStorage.setItem('jwtToken', token);
      dispatch(loginSuccess({ token, user: data })); // Save in Redux
      console.log("Login successful");
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      setMessage('Login failed because Credential is Wrong');
      setShowError(false);
      setTimeout(() => {
        setShowError(true);
      }, 10);
    }

  }

  const register = async (e) => {
    e.preventDefault();
    if (password != password2) {
      setMessage('Password mismatch please check it again');
      setShowError(false);
      setTimeout(() => {
        setShowError(true);
      }, 10);
      return;
    }
    try {
      const response = await axios.post('/auth/register', {
        fullName,
        username,
        password,
        email
      });
      alert("Check your mail to confirm your email id");
      navigate('/u/login');

    } catch (error) {
      console.error("Ragisteration failed:", error.response?.data?.message || error.message);
      setMessage('Ragisteration failed');
      setShowError(false);
      setTimeout(() => {
        setShowError(true);
      }, 10);
    }
  }

  const resetLink = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/forgotten_password', {
        email
      });
      alert("Password reset link is send to your email id please check it.");
      navigate('/u/login');
    } catch (error) {
      console.error("Failed:", error.response?.data?.message || error.message);
      setMessage('Failed to send reset link');
      setShowError(false);
      setTimeout(() => {
        setShowError(true);
      }, 10);
    }
  }

  const renderForm = () => {
    switch (formType) {
      case 'login':
        return (
          <form onSubmit={submitLogin}>
            <h2>Welcome Back</h2>
            <input type="text" placeholder="Username or Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="primary-btn" type='submit'>Login</button>
            <div className="form-links">
              <span onClick={() => setFormType('forgot')}>Forgot Password?</span>
              <span onClick={() => setFormType('register')}>New User? Register</span>
            </div>
          </form>
        );
      case 'register':
        return (
          <form onSubmit={register}>
            <h2>Create Account</h2>
            <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="email" placeholder="xyz@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
            <button className="primary-btn" type='submit'>Register</button>
            <div className="form-links">
              <span onClick={() => setFormType('login')}>Already have an account? Login</span>
            </div>
          </form>
        );
      case 'forgot':
        return (
          <form onSubmit={resetLink}>
            <h2>Reset Password</h2>
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="primary-btn" type='submit'>Send Reset Link</button>
            <div className="form-links">
              <span onClick={() => setFormType('login')}>Back to Login</span>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className='mainhead'>
      <div className="auth-wrapper">
        <LoginAlert message={message} show={showError} />
        <div className="auth-header">
          <h1 className='h1tag'><img className='logohome' src={Logo} alt="" /> TimeCoins</h1>
          <p>The Coin That Moves with Time</p>
        </div>

        <div className="auth-container">
          <div className="form-tabs">
            <button className={formType === 'login' ? 'active' : ''} onClick={() => setFormType('login')}>Login</button>
            <button className={formType === 'register' ? 'active' : ''} onClick={() => setFormType('register')}>Register</button>
            <button className={formType === 'forgot' ? 'active' : ''} onClick={() => setFormType('forgot')}>Forgot</button>
          </div>
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
