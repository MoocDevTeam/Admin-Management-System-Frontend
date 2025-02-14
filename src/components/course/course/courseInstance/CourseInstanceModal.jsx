import React from "react";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCourseInstanceForm } from "../../../util/useCourseInstanceForm"; // Custom hook
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import the UTC plugin
dayjs.extend(utc); // Enable UTC support

export default function CourseInstanceModal({ open, courses, onSubmit, onUpdate, onClose, selectedRowData }) {
  const { courseInstance, handleInputChange, handleDateInputChange } = useCourseInstanceForm(selectedRowData);

  // By keeping handleSubmit in Modal, the useCourseInstanceForm hook can be reused in other components
  // that need similar form state management but have different submission logic.
  const handleSubmit = (event) => {
    event.preventDefault();
    const formattedInstance = {
      ...courseInstance,
      // Although we have converted format in handleDateInputChange,
      // we still need to ensure the date-time values are in the correct UTC format
      startDate: courseInstance.startDate ? dayjs(courseInstance.startDate).utc().toISOString() : null,
      endDate: courseInstance.endDate ? dayjs(courseInstance.endDate).utc().toISOString() : null,
    };
    if (selectedRowData) {
      // If editing, call onUpdate
      onUpdate({ ...formattedInstance, id: selectedRowData.id });
    } else {
      // Otherwise, add a new course instance
      onSubmit(formattedInstance);
    }
    // console.log("formattedInstance:", formattedInstance);
  };

  return (
    <Modal open={open} onClose={onClose}>
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
        }}>
        <IconButton
          onClick={onClose}
          aria-label="Close" //for screen readers
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
          }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="h2" marginBottom={2}>
          {selectedRowData ? "Update Course Instance" : "Add New Course Instance"}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <form onSubmit={handleSubmit}>
            {/* Course Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="course-select-label">Course</InputLabel>
              <Select
                labelId="course-select-label"
                id="course-select"
                name="moocCourseId"
                value={courseInstance.moocCourseId}
                onChange={handleInputChange}
                label="Course">
                {courses.length === 0 ? (
                  <MenuItem disabled> No courses available </MenuItem>
                ) : (
                  courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.title}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            {/* Status Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                name="status"
                value={courseInstance.status}
                onChange={handleInputChange}
                label="Status">
                <MenuItem value={0}>Close</MenuItem>
                <MenuItem value={1}>Open</MenuItem>
              </Select>
            </FormControl>
            {/* Permission Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="permission-select-label">Permission</InputLabel>
              <Select
                labelId="permission-select-label"
                id="permission-select"
                name="permission"
                value={courseInstance.permission}
                onChange={handleInputChange}
                label="Permission">
                <MenuItem value={0}>Private</MenuItem>
                <MenuItem value={1}>Public</MenuItem>
              </Select>
            </FormControl>
            {/* Start Date */}
            <DateTimePicker
              label="Start Date"
              value={courseInstance.startDate ? dayjs.utc(courseInstance.startDate) : null} // Explicitly use UTC
              format="DD/MM/YYYY HH:mm" // Explicitly set format, otherwise the format will be "MM/DD/YYYY HH:mm"
              onChange={(newValue) => handleDateInputChange("startDate", newValue)}
              // DateTimePicker doesn’t accept fullWidth or margin props
              slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
            />
            {/* End Date */}
            <DateTimePicker
              label="End Date"
              value={courseInstance.endDate ? dayjs.utc(courseInstance.endDate) : null}
              format="DD/MM/YYYY HH:mm"
              onChange={(newValue) => handleDateInputChange("endDate", newValue)}
              slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
            />
            <TextField
              label="Description"
              name="description"
              value={courseInstance.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </form>
        </LocalizationProvider>
      </Box>
    </Modal>
  );
}
