import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import courseReducer from './courseSlice';
import categoryReducer from './categorySlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    course: courseReducer,
    category: categoryReducer,
  },
});

export default store;
