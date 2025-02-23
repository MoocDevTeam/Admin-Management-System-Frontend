import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import { useLocation } from "react-router-dom";
import getRequest from "../../request/getRequest";
import postRequest from "../../request/postRequest";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-hot-toast";
import colors, { theme } from "../../theme";
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
} from "@mui/material";

export const AssignCourseInstance = () => {
  const location = useLocation();
  const teacherId = location.state?.teacherId;
  const [courseInstanceDetail, setCourseInstanceDetail] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [instances, setInstances] = useState([]);

  console.log("filtered course", filteredCourses);
  console.log("course", courses);
  console.log("instances", instances);

  //handle search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);
    setFilteredCourses(
      courses.filter((course) => course.title.toLowerCase().includes(value))
    );
  };

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
      setFilteredCourses(result.data);
    } else {
      setCourses([]);
      setFilteredCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  //fetch courseInstance by course id (when hovering over actiuon button)
  useEffect( () => {
    if (activeCourseId) {
      fetchCourseInstanceByCourseId(activeCourseId);
    }
  }, [activeCourseId]);
  const fetchCourseInstanceByCourseId = async (courseId) => {
    setLoading(true);
    let result = await getRequest(
      `/MoocCourse/GetCourseInstancesByCourseId/${courseId}`
    );
    if (result.isSuccess) {
      console.log("hover result", result.data);
      setInstances(result.data);
      setLoading(false);
    } else {
      console.log("Failed to fetch course instance");
      setInstances([]);
      setLoading(false);
    }
  };

  //handel hover to load course instance
  const handleHover = (event, courseId) => {
    setAnchorEl(event.currentTarget);
    setActiveCourseId(courseId);
    console.log("instances now", instances);
  };

  //handle close popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  //handle assign course
  const handleAssignCourse = async (courseInstanceId) => {
    let result = await postRequest(`/TeacherCourseInstance/AssignTeacherToCourseInstance`, {
      teacherId: teacherId,
      courseInstanceId: courseInstanceId
    }
    );
    if (result.isSuccess) {
      console.log("course assigned successfully");
      toast.success("Course assigned successfully!");
      getAssignedCourses(teacherId);
      handleClose();
    } else {
      console.log("Failed to assign course");
      toast.error("Failed to assign course!");
    }
  };

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
                value={searchText}
                onChange={handleSearch}
                style={{ marginBottom: 20 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                
              ></TextField>
            </div>
            {/* Table content */}
            <TableContainer component={Paper} sx={{ minWidth: 650 }}>
              <Table>
                <TableHead sx={{ backgroundColor: colors.blueAccent[700] }}>
                  <TableRow>
                    <TableCell>Course Title</TableCell>
                    <TableCell>Course Code</TableCell>
                    <TableCell>Course Category</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.courseCode}>
                      <TableCell>{course.title}</TableCell>
                      <TableCell>{course.courseCode}</TableCell>
                      <TableCell>{course.categoryName}</TableCell>
                      <TableCell>
                        <Button
                          onMouseEnter={(e) => handleHover(e, course.id)}
                          variant="contained"
                          color="primary"
                          onClose={handleClose}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box
                sx={{
                  p: 1,
                  paddingLeft: 2,
                  bgcolor: theme.palette.secondary.main,
                  color: "white",
                }}
              >
                <h4>Available Course Launch</h4>
              </Box>

              {instances.length === 0 ? (
                loading ? (
                  <Box display="flex" justifyContent="center" m="20px">
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box display="flex" justifyContent="center" m="20px">
                  <h5>"No course launch under this course."</h5>
                  </Box>
                )
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {instances.map((instance) => (
                        <TableRow key={instance.id}>
                          <TableCell>
                            {dayjs(instance.startDate).format("lll")}
                          </TableCell>
                          <TableCell>
                            {dayjs(instance.endDate).format("lll")}
                          </TableCell>
                          <TableCell>
                            <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => handleAssignCourse(instance.id)}
                            >
                              Assign
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Popover>
          </Box>
        </Box>
      </Box>
    </>
  );
};
