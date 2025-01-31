import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../feature/userSlice/userSlice"
import authReducer from "../feature/authSlice/authSlice"
import courseReducer from "../feature/courseSlice/courseSlice"
const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    course: courseReducer,
  },
})

export default store
