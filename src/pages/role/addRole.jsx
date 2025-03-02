import React, { useCallback, useEffect } from "react";
import { Box, Button, TextField, Stack } from "@mui/material";

import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import postRequest from "../../request/postRequest";
import Header from "../../components/header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddRole() {
  const [roles, setRoles] = useState([]);
  const [selectRoles, setSelectRoles] = useState([]);
  const [avatarData, setAvatarData] = useState("");

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  let baseUrl = process.env.REACT_APP_BASE_API_URL;

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      roleName: "",
      description: "",
    },
    validationSchema: Yup.object({
      roleName: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(30, "Must be 30 characters or less")
        .required("Required"),
      description: Yup.string().max(100, "Must be 30 characters or less"),
    }),
    onSubmit: async (values) => {
      let result = await postRequest(`${baseUrl}/api/Role/Add`, {
        roleName: values.roleName,
        description: values.description,
      });
      if (result.isSuccess) {
        toast.success("add success!");
        formik.resetForm();
        navigate("/role", { replace: true });
      } else {
        toast.error(result.message);
      }
    },
  });

  const handleAvatarResult = (result) => {
    setAvatarData(result);
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const handleChangeRole = (event) => {
    const {
      target: { value },
    } = event;
    setSelectRoles(
      //On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const renderValueRole = (valueArray) => {
    return roles
      .filter((x) => valueArray.indexOf(x.id) !== -1)
      .map((x) => x.roleName)
      .join(", ");
    //return roles.map((value) => valueArray.find(x=>x===value.id)).map(x=>x.name).join(', ')
  };

  return (
    <Box m="20px">
      <Header
        title="CREATE ROLE"
        subtitle="Create a New Role"
        url="/role"
        urltitle={"RoleList"}
      />
      <form onSubmit={formik.handleSubmit}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        >
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Role Name"
            name="roleName"
            autoComplete="text"
            onChange={formik.handleChange}
            value={formik.values.roleName}
            error={formik.touched.roleName && Boolean(formik.errors.roleName)}
            helperText={formik.touched.roleName && formik.errors.roleName}
            autoFocus
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Description"
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            autoComplete="current-description"
            autoFocus
            sx={{ gridColumn: "span 4" }}
          />
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Stack direction="row" spacing={2}>
            <Button type="submit" color="primary" variant="contained">
              Create Role
            </Button>
            <Button
              type="cancel"
              color="secondary"
              variant="contained"
              onClick={() => {
                formik.resetForm();
                navigate("/role");
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </form>
    </Box>
  );
}
