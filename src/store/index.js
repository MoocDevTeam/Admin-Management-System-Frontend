import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import courseReducer from "./courseSlice";
import categoryReducer from "./categorySlice";
import roleReducer from "./roleSlice";
import authReducer from "./authSlice";
import avatarReducer from "./avatarSlice";
import permissionSlice from "./permissionSlice";


const store = configureStore({
  reducer: {
    user: userReducer,
    course: courseReducer,
    category: categoryReducer,
    role: roleReducer,
    auth: authReducer,
    avatar: avatarReducer,
    permission: permissionSlice.reducer,
  },
});

export default store;
