import { useFormik } from "formik";
import * as Yup from "yup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Button,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Stack,
} from "@mui/material";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/header";
import postRequest from "../../request/postRequest";
import toast from "react-hot-toast";

export default function AddTeacher() {

  //Get userId from the search dialog
  const location = useLocation();
  const userId = location.state?.userId;        

  const navigate = useNavigate();
  const handleOnClose = () => {
    navigate("/teacher");
  };

  //set the initial values for the form
  const formik = useFormik({
    initialValues: {
      userId: userId,
      title: "",
      department: "",
      introduction: "",
      expertise: "",
      office: "",
      hiredDate: "",
      isActive: false,
    },

    validationSchema: Yup.object({
      userId: Yup.string()
        .required("Required"),
      title: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(30, "Must be 100 characters or less")
        .required("Required"),
      department: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(30, "Must be 100 characters or less")
        .required("Required"),
      introduction: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(30, "Must be 500 characters or less")
        .required("Required"),
      expertise: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(30, "Must be 100 characters or less")
        .required("Required"),
      office: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(30, "Must be 100 characters or less")
        .required("Required"),
      hiredDate: Yup.date().required("Required"),
      isActive: Yup.boolean().required("Required"),
    }),

    onSubmit: async (values) => {
       let result = await postRequest("/teacher/Add", {
        userId: values.userId,
        title: values.title,
        department: values.department,
        introduction: values.introduction,
        expertise: values.expertise,
        office: values.office,
        hiredDate: values.hiredDate,
        isActive: values.isActive,
      });
      console.log("result", result);
      console.log("values", values);

      //If the request is successful, navigate to the teacher page
      if (result.isSuccess) {
        toast.success("add success!");
        formik.resetForm();
        navigate("/teacher");
      } else {
        toast.error(result.message);
      }
    },
  });

  return (
    <Box m="20px">
      <Header title="ADD TEACHER" subtitle="Managing the Teacher Members" />
      <form onSubmit={formik.handleSubmit}>
        <Box
          display={"grid"}
          gap={"30px"}
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        >

          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="User ID"
            name="userId"
            autoComplete="off"
            onChange={formik.handleChange}
            value={userId}
            error={formik.touched.userId && Boolean(formik.errors.userId)}
            helperText={formik.touched.userId && formik.errors.userId}
            slotProps={{ readOnly: true }}
            sx={{ gridColumn: "span 4" }}
          ></TextField>
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Title"
            name="title"
            autoComplete="text"
            onChange={formik.handleChange}
            value={formik.values.title}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            autoFocus
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Department"
            name="department"
            autoComplete="off"
            onChange={formik.handleChange}
            value={formik.values.department}
            error={
              formik.touched.department && Boolean(formik.errors.department)
            }
            helperText={formik.touched.department && formik.errors.department}
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Introduction"
            name="introduction"
            autoComplete="off"
            onChange={formik.handleChange}
            value={formik.values.introduction}
            error={
              formik.touched.introduction && Boolean(formik.errors.introduction)
            }
            helperText={
              formik.touched.introduction && formik.errors.introduction
            }
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Expertise"
            name="expertise"
            autoComplete="off"
            onChange={formik.handleChange}
            value={formik.values.expertise}
            error={formik.touched.expertise && Boolean(formik.errors.expertise)}
            helperText={formik.touched.expertise && formik.errors.expertise}
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Office"
            name="office"
            autoComplete="off"
            onChange={formik.handleChange}
            value={formik.values.office}
            error={formik.touched.office && Boolean(formik.errors.office)}
            helperText={formik.touched.office && formik.errors.office}
            sx={{ gridColumn: "span 4" }}
          />

          {/* pick a date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Hired Date"
            format="DD/MM/YYYY"
            onChange={(value) => {
              if(value&&value.isValid()){
                const formattedDate = value.toISOString();
                formik.setFieldValue("hiredDate", formattedDate);
              }}}
            value={formik.values.hiredDate ? dayjs(formik.values.hiredDate) : null}
            renderInput={params => (
              <TextField
                {...params}
              />
            )}
            error={formik.touched.hiredDate && Boolean(formik.errors.hiredDate)}
            helperText={formik.touched.hiredDate && formik.errors.hiredDate}
          />
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
              error={formik.touched.isActive && Boolean(formik.errors.isActive)}
              helperText={formik.touched.isActive && formik.errors.isActive}
            >
              <MenuItem value={true}> Active </MenuItem>
              <MenuItem value={false}> Inactive </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" justifyContent="end" marginTop="20px">
          <Stack direction={"row"} spacing={2}>
            <Button type="submit" variant="contained" color="secondary">
              Add Teacher
            </Button>
            <Button
              type="cancel"
              onClick={handleOnClose}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </form>
    </Box>
  );
}
