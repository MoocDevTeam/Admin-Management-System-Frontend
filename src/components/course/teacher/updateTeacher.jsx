import { useFormik } from "formik";
import colors, { theme } from "../../../theme";
import React from "react";
import { useEffect } from "react";
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
} from "@mui/material";
import postRequest from "../../../request/postRequest";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";

export const UpdateTeacher = ({ open, onClose, data }) => {
  console.log("data", data);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: data?.title ?? "",
      department: data?.department || "",
      introduction: data?.introduction || "",
      expertise: data?.expertise || "",
      hiredDate: data?.hiredDate || "",
      isActive: data?.isActive || false,
      office: data?.office || "",
      userId: data?.userId || "",
    },
    validationSchema: Yup.object({
      userId: Yup.string().required("Required"),
      title: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(30, "Must be 30 characters or less")
        .required("Required"),
      department: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      introduction: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(500, "Must be 500 characters or less")
        .required("Required"),
      expertise: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(200, "Must be 200 characters or less")
        .required("Required"),
      office: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(30, "Must be 100 characters or less")
        .required("Required"),
      hiredDate: Yup.date().required("Required"),
      isActive: Yup.boolean().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log("Form submitted!", values);
      let result = await postRequest("/teacher/update", {
        userId: values.userId,
        title: values.title,
        expertise: values.expertise,
        department: values.department,
        introduction: values.introduction,
        office: values.office,
        hiredDate: values.hiredDate,
        isActive: values.isActive,
        id: values.id,
        displayName: values.displayName,
      });

      if (result.isSuccess) {
        toast.success("Update success!");
        formik.resetForm();
        navigate(0);
      } else {
        toast.error(result.message);
      }
    },
  });
  useEffect(() => {
    const setTeacherInformation = (newValues) => {
      formik.setValues(newValues);
    };
    setTeacherInformation(
      data || {
        title: "",
        department: "",
        introduction: "",
        expertise: "",
        hiredDate: "",
        isActive: false,
        office: "",
      }
    );
  }, [data]);

  return (
    <Dialog open={open} onClose={onClose}>

      <DialogTitle fontSize={"1.5rem"} color="white" sx={{bgcolor: theme.palette.secondary.main}}>
        Update Teacher
      </DialogTitle>
        
      <Box m="20px">
        <form onSubmit={formik.handleSubmit}>
          <Box
            mb={"40px"}
            display={"grid"}
            gap={"30px"}
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          >

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Title"
              name="title"
              onChange={formik.handleChange}
              autoComplete="off"
              value={formik.values.title}
              error={formik.touched.title && formik.errors.title}
              helpertext={formik.touched.title && formik.errors.title}
              autoFocus
              sx={{ gridColumn: "span 4" }}
            ></TextField>

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="department"
              name="department"
              onChange={formik.handleChange}
              autoComplete="off"
              value={formik.values.department}
              error={formik.touched.department && formik.errors.department}
              helpertext={formik.touched.department && formik.errors.department}
              autoFocus
              sx={{ gridColumn: "span 4" }}
            ></TextField>

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Expertise"
              name="expertise"
              onChange={formik.handleChange}
              autoComplete="off"
              value={formik.values.expertise}
              error={formik.touched.expertise && formik.errors.expertise}
              helperText={formik.touched.expertise && formik.errors.expertise}
              autoFocus
              sx={{ gridColumn: "span 4" }}
            ></TextField>

            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Office"
              name="office"
              onChange={formik.handleChange}
              autoComplete="off"
              value={formik.values.office}
              error={formik.touched.office && formik.errors.office}
              helpertext={formik.touched.office && formik.errors.office}
              autoFocus
              sx={{ gridColumn: "span 4" }}
            ></TextField>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                variant="filled"
                format="DD/MM/YY"
                label="Hired Date"
                name="hiredDate"
                onChange={(value) => {
                  if (value && value.isValid()) {
                    const formattedDate = value.toISOString();
                    formik.setFieldValue("hiredDate", formattedDate);
                  }
                }}
                value={
                  formik.values.hiredDate
                    ? dayjs(formik.values.hiredDate)
                    : null
                }
                renderInput={(params) => <TextField {...params} />}
                error={
                  formik.touched.hiredDate && Boolean(formik.errors.hiredDate)
                }
                helpertext={formik.touched.hiredDate && formik.errors.hiredDate}
              ></DatePicker>
            </LocalizationProvider>

            <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
              <InputLabel id="teacher-status-select-label">
                Active Status
              </InputLabel>
              <Select
                labelId="teacher-status-select-label"
                id="teacher-status-select"
                name="isActive"
                value={formik.values.isActive}
                onChange={formik.handleChange}
                label="Active Status"
                error={
                  formik.touched.isActive && Boolean(formik.errors.isActive)
                }
                helpertext={formik.touched.isActive && formik.errors.isActive}
              >
                <MenuItem value={true}> Active </MenuItem>
                <MenuItem value={false}> Inactive </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={onClose}>
              CANCEL
            </Button>
            <Button type="submit" variant="contained" color="primary">
              UPDATE
            </Button>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
};
