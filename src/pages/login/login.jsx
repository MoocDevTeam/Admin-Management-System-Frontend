import React, { useState } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Avatar,
  CssBaseline,
  CircularProgress,
  Paper,
  FormControlLabel,
  Grid,
  Link,
  Checkbox,
  IconButton,
} from "@mui/material"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import postRequest from "../../request/postRequest"

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const loginValidationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required!")
      .min(4, "Password must be at least 4 characters long"),
    password: Yup.string()
      .required("Password is required!")
      .min(6, "Password must be at least 6 characters long"),
  })

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
    loginValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        const res = await postRequest("http://localhost:9000/api/Auth/login", {
          username: values.username,
          password: values.password,
        })
        if (res && res.isSuccess === true) {
          localStorage.setItem("access_token", res.message)
          localStorage.setItem("userName", values.username)
          navigate("/")
        } else {
          formik.setFieldError("username", "Invalid username or password")
        }
      } catch (error) {
        console.error("Login error:", error)
        formik.setFieldError("username", "An error occurred. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container component="main" maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            marginTop: 8,
            padding: 1,
            backgroundColor: "#fff",
            borderRadius: 10,
            background: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 10,
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
              marginBottom: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ mx: "auto", size: "5rem", m: 1, bgcolor: "#AEEA94" }}>
              <FontAwesomeIcon icon={faGraduationCap} size="lg" />
            </Avatar>
            <Typography sx={{ fontSize: "2rem" }} component="h1" variant="h5">
              Sign In
            </Typography>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              noValidate
              sx={{ mt: 1, mx: "auto", px: 16 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                placeholder="Enter your username"
                id="username"
                name="username"
                autoComplete="off"
                autoFocus
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={
                  formik.touched.username && formik.errors.username
                    ? "wrong username" + formik.errors.username
                    : ""
                }
                InputProps={{
                  sx: {
                    marginBottom: 2,
                    borderRadius: 5,
                    border: "2px solid #000",
                    input: {
                      color: "#FFFBCA",
                      fontSize: "2rem",
                      "&::placeholder": {
                        fontSize: "2rem",
                        color: "#FFFBCA",
                        fontWeight: "bold",
                      },
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                placeholder="Enter your password"
                name="password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="on"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={
                  formik.touched.password && formik.errors.password
                    ? "wrong password" + formik.errors.password
                    : ""
                }
                InputProps={{
                  sx: {
                    borderRadius: 5,
                    marginBottom: 2,
                    border: "2px solid #000",
                    input: {
                      color: "#FFFBCA",
                      fontSize: "2rem",
                      "&::placeholder": {
                        fontSize: "2rem",
                        color: "#FFFBCA",
                        fontWeight: "bold",
                      },
                    },
                  },
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      "&.MuiSvgIcon-root": { fontSize: 32, color: "#000" },
                      "&.Mui-checked": { color: "#FFFBCA" },
                    }}
                    name="rememberMe"
                    checked={formik.values.rememberMe}
                    onChange={formik.handleChange}
                    color="default"
                  />
                }
                label="Remember me"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    color: "#FFFBCA",
                    fontSize: "1rem",
                    fontWeight: "bold",
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  fontSize: "1.5rem",
                  color: "#FFFBCA",
                  mt: 3,
                  mb: 2,
                  borderRadius: 5,
                  backgroundColor: "#4635B1",
                  "&:hover": isLoading
                    ? { backgroundColor: "#ccc", color: "#000" }
                    : { backgroundColor: "#FFFBCA", color: "#4635B1" },
                }}
              >
                {isLoading ? (
                  <CircularProgress size="3rem" sx={{ color: "#4635B1" }} />
                ) : (
                  "Sign In"
                )}
              </Button>
              <Grid
                container
                justifyContent="space-between"
                sx={{ mt: 1, fontSize: "1rem" }}
              >
                <Grid item>
                  <Link
                    sx={{ textDecoration: "none" }}
                    component={RouterLink}
                    to="/forgot"
                  >
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        color: "#FFFBCA",
                        fontWeight: "bold",
                        mb: 2,
                        textAlign: "center",
                      }}
                      component="h1"
                      variant="h5"
                    >
                      Forgot Password ?
                    </Typography>
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    sx={{ textDecoration: "none" }}
                    component={RouterLink}
                    to="/register"
                  >
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        color: "#FFFBCA",
                        fontWeight: "bold",
                        mb: 2,
                        textAlign: "center",
                        textDecoration: "none",
                      }}
                      component="h1"
                      variant="h5"
                    >
                      Sign Up
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
