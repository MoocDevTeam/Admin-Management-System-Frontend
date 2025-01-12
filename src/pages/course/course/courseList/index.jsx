import React, { useState, useEffect } from "react";
import Header from "../../../../components/header";
import getRequest from "../../../../request/getRequest";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import FlexList from "../../../../components/course/course/FlexList";
import CourseCard from "../../../../components/course/course/CourseCard";
import Skeleton from "@mui/material/Skeleton";
import toast from "react-hot-toast";

export default function CourseList() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest("/MoocCourse/getall", null, setLoading);
        if (response?.isSuccess) {
          setCourses(response?.data || []);
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
      <Header title="Courses" subtitle="Managing all courses" />

      {loading && (
        <FlexList>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" width={300} height={100} />
          ))}
        </FlexList>
      )}

      {error && <Typography sx={{ marginBottom: 4 }}>
        {error}
      </Typography>}

      {!loading && !error && courses.length === 0 && (
        <Typography align="center" sx={{ marginBottom: 4 }}>
          No courses available at the moment.
        </Typography>
      )}

      {!loading && !error && courses.length > 0 && (
        <FlexList>
          {courses.map((course) => (
            <Link
              key={course.courseCode}
              to={`/course/${course.title}`}
              style={{ textDecoration: "none" }}
            >
              <CourseCard
                title={course.title}
                category={`Categories: ${course.categoryName || "N/A"}`}
                description={`Description: ${course.description || "No description available"}`}
              />
            </Link>
          ))}
        </FlexList>
      )}
    </Box>
  );
}
