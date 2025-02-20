import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: localStorage.getItem("access_token") || null,
  status: "idle",
  userName: "",
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userName = action.payload.userName;
      localStorage.setItem("access_token", action.payload.token);
      localStorage.setItem("userName", action.payload.userName);
    },
    clearAuthentication: (state, action) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userName = "";
      localStorage.removeItem("access_token"); // Remove token from localStorage
      localStorage.removeItem("userName"); // Remove username from localStorage
    },
  },
});
export const { setAuthenticated, clearAuthentication } = authSlice.actions;
export default authSlice.reducer;
