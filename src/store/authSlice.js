import { createSlice } from "@reduxjs/toolkit";
import { closeModal } from "./categorySlice";

const initialState = {
  isAuthenticated: false,
  token: null,
  status: "idle",
  error: null,
  menuItems: [],
  routeMenuData: [],
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
    setRouteMenuData: (state, action) => {
      state.routeMenuData = action.payload;
    },
  },
});
export const {
  setAuthenticated,
  clearAuthentication,
  setMenuItems,
  setRouteMenuData,
} = authSlice.actions;
export default authSlice.reducer;
