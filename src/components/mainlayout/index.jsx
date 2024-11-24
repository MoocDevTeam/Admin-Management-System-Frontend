import React, { useEffect } from "react";
import MainSidebar from "./mainSidebar";
import Topbar from "./topbar";
import { Outlet } from "react-router-dom";
export default function Mainlayout() {

  return (
    <div className="app">
      <MainSidebar />
      <main className="content">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
}
