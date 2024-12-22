import React, { useState, useEffect, Suspense } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Mainlayout from "./components/mainlayout/index";
import { Toaster } from "react-hot-toast";

import Test from "./pages/test/index";
import AddTest from "./pages/test/addTest";
import Page404 from "./pages/page404";

import { theme } from "./theme";

function App() {

  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster />
      <Routes>
        <Route key="home" path="/" element={<Mainlayout />}>
          <Route
            key="dashboard"
            path="/"
            element={

              <Dashboard />

            }
          />
          <Route
            key="test"
            path="/test"
            element={

              <Test />

            }
          />

          <Route
            key="addTest"
            path="/test/add"
            element={
              <AddTest />
            }
          />

          <Route key="page404" path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
