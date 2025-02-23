import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Modal,
  Typography,
  OutlinedInput,
  Chip,
  ListItemText,
  Checkbox,
  Alert,
} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const questionData = {
  "Web Development": {
    "Choice Question": ["FE_CQ_1", "FE_CQ_2", "FE_CQ_3", "FE_CQ_4", "FE_CQ_5"],
    "Multiple Choice Question": ["FE_MCQ_1", "FE_MCQ_2", "FE_MCQ_3"],
    "Judgement Question": ["FE_JQ_1", "FE_JQ_2", "FE_JQ_3", "FE_JQ_4"],
    "Short Answer Question": ["FE_SQ_1", "FE_SQ_2"]
  },
  "Server-side Programming": {
    "Choice Question": ["BE_CQ_1", "BE_CQ_2", "BE_CQ_3"],
    "Multiple Choice Question": ["BE_MCQ_1", "BE_MCQ_2"],
    "Judgement Question": ["BE_JQ_1", "BE_JQ_2"],
    "Short Answer Question": ["BE_SQ_1"]
  },
  "Cloud Computing": {
    "Choice Question": ["CL_CQ_1", "CL_CQ_2"],
    "Multiple Choice Question": ["CL_MCQ_1"],
    "Judgement Question": ["CL_JQ_1", "CL_JQ_2", "CL_JQ_3"],
    "Short Answer Question": ["CL_SQ_1"]
  }
};

export default function ExamForm({ open, onClose, exam = null, mode = "add" }) {
  const [formData, setFormData] = useState(
    exam || {
      title: "",
      totalScore: 100,
      duration: "2 hours",
      course: "Web Development",
      questions: {
        "Choice Question": [],
        "Multiple Choice Question": [],
        "Judgement Question": [],
        "Short Answer Question": [],
      },
      description: "",
    }
  );

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (open) {
      setFormData(exam || {
        title: "",
        totalScore: 100,
        duration: "2 hours",
        course: "Web Development",
        questions: {
          "Choice Question": [],
          "Multiple Choice Question": [],
          "Judgement Question": [],
          "Short Answer Question": [],
        },
        description: "",
      });
      setAlert({
        open: false,
        message: '',
        severity: 'success'
      });
    }
  }, [open, exam]);

  const handleSubmit = () => {
    try {
      setAlert({
        open: true,
        message: mode === 'add' ? 'Exam created successfully!' : 'Exam updated successfully!',
        severity: 'success'
      });
      
      setTimeout(() => {
        onClose(formData);
      }, 1000);
    } catch (error) {
      setAlert({
        open: true,
        message: 'Operation failed',
        severity: 'error'
      });
    }
  };

  const handleQuestionSelect = (type, selectedQuestions) => {
    setFormData(prev => ({
      ...prev,
      questions: {
        ...prev.questions,
        [type]: selectedQuestions
      }
    }));
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose(null)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 24,
        p: 4,
        width: '80%',
        maxWidth: 800,
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        {alert.open && (
          <Alert 
            severity={alert.severity}
            sx={{ mb: 2 }}
            onClose={() => setAlert({ ...alert, open: false })}
          >
            {alert.message}
          </Alert>
        )}
        
        <Typography variant="h5" component="h2" gutterBottom>
          {mode === "add" ? "Create Exam" : "Edit Exam"}
        </Typography>
        
        <Stack spacing={3}>
          <TextField
            label="Exam Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            fullWidth
          />

          <TextField
            label="Total Score"
            type="number"
            value={formData.totalScore}
            onChange={(e) => setFormData(prev => ({ ...prev, totalScore: e.target.value }))}
            fullWidth
          />

          <TextField
            label="Duration"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Course</InputLabel>
            <Select
              value={formData.course}
              onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
              label="Course"
            >
              {Object.keys(questionData).map((course) => (
                <MenuItem key={course} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {Object.keys(formData.questions).map((type) => (
            <FormControl key={type} fullWidth>
              <InputLabel>{type}</InputLabel>
              <Select
                multiple
                value={formData.questions[type]}
                onChange={(e) => handleQuestionSelect(type, e.target.value)}
                input={<OutlinedInput label={type} />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {questionData[formData.course]?.[type]?.map((question) => (
                  <MenuItem key={question} value={question}>
                    <Checkbox checked={formData.questions[type].indexOf(question) > -1} />
                    <ListItemText primary={question} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          <TextField
            label="Description"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            fullWidth
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button onClick={() => onClose(null)}>Cancel</Button>
            <Button 
              variant="contained"
              onClick={handleSubmit}
            >
              {mode === "add" ? "Create" : "Save"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
