import React, { useEffect, useState } from "react";
import colors from "../../theme";
import Header from "../../components/header";
import { useLocation } from "react-router-dom";
import getRequest from "../../request/getRequest";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Popover,
  CircularProgress,
  Typography,
} from "@mui/material";
import { filterCourses } from "../../store/courseSlice";

export const AssignCourseInstance = () => {
  const location = useLocation();
  const teacherId = location.state?.teacherId;
  const [courseInstanceDetail, setCourseInstanceDetail] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  //Get assigned courses section
  const getAssignedCourses = async (id) => {
    let result = await getRequest(
      `teachercourseInstance/getallcourseinstancebyteacherid?id=${id}`
    );
    if (result.isSuccess) {
      console.log(result.data);
      setCourseInstanceDetail(result.data);
    } else {
      setCourseInstanceDetail([]);
    }
  };
  useEffect(() => {
    if (teacherId) {
      getAssignedCourses(teacherId);
    }
  }, [teacherId]);

  //Assign courses section
  //Fetch courses
  const fetchCourses = async () => {
    let result = await getRequest("/mooccourse/getall");
    if (result.isSuccess) {
      setCourses(result.data);
      setFilteredCourses(result.data)
    } else {
      setCourses([]);
      setFilteredCourses([])
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <Box m="20px">
        <Header
          title="Assignment"
          subtitle="Assign course to a specific teacher"
        ></Header>
        <Box
          m="40px 0 0 0"
          minHeight={"500px"}
          minWidth={"500px"}
          width="99%"
          height={"100%"}
        >
          <Box>
            <h3>Course(s) assigned to teacher id {teacherId}</h3>
          </Box>

          <Box>
            {courseInstanceDetail.length === 0 ? (
              "No course assigned to this teacher!"
            ) : (
              <TableContainer component={Paper} sx={{ minWidth: 650 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead sx={{ backgroundColor: colors.blueAccent[700] }}>
                    <TableRow>
                      <TableCell>Assigned Course</TableCell>
                      <TableCell align="right">Publish Details</TableCell>
                      <TableCell align="right">Status</TableCell>
                      <TableCell align="right">Start Date</TableCell>
                      <TableCell align="right">End Date</TableCell>
                      <TableCell align="right">Operation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courseInstanceDetail?.map((item) => (
                      <TableRow
                        key={item.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {item.moocCourseTitle}
                        </TableCell>
                        <TableCell align="right">{item.description}</TableCell>
                        <TableCell align="right">{item.status}</TableCell>
                        <TableCell align="right">
                          {dayjs(item.startDate).format("lll")}
                        </TableCell>
                        <TableCell align="right">
                          {dayjs(item.startDate).format("lll")}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            color="error"
                            variant="contained"
                            startIcon={<DeleteIcon />}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
          <Box
            m="40px 0 0 0"
            minHeight={"500px"}
            minWidth={"500px"}
            width="100%"
            height={"100%"}
            sx={{
              borderRadius: "5px",
              
            }}
          >
            <div>
              <TextField
                label="Search Courses"
                variant="outlined"
                // value={searchText}
                // onChange={handleSearch}
                style={{ marginBottom: 20 }}
              ></TextField>
            </div>
            {/* Table content */}
            <TableContainer component={Paper} sx={{ minWidth: 650 }}>
              <Table>
                <TableHead sx={{backgroundColor: colors.blueAccent[700]}}>
                  <TableRow>
                    <TableCell>Course Title</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.courseCode}>
                      <TableCell>{course.title}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                        >View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </>
  );
};
