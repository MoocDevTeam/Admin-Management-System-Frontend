import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserByName, updateUser } from "../../store/userSlice";
import {
  Container,
  Typography,
  Box,
  TextField,
  Alert,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Avatar,
  Stack
} from "@mui/material";
import LoadingSpinner from "../../components/loadingSpinner";
import { getGenderName } from "../../components/util/gender";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import post from "../../request/postRequest";
import del from "../../request/delRequest";

export default function UserProfile() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.user);
  const [isEditMode, setIsEditMode] = useState(false);
  const userName = localStorage.getItem("userName") || user?.userName;
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  

  const validationSchema = Yup.object({
    age: Yup.number()
      .required("Age is required")
      .min(1, "Age must be at least 1")
      .max(120, "Age must be at most 120"),
    gender: Yup.number().required("Gender is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
    address: Yup.string().max(100, "max 100 characters"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      age: user.age || "",
      gender: user.gender || "",
      email: user.email || "",
      address: user.address || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        id: user.id,
        userName: user.userName,
        password: user.password,
        access: user.access,
        isActive: user.isActive,
        roleIds: user.roleIds || [],
        createdDate: user.createdDate,
        avatar: user.avatar || null,
        age: values.age,
        gender: values.gender,
        email: values.email,
        address: values.address
      };
      const resultAction = await dispatch(updateUser(payload));
      if(updateUser.fulfilled.match(resultAction)){
        toast.success("user updated successfully");
        setIsEditMode(false);
      }else{
        toast.error("failed to update user");
      }
      
    },
  });

  useEffect(() => {
    if (userName) {
      dispatch(fetchUserByName(userName));
    }
  }, [dispatch, userName]);

  useEffect(() => {
    setAvatarUrl(user.avatar || "");
  }, [user]);

  const handleFileChange = (e) => {
    if(e.target.value && e.target.files[0]){
      setSelectedFile(e.target.files[0]);
    }
  };
  

  const handleUploadAvatar = async() => {
    if(!selectedFile || !userName) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    try{
      const res = await post(`/Avatar/UploadAvatar/${userName}`, formData, setLoading, {
        headers: {"Content-Type": "multipart/form-data"},
      });
      if (res && res.avatarUrl){
        setAvatarUrl(res.avatarUrl);
        toast.success("avatar uploaded successfully")
      }else{
        toast.error("avatar upload failed");
      }
    }catch(err){
      console.error("error uploading avatar:", err);
      toast.error("error uploading avatar:" + err.message);
    }

  };

  const handleDeleteAvatar = async () => {
    if(!userName) return;
    try{
      const res = del(`/Avatar/DeleteAvatar/${userName}`);
      if(res){
        toast.success("Avatar deleted successfully!");
        setAvatarUrl("");

      }
    }catch(err){
      console.error("Error deleting avatar:", err);
      toast.error("Error deleting avatar: " + err.message);
    }
  }

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
        <>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                src={ user.avatar|| ""}
                alt="User Avatar"
                sx={{ width: 80, height: 80, cursor:"pointer"}}
              
              />
              {/* Upload / Delete Buttons */}
              {isEditMode && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUploadAvatar}
                  >
                    Upload Avatar
                  </Button>
                  {avatarUrl && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleDeleteAvatar}
                    >
                      Delete Avatar
                    </Button>
                  )}
                </>
              )}
            </Stack>
            <TextField
              fullWidth
              label="Username"
              value={user.userName || ""}
              disabled={true}
            />

            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={formik.values.age}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.age && Boolean(formik.errors.age)}
              helperText={formik.touched.age && formik.errors.age}
              disabled={!isEditMode}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              disabled={!isEditMode}
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              type="string"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              disable={!isEditMode}
            />
            <FormControl
              fullWidth
              required
              disabled={!isEditMode}
              error={formik.touched.gender && Boolean(formik.errors.gender)}
            >
              <InputLabel id="gender-select-label">Gender</InputLabel>
              <Select
                labelId="gender-select-label"
                label="Gender"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value={0}>{getGenderName(0)}</MenuItem>
                <MenuItem value={1}>{getGenderName(1)}</MenuItem>
                <MenuItem value={2}>{getGenderName(2)}</MenuItem>
              </Select>
              {formik.touched.gender && formik.errors.gender && (
                <FormHelperText>{formik.errors.gender}</FormHelperText>
              )}
            </FormControl>

            {isEditMode && (
              <Button
                color="primary"
                variant="contained"
                sx={{ m: "24px 0 0 0" }}
                type="submit"
              >
                Save
              </Button>
            )}
          </Box>

          {!isEditMode && (
            <Button
              color="secondary"
              variant="contained"
              sx={{ m: "24px 0 0 0" }}
              onClick={() => {
                setIsEditMode(true);
              }}
            >
              Edit
            </Button>
          )}
        </>
      )}
    </Container>
  );
}
