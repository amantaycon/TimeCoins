import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("userdata")),
  token: localStorage.getItem("jwtToken") || null,
  isAuthenticated: !!localStorage.getItem("jwtToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("userdata", JSON.stringify(state.user));
      localStorage.setItem("jwtToken", state.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("userdata");
      localStorage.removeItem("jwtToken");
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }; // merge updated fields
      localStorage.setItem("userdata", JSON.stringify(state.user)); // persist changes
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
