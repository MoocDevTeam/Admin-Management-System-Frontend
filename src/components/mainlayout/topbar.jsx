import React, { useState } from "react"
import { Box, IconButton, Menu, MenuItem } from "@mui/material"
import colors from "../../theme"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { clearAuthentication } from "../../auth/authSlice"
export default function Topbar() {
  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfileNavigate = () => {
    navigate("/profile") // Navigate to the UserProfile page
  }

  const handleProfileClick = () => {
    console.log("Profile clicked") //should open profile route
    handleMenuClose()
    handleProfileNavigate()
  }

  const handleLogoutClick = () => {
    console.log("Logout clicked") // should clear JWT token
    handleMenuClose()
    localStorage.removeItem("access_token") // Remove token from localStorage
    localStorage.removeItem("userName") // Remove username from localStorage
    dispatch(clearAuthentication())
    navigate("/login") // Navigate to login page
  }

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      ></Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton>
          <LightModeOutlinedIcon />
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleMenuOpen}>
          <PersonOutlinedIcon />
        </IconButton>

        {/* Dropdown menu */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}
