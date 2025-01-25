import React, { useState, useEffect, Suspense } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Mainlayout from "./components/mainlayout/index";
import { Toaster } from "react-hot-toast";
// import User from "./pages/user/index";
// import AddUser from "./pages/user/addUser";
import Role from "./pages/role/index";
import Teacher from "./pages/user/teacher/index";
import CourseList from "./pages/course/course/courseList/index";
import CourseSingle from "./pages/course/course/courseSingle/index";
import CourseInstanceSingle from "./pages/course/course/courseInstanceSingle";
import Category from "./pages/course/category/index";
import CourseLaunch from "./pages/course/courseLaunch/index";
import Page404 from "./pages/page404";
import { theme } from "./theme";
import LoginPage from "./pages/login/login";
import UserProfile from "./pages/profile/userProfile";
import Questions from "./pages/exam/questions";
import Exams from "./pages/exam/exams";
import ExamPublish from "./pages/exam/publish";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster />
      <Routes>
        <Route Key="login" path="/login" element={<LoginPage />} />
        <Route key="home" path="/" element={<Mainlayout />}>
          <Route key="dashboard" path="/" element={<Dashboard />} />
          
          <Route key="role" path="/role" element={<Role />} />
          
          <Route key="profile" path="/profile" element={<UserProfile />} />
          <Route key="courseList" path="/course" element={<CourseList />} />

          <Route
            key="category"
            path="/course/category"
            element={<Category />}
          />

          <Route
            key="courseLaunch"
            path="/course/courseLaunch"
            element={<CourseLaunch />}
          />

          <Route
            key="courseSingle"
            path="/course/:courseId"
            element={<CourseSingle />}
          />

          <Route
            key="courseInstanceSingle"
            path="/course/:courseId/CourseInstance/:courseInstanceId"
            element={<CourseInstanceSingle />}
          />

          <Route
            key="teacher"
            path="/user/teacher"
            element={
              <Teacher />
            }
          />

          <Route
            key="questions"
            path="/exam/questions"
            element={<Questions />}
          />

          <Route
            key="exams"
            path="/exam/exams"
            element={<Exams />}
          />

          <Route
            key="publish"
            path="/exam/publish"
            element={<ExamPublish />}
          />

          <Route key="page404" path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App
