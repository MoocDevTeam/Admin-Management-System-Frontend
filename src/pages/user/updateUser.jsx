import { useFormik } from "formik";
import React from "react";
import { useEffect } from "react";
import * as Yup from "yup";
import colors, { theme } from "../../theme";
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
} from "@mui/material";
import postRequest from "../../request/postRequest";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const UpdateUser = ({ open, onClose, data, onUserUpdated }) => {
  const formik = useFormik({
    initialValues: {
      id: data?.id || "",
      userName: data?.userName || "",
      email: data?.email || "",
      address: data?.address || "",
      age: data?.age || 0,
      gender: data?.gender ?? 0,
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
    }),
    onSubmit: async (values) => {
      console.log("values", values);
      const payload = {
        id: values.id,
        userName: values.userName,
        email: values.email,
        address: values.address,
        gender: values.gender,
        age: values.age,
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
  // If data changes while dialog is open, update form values
  useEffect(() => {
    if (data) {
      formik.setValues({
        id: data.id || "",
        userName: data.userName || "",
        email: data.email || "",
        address: data.address || "",
        gender: data.gender ?? 0,
        age: data.age || 0,
      });
    }
  }, [data]);

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
        <form onSubmit={formik.handleSubmit}>
          <Box
            mb={"40px"}
            display={"grid"}
            gap={"30px"}
            gridTemplateColumns="repeat(4,minmax(0, 1fr))"
          >
            <TextField
              fullWidth //be responsive and align with other elements in a grid or flex layout
              variant="filled"
              type="text"
              label="USERNAME" //The visible label for the field
              name="userName" //Maps the input to "userName" in initialValues
              onChange={formik.handleChange}
              autoComplete="off"
              autoFocus
              value={formik.values.userName} // formik.values is part of Formik's internal state; holds the values of all input fields in the form; Reads the "userName" value
              error={formik.touched.userName && Boolean(formik.errors.userName)} //Determines whether the input field should visually indicate an error.
              helperText={formik.touched.userName && formik.errors.userName} //Displays a helper message (e.g., validation error) below the input field.
              sx={{ gridColumn: "span 4" }}
            ></TextField>

            <TextField
              fullWidth
              variant="filled"
              type="email" //for built-in validation for email format
              label="EMAIL"
              name="email"
              onChange={formik.handleChange}
              autoComplete="off"
              autoFocus
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ gridColumn: "span 4" }}
            ></TextField>

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="ADDRESS"
              name="address"
              onChange={formik.handleChange}
              autoComplete="off"
              autoFocus
              value={formik.values.address}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              sx={{ gridColumn: "span 4" }}
            ></TextField>

            <TextField
              fullWidth
              autoFocus
              autoComplete="off"
              variant="filled"
              type="number"
              label="AGE"
              name="age"
              value={formik.values.age}
              onChange={formik.handleChange}
              error={formik.touched.age && Boolean(formik.errors.age)}
              helperText={formik.touched.age && formik.errors.age}
              sx={{ gridColumn: "span 2" }}
            ></TextField>

            <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
              <InputLabel>GENDER</InputLabel>
              <Select
                name="gender"
                label="GENDER" // corresponds to <InputLabel> for accessibility
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
            <Button variant="outlined" onClick={onClose}>
              CANCEL
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              onClick={() => console.log("Button clicked!")}
            >
              UPDATE
            </Button>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
};
