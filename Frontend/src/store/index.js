import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import notificationReducer from './notificationSlice'; // import new slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer, // add here
  },
});
