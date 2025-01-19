import React, { useState, useEffect } from "react";
import Header from "../../../../components/header";
import getRequest from "../../../../request/getRequest";
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  Modal,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import FlexList from "../../../../components/course/course/FlexList";
import CourseCard from "../../../../components/course/course/CourseCard";
import Skeleton from "@mui/material/Skeleton";
import toast from "react-hot-toast";
import postRequest from "../../../../request/postRequest";
import { useDispatch, useSelector } from "react-redux";
import { setCourses, filterCourses } from "../../../../store/courseSlice";

import FilterDropdown from "../../../../components/course/course/FilterDropdown";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";
import { createSlice } from "@reduxjs/toolkit";
export default function CourseList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedChip, setSelectedChip] = React.useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  const [newCourseData, setNewCourseData] = useState({
    // id: "",
    title: "",
    courseCode: "",
    coverImage: "",
    description: "",
    categoryId: "",
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    setNewCourseData({
      ...newCourseData,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await postRequest("/MoocCourse/add", newCourseData);
      if (response.isSuccess) {
        setCourses([...courses, response.data]);
        handleClose();
        toast.success("Course added successfully!");
      } else {
        toast.error(response.message || "Failed to add course.");
      }
    } catch (error) {
      toast.error("Failed to add course.");
    }
  };

  const dispatch = useDispatch();
  const courses = useSelector((state) => state.course.filteredCourses);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest(
          "/MoocCourse/getall",
          null,
          setLoading
        );
        if (response?.isSuccess) {
          dispatch(setCourses(response?.data));
          setFilteredCourses(response?.data); // initializing course list

          // console.log("all courses", response?.data);

          //show category names
          const uniqueCategories = [];
          response?.data.forEach((course) => {
            if (
              !uniqueCategories.some(
                (item) => item.categoryName === course.categoryName
              )
            ) {
              uniqueCategories.push({
                id: course.id,
                categoryName: course.categoryName,
              });
            }
          });

          setCategories(uniqueCategories); // Update the component's state
          setError("");
        } else {
          const errorMessage =
            response?.message || "An error occurred while fetching data.";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err) {
        setError("Failed to fetch data");
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, [dispatch]);

  const handleChipClick = (chipIndex) => {
    setSelectedChip(chipIndex);
    let filteredCourses = [];
    if (chipIndex === null) {
      filteredCourses = courses; //  "All Courses" show all courses
    } else {
      const selectedCategoryName = categories[chipIndex]?.categoryName;
      filteredCourses = courses.filter(
        (course) => course.categoryName === selectedCategoryName
      );
    }
    setFilteredCourses(filteredCourses); // Update local state
  };

  return (
    <Box m="20px">
      <Header title="Courses" subtitle="Managing all courses" />

      <Box
        sx={{
          display: "inline-flex",
          flexDirection: "row",
          gap: 3,
          overflow: "auto",
        }}
      >
        <Chip
          onClick={() => handleChipClick(null)}
          size="medium"
          label="All Courses"
          variant={selectedChip == null ? "filled" : "outlined"}
        />
        {categories.map((category, index) => (
          <Chip
            key={category.id || index}
            label={category.categoryName}
            variant={selectedChip === index ? "filled" : "outlined"}
            onClick={() => handleChipClick(index)}
            sx={{ marginRight: 1 }}
          />
        ))}
      </Box>

      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={2}
      >
        <FilterDropdown />
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          Add Course
        </Button>
      </Stack>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" marginBottom={2}>
            Add New Course
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* <TextField
              label="ID"
              name="id"
              value={newCourseData.id}
              onChange={handleChange}
              fullWidth
              margin="normal"
            /> */}
            <TextField
              label="Title"
              name="title"
              value={newCourseData.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Course Code"
              name="courseCode"
              value={newCourseData.courseCode}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Cover Image URL"
              name="coverImage"
              value={newCourseData.coverImage}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Category"
              name="categoryId"
              value={newCourseData.categoryId}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={newCourseData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />

            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </form>
        </Box>
      </Modal>

      {loading && (
        <FlexList>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" width={300} height={100} />
          ))}
        </FlexList>
      )}

      {error && <Typography sx={{ marginBottom: 4 }}>{error}</Typography>}

      {!loading && !error && courses.length === 0 && (
        <Typography align="center" sx={{ marginBottom: 4 }}>
          No courses available at the moment.
        </Typography>
      )}

      {!loading && !error && courses.length > 0 && (
        <FlexList>
          {filteredCourses.map((course, index) => {
            // console.log("Mapped course:", course); // Log the course object
            return (
              <Link
                key={course.courseCode}
                to={`/course/${course.id}`}
                style={{ textDecoration: "none" }}
              >
                <CourseCard
                  title={course.title}
                  category={`Categories: ${course.categoryName || "N/A"}`}
                  description={`Description: ${
                    course.description || "No description available"
                  }`}
                  imageUrl={course.coverImage}
                />
              </Link>
            );
          })}
        </FlexList>
      )}
    </Box>
  );
}

export function Search() {
  return (
    <FormControl sx={{ width: { xs: "100%", md: "25ch" } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Search…"
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: "text.primary" }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          "aria-label": "search",
        }}
      />
    </FormControl>
  );
}
