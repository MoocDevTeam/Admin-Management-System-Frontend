import React, { useEffect } from "react";
import { Box, Modal, TextField, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import postRequest from "../../../request/postRequest";
import toast from "react-hot-toast";
import { addCategory, setCurrentCategories } from "../../../store/categorySlice";

export default function CategoryModal({ parentId, isOpen, isEdit, selectedCategory, onClose }) {
  const dispatch = useDispatch();
  const { currentCategories } = useSelector((state) => state.category);

  const validationSchema = Yup.object({
    categoryName: Yup.string().required("Category name is required"),
    description: Yup.string().required("Description is required"),
    iconUrl: Yup.string().url("Must be a valid URL").required("Icon URL is required"),
  });

  const formik = useFormik({
    initialValues: {
      id: "",
      categoryName: "",
      description: "",
      iconUrl: "",
      parentId: null,
      childrenCategories: [],
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (isEdit) {
          const response = await postRequest("/Category/Update", values);
          if (response.isSuccess) {
            dispatch(
              setCurrentCategories(
                currentCategories.map((cat) =>
                  cat.id === values.id ? { ...cat, ...values } : cat
                )
              )
            );
            toast.success("Category updated successfully!");
          } else {
            toast.error(response.message || "Failed to update category.");
          }
        } else {
          const response = await postRequest("/Category/Add", {
            ...values,
            childrenCategories: [],
          });
          if (response.isSuccess) {
            dispatch(addCategory({ ...response.data, childrenCategories: [] }));
            toast.success("Category added successfully!");
          } else {
            toast.error(response.message || "Failed to add category.");
          }
        }
        onClose();
      } catch (error) {
        toast.error("Failed to save category.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      formik.setValues(
        isEdit && selectedCategory
          ? {
              id: selectedCategory.id || "",
              categoryName: selectedCategory.categoryName || "",
              description: selectedCategory.description || "",
              iconUrl: selectedCategory.iconUrl || "",
              parentId: selectedCategory.parentId || null,
              childrenCategories: selectedCategory.childrenCategories || [],
            }
          : {
              id: "",
              categoryName: "",
              description: "",
              iconUrl: "",
              parentId: parentId || null,
              childrenCategories: [],
            }
      );
    }
  }, [isOpen, isEdit, selectedCategory, parentId]);

  return (
    <Modal open={isOpen} onClose={onClose}>
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
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Category Name"
            name="categoryName"
            value={formik.values.categoryName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.categoryName && Boolean(formik.errors.categoryName)}
            helperText={formik.touched.categoryName && formik.errors.categoryName}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Icon URL"
            name="iconUrl"
            value={formik.values.iconUrl}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.iconUrl && Boolean(formik.errors.iconUrl)}
            helperText={formik.touched.iconUrl && formik.errors.iconUrl}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting}>
              {isEdit ? "Update" : "Save"}
            </Button>
            <Button onClick={onClose} variant="contained" color="primary">
              Exit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

