import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../pages/user/userSlice"
import authReducer from "../auth/authSlice"
const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
  },
})

export default store
