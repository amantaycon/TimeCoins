import React, { useEffect, useState } from 'react';
import axios from './axios';
import './assets/css/LoginPage.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LoginAlert from './assets/loginalert';
import Logo from './assets/image/logosite-removebg-preview.png';



const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [showError, setShowError] = useState(false);
    const [message, setMessage] = useState('');

    // Extract query param ?token=...
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    const resetPassSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/reset', {
                "newPassword": password,
                token
            });
            navigate('/user/login');
        } catch (error) {
            console.error('Failed Password changing', error);
            setMessage('❌ token expired.');
            setShowError(false);
            setTimeout(() => {
                setShowError(true);
            }, 10);
        }
    }


    return (
        <div className="auth-wrapper">
            <LoginAlert message={message} show={showError} />
            <div className="auth-header">
                <h1 className='h1tag'><img className='logohome' src={Logo} alt="" /> TimeCoins</h1>
                <p>The Coin That Moves with Time</p>
            </div>

            <div className="auth-container">
                <form onSubmit={resetPassSubmit}>
                    <h2>Reset Password</h2>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" placeholder="Confirm Password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                    <button className="primary-btn" type='submit'>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
