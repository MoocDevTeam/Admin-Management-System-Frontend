import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../feature/userSlice/userSlice";
import authReducer from "../feature/authSlice/authSlice";
import courseReducer from "../feature/courseSlice/courseSlice";
import roleReducer from "../feature/roleSlice/roleSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    course: courseReducer,
    role: roleReducer,
  },
});

export default store;
