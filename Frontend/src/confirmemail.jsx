import React, { useEffect, useState } from 'react';
import axios from './axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const location = useLocation();
  const [status, setStatus] = useState('Verifying...');
  const navigate = useNavigate();

  // Extract query param ?token=...
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post('/auth/verify', {
          token
        });
        setStatus('✅ Email verified successfully!');
        setTimeout(() => {
          navigate('/u/login')
        }, 1000);
        
      } catch (error) {
        console.error('Verification failed', error);
        setStatus('❌ Verification failed or token expired.');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('❌ Invalid verification link');
    }
  }, [token]);

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h2>{status}</h2>
    </div>
  );
};

export default EmailVerification;
