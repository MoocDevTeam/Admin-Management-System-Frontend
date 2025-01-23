import React, { useState, useEffect } from "react";
import postRequest from "../../../../request/postRequest";
import toast from "react-hot-toast";
import { setCourses } from "../../../../store/courseSlice";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function AddCourseModal({
  CourseData,
  categories,
  handleClose,
}) {
  const [newCourseData, setNewCourseData] = useState(CourseData);
  const courses = useSelector((state) => state.course.filteredCourses);
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewCourseData({
      ...newCourseData,
      [name]: name === "categoryId" ? Number(value) : value, // 动态更新字段值
    });
  };

  return (
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
              <MenuItem key={category.id} value={category.id}>
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
  );
}
