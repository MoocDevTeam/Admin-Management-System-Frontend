import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: localStorage.getItem("access_token") || null,
  status: "idle",
  userName: "",
  error: null,
  permissions: []
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
    setPermissions: (state, action) => {
      state.permissions = action.payload;
      let user_permissions=JSON.stringify(action.payload);
      localStorage.setItem("user_permissions", user_permissions);
    },
    clearPermissons: (state, action) => {
      state.permissions = [];
      localStorage.clear("user_permissions");
    }
  },
});
export const { setAuthenticated, clearAuthentication, setPermissions, clearPermissons } = authSlice.actions;
export default authSlice.reducer;
