import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './courseSlice';
import categoryReducer from './categorySlice';

const store = configureStore({
  reducer: {
    course: courseReducer,
    category: categoryReducer,
  },
});

export default store;
