import React from "react"
import { useState, useEffect } from "react"
import { Alert, Box, IconButton, Typography } from "@mui/material"
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"
import MenuOpen from "@mui/icons-material/MenuOpen"
import colors from "../../theme"
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { fetchUserByName } from "../../feature/userSlice/userSlice"
import LoadingSpinner from "../loadingSpinner"
import { getAccessName } from "../util/access"
import QuizIcon from "@mui/icons-material/Quiz"
import AssignmentIcon from "@mui/icons-material/Assignment"
import ListAltIcon from "@mui/icons-material/ListAlt"
import PublishIcon from "@mui/icons-material/Publish"
import CastForEducationIcon from "@mui/icons-material/CastForEducation"
import AutoStoriesIcon from "@mui/icons-material/AutoStories"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import CategoryIcon from "@mui/icons-material/Category"
import SchoolIcon from "@mui/icons-material/School"

export default function MainSidebar({ userName }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const dispatch = useDispatch()
  const { user, status, error } = useSelector((state) => state.user)

  useEffect(() => {
    if (userName) {
      dispatch(fetchUserByName(userName))
    }
  }, [dispatch, userName])

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
                <Typography color={colors.grey[100]}>
                  {user ? getAccessName(user.access) : ""}
                </Typography>
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

              {status === "loading" && <LoadingSpinner />}
              {status === "failed" && (
                <Alert severity="error">
                  {error || "Failed to load user data"}
                </Alert>
              )}
              {status === "succeeded" && (
                <Box textAlign="center">
                  <Typography
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    {user.userName || "n/a"}
                  </Typography>
                  <Typography color={colors.greenAccent[500]}>
                    {user.email || "n/a"}
                  </Typography>
                </Box>
              )}
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
            <MenuItem
              icon={<CastForEducationIcon />}
              component={<Link />}
              to="user/teacher"
            >
              Teacher
            </MenuItem>
          </SubMenu>

          <SubMenu icon={<AutoStoriesIcon />} label="Course Management">
            <MenuItem
              icon={<MenuBookIcon />}
              component={<Link />}
              to="course"
            >
              Courses
            </MenuItem>
            <MenuItem
              icon={<CategoryIcon />}
              component={<Link />}
              to="/course/category"
            >
              Categories
            </MenuItem>
            <MenuItem
              icon={<SchoolIcon />}
              component={<Link />}
              to="/course/courseLaunch"
            >
              Course Launch
            </MenuItem>
          </SubMenu>

          <SubMenu icon={<QuizIcon />} label="Exam Management">
            <MenuItem
              icon={<AssignmentIcon />}
              component={<Link />}
              to="/exam/questions"
            >
              Questions
            </MenuItem>
            <MenuItem
              icon={<ListAltIcon />}
              component={<Link />}
              to="/exam/exams"
            >
              Exams
            </MenuItem>
            <MenuItem
              icon={<PublishIcon />}
              component={<Link />}
              to="/exam/publish"
            >
              Publish
            </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </Box>
  )
}
