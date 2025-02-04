import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserByName } from "../../feature/userSlice/userSlice";
// import getUserProfile from './getUserProfile';
import { Container, Typography, Box, TextField, Alert } from "@mui/material";
import LoadingSpinner from "../../components/loadingSpinner";
import { getGenderName } from "../../components/util/gender";

export default function UserProfile() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.user);

  const userName = localStorage.getItem("userName"); // Get the username from localStorage

  useEffect(() => {
    if (userName) {
      dispatch(fetchUserByName(userName));
    }
  }, [dispatch, userName]);

  return (
    <Container>
      <Typography variant="h4" sx={{ m: "0 0 24px 0" }}>
        User Profile
      </Typography>
      {status === "loading" && <LoadingSpinner />}
      {status === "failed" && (
        <Alert severity="error">{error || "Failed to load user data"}</Alert>
      )}
      {status === "succeeded" && (
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2, // Spacing between elements
          }}
        >
          <TextField
            fullWidth
            label="Username"
            value={user.userName || ""}
            inputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth
            label="Age"
            value={user.age || ""}
            inputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth
            label="Email"
            value={user.email || ""}
            inputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth
            label="Gender"
            value={getGenderName(user.gender) || ""}
            inputProps={{ readOnly: true }}
          />
        </Box>
      )}
    </Container>
  );
}
