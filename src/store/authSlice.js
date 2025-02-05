import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
  status: "idle",
  error: null,
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
  },
});
export const { setAuthenticated, clearAuthentication } = authSlice.actions;
export default authSlice.reducer;
