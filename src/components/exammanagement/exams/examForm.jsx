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
} from "@mui/material";

const questionData = {
  Frontend: {
    "Choice Question": ["FE_CQ_Q1", "FE_CQ_Q2", "FE_CQ_Q3", "FE_CQ_Q4", "FE_CQ_Q5"],
    "Multiple Choice Question": ["FE_MCQ_Q6", "FE_MCQ_Q7", "FE_MCQ_Q8", "FE_MCQ_Q9", "FE_MCQ_Q10"],
    "Judgement Question": ["FE_JDG_Q11", "FE_JDG_Q12", "FE_JDG_Q13", "FE_JDG_Q14", "FE_JDG_Q15"],
    "Short Answer Question": ["FE_SHT_Q16", "FE_SHT_Q17", "FE_SHT_Q18"],
  },
  Backend: {
    "Choice Question": ["BE_CQ_Q19", "BE_CQ_Q20", "BE_CQ_Q21", "BE_CQ_Q22", "BE_CQ_Q23"],
    "Multiple Choice Question": ["BE_MCQ_Q24", "BE_MCQ_Q25", "BE_MCQ_Q26", "BE_MCQ_Q27", "BE_MCQ_Q28"],
    "Judgement Question": ["BE_JDG_Q29", "BE_JDG_Q30", "BE_JDG_Q31", "BE_JDG_Q32", "BE_JDG_Q33"],
    "Short Answer Question": ["BE_SHT_Q34", "BE_SHT_Q35", "BE_SHT_Q36"],
  },
  Database: {
    "Choice Question": ["DB_CQ_Q37", "DB_CQ_Q38", "DB_CQ_Q39", "DB_CQ_Q40", "DB_CQ_Q41"],
    "Multiple Choice Question": ["DB_MCQ_Q42", "DB_MCQ_Q43", "DB_MCQ_Q44", "DB_MCQ_Q45", "DB_MCQ_Q46"],
    "Judgement Question": ["DB_JDG_Q47", "DB_JDG_Q48", "DB_JDG_Q49", "DB_JDG_Q50", "DB_JDG_Q51"],
    "Short Answer Question": ["DB_SHT_Q52", "DB_SHT_Q53", "DB_SHT_Q54"],
  },
};


export default function ExamForm({ open, onClose, exam = null, mode = "add" }) {
  const [formData, setFormData] = useState(
    exam || {
      id: "",
      title: "",
      totalScore: 100,
      timePeriod: 60,
      category: "Frontend",
      questions: {
        "Choice Question": [],
        "Multiple Choice Question": [],
        "Judgement Question": [],
        "Short Answer Question": [],
      },
    }
  );

  useEffect(() => {
    if (open) {
      setFormData(
        exam || {
          id: "",
          title: "",
          totalScore: 100,
          timePeriod: 60,
          category: "Frontend",
          questions: {
            "Choice Question": [],
            "Multiple Choice Question": [],
            "Judgement Question": [],
            "Short Answer Question": [],
          },
        }
      );
    }
  }, [open, exam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(mode === "add" ? "Creating exam" : "Updating exam", formData);
    onClose(formData);
  };
  
  const safeQuestions = formData.questions || {
    "Choice Question": [],
    "Multiple Choice Question": [],
    "Judgement Question": [],
    "Short Answer Question": [],
  };

  return (
    <Modal open={open} onClose={() => onClose()}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 800,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          {mode === "add" ? "Create Exam" : "Edit Exam"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField fullWidth label="Exam Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <TextField fullWidth type="number" label="Total Score" value={formData.totalScore} onChange={(e) => setFormData({ ...formData, totalScore: Number(e.target.value) || 0 })} />
            <TextField fullWidth type="number" label="Time Period (minutes)" value={formData.timePeriod} onChange={(e) => setFormData({ ...formData, timePeriod: Number(e.target.value) || 0 })} />
            <FormControl fullWidth>
              <InputLabel>Course Category</InputLabel>
              <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                <MenuItem value="Frontend">Frontend</MenuItem>
                <MenuItem value="Backend">Backend</MenuItem>
                <MenuItem value="Database">Database</MenuItem>
              </Select>
            </FormControl>
            {Object.keys(safeQuestions).map((type) => (
              <FormControl fullWidth key={type}>
                <InputLabel>{type} Questions</InputLabel>
                <Select
                  multiple
                  value={safeQuestions[type] || []}
                  onChange={(e) => setFormData({ ...formData, questions: { ...formData.questions, [type]: e.target.value } })}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {questionData[formData.category][type].map((q) => (
                    <MenuItem key={q} value={q}>{q}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => onClose()}>Cancel</Button>
              <Button type="submit" variant="contained">Save</Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
