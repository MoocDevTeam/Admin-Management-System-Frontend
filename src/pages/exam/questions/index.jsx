import React, { useState } from "react";
import { 
  Box, 
  Button, 
  Stack, 
  Modal, 
  Typography,
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
  Select,
  MenuItem,
  Checkbox
} from "@mui/material";
import Header from "../../../components/header";
import colors from "../../../theme";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import QuestionForm from './questionForm';
import DeleteConfirmDialog from './deleteConfirmDialog';

// 行组件
function Row({ row, onEdit, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const renderQuestionDetails = () => {
    switch (row.type) {
      case "Choice Question":
        return (
          <Box sx={{ 
            border: 1, 
            borderColor: 'divider',
            borderRadius: 1,
            mx: 2,
            my: 1,
            width: '100%'
          }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '8%' }}>Option</TableCell>
                  <TableCell sx={{ width: '25%' }}>Answer</TableCell>
                  <TableCell sx={{ 
                    width: '52%', 
                    pl: 4,
                    pr: 4  // 添加右侧padding
                  }}>Explanation</TableCell>
                  <TableCell sx={{ 
                    width: '15%',
                    pl: 3 
                  }}>Correct</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {row.options.map((option) => (
                  <TableRow key={option.id}>
                    <TableCell sx={{ height: '48px', verticalAlign: 'middle' }}>
                      {option.id}
                    </TableCell>
                    <TableCell sx={{ height: '48px', verticalAlign: 'middle' }}>
                      {option.text}
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        height: '48px', 
                        verticalAlign: 'middle',
                        pl: 4,  // 左侧padding
                        pr: 4,  // 右侧padding
                        width: '52%',  // 固定宽度
                        maxWidth: '52%',  // 最大宽度
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {option.explanation || '-'}
                    </TableCell>
                    <TableCell sx={{ 
                      height: '48px', 
                      verticalAlign: 'middle', 
                      pl: 3,
                      width: '15%'  // 固定宽度
                    }}>
                      <Box sx={{ 
                        minHeight: '32px', 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'flex-start'  // 左对齐
                      }}>
                        {option.correct && (
                          <Chip 
                            label="Correct" 
                            color="success" 
                            size="small" 
                          />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        );
      case "Judgement Question":
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Answer: {row.answer ? "True" : "False"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Explanation: {row.explanation}
            </Typography>
          </Box>
        );
      case "Short Answer Question":
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Answer:
            </Typography>
            <Box sx={{ 
              p: 2, 
              bgcolor: colors.primary[400], 
              borderRadius: 1,
              border: `1px solid ${colors.primary[300]}`
            }}>
              <Typography>{row.answer}</Typography>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  // 编辑按钮的处理函数
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(row);  // 调用父组件传入的处理函数
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

  // 模拟数据
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
      }
    ],
    total: 5
  };

  // 添加分页状态
  const [pageSearch, setPageSearch] = useState({
    page: 1,
    pageSize: 10,
  });

  const handleEdit = (question) => {
    setSelectedQuestion(question);
    setEditModalOpen(true);
  };

  // 处理添加和更新的回调
  const handleQuestionSubmit = async (data, mode) => {
    try {
      if (mode === 'add') {
        // 调用创建API
        // const response = await api.post('/questions', data);
        console.log('Creating new question:', data);
      } else {
        // 调用更新API
        // const response = await api.put(`/questions/${data.id}`, data);
        console.log('Updating question:', data);
      }
      
      // 刷新题目列表
      // fetchQuestions();
      
      // 关闭对应的modal
      if (mode === 'add') {
        setAddModalOpen(false);
      } else {
        setEditModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to save question:', error);
    }
  };

  return (
    <Box m="20px">
      <Header title="Questions Bank" subtitle="Manage your exam questions" />
      
      <Box m="40px 0 0 0">
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

        <TableContainer component={Paper}>
          <Table>
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
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Stack spacing={2} direction="row" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Rows per page:
              </Typography>
              <Select
                value={pageSearch.pageSize}
                onChange={(e) => setPageSearch(prev => ({...prev, pageSize: e.target.value}))}
                size="small"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </Select>
              <Typography variant="body2" color="text.secondary">
                {`${(pageSearch.page - 1) * pageSearch.pageSize + 1}-${Math.min(pageSearch.page * pageSearch.pageSize, mockData.total)} of ${mockData.total}`}
              </Typography>
              <IconButton 
                onClick={() => setPageSearch(prev => ({...prev, page: prev.page - 1}))}
                disabled={pageSearch.page === 1}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
              <IconButton
                onClick={() => setPageSearch(prev => ({...prev, page: prev.page + 1}))}
                disabled={pageSearch.page * pageSearch.pageSize >= mockData.total}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            </Stack>
          </Box>
        </TableContainer>
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
            // TODO: 刷新题目列表
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
