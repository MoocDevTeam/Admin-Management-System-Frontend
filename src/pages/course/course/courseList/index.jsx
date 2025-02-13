import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  TextField,
  Typography,
  Stack,
  Skeleton,
  Modal,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../../../../store/courseSlice";
import getRequest from "../../../../request/getRequest";
import CourseCard from "../../../../components/course/course/CourseCard";
import FlexWrap from "../../../../components/course/shared/FlexWrap";
import { setCurrentCategories } from "../../../../store/categorySlice";
import AddCourseModal from "../../../../components/course/course/addCourseModal";
import FilterMenu from "../../../../components/course/course/FilterMenu";
import Header from "../../../../components/header";

export default function CourseList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedChip, setSelectedChip] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    title: "",
    courseCode: "",
    coverImage: "",
    description: "",
    categoryId: 1,
  });

  const dispatch = useDispatch();
  const courses = useSelector((state) => state.course.courses);
  const categoryLocal = useSelector((state) => state.category.setCategories);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseResponse = await getRequest(
          "/MoocCourse/getall",
          null,
          setLoading
        );
        if (courseResponse?.isSuccess) {
          dispatch(setCourses(courseResponse?.data));
          setFilteredCourses(courseResponse?.data);
          setError("");
        } else {
          setError(
            courseResponse?.message || "An error occurred while fetching data."
          );
        }
      } catch (err) {
        setError("Failed to fetch data", err);
      }
    };
    fetchData();
  }, [dispatch]);
  // process category with unlimited level
  // store categoryName,id and children
  function processCategory(category) {
    const categoryWithChildren = {
      categoryName: category.categoryName,
      id: String(category.id),
      label: category.categoryName,
      children: [],
    };
    category.childrenCategories.forEach((childCategory) => {
      categoryWithChildren.children.push(processCategory(childCategory));
    });
    return categoryWithChildren;
  }
  // fetch category data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await getRequest(
          "/Category/GetAllCategories",
          null,
          setLoading
        );
        if (categoryResponse?.isSuccess) {
          console.log("get category", categoryResponse?.data);
          const uniqueCategoriesList = [];
          categoryResponse.data.forEach((category) => {
            uniqueCategoriesList.push(processCategory(category));
          });
          console.log("processCategory", uniqueCategoriesList);
          dispatch(setCurrentCategories(uniqueCategoriesList));
          setCategories(uniqueCategoriesList);
          setError("");
        } else {
          setError(
            categoryResponse?.message ||
              "An error occurred while fetching data."
          );
        }
      } catch (err) {
        setError("Failed to fetch data", err);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleChipClick = (chipIndex) => {
    setSelectedChip(chipIndex);
    const filtered =
      chipIndex === null
        ? courses
        : courses.filter(
          (course) =>
            course.categoryName === categories[chipIndex]?.categoryName
        );
    setFilteredCourses(filtered);
  };

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
      <Header
        title="Courses"
        subtitle="Managing All Courses"
      />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} >
        <Box display="flex" justifyContent="start" width="500px">
          <Box>
            <FilterMenu categories={categories} handleChipClick={handleChipClick} />
          </Box>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by Course Title"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ ml: 2, width: 300 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          Add Course
        </Button>
      </Box>

      {loading && (
        <FlexWrap>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" width={300} height={100} />
          ))}
        </FlexWrap>
      )}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && filteredCourses.length === 0 && (
        <Typography>No courses found.</Typography>
      )}
      {!loading && !error && filteredCourses.length > 0 && (
        <FlexWrap>
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
        </FlexWrap>
      )}
      {/* Popup add course page */}
      <Modal open={open} onClose={handleClose}>
        <AddCourseModal
          CourseData={newCourseData}
          categories={categories}
          handleClose={handleClose}
        />
      </Modal>
    </Box>
  );
}
