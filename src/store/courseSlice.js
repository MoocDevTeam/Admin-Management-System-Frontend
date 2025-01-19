import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postRequest from "../request/postRequest";
import getRequest  from "../request/getRequest";

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
        category === "All"
          ? state.courses 
          : state.courses.filter((course) => course.categoryName === category);
    },
  },
});

export const { setCourses, setCourse, filterCourses } = courseSlice.actions;
export default courseSlice.reducer;
