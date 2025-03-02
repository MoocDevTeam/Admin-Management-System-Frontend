import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  ListItemText,
  Checkbox,
  OutlinedInput,
} from "@mui/material";
import toast from "react-hot-toast";

// Your custom request helpers (adjust paths as needed)
import postRequest from "../../request/postRequest";
import getRequest from "../../request/getRequest";

// Example theme import (adjust if needed)
import { theme } from "../../theme";

export const UpdateUser = ({ open, onClose, data, onUserUpdated }) => {
  const [roles, setRoles] = useState([]);

  // 1) Formik Setup
  const formik = useFormik({
    initialValues: {
      id: data?.id || "",
      userName: data?.userName || "",
      email: data?.email || "",
      address: data?.address || "",
      age: data?.age || 0,
      gender: data?.gender ?? 0,
      // Store the array of selected role IDs in Formik's state
      roles: data?.roleIds || [], 
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("username is required"),
      email: Yup.string().email("invalid email").required("email is required"),
      address: Yup.string().max(100, "max 100 characters"),
      age: Yup.number()
        .min(0, "min age is 0")
        .max(120, "max age is 120")
        .required("age is required"),
      gender: Yup.number().oneOf([0, 1, 2]).required("gender is required"),

      // 2) Validate roles: array of numbers, at least one item
      roles: Yup.array()
        .of(Yup.number())
        .min(1, "Please select at least one role"),
    }),
    onSubmit: async (values) => {
      console.log("values", values);

      // 3) Build payload using formik.values.roles
      const payload = {
        id: values.id,
        userName: values.userName,
        email: values.email,
        address: values.address,
        gender: values.gender,
        age: values.age,
        roleIds: values.roles, // formik holds the selected role IDs
      };

      console.log("Update payload:", payload);

      const result = await postRequest("/User/Update", payload);
      if (result.isSuccess) {
        toast.success("user updated successfully");
        onUserUpdated({ ...values });
        formik.resetForm();
      } else {
        toast.error(result.message || "failed to update user");
      }
    },
  });

  // 4) Handle multiple-select for roles
  const handleChangeRole = (event) => {
    const { value } = event.target;
    // On autofill we get a stringified value, so split if it's a string
    formik.setFieldValue(
      "roles",
      typeof value === "string" ? value.split(",") : value
    );
  };

  // 5) On component mount or when `data.id` changes, fetch roles & user details
  useEffect(() => {
    if (data.id) {
      const getRolesList = async () => {
        let result = await getRequest("/role/GetbyPage?page=1&pageSize=9999999");
        if (result.isSuccess) {
          setRoles(result.data.items);
        }
      };

      const getUserById = async () => {
        let result = await getRequest(`user/GetUserById/${data.id}`);
        if (result.isSuccess) {
          let user = result.data;
          formik.setValues({
            id: user.id || "",
            userName: user.userName || "",
            email: user.email || "",
            address: user.address || "",
            gender: user.gender ?? 0,
            age: user.age || 0,
            roles: user.roleIds || [], // Update roles in Formik
          });
        }
      };

      getRolesList().then(() => {
        getUserById();
      });
    }
  }, [data.id]);

  // 6) UI for roles multiple-select
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const renderValueRole = (valueArray) => {
    return roles
      .filter((roleItem) => valueArray.includes(roleItem.id))
      .map((x) => x.roleName)
      .join(", ");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        fontSize={"1.5rem"}
        color="white"
        sx={{ bgcolor: theme.palette.secondary.main }}
      >
        Update User
      </DialogTitle>
      <Box m="20px">
        {/* 7) Bind formik's handleSubmit */}
        <form onSubmit={formik.handleSubmit}>
          <Box
            mb={"40px"}
            display={"grid"}
            gap={"30px"}
            gridTemplateColumns="repeat(4,minmax(0, 1fr))"
          >
            {/* USERNAME */}
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="USERNAME"
              name="userName"
              onChange={formik.handleChange}
              autoComplete="off"
              autoFocus
              value={formik.values.userName}
              error={formik.touched.userName && Boolean(formik.errors.userName)}
              helperText={formik.touched.userName && formik.errors.userName}
              sx={{ gridColumn: "span 4" }}
            />

            {/* EMAIL */}
            <TextField
              fullWidth
              variant="filled"
              type="email"
              label="EMAIL"
              name="email"
              onChange={formik.handleChange}
              autoComplete="off"
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ gridColumn: "span 4" }}
            />

            {/* ADDRESS */}
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="ADDRESS"
              name="address"
              onChange={formik.handleChange}
              autoComplete="off"
              value={formik.values.address}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              sx={{ gridColumn: "span 4" }}
            />

            {/* AGE */}
            <TextField
              fullWidth
              variant="filled"
              type="number"
              label="AGE"
              name="age"
              value={formik.values.age}
              onChange={formik.handleChange}
              error={formik.touched.age && Boolean(formik.errors.age)}
              helperText={formik.touched.age && formik.errors.age}
              sx={{ gridColumn: "span 2" }}
            />

            {/* ROLES Multiple Select */}
            <FormControl sx={{ gridColumn: "span 2" }}>
              <InputLabel>Roles</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                name="roles" // Not strictly necessary if we use handleChangeRole
                value={formik.values.roles}
                onChange={handleChangeRole}
                input={<OutlinedInput label="Roles" />}
                renderValue={renderValueRole}
                MenuProps={MenuProps}
                error={formik.touched.roles && Boolean(formik.errors.roles)}
              >
                {roles.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    <Checkbox checked={formik.values.roles.includes(item.id)} />
                    <ListItemText primary={item.roleName} />
                  </MenuItem>
                ))}
              </Select>
              {/* Display roles validation error if any */}
              {formik.touched.roles && formik.errors.roles && (
                <Box sx={{ color: "red", fontSize: 12, mt: 1 }}>
                  {formik.errors.roles}
                </Box>
              )}
            </FormControl>

            {/* GENDER */}
            <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
              <InputLabel>GENDER</InputLabel>
              <Select
                name="gender"
                label="GENDER"
                value={formik.values.gender}
                onChange={formik.handleChange}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
              >
                <MenuItem value={0}>Other</MenuItem>
                <MenuItem value={1}>Male</MenuItem>
                <MenuItem value={2}>Female</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
            <Button variant="contained" type="submit" color="primary">
              UPDATE
            </Button>
            <Button variant="contained" color="secondary" onClick={onClose}>
              CANCEL
            </Button>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
};