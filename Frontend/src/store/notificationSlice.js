import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationUsers: [], // store userIds (or full objects) with unread messages
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotificationUsers: (state, action) => {
      state.notificationUsers = action.payload;
    },
    addNotificationUser: (state, action) => {
      if (!state.notificationUsers.includes(action.payload)) {
        state.notificationUsers.push(action.payload);
      }
    },
    removeNotificationUser: (state, action) => {
      state.notificationUsers = state.notificationUsers.filter(
        (id) => id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notificationUsers = [];
    },
  },
});

export const {
  setNotificationUsers,
  addNotificationUser,
  removeNotificationUser,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
