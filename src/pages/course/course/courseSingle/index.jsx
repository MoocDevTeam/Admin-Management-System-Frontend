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
import EditCourseModal from "../../../../components/course/course/editCourse/index"
import deleteRequest from "../../../../request/delRequest";
import { useNavigate } from "react-router-dom";
import StyledBreadcrumbs from "../../../../components/course/course/Breadcrumbs";

function useCourse(courseId) {
  return useQuery(["course", courseId], () =>
    getRequest(`/MoocCourse/GetById/${courseId}`)
  );
}

export default function CourseSingle() {
  const theme = useTheme();
  const { courseId } = useParams();
  const { data, isLoading, error } = useCourse(courseId);
  const [modalOpen, setModalOpen] = useState(false);
  const [courseData, setCourseData] = useState({
    id: null,
    title: "",
    courseCode: "",
    coverImage: "",
    description: "",
    categoryId: 1,
  });

  const categories = useSelector((state) => state.category.currentCategories);
  // console.log("course single currentCategories", categories);
  const navigate = useNavigate();
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

  const handleDelete = async () => {
    // Not allow delete course unless all course instance is deleted
    if (!data.data.courseInstances || data.data.courseInstances.length === 0) {
      try {
        const response = await deleteRequest(
          `/MoocCourse/delete/${data.data.id}`
        );
        if (response?.isSuccess) {
          toast.success("Course deleted successfully!");
          navigate(-1);
        } else {
          toast.error(response?.message || "Failed to delete the course.");
        }
      } catch (err) {
        toast.error("An error occurred during deletion.");
      }
    } else {
      toast.error(
        `The course cannot be deleted because it still has ${data.data.courseInstances.length} instance(s). Please delete all instances first.`
      );
    }
  };

  return (
    <Box m="20px">
      <Header
        title={data?.data?.title || "Loading..."}
        subtitle="Managing single course"
      />

      <StyledBreadcrumbs courseTitle={data?.data?.title} />

      {isLoading && <Skeleton variant="rounded" width="100%" height={100} />}
      {error && (
        <Typography sx={{ marginBottom: 4 }}>
          {error.message || "Error fetching course."}
        </Typography>
      )}
      {!isLoading && !error && data && (
        <StyledSection sx={{ marginTop: "16px" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold"}}>
              Description
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpen}
                sx={{ px: 3 }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                sx={{ px: 3 }}
              >
                Delete
              </Button>
            </Box>
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
            <EditCourseModal
              courseId={courseId}
              courseDataInput={courseData}
              categories={categories}
              handleClose={handleClose}
            />
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
                  to={`/course/${courseId}/CourseInstance/${instance.id}`}
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
