import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
  status: "idle",
  error: null,
  menuItems: [],
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state) => {
      state.isAuthenticated = true;
    },
    clearAuthentication: (state) => {
      state.isAuthenticated = false;
    },
    setMenuItems: (state, action) => {
      state.menuItems = action.payload;
    },
  },
});
export const { setAuthenticated, clearAuthentication, setMenuItems } =
  authSlice.actions;
export default authSlice.reducer;
