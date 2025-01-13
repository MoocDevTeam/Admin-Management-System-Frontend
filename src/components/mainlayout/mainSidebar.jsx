import React from "react"
import { useState } from "react"
import { Box, IconButton, Typography } from "@mui/material"
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"
import MenuOpen from "@mui/icons-material/MenuOpen"
import colors from "../../theme"
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined"

import { Link } from "react-router-dom"

export default function MainSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Box>
      <Sidebar collapsed={isCollapsed}>
        <Menu style={{ height: "99vh" }}>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOpen /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography color={colors.grey[100]}>ADMINIS</Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                ></Typography>
                <Typography color={colors.greenAccent[500]}></Typography>
              </Box>
            </Box>
          )}

          <SubMenu icon={<PeopleOutlinedIcon />} label="People Management">
            <MenuItem
              icon={<PeopleOutlinedIcon />}
              component={<Link />}
              to="user"
            >
              User
            </MenuItem>
            <MenuItem
              icon={<PeopleOutlinedIcon />}
              component={<Link />}
              to="role"
            >
              Role
            </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </Box>
  )
}
