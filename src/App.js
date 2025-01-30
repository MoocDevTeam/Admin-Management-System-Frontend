import React, { useState, useEffect, Suspense } from "react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/dashboard"
import Mainlayout from "./components/mainlayout/index"
import { Toaster } from "react-hot-toast"
import User from "./pages/user/index"
import AddUser from "./pages/user/addUser"
import AddRole from "./pages/role/addRole"
import Page404 from "./pages/page404"
import Role from "./pages/role/index"
import { theme } from "./theme"
import LoginPage from "./pages/login/login"
import UserProfile from "./pages/profile/userProfile"
import getRequest from "./request/getRequest"
import { Lazy } from "yup"
import LoadingSpinner from "./components/loadingSpinner"
import { useSelector } from "react-redux"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import lazyLoad from "./components/util/lazyLoad"
function App() {
  const [menus, setMenus] = useState([])
  const [routes, setRoutes] = useState([])
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  let baseUrl = process.env.REACT_APP_BASE_API_URL

  useEffect(() => {
    if (!isAuthenticated) return
    async function getMenu() {
      const res = await getRequest(`${baseUrl}/api/menu/GetMenuTree`)
      if (res.isSuccess) {
        setMenus(res.data)
        console.log("res.data is:", res.data)
        let routerMenuData = []
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].children.length > 0) {
            for (let j = 0; j < res.data[i].children.length; j++) {
              if (res.data[i].children[j].menuType === 2) {
                routerMenuData.push(res.data[i].children[j])
              }
            }
          }
        }
        console.log("routerMenuData is:", routerMenuData)

        const dynamicRoutes = routerMenuData.map((item) => {
          return (
            <Route
              key={item.id}
              path={item.route}
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ProtectedRoute>
                    {lazyLoad(item.componentPath)}
                  </ProtectedRoute>
                </Suspense>
              }
            />
          )
        })
        console.log("dynamicRoutes: ", dynamicRoutes)
        setRoutes(dynamicRoutes)
      }
    }
    getMenu()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster />
      <Routes>
        <Route Key="login" path="/login" element={<LoginPage />} />
        <Route key="home" path="/" element={<Mainlayout />}>
          <Route key="dashboard" path="/" element={<Dashboard />} />
          <Route key="user" path="/user" element={<User />} />
          <Route key="role" path="/role" element={<Role />} />
          <Route key="addUser" path="/user/add" element={<AddUser />} />
          <Route key="addUser" path="/role/add" element={<AddRole />} />
          <Route key="profile" path="/profile" element={<UserProfile />} />
          <Route key="page404" path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App
