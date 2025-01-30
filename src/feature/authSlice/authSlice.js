import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isAuthenticated: false,
  token: null,
  status: "idle",
  error: null,
}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state) => {
      state.isAuthenticated = true
      console.log("setAuthenticated is:", state.isAuthenticated)
    },
    clearAuthentication: (state) => {
      state.isAuthenticated = false
      console.log("setAuthenticated in clear is:", state.isAuthenticated)
    },
  },
})
export const { setAuthenticated, clearAuthentication } = authSlice.actions
export default authSlice.reducer
