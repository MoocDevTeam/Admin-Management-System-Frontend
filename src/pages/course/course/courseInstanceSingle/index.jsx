import React, { useState, useEffect } from "react";
import Header from "../../../../components/header";
import { useParams } from "react-router-dom";
import getRequest from "../../../../request/getRequest";
import { Box, Typography } from "@mui/material";
import toast from "react-hot-toast";
import StyledSection from "../../../../components/course/course/StyledSection";
import BasicStack from "../../../../components/course/course/Stack";

export default function CourseInstanceSingle() {
  const { courseId, courseInstanceId } = useParams();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null)

  const courseInstance = course
    ? course.courseInstances?.find((instance) => Number(instance.id) === Number(courseInstanceId))
    : null;

  useEffect(() => {
    if (!course) {
      const fetchCourses = async () => {
        try {
          const response = await getRequest(`/MoocCourse/GetByCourseName/${courseId}`, null, setLoading);
          if (response?.isSuccess) {
            setCourse(response.data)
            setError("");
          } else {
            const errorMessage = response?.message || "An error occurred while fetching data.";
            setError(errorMessage);
            toast.error(errorMessage);
          }
        } catch (err) {
          setError("Failed to fetch data");
          toast.error("Failed to fetch data");
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    } else {
      setLoading(false);
    }
  }, [courseId, course]);

  if (!courseInstance) {
    return <div>Course Instance not found</div>;
  }

  return (
    <Box m="20px">
      {courseInstance && <Header title={courseId + " " + courseInstance?.description} subtitle={`Managing course version`} />}

      {courseInstance &&
        <StyledSection sx={{ marginTop: "16px" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Details
          </Typography>
          {/* <Typography variant="body1">{`Total Sessions: ${courseInstance.totalSessions}`}</Typography> */}
          <Typography variant="body1">{`Created by: faculty staff ${courseInstance.createdByUserId}`}</Typography>
          <Typography variant="body1">{`Start Date: ${courseInstance.startDate}`}</Typography>
          <Typography variant="body1">{`End Date: ${courseInstance.endDate}`}</Typography>
        </StyledSection>}

      {courseInstance &&
          <StyledSection sx={{ marginTop: "16px", backgroundColor: "#f5f5f5" }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
              Outline
            </Typography>
            <BasicStack list={courseInstance.sessions} sx={{ marginTop: "16px"}}/>
          </StyledSection>
      }

    </Box>
  );
}
