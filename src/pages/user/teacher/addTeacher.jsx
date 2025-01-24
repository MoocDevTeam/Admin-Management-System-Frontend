import React, { useState } from "react";
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
  ListItemText,
  Checkbox,
  OutlinedInput,
} from "@mui/material";
import { DatePicker } from "@mui/lab";
import { AdatpterDayjs } from "@mui/lab/AdapterDayjs";
import { LocaliztionProvider } from "@mui/lab/LocalizationProvider";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/header";
import { Form } from "react-router-dom";
import postRequest from "../../../request/postRequest";
import toast from "react-hot-toast";

export default function AddTeacher() {
  //set the initial userId to null
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //set the initial search type to id
  const [searchType, setSearchType] = useState("id");
  const [searchInput, setSearchInput] = useState("");

  //handle the search dialog open

  //handle the search dialog open
  const handleSearchOpen = () => setIsDialogOpen(true); // open the search dialog
  const handleSearchClose = () => setIsDialogOpen(false); // close the search dialog

  //set the initial values for the form
  const formik = useFormik({
    initialValues: {
      title: "",
      department: "",
      introduction: "",
      expertise: "",
      office: "",
      hiredDate: "",
      isActive: false,
    },

    validationSechema: Yup.object({
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
        title: values.title,
        department: values.department,
        introduction: values.introduction,
        expertise: values.expertise,
        office: values.office,
        hiredDate: values.hiredDate,
        isActive: values.isActive,
      });

      if (result.isSuccess) {
        toast.success("add success!");
        formik.resetForm();
        //navigate("/", { replace: true });
      } else {
        toast.error(result.message);
      }
    },
  });

  const navigate = useNavigate();
  const handleOnClose = () => {
    navigate("/teacher");
  };

  return (
    <Box m="20px">
      <Header title="ADD TEACHER" subtitle="Managing the Teacher Members" />
      <form onSubmit={formik.handleSubmit}>
        <Box
          display={"grid"}
          gap={"30px"}
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        >
          <Box
          sx={{ gridColumn: "span 2" }}
          >
          <TextField
            fullWidth
            label={`Search by ${searchType === "id" ? "ID" : "Username"}`}
            variant="filled"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ gridColumn: "span 1" }}
          />
          <FormControl fullWidth sx={{ gridColumn: "span 1" }}>
            <InputLabel id="search-type-label">Search By</InputLabel>
            <Select
              labelId="search-type-label"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <MenuItem value="id">ID</MenuItem>
              <MenuItem value="username">User Name</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="secondary"
            // onClick={handleSearch}
            sx={{ gridColumn: "span 1" }}
          >
            Search
          </Button>
          </Box>

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
            autoFocus
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
            autoFocus
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
            autoFocus
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
            autoFocus
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Hired Date"
            name="hiredDate"
            autoComplete="off"
            onChange={formik.handleChange}
            value={formik.values.hiredDate}
            error={formik.touched.hiredDate && Boolean(formik.errors.hiredDate)}
            helperText={formik.touched.hiredDate && formik.errors.hiredDate}
            autoFocus
            sx={{ gridColumn: "span 4" }}
          />
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
              // onClick={handleOnClose}
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
