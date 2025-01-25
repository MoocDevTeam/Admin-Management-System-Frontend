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
  Alert,
  Modal,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import Header from "../../../components/header";

export default function QuestionForm({ open, onClose, question = null, mode = 'add' }) {
  const [formData, setFormData] = useState(question || {
    id: "",
    title: "",
    type: "Choice Question",
    difficulty: "Easy",
    category: "Frontend",
    score: 5,
    options: [
      { id: 'A', text: '', correct: false },
      { id: 'B', text: '', correct: false },
      { id: 'C', text: '', correct: false },
      { id: 'D', text: '', correct: false }
    ],
    answer: "",
    explanation: ""
  });

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // 添加一个 useEffect 来监听 open 状态
  useEffect(() => {
    if (open) {
      // 当 modal 打开时，重置表单数据和 alert 状态
      setFormData(question || {
        id: "",
        title: "",
        type: "Choice Question",
        difficulty: "Easy",
        category: "Frontend",
        score: 5,
        options: [
          { id: 'A', text: '', correct: false },
          { id: 'B', text: '', correct: false },
          { id: 'C', text: '', correct: false },
          { id: 'D', text: '', correct: false }
        ],
        answer: "",
        explanation: ""
      });
      setAlert({
        open: false,
        message: '',
        severity: 'success'
      });
    }
  }, [open, question]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setAlert({
        open: true,
        message: mode === 'add' ? 'Question added successfully!' : 'Question updated successfully!',
        severity: 'success'
      });
      
      setTimeout(() => {
        onClose && onClose(formData);
      }, 1000);
    } catch (error) {
      setAlert({
        open: true,
        message: 'Operation failed',
        severity: 'error'
      });
    }
  };

  // 从 edit.jsx 复制过来的 renderQuestionContent 函数
  const renderQuestionContent = () => {
    switch (formData.type) {
      case "Choice Question":
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Options</Typography>
            {formData.options.map((option, index) => (
              <Stack 
                key={option.id} 
                direction="row" 
                spacing={2} 
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Radio
                  checked={option.correct}
                  onChange={() => {
                    const newOptions = formData.options.map((opt, i) => ({
                      ...opt,
                      correct: i === index
                    }));
                    setFormData({ ...formData, options: newOptions });
                  }}
                />
                <TextField
                  fullWidth
                  label={`Option ${option.id}`}
                  value={option.text}
                  onChange={(e) => {
                    const newOptions = [...formData.options];
                    newOptions[index].text = e.target.value;
                    setFormData({ ...formData, options: newOptions });
                  }}
                />
              </Stack>
            ))}
          </Box>
        );

      case "Judgement Question":
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Correct Answer</Typography>
            <RadioGroup
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value === 'true' })}
            >
              <FormControlLabel value="true" control={<Radio />} label="True" />
              <FormControlLabel value="false" control={<Radio />} label="False" />
            </RadioGroup>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Explanation"
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      case "Short Answer Question":
        return (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Model Answer"
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            />
          </Box>
        );
    }
  };

  return (
    <Modal open={open} onClose={() => onClose()}>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: '90%',
        maxWidth: 1200,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 1,
        maxHeight: '90vh',
        overflow: 'auto'
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
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="Choice Question">Choice Question</MenuItem>
                  <MenuItem value="Judgement Question">Judgement Question</MenuItem>
                  <MenuItem value="Short Answer Question">Short Answer Question</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={formData.difficulty}
                  label="Difficulty"
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="Frontend">Frontend</MenuItem>
                  <MenuItem value="Backend">Backend</MenuItem>
                  <MenuItem value="Database">Database</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Score"
                type="number"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                sx={{ width: 100, flex: '0 0 auto' }}
              />
            </Stack>

            <TextField
              fullWidth
              multiline
              rows={2}
              label="Question"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            {renderQuestionContent()}

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
