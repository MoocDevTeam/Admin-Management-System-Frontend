import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import toast from "react-hot-toast";
import StyledSection from "../../../../components/course/course/StyledSection";
import Header from "../../../../components/header";
import FlexList from "../../../../components/course/course/FlexList";
import getRequest from "../../../../request/getRequest";

export default function CourseSingle() {
  const { courseId } = useParams();
  const dispatch = useDispatch(); 
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!course) {
      const fetchCourse = async () => {
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
      fetchCourse();
    } else {
      setLoading(false);
    }
  }, [courseId, course, dispatch]);

  if (loading) {
    return (
      <Box m="20px">
        <Header title="Course" subtitle="Loading course data..." />
        <Skeleton variant="rounded" width="100%" height={100} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px">
        <Header title="Course" subtitle="Error loading course data" />
        <Typography sx={{ marginBottom: 4, color: "red" }}>{error}</Typography>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box m="20px">
        <Header title="Course" subtitle="Course not found" />
        <Typography>No course data available.</Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="Course" subtitle="Managing single course" />

      <StyledSection>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          {course.title}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            marginBottom: "8px",
          }}
        >
          {`Categories: ${course.categoryid}`}
        </Typography>
        <Typography variant="body1">{`Description: ${course.description}`}</Typography>
      </StyledSection>

      <StyledSection sx={{ marginTop: "16px" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Course Publish
        </Typography>

        {course?.courseInstances?.length > 0 ? (
          <FlexList>
            {course.courseInstances.map((instance) => (
              <Link
                key={instance.id}
                to={`/course/${course.title}/CourseInstance/${instance.id}`}
                style={{ textDecoration: "none" }}
              >
                <Typography>{instance.description}</Typography>
              </Link>
            ))}
          </FlexList>
        ) : (
          <Typography>No course instances available.</Typography>
        )}
      </StyledSection>
    </Box>
  );
}
