import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentCategories } from "../../../store/categorySlice";
import Header from "../../../components/header";
import CategoryList from "./categoryList";
import CategoryModal from "./categoryModel";
import { Box, Button, Stack } from "@mui/material";
import getRequest from "../../../request/getRequest";
import toast from "react-hot-toast";

export default function CategoryTree() {
  const dispatch = useDispatch();
  const { currentCategories } = useSelector((state) => state.category);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  
  const [modalState, setModalState] = useState({
    isOpen: false,
    isEdit: false,
    selectedCategory: null,
  });

  
  const currentParentId =
    breadcrumbs.length > 0
      ? breadcrumbs[breadcrumbs.length - 1].selectedCategory?.id
      : null;

 
  const handleCategoryClick = async (category) => {
    try {
      const response = await getRequest(
        `/Category/GetChildrenCategories?id=${category.id}`
      );

      if (response.isSuccess) {
        dispatch(setCurrentCategories(response.data));
        setBreadcrumbs((prev) => [
          ...prev,
          {
            currentLevelCategories: currentCategories,
            selectedCategory: category,
          },
        ]);
      } else {
        toast.error(response.message || "Failed to fetch subcategories.");
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to fetch subcategories.");
    }
  };


  const handleBack = () => {
    if (breadcrumbs.length > 0) {
      const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
      const restoredCategories = lastBreadcrumb.currentLevelCategories || [];
      dispatch(setCurrentCategories(restoredCategories));
      setBreadcrumbs((prev) => prev.slice(0, -1));
    }
  };

  
  const handleAdd = () => {
    setModalState({
      isOpen: true,
      isEdit: false,
      selectedCategory: null,
    });
  };

  const handleEdit = (category) => {
    setModalState({
      isOpen: true,
      isEdit: true,
      selectedCategory: category,
    });
  };
  

 
  const closeModal = () => {
    setModalState({ isOpen: false, isEdit: false, selectedCategory: null });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest("/Category/GetMainCategories");
        if (response?.isSuccess) {
          console.log("Main categories response:", response);
          dispatch(setCurrentCategories(response?.data));
          setError("");
        } else {
          const errorMessage =
            response?.message || "An error occurred while fetching data.";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err) {
        setError("Failed to fetch data");
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <Box m="20px">
      <Header title="Categories" subtitle="Managing all categories" />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Button variant="contained" color="secondary" onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" color="secondary" onClick={handleAdd}>
          Add Category
        </Button>
      </Stack>

    
      <CategoryModal
        isOpen={modalState.isOpen}
        isEdit={modalState.isEdit}
        selectedCategory={modalState.selectedCategory}
        parentId={currentParentId}
        onClose={closeModal}
      />

      <CategoryList
        currentCategories={currentCategories}
        handleCategoryClick={handleCategoryClick}
        handleEdit={handleEdit}
        loading={loading}
        error={error}
      />
    </Box>
  );
}
