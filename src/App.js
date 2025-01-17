import React, { useState, useEffect, Suspense } from "react"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/dashboard"
import Mainlayout from "./components/mainlayout/index"
import { Toaster } from "react-hot-toast"
import User from "./pages/user/index"
import AddUser from "./pages/user/addUser"
import Page404 from "./pages/page404"
import Role from "./pages/role/index"
import { theme } from "./theme"
import LoginPage from "./pages/login/login"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster />
      <Routes>
        <Route key="home" path="/" element={<Mainlayout />}>
          <Route key="dashboard" path="/" element={<Dashboard />} />
          <Route key="user" path="/user" element={<User />} />
          <Route key="role" path="/role" element={<Role />} />
          <Route key="addUser" path="/user/add" element={<AddUser />} />
          <Route key="page404" path="*" element={<Page404 />} />
          <Route Key="login" path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App
