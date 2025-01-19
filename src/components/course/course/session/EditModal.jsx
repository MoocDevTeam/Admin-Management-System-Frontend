import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import postRequest from "../../../../request/postRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const EditModal = ({ onClose, session }) => {
  const [sessionData, setSessionData] = useState({
    courseInstanceId: "",
    id: "",
    title: "",
    description: "",
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (session) {
      setSessionData({
        courseInstanceId: session.courseInstanceId || "",
        id: session.id || "",
        title: session.title || "",
        description: session.description || "",
      });
    }
  }, [session]);

  const handleChange = (event) => {
    setSessionData({
      ...sessionData,
      [event.target.name]: event.target.value,
    });
  };

  const mutation = useMutation(
    async (updatedValue) => {
      const response = await postRequest(`/Session/update`, updatedValue);
      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to update session.");
      }
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("courseInstance"); 
        toast.success("Session updated successfully!");
        onClose();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update session.");
      },
    }
  );
  

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(sessionData); 
  };

  return (
    <Modal open={true} onClose={onClose}>
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
          Edit Session
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            value={sessionData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={sessionData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="submit"
              sx={{ margin: "20px 20px 0 20px" }}
              variant="contained"
              color="secondary"
              disabled={mutation.isLoading} 
            >
              {mutation.isLoading ? "Saving..." : "Save Changes"}
            </Button>

            <Button
              onClick={onClose}
              sx={{ margin: "20px 20px 0 20px" }}
              variant="contained"
              color="secondary"
            >
              Close
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditModal;
