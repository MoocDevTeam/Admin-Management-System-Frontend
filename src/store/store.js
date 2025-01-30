import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../feature/userSlice/userSlice"
import authReducer from "../feature/authSlice/authSlice"
const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
  },
})

export default store
