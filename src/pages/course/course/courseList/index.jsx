import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  TextField,
  Typography,
  Stack,
  Skeleton,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import postRequest from "../../../../request/postRequest";
import toast from "react-hot-toast";
import { setCourses } from "../../../../store/courseSlice";
import getRequest from "../../../../request/getRequest";
import CourseCard from "../../../../components/course/course/CourseCard";
import FlexList from "../../../../components/course/course/FlexList";
export default function CourseList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedChip, setSelectedChip] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    title: "",
    courseCode: "",
    coverImage: "",
    description: "",
    categoryId: 1,
  });

  // Pop up page add course control
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    // add course form handle
    const { name, value } = event.target;
    setNewCourseData({
      ...newCourseData,
      categoryId: value,
      // [event.target.name]: event.target.value,
      [name]: name === "categoryId" ? Number(value) : value,
    });
    console.log("newCourseData", newCourseData);
  };

  //submit new course to backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await postRequest("/MoocCourse/add", newCourseData);
      if (response.isSuccess) {
        toast.success("Course added successfully!");
        setCourses([...courses, response.data]);
        handleClose();
      } else {
        toast.error(response.message || "Failed to add course.");
      }
    } catch (error) {
      toast.error("Failed to add course.");
    }
  };

  const dispatch = useDispatch();
  const courses = useSelector((state) => state.course.filteredCourses);

  // fetch data from backend
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
          setFilteredCourses(response?.data);
          // store category name and id
          const uniqueCategories = [];
          response?.data.forEach((course) => {
            if (
              !uniqueCategories.some(
                (item) => item.categoryName === course.categoryName
              )
            ) {
              uniqueCategories.push({
                id: course.categoryId,
                categoryName: course.categoryName,
              });
            }
            console.log("categories", categories);
          });
          setCategories(uniqueCategories);
          setError("");
        } else {
          setError(
            response?.message || "An error occurred while fetching data."
          );
        }
      } catch (err) {
        setError("Failed to fetch data");
      }
    };
    fetchData();
  }, [dispatch]);

  // click chip for different category
  const handleChipClick = (chipIndex) => {
    setSelectedChip(chipIndex);
    const filtered =
      chipIndex === null // all course
        ? courses
        : courses.filter(
            (course) =>
              course.categoryName === categories[chipIndex]?.categoryName
          );
    setFilteredCourses(filtered);
  };

  //search for course title
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.categoryName.toLowerCase().includes(query)
    );
    setFilteredCourses(filtered);
  };

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>
        Courses
      </Typography>
      {/* Chips and Search Bar */}
      <Box display="flex" alignItems="center" mb={2}>
        <Box
          sx={{ display: "flex", gap: 2, overflow: "auto", flexWrap: "wrap" }}
        >
          <Chip
            onClick={() => handleChipClick(null)}
            label="All Courses"
            variant={selectedChip == null ? "filled" : "outlined"}
          />
          {categories.map((category, index) => (
            <Chip
              key={category.id}
              label={category.categoryName}
              onClick={() => handleChipClick(index)}
              variant={selectedChip === index ? "filled" : "outlined"}
            />
          ))}
        </Box>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Course Title"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ ml: 2, width: 300 }}
        />
      </Box>
      {/* Filter button and Add course button */}
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={2}
      >
        {/* <FilterDropdown /> */}
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          Add Course
        </Button>
      </Stack>
      {/* Course List */}
      {loading && (
        <FlexList>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" width={300} height={100} />
          ))}
        </FlexList>
      )}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && filteredCourses.length === 0 && (
        <Typography>No courses found.</Typography>
      )}
      {!loading && !error && filteredCourses.length > 0 && (
        <FlexList>
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/course/${course.id}`}
              style={{ textDecoration: "none", display: "flex" }}
            >
              <CourseCard
                title={course.title}
                category={`Category: ${course.categoryName || "N/A"}`}
                description={course.description || "No description available"}
                imageUrl={course.coverImage}
              />
            </Link>
          ))}
        </FlexList>
      )}
      {/* Popup add course page */}
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
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                name="categoryId"
                value={newCourseData.categoryId}
                onChange={handleChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.categoryId} value={category.id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
    </Box>
  );
}
