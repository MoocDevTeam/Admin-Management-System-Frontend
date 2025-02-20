import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Collapse,
  IconButton,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import Header from "../../../components/header";
import colors from "../../../theme";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ExamForm from "../../../components/exammanagement/exams/examForm";
import TablePagination from '../../../components/tablePagination';
import DeleteConfirmDialog from '../../../components/exammanagement/questions/deleteConfirmDialog';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useNavigate } from "react-router-dom";

function ExamRow({ row, onEdit, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(row);
  };

  // Colors for pie chart - use fixed colors instead of getting from theme
  const COLORS = [
    '#4caf50', // green
    '#2196f3', // blue
    '#f44336', // red
    '#ff9800'  // orange
  ];

  // add error handling
  if (!row || !row.questions) {
    return null; // or return a loading state or error prompt
  }

  // Prepare data for pie chart
  const pieData = Object.entries(row.questions).map(([type, questions]) => ({
    name: type,
    value: Array.isArray(questions) ? questions.length : 0,
    score: (Array.isArray(questions) ? questions.length : 0) * (
      type === "Choice Question" ? 2 :
      type === "Multiple Choice Question" ? 4 :
      type === "Judgement Question" ? 2 :
      type === "Short Answer Question" ? 10 : 0
    )
  }));

  return (
    <>
      <TableRow 
        sx={{ 
          '& > *': { borderBottom: 'unset' },
          transition: 'all 0.2s ease',
          '&:hover': { 
            transform: 'translateX(6px)',
            '& .MuiIconButton-root': {
              color: '#2196f3'
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
        <TableCell>{row.totalScore}</TableCell>
        <TableCell>{row.course}</TableCell>
        <TableCell>{row.duration}</TableCell>
        <TableCell>{row.publisher}</TableCell>
        <TableCell>{row.updater}</TableCell>
        <TableCell>{row.openRange}</TableCell>
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Exam Details
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {/* Question Distribution with Chart */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Question Distribution
                    </Typography>
                    {pieData.length > 0 ? (
                      <>
                        <Box sx={{ height: 300, width: '100%' }}>
                          <ResponsiveContainer>
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                  />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value, name) => [
                                  `Questions: ${value}
                                   Score: ${pieData.find(item => item.name === name)?.score}`,
                                  name
                                ]}
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                        
                        <Box sx={{ mt: 2 }}>
                          {pieData.map((item, index) => (
                            <Box 
                              key={item.name} 
                              sx={{ 
                                mb: 1, 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center' 
                              }}
                            >
                              <Typography variant="body2" color="text.secondary">
                                {item.name}:
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                  label={`${item.value} questions`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                                <Chip
                                  label={`${item.score} points`}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No questions added yet
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                {/* Additional Information */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Additional Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Created by: {row.publisher}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Creation Date: 2024-01-15
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Modified: 2024-01-20
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: <Chip 
                          label={row.status || "Draft"} 
                          size="small"
                          color={row.status === "Published" ? "success" : "default"}
                        />
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Description: {row.description || "No description provided"}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* Preview Button */}
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/exam/preview/${row.id}`);
                  }}
                >
                  Preview Exam
                </Button>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function Exams() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageSearch, setPageSearch] = useState({
    page: 1,
    pageSize: 10,
  });

  const mockData = [
    {
      id: 1,
      title: "Frontend Skill Check",
      totalScore: 100,
      course: "Web Development",
      duration: "2 hours",
      publisher: "Justin Hu",
      updater: "Kaiwen Luo",
      openRange: "2024-11-26 to 2024-12-12",
      status: "Draft",
      description: "This is a comprehensive exam to test frontend development skills.",
      questions: {
        "Choice Question": ["FE_CQ_1", "FE_CQ_2", "FE_CQ_3", "FE_CQ_4", "FE_CQ_5"],
        "Multiple Choice Question": ["FE_MCQ_1", "FE_MCQ_2", "FE_MCQ_3"],
        "Judgement Question": ["FE_JQ_1", "FE_JQ_2", "FE_JQ_3", "FE_JQ_4"],
        "Short Answer Question": ["FE_SQ_1", "FE_SQ_2"]
      }
    },
    {
      id: 2,
      title: "Backend Skill Check",
      totalScore: 150,
      course: "Server-side Programming",
      duration: "3 hours",
      publisher: "Lily Jiang",
      updater: "Notail Wang",
      openRange: "2024-12-07 to 2024-12-23",
      status: "Published",
      description: "Comprehensive backend development skills assessment",
      questions: {
        "Choice Question": ["BE_CQ_1", "BE_CQ_2", "BE_CQ_3"],
        "Multiple Choice Question": ["BE_MCQ_1", "BE_MCQ_2", "BE_MCQ_3", "BE_MCQ_4"],
        "Judgement Question": ["BE_JQ_1", "BE_JQ_2"],
        "Short Answer Question": ["BE_SQ_1", "BE_SQ_2", "BE_SQ_3"]
      }
    },
    {
      id: 3,
      title: "Cloud Skill Check",
      totalScore: 100,
      course: "Cloud Computing",
      duration: "2 hours",
      publisher: "Kaiwen Luo",
      updater: "Lasky He",
      openRange: "2024-12-08 to 2024-12-24",
      status: "Draft",
      description: "Cloud computing and infrastructure assessment",
      questions: {
        "Choice Question": ["CL_CQ_1", "CL_CQ_2", "CL_CQ_3", "CL_CQ_4"],
        "Multiple Choice Question": ["CL_MCQ_1", "CL_MCQ_2"],
        "Judgement Question": ["CL_JQ_1", "CL_JQ_2", "CL_JQ_3"],
        "Short Answer Question": ["CL_SQ_1"]
      }
    },
  ];

  const handleEdit = (exam) => {
    setSelectedExam(exam);
    setEditModalOpen(true);
  };

  const handleExamSubmit = (data, mode) => {
    if (mode === 'add') {
      console.log('Adding exam:', data);
      setAddModalOpen(false);
    } else {
      console.log('Editing exam:', data);
      setEditModalOpen(false);
    }
  };

  return (
    <Box m="20px" sx={{ 
      height: 'calc(100vh - 140px)',
      display: 'flex', 
      flexDirection: 'column'
    }}>
      <Header title="Exams Management" subtitle="Manage your exams" />
      
      <Box sx={{ 
        flex: 1,
        display: 'flex', 
        flexDirection: 'column',
        mt: 4
      }}>
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddModalOpen(true)}
            >
              Add Exam
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
            flex: 1,
            overflow: 'auto'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: colors.blueAccent[700] }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedItems.length > 0 && selectedItems.length < mockData.length}
                    checked={mockData.length > 0 && selectedItems.length === mockData.length}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setSelectedItems(mockData.map((row) => row.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell align="right">ID</TableCell>
                <TableCell padding="checkbox">Expand</TableCell>
                <TableCell>Exam Title</TableCell>
                <TableCell>Total Score</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Publisher</TableCell>
                <TableCell>Updater</TableCell>
                <TableCell>Open Range</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.map((row) => (
                <ExamRow
                  key={row.id}
                  row={row}
                  onEdit={handleEdit}
                  selected={selectedItems.includes(row.id)}
                  onSelect={(id, checked) => {
                    if (checked) {
                      setSelectedItems([...selectedItems, id]);
                    } else {
                      setSelectedItems(selectedItems.filter((item) => item !== id));
                    }
                  }}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ 
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider'
        }}>
          <TablePagination
            pageSize={pageSearch.pageSize}
            page={pageSearch.page}
            total={mockData.length}
            onPageChange={(newPage) => setPageSearch(prev => ({...prev, page: newPage}))}
            onPageSizeChange={(newPageSize) => setPageSearch(prev => ({...prev, pageSize: newPageSize}))}
          />
        </Box>
      </Box>

      <ExamForm 
        open={addModalOpen}
        onClose={(data) => {
          if (data) {
            handleExamSubmit(data, 'add');
          } else {
            setAddModalOpen(false);
          }
        }}
        mode="add"
      />

      <ExamForm 
        open={editModalOpen}
        onClose={(data) => {
          if (data) {
            handleExamSubmit(data, 'edit');
          } else {
            setEditModalOpen(false);
          }
        }}
        exam={selectedExam}
        mode="edit"
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={(confirmed) => {
          if (confirmed) {
            console.log('Deleting exams:', selectedItems);
            setSelectedItems([]);
          }
          setDeleteDialogOpen(false);
        }}
        selectedCount={selectedItems.length}
      />
    </Box>
  );
}
