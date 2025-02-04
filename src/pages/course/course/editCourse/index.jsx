import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import postRequest from "../../../../request/postRequest";
import toast from "react-hot-toast";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";

function useUpdateCourse(courseId) {
  const queryClient = useQueryClient();

  return useMutation(
    (courseData) => postRequest(`/MoocCourse/update`, courseData),
    {
      onSuccess: (data) => {
        if (data.isSuccess) {
          queryClient.invalidateQueries(["course", courseId]);
          toast.success("Course updated successfully!");
        } else {
          toast.error(data.message || "Failed to update course.");
        }
      },
      onError: () => {
        toast.error("Failed to update course.");
      },
    }
  );
}
export default function EditCourseModal({
  courseId,
  courseDataInput,
  categories,
  handleClose,
}) {
  const updateCourseMutation = useUpdateCourse(courseId);
  const [courseData, setCourseData] = useState(courseDataInput);

  const handleSubmit = (event) => {
    event.preventDefault();
    updateCourseMutation.mutate(courseData, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleChange = (event) => {
    setCourseData({
      ...courseData,
      [event.target.name]: event.target.value,
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
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" component="h2" marginBottom={2}>
        Edit Course
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={courseData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Course Code"
          name="courseCode"
          value={courseData.courseCode}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={courseData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            name="categoryId"
            value={courseData.categoryId}
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

        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </form>
    </Box>
  );
}
