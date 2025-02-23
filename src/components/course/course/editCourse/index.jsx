import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import postRequest from "../../../../request/postRequest";
import getRequest from "../../../../request/getRequest";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentCategories } from "../../../../store/categorySlice";
import toast from "react-hot-toast";
import { useState } from "react";
import { Tree } from "antd";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";

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
export default function EditCourseModal({
  courseId,
  courseDataInput,
  categoryId,
  handleClose,
}) {
  const [loading, setLoading] = useState(true);
  const updateCourseMutation = useUpdateCourse(courseId);
  const [newCourseData, setNewCourseData] = useState(courseDataInput);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const formatTreeData = (categories) => {
    return categories.map((category) => ({
      key: category.id,
      id: category.id,
      title: category.categoryName,
      children: category.children ? formatTreeData(category.children) : [],
    }));
  };
  const dispatch = useDispatch();
  console.log("categoryId", categoryId);
  const treeData = formatTreeData(categories);

  const handleSubmit = (event) => {
    event.preventDefault();
    updateCourseMutation.mutate(newCourseData, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleChange = (event) => {
    setNewCourseData({
      ...newCourseData,
      [event.target.name]: event.target.value,
    });
  };

  const onSelect = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      console.log("id", selectedKeys[0]);
      setNewCourseData((prevData) => ({
        ...prevData,
        categoryId: selectedKeys[0],
      }));
    }
  };

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

  return (
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
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" component="h2" marginBottom={2}>
        Edit Course
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={newCourseData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Course Code"
          name="courseCode"
          value={newCourseData.courseCode}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={newCourseData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Box
          sx={{
            minHeight: 252,
            minWidth: 252,
            border: "1px solid #ccc",
            p: 1,
            "& .ant-tree-title": {
              fontSize: "18px",
            },
          }}
        >
          <Tree
            onExpand={(expandedKeys) => setExpandedKeys(expandedKeys)}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={treeData}
            onSelect={onSelect}
            selectedKeys={treeData.key}
          />
        </Box>

        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </form>
    </Box>
  );
}
