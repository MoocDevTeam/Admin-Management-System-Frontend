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
} from "@mui/material";
import Header from "../../../components/header";
import colors from "../../../theme";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExamForm from "../../../components/exammanagement/exams/examForm";

function ExamRow({ row, onEdit, selected, onSelect }) {
  return (
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onChange={(event) => onSelect(row.id, event.target.checked)}
        />
      </TableCell>
      <TableCell align="right">{row.id}</TableCell>
      <TableCell>{row.title}</TableCell>
      <TableCell>{row.totalScore}</TableCell>
      <TableCell>{row.course}</TableCell>
      <TableCell>{row.duration}</TableCell>
      <TableCell>{row.publisher}</TableCell>
      <TableCell>{row.updater}</TableCell>
      <TableCell>{row.openRange}</TableCell>
      <TableCell>
        <Button variant="text" size="small" startIcon={<EditIcon />} onClick={() => onEdit(row)}>
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function Exams() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const mockData = [
    {
      id: 1,
      title: "Frontend Skill Check",
      totalScore: 100,
      course: "Frontend",
      duration: "2 hours",
      publisher: "Justin Hu",
      updater: "Kaiwen Luo",
      openRange: "2024-11-26 to 2024-12-12",
    },
    {
      id: 2,
      title: "Backend Skill Check",
      totalScore: 150,
      course: "Backend",
      duration: "3 hours",
      publisher: "Lily Jiang",
      updater: "Notail Wang",
      openRange: "2024-12-07 to 2024-12-23",
    },
    {
      id: 3,
      title: "Cloud Skill Check",
      totalScore: 100,
      course: "Backend",
      duration: "2 hours",
      publisher: "Kaiwen Luo",
      updater: "Lasky He",
      openRange: "2024-12-08 to 2024-12-24",
    },
  ];

  const handleEdit = (exam) => {
    setSelectedExam(exam);
    setEditModalOpen(true);
  };

  return (
    <Box m="20px">
      <Header title="Exams Management" subtitle="Manage your exams" />
      <Stack direction="row" spacing={2} justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddModalOpen(true)}>
          Add Exam
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={selectedItems.length === 0}
          onClick={() => alert('Delete selected exams')}
        >
          Delete Selected
        </Button>
      </Stack>
      <TableContainer component={Paper}>
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
      <ExamForm
        open={addModalOpen}
        onClose={(data) => {
          if (data) {
            console.log("Creating exam:", data);
          }
          setAddModalOpen(false);
        }}
        mode="add"
      />
      <ExamForm
        open={editModalOpen}
        onClose={(data) => {
          if (data) {
            console.log("Updating exam:", data);
          }
          setEditModalOpen(false);
        }}
        exam={selectedExam}
        mode="edit"
      />
    </Box>
  );
}
