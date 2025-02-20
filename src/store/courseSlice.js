import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getRequest from "../request/getRequest";

const initialState = {
  courses: [],
  filteredCourses: [],
  course: null,
};

export const fetchCourses = createAsyncThunk("course/fetchCourses", async () => {
  const response = await getRequest("/MoocCourse/getall");
  return response.data;
});

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
        category === "All" ? state.courses : state.courses.filter((course) => course.categoryName === category);
    },
  },
  //extraReducers Handle asynchronous actions (fetchCourses)
  extraReducers: (builder) => {
    builder.addCase(fetchCourses.fulfilled, (state, action) => {
      state.courses = action.payload;
    });
  },
});

export const { setCourses, setCourse, filterCourses } = courseSlice.actions;
export default courseSlice.reducer;
