import React, { useState, useEffect } from "react";
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
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import the UTC plugin
dayjs.extend(utc); // Enable UTC support

export default function CourseInstanceModal({ open, courses, onSubmit, onUpdate, onClose, selectedRowData }) {
  const [courseInstance, setCourseInstance] = useState({
    moocCourseId: "",
    status: "",
    permission: "",
    startDate: null,
    endDate: null,
    description: "",
  });

  // Sync selectedRowData when modal opens (for updates)
  useEffect(() => {
    if (selectedRowData) {
      setCourseInstance({
        moocCourseId: selectedRowData.moocCourseId,
        status: selectedRowData.status,
        permission: selectedRowData.permission,
        startDate: selectedRowData.startDate ? dayjs(selectedRowData.startDate) : null,
        endDate: selectedRowData.endDate ? dayjs(selectedRowData.endDate) : null,
        description: selectedRowData.description,
      });
    }
  }, [selectedRowData, open]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCourseInstance((prev) => ({
      ...prev,
      // Dynamically updates the field based on 'name'
      // convert the status and permission back to numeric values (0 or 1)
      [name]: name === "status" || name === "permission" ? Number(value) : value,
    }));
  };

  // date inputs
  const handleDateInputChange = (name, date) => {
    setCourseInstance((prev) => ({
      ...prev,
      [name]: date ? date.toISOString() : null,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formattedInstance = {
      ...courseInstance,
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
              value={courseInstance.startDate ? dayjs(courseInstance.startDate).utc() : null}
              format="DD/MM/YYYY HH:mm" // Explicitly set format, otherwise the format will be "MM/DD/YYYY HH:mm"
              onChange={(newValue) => handleDateInputChange("startDate", newValue)}
              // DateTimePicker doesn’t accept fullWidth or margin props
              slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
            />
            {/* End Date */}
            <DateTimePicker
              label="End Date"
              value={courseInstance.endDate ? dayjs(courseInstance.endDate).utc() : null}
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
