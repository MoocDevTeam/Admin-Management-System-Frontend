import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Grid,
  Button,
} from "@mui/material";
import Header from "../../../components/header";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from "react-router-dom";

// 题目组件
const QuestionItem = ({ question, index, type }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          Question {index + 1}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip 
            label={type}
            color={
              type === "Choice Question" ? "success" :
              type === "Multiple Choice Question" ? "primary" :
              type === "Judgement Question" ? "error" :
              "warning"
            }
            size="small"
          />
          <Button 
            size="small" 
            variant="outlined"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </Button>
        </Box>
      </Box>

      <Typography variant="body1" gutterBottom>
        {question.content}
      </Typography>
      
      {/* options and answer display */}
      {(type === "Choice Question" || type === "Multiple Choice Question") && (
        <Box sx={{ pl: 2 }}>
          {question.options.map((option, idx) => (
            <Typography 
              key={idx} 
              variant="body2" 
              sx={{ 
                mb: 1,
                color: showAnswer && (
                  type === "Choice Question" 
                    ? question.answer === option
                    : question.answer.includes(option)
                ) ? 'success.main' : 'text.primary'
              }}
            >
              {String.fromCharCode(65 + idx)}. {option}
              {showAnswer && (
                type === "Choice Question" 
                  ? question.answer === option && " ✓"
                  : question.answer.includes(option) && " ✓"
              )}
            </Typography>
          ))}
          {showAnswer && type === "Multiple Choice Question" && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Correct answers: {question.answer.join(", ")}
            </Typography>
          )}
        </Box>
      )}
      
      {type === "Judgement Question" && (
        <Box sx={{ pl: 2 }}>
          <Typography variant="body2">True / False</Typography>
          {showAnswer && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="success.main">
                Correct answer: {question.answer ? "True" : "False"}
              </Typography>
              {question.explanation && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Explanation: {question.explanation}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      )}

      {type === "Short Answer Question" && (
        <Box sx={{ pl: 2, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Answer space...
          </Typography>
          {showAnswer && (
            <Box sx={{ mt: 1, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="body2" color="success.contrastText">
                Reference Answer: {question.answer}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default function ExamPreview() {
  const navigate = useNavigate();
  const { examId } = useParams();

  // Mock data - should be obtained from API in actual application
  const examData = {
    id: 1,
    title: "Frontend Skill Check",
    totalScore: 100,
    course: "Web Development",
    duration: "2 hours",
    description: "This is a comprehensive exam to test frontend development skills.",
    questions: {
      "Choice Question": [
        {
          id: "FE_CQ_1",
          content: "Which of the following is NOT a valid JavaScript data type?",
          options: ["String", "Boolean", "Float", "Symbol"],
          answer: "Float"
        },
        {
          id: "FE_CQ_2",
          content: "What does CSS stand for?",
          options: [
            "Computer Style Sheets",
            "Cascading Style Sheets",
            "Creative Style Sheets",
            "Colorful Style Sheets"
          ],
          answer: "Cascading Style Sheets"
        },
      ],
      "Multiple Choice Question": [
        {
          id: "FE_MCQ_1",
          content: "Which of the following are valid HTTP methods? (Select all that apply)",
          options: ["GET", "POST", "FETCH", "DELETE"],
          answer: ["GET", "POST", "DELETE"]
        }
      ],
      "Judgement Question": [
        {
          id: "FE_JQ_1",
          content: "JavaScript is a statically typed language.",
          answer: false
        }
      ],
      "Short Answer Question": [
        {
          id: "FE_SQ_1",
          content: "Explain the concept of closure in JavaScript and provide an example.",
          answer: "A closure is..."
        }
      ]
    }
  };

  return (
    <Box m="20px" sx={{ height: 'calc(100vh - 140px)' }}>
      <Header 
        title="Exam Preview" 
        subtitle={examData.title}
        backButton={
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2 }}
          >
            Back to Exams
          </Button>
        }
      />

      <Grid container spacing={2}>
        {/* left: exam information */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Exam Information
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">
                <strong>Course:</strong> {examData.course}
              </Typography>
              <Typography variant="body2">
                <strong>Duration:</strong> {examData.duration}
              </Typography>
              <Typography variant="body2">
                <strong>Total Score:</strong> {examData.totalScore}
              </Typography>
              <Typography variant="body2">
                <strong>Description:</strong> {examData.description}
              </Typography>
            </Box>
          </Paper>

          {/* question type summary */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Question Summary
            </Typography>
            <Divider sx={{ my: 1 }} />
            {Object.entries(examData.questions).map(([type, questions]) => (
              <Box 
                key={type} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 1 
                }}
              >
                <Typography variant="body2">{type}:</Typography>
                <Typography variant="body2">
                  {questions.length} questions
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* right: question list */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2, mb: 2 }}>
            {Object.entries(examData.questions).map(([type, questions]) => (
              <Box key={type}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  {type}
                </Typography>
                {questions.map((question, index) => (
                  <QuestionItem 
                    key={question.id}
                    question={question}
                    index={index}
                    type={type}
                  />
                ))}
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
