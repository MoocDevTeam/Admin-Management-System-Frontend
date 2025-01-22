import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  TextField,
  Typography,
  Stack,
  Skeleton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../../../../store/courseSlice";
import getRequest from "../../../../request/getRequest";
import CourseCard from "../../../../components/course/course/CourseCard";
import FlexList from "../../../../components/course/course/FlexList";

export default function CourseList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedChip, setSelectedChip] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const courses = useSelector((state) => state.course.filteredCourses);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest(
          "/MoocCourse/getall",
          null,
          setLoading
        );
        if (response?.isSuccess) {
          dispatch(setCourses(response?.data));
          setFilteredCourses(response?.data);

          const uniqueCategories = [];
          response?.data.forEach((course) => {
            if (
              !uniqueCategories.some(
                (item) => item.categoryName === course.categoryName
              )
            ) {
              uniqueCategories.push({
                id: course.categoryId,
                categoryName: course.categoryName,
              });
            }
          });
          setCategories(uniqueCategories);
          setError("");
        } else {
          setError(
            response?.message || "An error occurred while fetching data."
          );
        }
      } catch (err) {
        setError("Failed to fetch data");
      }
    };
    fetchData();
  }, [dispatch]);

  // Handle chip for choosing category
  const handleChipClick = (chipIndex) => {
    setSelectedChip(chipIndex);
    const filtered =
      chipIndex === null // All course
        ? courses
        : courses.filter(
            (course) =>
              course.categoryName === categories[chipIndex]?.categoryName
          );
    setFilteredCourses(filtered);
  };

  // Search bar
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.categoryName.toLowerCase().includes(query)
    );
    setFilteredCourses(filtered);
  };

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>
        Manage Courses
      </Typography>

      {/* Chips and Search Bar */}
      <Box display="flex" alignItems="center" mb={2}>
        <Box
          sx={{ display: "flex", gap: 2, overflow: "auto", flexWrap: "wrap" }}
        >
          <Chip
            onClick={() => handleChipClick(null)}
            label="All Courses"
            variant={selectedChip == null ? "filled" : "outlined"}
          />
          {categories.map((category, index) => (
            <Chip
              key={category.id}
              label={category.categoryName}
              onClick={() => handleChipClick(index)}
              variant={selectedChip === index ? "filled" : "outlined"}
            />
          ))}
        </Box>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by title or category"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ ml: 2, width: "300px" }}
        />
      </Box>

      {/* Course List */}
      {loading && (
        <FlexList>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" width={300} height={100} />
          ))}
        </FlexList>
      )}

      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && filteredCourses.length === 0 && (
        <Typography>No courses found.</Typography>
      )}

      {!loading && !error && filteredCourses.length > 0 && (
        <FlexList>
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/course/${course.id}`}
              style={{ textDecoration: "none", display: "flex" }}
            >
              <CourseCard
                title={course.title}
                category={`Category: ${course.categoryName || "N/A"}`}
                description={course.description || "No description available"}
                imageUrl={course.coverImage}
              />
            </Link>
          ))}
        </FlexList>
      )}
    </Box>
  );
}
