import React, { useState, useEffect, Suspense } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Mainlayout from "./components/mainlayout/index";
import { Toaster } from "react-hot-toast";
import User from "./pages/user/index";
import AddUser from "./pages/user/addUser";
import AddRole from "./pages/role/addRole";
import Role from "./pages/role/index";
import Teacher from "./pages/teacher/index";
import CourseList from "./pages/course/course/courseList/index";
import CourseSingle from "./pages/course/course/courseSingle/index";
import CourseInstanceSingle from "./pages/course/course/courseInstanceSingle";
import CategoryTree from "./pages/course/category/categoryTree";
import CourseLaunch from "./pages/course/courseLaunch/index";
import Page404 from "./pages/page404";
import { theme } from "./theme";
import LoginPage from "./pages/login/login";
import UserProfile from "./pages/profile/userProfile";
import getRequest from "./request/getRequest";
import Questions from "./pages/exam/questions";
import Exams from "./pages/exam/exams";
import ExamPublish from "./pages/exam/publish";
import AddTeacher from "./pages/teacher/addTeacher";
import LoadingSpinner from "./components/loadingSpinner";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { lazy } from "react";

function LazyLoad(componentPath) {
  const Module = lazy(() => import(`${componentPath}`));
  return Module;
}

function App() {
  const [menus, setMenus] = useState([]);
  const [routes, setRoutes] = useState([]);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function getMenu() {
      const res = await getRequest("menu/GetMenuTree");
      if (res.isSuccess) {
        setMenus(res.data);
        console.log("res.data is:", res.data);
        let routerMenuData = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].children.length > 0) {
            for (let j = 0; j < res.data[i].children.length; j++) {
              if (res.data[i].children[j].menuType === 2) {
                routerMenuData.push(res.data[i].children[j]);
              }
            }
          }
        }
        console.log("routerMenuData is:", routerMenuData);

        const dynamicRoutes = routerMenuData.map((item) => {
          return (
            <Route
              key={item.id}
              path={item.route}
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ProtectedRoute>{LazyLoad(item.componentPath)}</ProtectedRoute>
                </Suspense>
              }
            />
          );
        });
        console.log("dynamicRoutes: ", dynamicRoutes);
        setRoutes(dynamicRoutes);
      }
    }
    getMenu();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster />
      <Routes>
        <Route key="login" path="/login" element={<LoginPage />} />
        <Route key="home" path="/" element={<Mainlayout />}>
          <Route key="dashboard" path="/" element={<Dashboard />} />
          <Route key="user" path="/user" element={<User />} />
          <Route key="role" path="/role" element={<Role />} />
          <Route key="addUser" path="/user/add" element={<AddUser />} />
          <Route key="addRole" path="/role/add" element={<AddRole />} />
          <Route key="profile" path="/profile" element={<UserProfile />} />
          <Route key="courseList" path="/course" element={<CourseList />} />
          <Route key="category" path="/course/category" element={<CategoryTree />} />
          <Route key="courseLaunch" path="/course/courseLaunch" element={<CourseLaunch />} />
          <Route key="courseSingle" path="/course/:courseId" element={<CourseSingle />} />
          <Route key="category" path="/course/category" element={<CategoryTree />} />
          <Route key="courseLaunch" path="/course/courseLaunch" element={<CourseLaunch />} />
          <Route key="courseSingle" path="/course/:courseId" element={<CourseSingle />} />
          <Route
            key="courseInstanceSingle"
            path="/course/:courseId/CourseInstance/:courseInstanceId"
            element={<CourseInstanceSingle />}
          />

          {/* Route for teacher */}
          <Route key="teacher" path="/user/teacher" element={<Teacher />} />
          <Route key="teacher" path="/teacher" element={<Teacher />} />
          <Route key="addTeacher" path="/teacher/add" element={<AddTeacher />} />

          {/* Exam-related routes */}
          <Route key="questions" path="/exam/questions" element={<Questions />} />
          <Route key="exams" path="/exam/exams" element={<Exams />} />
          <Route key="publish" path="/exam/publish" element={<ExamPublish />} />

          <Route key="page404" path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
