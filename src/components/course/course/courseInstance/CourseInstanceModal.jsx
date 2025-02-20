import React from "react";
import { Modal, Box, IconButton, Typography, TextField, FormControl, Button, FormHelperText } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCourseInstanceForm } from "../../../util/useCourseInstanceForm"; // Custom hook
import FormSelectField from "./FormSelectField";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import the UTC plugin
dayjs.extend(utc); // Enable UTC support

export default function CourseInstanceModal({ open, courses, onSubmit, onUpdate, onClose, selectedRowData }) {
  const formik = useCourseInstanceForm(open, onUpdate, onSubmit, selectedRowData);

  return (
    <>
      {/* conditional rendering Modal to improve performance */}
      {open && (
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
              <form onSubmit={formik.handleSubmit}>
                {/* Course Selection */}
                <FormSelectField
                  formik={formik}
                  name="moocCourseId"
                  label="Course"
                  //If courses is null or undefined, it falls back to an empty array []
                  options={(courses ?? []).map((course) => ({ value: course.id, label: course.title }))}
                  disabledMessage="No courses available"
                />
                {/* Status Selection */}
                <FormSelectField
                  formik={formik}
                  name="status"
                  label="Status"
                  options={[
                    { value: 0, label: "Close" },
                    { value: 1, label: "Open" },
                  ]}
                />
                {/* Permission Selection */}
                <FormSelectField
                  formik={formik}
                  name="permission"
                  label="Permission"
                  options={[
                    { value: 0, label: "Private" },
                    { value: 1, label: "Public" },
                  ]}
                />
                {/* Start Date */}
                <FormControl
                  fullWidth
                  margin="normal"
                  error={formik.touched.startDate && Boolean(formik.errors.startDate)}>
                  <DateTimePicker
                    label="Start Date"
                    value={formik.values.startDate ? dayjs.utc(formik.values.startDate) : null} // Convert to UTC and store as ISO string
                    format="DD/MM/YYYY HH:mm"
                    onChange={(newValue) => formik.setFieldValue("startDate", newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.startDate && Boolean(formik.errors.startDate),
                      },
                    }}
                    // <DateTimePicker> doesn’t accept fullWidth and error props (error styling like <TextField> does), so we need to explicitly pass error
                    // The first fullWidth ensures proper alignment in the form layout, while the second one makes sure the input field inside the DateTimePicker is also full-width
                  />
                  <FormHelperText>{formik.touched.startDate && formik.errors.startDate}</FormHelperText>
                </FormControl>
                {/* End Date */}
                <FormControl fullWidth margin="normal" error={formik.touched.endDate && Boolean(formik.errors.endDate)}>
                  <DateTimePicker
                    label="End Date"
                    value={formik.values.endDate ? dayjs.utc(formik.values.endDate) : null}
                    format="DD/MM/YYYY HH:mm"
                    onChange={(newValue) => formik.setFieldValue("endDate", newValue)}
                    slotProps={{
                      textField: { fullWidth: true, error: formik.touched.endDate && Boolean(formik.errors.endDate) },
                    }}
                  />
                  <FormHelperText>{formik.touched.endDate && formik.errors.endDate}</FormHelperText>
                </FormControl>
                {/* Description */}
                <TextField
                  label="Description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  error={formik.touched.description && !!formik.errors.description}
                  helperText={formik.touched.description && formik.errors.description}
                />
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </form>
            </LocalizationProvider>
          </Box>
        </Modal>
      )}
    </>
  );
}
