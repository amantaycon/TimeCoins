import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Get token from localStorage (or cookie if you use that)
const getToken = () => localStorage.getItem('jwtToken');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9090/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // set true if using cookies
});

// Add Authorization header to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Logging out...");
      // Optional: redirect to login or clear token
      localStorage.removeItem('jwtToken');
      useNavigate('/login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
