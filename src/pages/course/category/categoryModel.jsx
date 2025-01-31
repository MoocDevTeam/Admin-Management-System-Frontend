import React, { useState, useEffect } from "react";
import { Box, Modal, Typography, TextField, Button } from "@mui/material";
import postRequest from "../../../request/postRequest";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addCategory, closeModal, setCurrentCategories } from "../../../store/categorySlice";

export default function CategoryModal({ parentId }) {
  const dispatch = useDispatch();
  const { isOpen, isEdit, selectedCategory } = useSelector((state) => state.category.modal);
  const { currentCategories } = useSelector((state) => state.category);

  const [categoryData, setCategoryData] = useState({
    id: "",
    categoryName: "",
    description: "",
    iconUrl: "",
    parentId: null,
    childrenCategories: [],
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit && selectedCategory) {
        setCategoryData({
          id: selectedCategory.id || "",
          categoryName: selectedCategory.categoryName || "",
          description: selectedCategory.description || "",
          iconUrl: selectedCategory.iconUrl || "",
          parentId: selectedCategory.parentId || null,
          childrenCategories: selectedCategory.childrenCategories || [],
        });
      } else {
        setCategoryData({
          id: "",
          categoryName: "",
          description: "",
          iconUrl: "",
          parentId: parentId || null,
          childrenCategories: [],
        });
      }
    }
  }, [isOpen, isEdit, selectedCategory, parentId]);

  const handleChange = (event) => {
    setCategoryData({
      ...categoryData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting data:", categoryData);

    try {
      if (isEdit) {
        const response = await postRequest("/Category/Update", categoryData);
        if (response.isSuccess) {
          const updatedCategories = currentCategories.map((cat) =>
            cat.id === categoryData.id ? { ...cat, ...categoryData } : cat
          );
          dispatch(setCurrentCategories(updatedCategories));
          toast.success("Category updated successfully!");
        } else {
          toast.error(response.message || "Failed to update category.");
        }
      } else {
        const response = await postRequest("/Category/Add", {
          ...categoryData,
          childrenCategories: [],
        });
        if (response.isSuccess) {
          dispatch(addCategory({ ...response.data, childrenCategories: [] }));
          console.log("categoryData", categoryData)
          toast.success("Category added successfully!");
        } else {
          toast.error(response.message || "Failed to add category.");
        }
      }
      dispatch(closeModal());
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category.");
    }
  };

  return (
    <Modal open={isOpen} >
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
        
        <form onSubmit={handleSubmit}>

          <TextField
            label="CategoryName"
            name="categoryName"
            value={categoryData.categoryName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Icon URL"
            name="iconUrl"
            value={categoryData.iconUrl}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={categoryData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
            <Button onClick={() => dispatch(closeModal())} variant="contained" color="primary">
              Exit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
