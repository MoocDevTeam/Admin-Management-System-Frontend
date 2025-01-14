import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courses: [],  
  course: null,  
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload; 
    },
    setCourse: (state, action) => {
      state.course = action.payload; 
    },
  },
});

export const { setCourses, setCourse } = courseSlice.actions;
export default courseSlice.reducer;
