import React, { useState } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Avatar,
  CssBaseline,
} from "@mui/material"
//import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { useNavigate } from "react-router-dom"
import postRequest from "../../request/postRequest"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons"
const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" })
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Form Data:", formData)
    let res = await postRequest(
      "http://localhost:9000/api/Auth/login",
      formData
    )
    localStorage.setItem("access_token", res.token);
    localStorage.setItem("userName", formData.username);
    navigate("/");
  }

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "3rem",
            fontWeight: "bold",
            color: "#B771E5",
          }}
          component="h1"
          variant="h1"
        >
          MOOC Administration System
        </Typography>
      </Box>
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ size: "5rem", m: 1, bgcolor: "#AEEA94" }}>
          {/* <LockOutlinedIcon /> */}
          <FontAwesomeIcon icon={faGraduationCap} size="lg" />
        </Avatar>
        <Typography sx={{ fontSize: "2rem" }} component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              fontSize: "1.5rem",
              mt: 3,
              mb: 2,
              backgroundColor: "#4635B1",
              ":hover": { backgroundColor: "#FFFBCA", color: "#000" },
            }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default LoginPage
