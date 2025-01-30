import React, { useState } from "react";
import { 
  Box, 
  Button, 
  Stack, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Paper,
  Checkbox
} from "@mui/material";
import Header from "../../../components/header";
import colors from "../../../theme";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate } from "react-router-dom";
import QuestionForm from '../../../components/examManagement/questions/questionForm';
import DeleteConfirmDialog from '../../../components/examManagement/questions/deleteConfirmDialog';
import TablePagination from '../../../components/tablePagination';
import {
  MultipleChoiceDetails,
  ChoiceQuestionDetails,
  JudgementQuestionDetails,
  ShortAnswerDetails
} from '../../../components/examManagement/questions/details';

// row component
function Row({ row, onEdit, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const renderQuestionDetails = () => {
    switch (row.type) {
      case "Multiple Choice Question":
        return <MultipleChoiceDetails options={row.options} />;
      
      case "Choice Question":
        return <ChoiceQuestionDetails options={row.options} />;
      
      case "Judgement Question":
        return <JudgementQuestionDetails 
          answer={row.answer} 
          explanation={row.explanation} 
        />;
      
      case "Short Answer Question":
        return <ShortAnswerDetails answer={row.answer} />;
      
      default:
        return null;
    }
  };

  // the edit button
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(row);  // call the parent component's handleEdit function
  };

  return (
    <>
      <TableRow 
        sx={{ 
          '& > *': { borderBottom: 'unset' },
          transition: 'all 0.2s ease',
          '&:hover': { 
            transform: 'translateX(6px)',
            '& .MuiIconButton-root': {
              color: colors.blueAccent[400]
            }
          }
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onChange={(event) => {
              event.stopPropagation();
              onSelect(row.id, event.target.checked);
            }}
          />
        </TableCell>
        <TableCell align="right">{row.id}</TableCell>
        <TableCell padding="checkbox">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.title}</TableCell>
        <TableCell>{row.type}</TableCell>
        <TableCell>
          <Chip 
            label={row.difficulty} 
            color={
              row.difficulty === "Easy" ? "success" : 
              row.difficulty === "Medium" ? "warning" : "error"
            }
            size="small"
          />
        </TableCell>
        <TableCell>{row.category}</TableCell>
        <TableCell>{row.score}</TableCell>
        <TableCell>
          <Button
            variant="text"
            size="small"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {renderQuestionDetails()}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function Questions() {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // TODO: Replace mockData with API calls
  // Expected API endpoints:
  // GET /api/questions - fetch questions list with pagination
  // POST /api/questions - create new question
  // PUT /api/questions/:id - update question
  // DELETE /api/questions/:id - delete question
  const mockData = {
    items: [
      { 
        id: 1, 
        title: "What is React?", 
        type: "Choice Question", 
        difficulty: "Easy", 
        category: "Frontend", 
        score: 5,
        options: [
          { 
            id: 'A', 
            text: 'A JavaScript library for building user interfaces', 
            correct: true,
            explanation: 'React is indeed a JavaScript library maintained by Facebook/Meta, specifically designed for building user interfaces'
          },
          { 
            id: 'B', 
            text: 'A programming language', 
            correct: false,
            explanation: 'React is not a programming language - it is a library written in JavaScript'
          },
          { 
            id: 'C', 
            text: 'A database management system', 
            correct: false,
            explanation: 'React has nothing to do with database management, it is purely for frontend UI development'
          },
          { 
            id: 'D', 
            text: 'A web server', 
            correct: false,
            explanation: 'React runs in the browser, not on the server side. It is a client-side library'
          }
        ]
      },
      { 
        id: 2, 
        title: "Is JavaScript a compiled language?", 
        type: "Judgement Question", 
        difficulty: "Easy", 
        category: "Frontend", 
        score: 3,
        answer: false,
        explanation: "JavaScript is an interpreted language, not a compiled language."
      },
      {
        id: 3,
        title: "What are the key principles of REST?",
        type: "Short Answer Question",
        difficulty: "Medium",
        category: "Backend",
        score: 10,
        answer: "The key principles of REST include: 1. Client-Server Architecture 2. Statelessness 3. Cacheability 4. Uniform Interface 5. Layered System"
      },
      {
        id: 4,
        title: "Which of the following is NOT a valid HTTP method?",
        type: "Choice Question",
        difficulty: "Medium",
        category: "Backend",
        score: 5,
        options: [
          { 
            id: 'A', 
            text: 'GET', 
            correct: false,
            explanation: 'GET is a valid HTTP method used to retrieve data from a server'
          },
          { 
            id: 'B', 
            text: 'POST', 
            correct: false,
            explanation: 'POST is a valid HTTP method used to submit data to a server'
          },
          { 
            id: 'C', 
            text: 'SEND', 
            correct: true,
            explanation: 'SEND is not a standard HTTP method. The standard methods are GET, POST, PUT, DELETE, PATCH, etc.'
          },
          { 
            id: 'D', 
            text: 'DELETE', 
            correct: false,
            explanation: 'DELETE is a valid HTTP method used to remove resources from a server'
          }
        ]
      },
      {
        id: 5,
        title: "HTML is a programming language.",
        type: "Judgement Question",
        difficulty: "Easy",
        category: "Frontend",
        score: 3,
        answer: false,
        explanation: "HTML is a markup language, not a programming language."
      },
      {
        id: 6,
        title: "Which of the following are JavaScript data types?",
        type: "Multiple Choice Question",
        difficulty: "Medium",
        category: "Frontend",
        score: 8,
        options: [
          {
            id: 'A',
            text: 'String',
            correct: true,
            explanation: 'String is a primitive data type in JavaScript'
          },
          {
            id: 'B',
            text: 'Number',
            correct: true,
            explanation: 'Number is a primitive data type in JavaScript'
          },
          {
            id: 'C',
            text: 'Integer',
            correct: false,
            explanation: 'JavaScript does not have a specific Integer type - all numbers are of type Number'
          },
          {
            id: 'D',
            text: 'Object',
            correct: true,
            explanation: 'Object is a non-primitive data type in JavaScript'
          }
        ]
      },
      {
        id: 7,
        title: "Which of the following HTTP status codes indicate a successful response? (Select all that apply)",
        type: "Multiple Choice Question",
        difficulty: "Medium",
        category: "Backend",
        score: 10,
        options: [
          {
            id: 'A',
            text: '200 OK',
            correct: true,
            explanation: '200 indicates that the request has succeeded'
          },
          {
            id: 'B',
            text: '201 Created',
            correct: true,
            explanation: '201 indicates that the request has succeeded and a new resource has been created'
          },
          {
            id: 'C',
            text: '404 Not Found',
            correct: false,
            explanation: '404 is a client error response, not a success response'
          },
          {
            id: 'D',
            text: '204 No Content',
            correct: true,
            explanation: '204 indicates that the request has succeeded but there is no content to send'
          }
        ]
      },
      {
        id: 8,
        title: "Which of the following are valid ways to create a React component? (Select all that apply)",
        type: "Multiple Choice Question",
        difficulty: "Easy",
        category: "Frontend",
        score: 6,
        options: [
          {
            id: 'A',
            text: 'Function Component',
            correct: true,
            explanation: 'Function components are the modern way to write React components'
          },
          {
            id: 'B',
            text: 'Class Component',
            correct: true,
            explanation: 'Class components are a traditional way to write React components'
          },
          {
            id: 'C',
            text: 'Arrow Function Component',
            correct: true,
            explanation: 'Arrow functions can be used to create valid React components'
          },
          {
            id: 'D',
            text: 'HTML Component',
            correct: false,
            explanation: 'HTML Component is not a valid way to create React components'
          }
        ]
      }
    ],
    total: 8
  };

  // TODO: Implement pagination with API
  // Expected query parameters:
  // page: current page number
  // pageSize: number of items per page
  // Example: GET /api/questions?page=1&pageSize=10
  const [pageSearch, setPageSearch] = useState({
    page: 1,
    pageSize: 10,
  });

  const handleEdit = (question) => {
    setSelectedQuestion(question);
    setEditModalOpen(true);
  };

  // handle question edit and add
  const handleQuestionSubmit = async (data, mode) => {
    try {
      if (mode === 'add') {
        // TODO: Implement API integration
        // API endpoint: POST /api/questions
        // const response = await api.post('/questions', data);
        console.log('Creating new question:', data);
      } else {
        // TODO: Implement API integration
        // API endpoint: PUT /api/questions/${data.id}
        // const response = await api.put(`/questions/${data.id}`, data);
        console.log('Updating question:', data);
      }
      
      // TODO: Implement API integration
      // API endpoint: GET /api/questions
      // const response = await api.get('/questions');
      console.log('Refreshing questions list');
      
      // close the corresponding modal
      if (mode === 'add') {
        setAddModalOpen(false);
      } else {
        setEditModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to save question:', error);
    }
  };

// Main container with fixed height and flex column layout
  return (
    <Box m="20px" sx={{ 
      height: 'calc(100vh - 140px)', // Fixed height based on viewport
      display: 'flex', 
      flexDirection: 'column'
    }}>
      <Header title="Questions Bank" subtitle="Manage your exam questions" />
      
      <Box sx={{ 
        flex: 1,  // Take remaining space
        display: 'flex', 
        flexDirection: 'column',
        mt: 4
      }}>
        {/* Buttons container */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddModalOpen(true)}
            >
              Add Question
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              disabled={selectedItems.length === 0}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Selected
            </Button>
          </Stack>
        </Box>

        <TableContainer 
          component={Paper} 
          sx={{ 
            flex: 1, // Take remaining space
            overflow: 'auto' // Enable vertical scrolling
          }}
        >
          <Table>
            {/* Table header */}
            <TableHead>
              <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedItems.length > 0 && selectedItems.length < mockData.items.length}
                    checked={mockData.items.length > 0 && selectedItems.length === mockData.items.length}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setSelectedItems(mockData.items.map(row => row.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell align="right">ID</TableCell>
                <TableCell padding="checkbox"></TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.items
                .slice(
                  (pageSearch.page - 1) * pageSearch.pageSize,
                  pageSearch.page * pageSearch.pageSize
                )
                .map((row) => (
                  <Row key={row.id} row={row} onEdit={handleEdit} selected={selectedItems.includes(row.id)} onSelect={(id, checked) => {
                    if (checked) {
                      setSelectedItems([...selectedItems, id]);
                    } else {
                      setSelectedItems(selectedItems.filter(item => item !== id));
                    }
                  }} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination container */}
        <Box sx={{ 
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider'
        }}>

          {/* Pagination component */}
          <TablePagination
            pageSize={pageSearch.pageSize}
            page={pageSearch.page}
            total={mockData.total}
            onPageChange={(newPage) => setPageSearch(prev => ({...prev, page: newPage}))}
            onPageSizeChange={(newPageSize) => setPageSearch(prev => ({...prev, pageSize: newPageSize}))}
          />
        </Box>
      </Box>

      {/* Add Question Modal */}
      <QuestionForm 
        open={addModalOpen}
        onClose={(data) => {
          if (data) {
            handleQuestionSubmit(data, 'add');
          } else {
            setAddModalOpen(false);
          }
        }}
        mode="add"
      />

      {/* Edit Question Modal */}
      <QuestionForm 
        open={editModalOpen}
        onClose={(data) => {
          if (data) {
            handleQuestionSubmit(data, 'edit');
          } else {
            setEditModalOpen(false);
          }
        }}
        question={selectedQuestion}
        mode="edit"
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={(confirmed) => {
          if (confirmed) {
            // TODO: Implement API integration
            // API endpoint: DELETE /api/questions
            // await Promise.all(selectedItems.map(id => api.delete(`/questions/${id}`)));
            // fetchQuestions();
            setSelectedItems([]);
          }
          setDeleteDialogOpen(false);
        }}
        selectedCount={selectedItems.length}
      />
    </Box>
  );
}
