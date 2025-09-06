import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('jwtToken');
    dispatch(logout());
    navigate('/u/login');
  }, [dispatch, navigate]);

  return null;
}

export default LogoutPage;
