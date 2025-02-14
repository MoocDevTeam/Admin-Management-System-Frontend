import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import colors from "../../theme";
import Header from "../../components/header";
import { useLocation } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import getRequest from "../../request/getRequest";

export const AssignCourseInstance = () => {
  const location = useLocation();
  const teacherId = location.state?.teacherId;
  const [courseInstanceDetail, setCourseInstanceDetail] = useState([]);

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
      if(teacherId) {
        getAssignedCourses(teacherId);
      }
    }, [teacherId]);

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
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <Box>
            <h3>"Course(s) assigned to teacher id {teacherId}</h3>
          </Box>

          <Box>
            {courseInstanceDetail.length === 0 ? (
              "No course assigned to this teacher" 
            ) : (
              <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Assigned Course</TableCell>
                    <TableCell align="right">Publish Details</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Start Date</TableCell>
                    <TableCell align="right">End Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courseInstanceDetail?.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {item.moocCourseTitle}
                      </TableCell>
                      <TableCell align="right">{item.description}</TableCell>
                      <TableCell align="right">{item.status}</TableCell>
                      <TableCell align="right">{item.startDate}</TableCell>
                      <TableCell align="right">{item.endDate}</TableCell>
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
            width="99%"
            height={"100%"}
            sx={{ 
              border: "1px solid black", padding: 2, 
              borderRadius: "5px"
            }}
          >
            <h3>This area is to assign teacher a course</h3>
            
          </Box>
        </Box>
      </Box>
    </>
  );
};
