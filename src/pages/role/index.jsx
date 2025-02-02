import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import Header from "../../components/header";
import colors from "../../theme";
import AlterDialog from "../../components/alterDialog";
import RoleList from "./roleList";

import { useEffect } from "react";
import getRequest from "../../request/getRequest";
import deleteRequest from "../../request/delRequest";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GridSearchIcon } from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useFormik } from "formik";
import postRequest from "../../request/postRequest";
import * as Yup from "yup";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

export default function Role() {
  const [pageSearch, setPageSearch] = useState({
    pageSize: 10,
    page: 1,
  });
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageData, setPageData] = useState({ items: [], total: 0 });
  const [filteredRoleList, setFilteredRoleList] = useState({
    items: [],
    total: 0,
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  let baseUrl = process.env.REACT_APP_BASE_API_URL;

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
      description: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(100, "Must be 30 characters or less"),
    }),
    onSubmit: async (values) => {
      let result = await postRequest(`${baseUrl}/api/Role/Update`, {
        id: selectedRowId,
        roleName: values.roleName,
        description: values.description,
      });
      if (result.isSuccess) {
        toast.success("Add Role Success !");
        formik.resetForm();
        navigate("/role", { replace: true });
      } else {
        toast.error(result.message);
      }
      setUpdateOpen(false);
    },
  });

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "roleName",
      headerName: "RoleName",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "Operation",
      headerName: "Operation",
      flex: 1,
      renderCell: (row) => {
        return (
          <Box>
            {/* <Button variant="text" onClick={(e) => handleUpdate(e, row)}>
              Update
            </Button> */}
            <Button
              variant="outlined"
              color="success"
              startIcon={<ModeEditIcon />}
              onClick={(e) => handleUpdate(e, row)}
            >
              Update
            </Button>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    let getRole = async (param) => {
      let result = await getRequest(
        `${baseUrl}/api/Role/GetByPage?PageIndex=${pageSearch.page}&PageSize=${pageSearch.pageSize}`,
        param
      );
      if (result.status === 200) {
        setPageData(result.data);
      } else {
        setPageData({ items: [], total: 0 });
      }
    };
    let filterPagedResultRequestDto = {
      Filter: "",
      PageIndex: pageSearch.page,
      PageSize: pageSearch.pageSize,
      Sorting: "",
    };
    getRole(filterPagedResultRequestDto);
  }, [pageSearch, baseUrl]);

  const navigate = useNavigate();
  function handleAddRole() {
    navigate("/role/add");
  }
  const handleUpdate = (e, row) => {
    e.stopPropagation();
    //only for one item update
    if (rowSelectionModel.length === 0 || rowSelectionModel.length > 1) {
      setAlertMessage("Please select one or more roles");
      setAlertOpen(true);
      return;
    }
    setSelectedRowId(row.id);
    console.log("in handle update, row value:", row.id);
    setUpdateOpen(true);
  };

  const handlePaginationModel = (e) => {
    setPageSearch((preState) => ({
      ...preState,
      page: e.page + 1,
      pageSize: e.pageSize,
    }));
  };
  function handleDelete() {
    if (rowSelectionModel.length === 0) {
      setAlertMessage("Please select one or more roles");
      setAlertOpen(true);
      return;
    }
    setAlertMessage("Are you sure to delete ?");
    setAlertOpen(true);
  }

  const handleWinClose = async (data) => {
    console.log("handleWinClose", data);
    setAlertOpen(false);
    if (!data.isOk || rowSelectionModel.length === 0) {
      return;
    }
    let ids = rowSelectionModel.join(",");
    let result = await deleteRequest(`${baseUrl}/api/Role/Delete/${ids}`);
    if (result.isSuccess) {
      toast.success("Delete Success!");
    } else {
      toast.error(result.message);
    }
    setPageSearch({ page: 1, pageSize: pageSearch.pageSize });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const filteredRole = [...pageData.items].filter(
        (role) =>
          role.roleName.toLowerCase().includes(searchQuery) ||
          role.description.toLowerCase().includes(searchQuery)
      );
      setFilteredRoleList({
        items: [...filteredRole],
        total: filteredRole.length,
      });
    }, 300); //debounce
    return () => clearTimeout(timer);
  }, [searchQuery, pageData.items]);

  return (
    <>
      <Box m="20px">
        <Header title="Roles" subtitle="Managing the Roles" />
        <Box
          m="40px 0 0 0"
          minHeight={"500px"}
          height="100%"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <Box sx={{ mb: "15px" }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search a role ..."
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ ml: 2, width: 250, height: 40, marginTop: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton>
                        <GridSearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => (
                          setFilteredRoleList({ items: [], total: 0 }),
                          setSearchQuery("")
                        )}
                      >
                        {searchQuery.length > 0 ? "x" : ""}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button variant="contained" onClick={handleAddRole}>
                Add Role
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  console.log("permission");
                }}
              >
                Permission
              </Button>
              <Button
                color="secondary"
                variant="contained"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Stack>
          </Box>
          <RoleList
            columns={columns}
            pageData={
              filteredRoleList.items.length > 0 ? filteredRoleList : pageData
            }
            setPaginationModel={handlePaginationModel}
            setRowSelectionModel={setRowSelectionModel}
          ></RoleList>
        </Box>
        <AlterDialog
          title="Warning"
          alertType="warning"
          open={alertOpen}
          onClose={handleWinClose}
        >
          {alertMessage}
        </AlterDialog>
      </Box>
      <Dialog open={updateOpen} onClose={() => setUpdateOpen(false)}>
        <DialogTitle>Update Role</DialogTitle>
        <Formik>
          <Form onSubmit={formik.handleSubmit}>
            <DialogContent>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Role Name"
                name="roleName"
                margin="dense"
                autoComplete="text"
                onChange={formik.handleChange}
                value={formik.values.roleName}
                error={
                  formik.touched.roleName && Boolean(formik.errors.roleName)
                }
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
                margin="dense"
                onChange={formik.handleChange}
                value={formik.values.description}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                autoComplete="current-description"
                autoFocus
                sx={{ gridColumn: "span 4" }}
              />
            </DialogContent>
            <DialogActions>
              <Button type="submit" color="secondary" variant="contained">
                Save
              </Button>
              <Button
                onClick={() => setUpdateOpen(false)}
                color="secondary"
                variant="contained"
              >
                Cancel
              </Button>
            </DialogActions>
          </Form>
        </Formik>
      </Dialog>
      {/* <WinDialog title="test dialog" open={open} onClose={handleWinClose}>
        <Adduser />
      </WinDialog> */}
    </>
  );
}
