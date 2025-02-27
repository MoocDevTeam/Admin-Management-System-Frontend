import React from "react"
import MainSidebar from "./mainSidebar"
import Topbar from "./topbar"
import { Outlet } from "react-router-dom"
export default function Mainlayout() {
  const userName = localStorage.getItem("userName")

  return (
    <div className="app">
      <MainSidebar userName={userName} />
      <main className="content">
        <Topbar />
        <Outlet />
      </main>
    </div>
  )
}
