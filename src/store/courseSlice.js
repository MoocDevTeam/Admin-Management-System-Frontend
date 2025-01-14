import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courses: [], 
  filteredCourses: [], 
  course: null, 
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload; 
      state.filteredCourses = action.payload;
    },
    setCourse: (state, action) => {
      state.course = action.payload; 
    },
    filterCourses: (state, action) => {
      const category = action.payload;
      state.filteredCourses =
        category === "all"
          ? state.courses 
          : state.courses.filter((course) => course.categoryName === category);
    },
  },
});

export const { setCourses, setCourse, filterCourses } = courseSlice.actions;
export default courseSlice.reducer;
