import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Chip,
  Modal,
  Stack,
  TextField,
  Typography,
  Skeleton,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import StyledSection from "../../../../components/course/shared/StyledSection";
import Header from "../../../../components/header";
import BackButton from "../../../../components/course/shared/ReturnButton";
import getRequest from "../../../../request/getRequest";
import postRequest from "../../../../request/postRequest";
import colors from "../../../../theme";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentCategories } from "../../../../store";

function useCourse(courseId) {
  return useQuery(["course", courseId], () =>
    getRequest(`/MoocCourse/GetById/${courseId}`)
  );
}

function useUpdateCourse(courseId) {
  const queryClient = useQueryClient();

  return useMutation(
    (courseData) => postRequest(`/MoocCourse/update`, courseData),
    {
      onSuccess: (data) => {
        if (data.isSuccess) {
          queryClient.invalidateQueries(["course", courseId]);
          toast.success("Course updated successfully!");
        } else {
          toast.error(data.message || "Failed to update course.");
        }
      },
      onError: () => {
        toast.error("Failed to update course.");
      },
    }
  );
}

export default function CourseSingle() {
  const theme = useTheme();
  const { courseId } = useParams();
  const { data, isLoading, error } = useCourse(courseId);
  const updateCourseMutation = useUpdateCourse(courseId);

  const [modalOpen, setModalOpen] = useState(false);
  const [courseData, setCourseData] = useState({
    id: null,
    title: "",
    courseCode: "",
    coverImage: "",
    description: "",
  });

  const categories = useSelector((state) => state.category.currentCategories);
  console.log("course single currentCategories", categories);

  const handleOpen = () => {
    setCourseData({
      id: data?.data?.id,
      title: data?.data?.title || "",
      courseCode: data?.data?.courseCode || "",
      coverImage: data?.data?.coverImage || "",
      description: data?.data?.description || "",
    });
    setModalOpen(true);
  };

  const handleClose = () => setModalOpen(false);

  const handleChange = (event) => {
    setCourseData({
      ...courseData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateCourseMutation.mutate(courseData);
    handleClose();
  };

  return (
    <Box m="20px">
      <BackButton />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Header
          title={data?.data?.title || "Loading..."}
          subtitle="Managing single course"
        />
      </Stack>
      {isLoading && <Skeleton variant="rounded" width="100%" height={100} />}
      {error && (
        <Typography sx={{ marginBottom: 4 }}>
          {error.message || "Error fetching course."}
        </Typography>
      )}
      {!isLoading && !error && data && (
        <StyledSection>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", marginBottom: "16px" }}
            >
              Meta Data
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleOpen}>
              Edit
            </Button>
          </Box>
          <Typography variant="body1">{`Course Code: ${data.data.courseCode}`}</Typography>
          <Typography variant="body1">{`Description: ${data.data.description}`}</Typography>
          <Typography variant="subtitle1">
            {`Categories: `}
            <Chip
              sx={{
                borderRadius: "8px",
                border: `1px solid ${colors.greenAccent[500]}`,
                backgroundColor: colors.greenAccent[900],
              }}
              label={data.data.categoryName}
              size="small"
            />
          </Typography>

          <Modal open={modalOpen} onClose={handleClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography variant="h6" component="h2" marginBottom={2}>
                Edit Course
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Title"
                  name="title"
                  value={courseData.title}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Course Code"
                  name="courseCode"
                  value={courseData.courseCode}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Description"
                  name="description"
                  value={courseData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    name="categoryId"
                    value={categories.id}
                    onChange={handleChange}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button type="submit" variant="contained" color="primary">
                  Save Changes
                </Button>
              </form>
            </Box>
          </Modal>
        </StyledSection>
      )}
      <StyledSection sx={{ marginTop: "16px" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", marginBottom: "16px" }}
        >
          Publish Version
        </Typography>
        {isLoading && <Skeleton variant="rounded" width="100%" height={200} />}
        {error && (
          <Typography sx={{ marginBottom: 4 }}>
            {error.message || "Error fetching course instances."}
          </Typography>
        )}
        {!isLoading && !error && data && (
          <Box component="ul" sx={{ listStyle: "none", padding: 0, margin: 0 }}>
            {data.data.courseInstances?.map((instance) => (
              <Box
                component="li"
                key={instance.id}
                sx={{ marginBottom: "8px" }}
              >
                <Link
                  to={`/course/${data.data.title}/CourseInstance/${instance.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Chip
                    sx={{
                      borderRadius: "8px",
                      border: `1px solid ${colors.blueAccent[500]}`,
                      backgroundColor: colors.blueAccent[900],
                      color: "Black",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: theme.shadows[4],
                      },
                    }}
                    label={instance.description}
                    size="small"
                  />
                </Link>
              </Box>
            ))}
          </Box>
        )}
      </StyledSection>
    </Box>
  );
}
