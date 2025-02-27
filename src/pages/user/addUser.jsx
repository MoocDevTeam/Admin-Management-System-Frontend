import React, { useCallback, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Stack,
  ListItemText,
  Checkbox,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import postRequest from "../../request/postRequest";
import Header from "../../components/header";
import { useState } from "react";
import getRequest from "../../request/getRequest";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const [avatarData, setAvatarData] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectRoles, setSelectRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
    }
  const handleClickShowConfirmPassword = () => {
      setShowConfirmPassword(!showConfirmPassword);
    };
  
  const roleNames = useSelector((state) => state.role.roleNames);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      address: "",
      gender: 0,
      age: 0,
      password: "",
      confirmpassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(30, "Must be 30 characters or less")
        .required("Required"),
      email: Yup.string()
        .max(100, "Must be 30 characters or less")
        .email("pls input correct email format"),
      password: Yup.string()
        .min(6, "Must be 6 characters or more")
        .max(100, "Must be 30 characters or less")
        .required("Required"),
      confirmpassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      let result = await postRequest("/User/Add", {
        username: values.username,
        password: values.password,
        email: values.email,
        address: values.address,
        gender: values.gender,
        age: values.age,
        avatar: avatarData,
        roleIds: selectRoles,
      });
      if (result.isSuccess) {
        toast.success("add success!");
        formik.resetForm();
        navigate("/user", { replace: true });
      } else {
        toast.error(result.message);
      }
    },
  });

  const handleAvatarResult = (result) => {
    setAvatarData(result);
  };
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const handleChangeRole = (event) => {
    const {
      target: { value },
    } = event;
    setSelectRoles(
      //On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const renderValueRole = (valueArray) => {
    return roles
      .filter((x) => valueArray.indexOf(x.id) !== -1)
      .map((x) => x.roleName)
      .join(", ");
    //return roles.map((value) => valueArray.find(x=>x===value.id)).map(x=>x.name).join(', ')
  };

  useEffect(() => {
    if (roleNames.total > 0) {
      setRoles(roleNames.items);
    } else {
      return;
    }
  }, []);

  return (
    <Box m="20px">
      <Header
        title="CREATE USER"
        subtitle="Create a New User Profile"
        url="/user"
        urltitle={"UserList"}
        
      />
      <form onSubmit={formik.handleSubmit}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        >
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="User Name"
            name="username"
            autoComplete="text"
            onChange={formik.handleChange}
            value={formik.values.username}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            autoFocus
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type={showPassword? "text" : "password"}
            label="Password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            autoComplete="current-password"
            autoFocus
            sx={{ gridColumn: "span 4" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                  onClick={handleClickShowPassword}
                  edge="end">
                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth
            variant="filled"
            type={showConfirmPassword? "text" : "password"}
            label="Confirmed Password"
            name="confirmpassword"
            onChange={formik.handleChange}
            value={formik.values.confirmpassword}
            error={
              formik.touched.confirmpassword &&
              Boolean(formik.errors.confirmpassword)
            }
            helperText={
              formik.touched.confirmpassword && formik.errors.confirmpassword
            }
            autoComplete="current-password"
            autoFocus
            sx={{ gridColumn: "span 4" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                  onClick={handleClickShowConfirmPassword}
                  edge="end">
                    {showConfirmPassword ? <VisibilityOff/> : <Visibility/>}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Email"
            name="email"
            autoComplete="text"
            onChange={formik.handleChange}
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            autoFocus
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Address"
            name="address"
            autoComplete="text"
            onChange={formik.handleChange}
            value={formik.values.address}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
            autoFocus
            sx={{ gridColumn: "span 4" }}
          />

          <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
            <InputLabel id="demo-simple-select-label">gender</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="gender"
              value={formik.values.gender}
              label="gender"
              error={formik.touched.gender && Boolean(formik.errors.gender)}
              helperText={formik.touched.gender && formik.errors.gender}
              onChange={formik.handleChange}
            >
              <MenuItem value={1}>Male</MenuItem>
              <MenuItem value={2}>Female</MenuItem>
              <MenuItem value={0}>Other</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ gridColumn: "span 2" }}>
            <InputLabel id="demo-multiple-checkbox-label">Roles</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={selectRoles}
              onChange={handleChangeRole}
              input={<OutlinedInput label="Roles" />}
              renderValue={renderValueRole}
              MenuProps={MenuProps}
            >
              {roles.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  <Checkbox checked={selectRoles.includes(item.id)} />
                  <ListItemText primary={item.roleName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Age"
            name="age"
            autoComplete="text"
            onChange={formik.handleChange}
            value={formik.values.age}
            error={formik.touched.age && Boolean(formik.errors.age)}
            helperText={formik.touched.age && formik.errors.age}
            autoFocus
            sx={{ gridColumn: "span 4" }}
          />
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Stack direction="row" spacing={2}>
            <Button type="submit" color="secondary" variant="contained">
              Create New User
            </Button>
            <Button
              type="cancel"
              color="secondary"
              variant="contained"
              onClick={() => {
                formik.resetForm();
                navigate("/user");
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </form>
    </Box>
  );
}
