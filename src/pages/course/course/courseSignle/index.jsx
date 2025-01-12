import React, { useState, useEffect } from "react";
import getRequest from "../../../../request/getRequest";
import StyledSection from "../../../../components/course/course/StyledSection";
import Header from "../../../../components/header";
import Skeleton from "@mui/material/Skeleton";
import toast from "react-hot-toast";
import { Box, Typography } from "@mui/material";
import FlexList from "../../../../components/course/course/FlexList";
import { Link } from "react-router-dom";


export default function CourseSingle() {
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest("/MoocCourse/GetByCourseName/React", null, setLoading);
        if (response?.isSuccess) {
          console.log("response: ", response)
          setCourse(response?.data || []);
          setError("");
        } else {
          const errorMessage = response?.message || "An error occurred while fetching data.";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err) {
        setError("Failed to fetch data");
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  return (
    <Box m="20px">
      <Header title="Course" subtitle="Managing single course" />

      {loading &&
        <Skeleton variant="rounded" width="100%" height={100} />
      }

      {error && (
        <Typography sx={{ marginBottom: 4 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && course && (
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
      )}



      <StyledSection sx={{ marginTop: "16px", }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Course Publish
        </Typography>
        {loading && (
          <FlexList>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" width={300} height={100} />
            ))}
          </FlexList>
        )}

        {error && (
          <Typography sx={{ marginBottom: 4 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && course && (
          <>
            {course?.courseInstances?.map((instance, index) => (
              <Link
                key={course.courseCode}
                to={`/course/${course.title}/CourseInstance/${instance.id}`}
                style={{ textDecoration: "none" }}
              >
                <p key={index}>
                  {instance.description}
                </p>
              </Link>

            ))}
          </>
        )}


        {/* {!loading && !error && course.instance.length === 0 && (
        <Typography align="center" sx={{ marginBottom: 4 }}>
          No courses available at the moment.
        </Typography>
      )} */}
      </StyledSection>
    </Box>
  );
}
