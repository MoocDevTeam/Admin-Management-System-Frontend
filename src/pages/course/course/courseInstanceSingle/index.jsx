import React, { useState, useEffect } from "react";
import Header from "../../../../components/header";
import { useParams} from "react-router-dom";
import getRequest from "../../../../request/getRequest";
import { Box} from "@mui/material";
import toast from "react-hot-toast";
import StyledSection from "../../../../components/course/course/StyledSection";
import FileUploadPanel from "../../../../components/course/course/FileUploadPanel";
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
      {courseInstance && <Header title={courseInstance?.description} subtitle={`Managing course version ${courseInstance?.moocCourseId}`} />}

      {courseInstance &&
        <StyledSection  sx={{ marginTop: "16px" }}>
          <p>{`Total Sessions: ${courseInstance.totalSessions}`}</p>
          <p>{`Start Date: ${courseInstance.startDate}`}</p>
        </StyledSection>}

      {courseInstance &&
        <StyledSection  sx={{ marginTop: "16px" }}>
          <BasicStack list={courseInstance.sessions} />
        </StyledSection>}

      <FileUploadPanel />
    </Box>
  );
}
