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
    },
  },
});

export const { setCourses, setCourse, filterCourses } = courseSlice.actions;
export default courseSlice.reducer;
