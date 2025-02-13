import React, { useState } from "react";
import postRequest from "../../../../request/postRequest";
import toast from "react-hot-toast";
import { setCourses } from "../../../../store/courseSlice";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { Tree } from "antd";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
export default function AddCourseModal({
  CourseData,
  categories,
  handleClose,
}) {
  const [newCourseData, setNewCourseData] = useState(CourseData);
  const courses = useSelector((state) => state.course.filteredCourses);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  // 递归转换 categories 为 Tree 需要的格式
  const formatTreeData = (categories) => {
    return categories.map((category) => ({
      key: category.id, // key 必须唯一
      id: category.id,
      title: category.categoryName, // 显示的名称
      children: category.children ? formatTreeData(category.children) : [],
    }));
  };
  const treeData = formatTreeData(categories);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await postRequest("/MoocCourse/add", newCourseData);
      if (response.isSuccess) {
        toast.success("Course added successfully!");
        setCourses([...courses, response.data]);
        handleClose();
      } else {
        toast.error(response.message || "Failed to add course.");
      }
    } catch (error) {
      toast.error("Failed to add course.");
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewCourseData({
      ...newCourseData,
      [name]: value,
    });
  };
  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
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
        Add New Course
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
          label="Cover Image URL"
          name="coverImage"
          value={newCourseData.coverImage}
          onChange={handleChange}
          fullWidth
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
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </form>
    </Box>
  );
}
