import { useState, useEffect } from "react";
import getRequest from "../../../../request/getRequest";
import StyledSection from "../../../../components/course/shared/StyledSection";
import Header from "../../../../components/header";
import Skeleton from "@mui/material/Skeleton";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FlexList from "../../../../components/course/course/FlexList";
import { Link, useParams } from "react-router-dom";
import postRequest from "../../../../request/postRequest";
import BackButton from "../../../../components/course/shared/ReturnButton";

export default function CourseSingle() {
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const { courseId } = useParams();
  const [open, setOpen] = useState(false);
  const [modalClosedAfterUpdate, setModalClosedAfterUpdate] = useState(false);

  const [courseData, setCourseData] = useState({
    id: null,
    title: "",
    courseCode: "",
    coverImage: "",
    description: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = (callback) => {
    setOpen(false);
    if (callback) {
      callback();
    }
  };

  const handleChange = (event) => {
    setCourseData({
      ...courseData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await postRequest(`/MoocCourse/update`, courseData);
      if (response.isSuccess) {
        setCourse(response.data);
        setModalClosedAfterUpdate(true);
        handleClose(refreshPage);
        toast.success("Course updated successfully!");
      } else {
        toast.error(response.message || "Failed to update course.");
      }
    } catch (error) {
      toast.error("Failed to update course.");
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (modalClosedAfterUpdate) {
      window.location.reload();
      setModalClosedAfterUpdate(false);
    }
  }, [modalClosedAfterUpdate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest(
          `/MoocCourse/GetById/${courseId}`,
          null,
          setLoading
        );

        if (response?.isSuccess) {
          const fetchedCourse = response?.data;
          setCourse(fetchedCourse);

          setCourseData({
            id: fetchedCourse.id,
            title: fetchedCourse.title,
            courseCode: fetchedCourse.courseCode,
            coverImage: fetchedCourse.coverImage,
            description: fetchedCourse.description,
          });

          setError("");
        } else {
          const errorMessage =
            response?.message ||
            "An error occurred while fetching data. CourseSingle";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err) {
        setError("Failed to fetch data");
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, [courseId]);

  return (
    <Box m="20px">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Header title="Course" subtitle="Managing single course" />
        <BackButton />
      </Stack>
      {loading && <Skeleton variant="rounded" width="100%" height={100} />}

      {error && <Typography sx={{ marginBottom: 4 }}>{error}</Typography>}

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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="subtitle1"
              sx={{
                marginBottom: "8px",
              }}
            >
              {`Categories: ${course.categoryName}`}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpen}
            >
              Edit
            </Button>
          </Stack>
          <Typography variant="body1">{`Course Code: ${course.courseCode}`}</Typography>
          <Typography variant="body1">{`Description: ${course.description}`}</Typography>

          <Modal open={open} onClose={handleClose}>
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
          sx={{
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Publish
        </Typography>
        {loading && (
          <FlexList>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                width={300}
                height={100}
              />
            ))}
          </FlexList>
        )}

        {error && <Typography sx={{ marginBottom: 4 }}>{error}</Typography>}

        {!loading && !error && course && (
          <>
            {course?.courseInstances?.map((instance, index) => (
              <Link
                key={instance.id} 
                to={`/course/${course.title}/CourseInstance/${instance.id}`}
                style={{ textDecoration: "none" }}
              >
                <p key={index}>{instance.description}</p>
              </Link>
            ))}
          </>
        )}
      </StyledSection>
    </Box>
  );
}
