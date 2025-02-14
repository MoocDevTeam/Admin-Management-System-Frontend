import React from "react";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogTitle, Typography, IconButton, DialogContent, Button, DialogActions, TextField, } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import postRequest from "../../../../../../request/postRequest";


export default function AddSessionModal({ open, onClose, courseInstanceId })
{
  // Initialization state
  const [sessionData, setSessionData] = useState({
  title: "",
  description: "",  
  courseInstanceId: courseInstanceId ||"",
  order: "",
  });

  // Initialization Error Status
  const [errors, setErrors] = useState({
  title: "",
  description: "",
  courseInstanceId: "",
  order: "",
  });

  // React Query 
  const queryClient = useQueryClient();

  // Processing Input Changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setSessionData({
      ...sessionData,
      [name]: value,
    });
    validateField(name, value);
  };

  // Validation of fields
  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "title":
        if (!value) {
          errorMessage = "Title is required";
        } else if (value.length > 50) {
          errorMessage = "Title must be less than 50 characters";
        }
        break;
      case "description":
        if (!value) {
          errorMessage = "Description is required";
        } else if (value.length > 255) {
          errorMessage = "Description must be less than 255 characters";
        }
        break;
      case "order":
        if (value && value <= 0) {
          errorMessage = "Order must be greater than 0";
        }
        break;
      default:
        break;
    }

    // Update Error Status
    setErrors({
      ...errors,
      [name]: errorMessage,
    });
  };

  // Mutation
  const createSessionMutation = useMutation(
    async (newSession) => {
      const response = await postRequest(`/Session/Add`, newSession);
      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to create session.");
      }
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("sessions");
        toast.success("Session created successfully!");
        onClose();
      },
      onError: (error) => { 
        toast.error(error.message || "Failed to create session.");
      },
    }
  );


  // Submit Form Final Validation
  const handleSubmit = (event) => {
    event.preventDefault();
    if (Object.values(errors).every((error) => error === "")) {
      createSessionMutation.mutate(sessionData);
    } else {
      alert("Please fix the errors before submitting.");
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose}> 
      {/* Header Section: Title and Close Button */}
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "space-between", p: 2}}>
        <Typography variant="h4">Add Session</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content Section: Add Session Form or Information */}
      <DialogContent sx={{ width:400, padding: 1,display: 'flex', flexDirection: 'column'}}>
        <TextField
          fullWidth
          label="Title"
          required
          name="title"
          value={sessionData.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          required
          name="description"
          value={sessionData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          margin="normal"
        />
        <TextField
          fullWidth
          label="CourseInstanceId"
          required
          name="courseInstanceId"
          value={sessionData.courseInstanceId}
          readOnly 
          margin="normal"
        />
        <TextField
          fullWidth
          label="Order"
          name="order"
          value={sessionData.order}
          onChange={handleChange}
          error={!!errors.order}
          helperText={errors.order}
          margin="normal"
        />      
      </DialogContent>

      {/* Footer Section: Action Buttons */}
      <DialogActions sx={{marginRight: 5, marginBottom:2,}}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          disabled={
            createSessionMutation.isLoading ||
            Object.values(errors).some((error) => error !== "") ||
            !sessionData.title ||
            !sessionData.description
          }
        >
          {createSessionMutation.isLoading ? "Saving..." : "Save Add"}
        </Button>
        </DialogActions>
    </Dialog>  
  )
}