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
import { Formik, Form } from "formik";
import { useFormik } from "formik";
import postRequest from "../../request/postRequest";
import * as Yup from "yup";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useDispatch } from "react-redux";
import { setRoleNames } from "../../store/roleSlice";
import { theme } from "../../theme";
import PermissionTree from "./permission";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { renderMultiSectionDigitalClockTimeView } from "@mui/x-date-pickers";
export default function Role() {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageData, setPageData] = useState({ items: [], total: 0 });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState([]);
  const [isPermissionOpen, setIsPermissionOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [pageSearch, setPageSearch] = useState({
    pageIndex: 1,
    pageSize: 20,
  });
  const [filteredRoleList, setFilteredRoleList] = useState({
    items: [],
    total: 0,
  });

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
      let result = await postRequest("/Role/Update", {
        id: selectedRowId,
        roleName: values.roleName,
        description: values.description,
      });
      console.log("selectedRowId is: ", selectedRowId);

      if (result.isSuccess) {
        toast.success("Update Role Success !");
        setPageData((prevData) => {
          const newRoles = prevData.items.map((role) =>
            role.id === selectedRowId
              ? {
                  id: selectedRowId,
                  roleName: values.roleName,
                  description: values.description,
                }
              : role
          );
          console.log("after update roles, newRoles:", newRoles);
          return { ...prevData, items: newRoles };
        });
        formik.resetForm();
        navigate("/role", { replace: true });
      } else {
        toast.error(result.message);
      }
      setUpdateOpen(false);
    },
  });

  const columns = [
    // { field: "id", headerName: "ID" },
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
      renderCell: (params) => {
        return (
          <Box>
            <Button
              variant="outlined"
              color="success"
              startIcon={<ModeEditIcon />}
              onClick={(e) => handleUpdate(e, params.row)}
            >
              Update
            </Button>
          </Box>
        );
      },
    },
  ];
  useEffect(() => {
    const timer = setTimeout(() => {
      const filteredRole = [...pageData.items].filter(
        (role) =>
          role.roleName.toLowerCase().includes(searchQuery) ||
          role.description.toLowerCase().includes(searchQuery)
      );
      setFilteredRoleList({
        items: [...filteredRole],
        total: filteredRole.length || pageData.total,
      });
    }, 300); //debounce
    return () => clearTimeout(timer);
  }, [searchQuery, pageData]);

  useEffect(() => {
    async function getRole(param) {
      let result;
      try {
        result = await getRequest("/Role/GetByPage", param);
        if (result.isSuccess === true) {
          setPageData({
            items: result.data.items,
            total: result.data.total,
          });
          console.log("result.data", result.data);
          dispatch(
            setRoleNames({ items: result.data.items, total: result.data.total })
          );
        } else {
          setPageData({ items: [], total: 0 });
        }
      } catch {
        toast.error(result.message);
      }
    }

    let filterPagedResultRequestDto = {
      Filter: "",
      PageIndex: pageSearch.page,
      PageSize: pageSearch.pageSize,
      Sorting: "",
    };
    getRole(filterPagedResultRequestDto);
  }, [pageSearch]);

  const handlePaginationModel = (e) => {
    setPageSearch((preState) => ({
      ...preState,
      page: e.page + 1,
      pageSize: e.pageSize,
    }));
  };
  // async function handlePermissionClose(data) {
  //   debugger;
  //   if (data.status == "ok") {
  //     const res = await postRequest(`role/RolePermission`, {
  //       id: rowSelectionModel[0],
  //       menuIds: data.permission,
  //     });
  //     if (res.isSuccess) {
  //       //setRefresh(!refresh);
  //       //message.success("Delete Success !");
  //     } else {
  //       // message.error(res.message);
  //     }
  //   }
  //   setIsPermissionOpen(false);
  //   console.log("in handle permission close");
  // }
  function handlePermissionClose() {
    setIsPermissionOpen(false);
    console.log("in handle permission close");
  }
  function handlePermissionOpen() {
    if (rowSelectionModel.length === 0 || rowSelectionModel.length > 1) {
      setAlertMessage("Please select one role to give permission");
      setAlertOpen(true);
      console.log("");
      return;
    }
    setIsPermissionOpen(true);
  }
  function handleAddRole() {
    navigate("/role/add");
  }
  const handleUpdate = (e, row) => {
    e.stopPropagation();
    //only for one item update
    console.log("get row is:", row);
    if (rowSelectionModel.length === 0 || rowSelectionModel.length > 1) {
      setAlertMessage("Please select one role to update");
      setAlertOpen(true);
      return;
    }
    setSelectedRowId(row.id);
    setUpdateOpen(true);
  };

  function handleDelete() {
    if (rowSelectionModel.length === 0) {
      setAlertMessage("Please select one or more roles");
      setAlertOpen(true);
      return;
    }
    setAlertMessage(
      `Are you sure to delete ${rowSelectionModel.length} ${
        rowSelectionModel.length > 1 ? "roles" : "role"
      } ?`
    );
    setAlertOpen(true);
  }
  const handleWinClose = async (data) => {
    let result;
    setAlertOpen(false);
    if (!data.isOk || rowSelectionModel.length === 0) {
      return;
    }
    const ids = rowSelectionModel;

    try {
      if (rowSelectionModel.length === 1) {
        result = await deleteRequest(`Role/Delete/${rowSelectionModel[0]}`);
      }
      if (rowSelectionModel.length >= 1) {
        result = await deleteRequest("Role/BatchDelete", {
          data: ids,
          headers: { "Content-Type": "application/json" },
        });
      }
      toast.success("Delete Success!");
    } catch (error) {
      toast.error(result.message);
      setRowSelectionModel([]);
    }
    setPageSearch((preState) => ({ ...preState, page: 1 }));
  };
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

              <Button
                variant="contained"
                onClick={handleAddRole}
                startIcon={<AddIcon />}
              >
                Add Role
              </Button>
              <Button
                variant="contained"
                startIcon={<CheckBoxOutlinedIcon />}
                onClick={handlePermissionOpen}
              >
                Permission
              </Button>
              <Button
                color="secondary"
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Stack>
          </Box>
          <RoleList
            columns={columns}
            pageData={
              filteredRoleList.items.length
                ? { ...filteredRoleList, total: pageData.total }
                : pageData
            }
            setPaginationModel={handlePaginationModel}
            setRowSelectionModel={setRowSelectionModel}
          ></RoleList>
          {/* total could be zero, pagination does not work */}
        </Box>
        <AlterDialog
          title="Warning"
          alertType="warning"
          open={alertOpen}
          onClose={handleWinClose}
        >
          {alertMessage}
        </AlterDialog>
        <Dialog open={updateOpen} onClose={() => setUpdateOpen(false)}>
          <DialogTitle
            sx={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: "2rem",
              bgcolor: theme.palette.secondary.main,
            }}
          >
            Update Role
          </DialogTitle>
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
                  sx={{
                    gridColumn: "span 4",
                  }}
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
                <Button
                  onClick={() => setUpdateOpen(false)}
                  variant="contained"
                  sx={{ bgcolor: "#fff", color: "#000" }}
                >
                  CANCEL
                </Button>
                <Button type="submit" color="primary" variant="contained">
                  UPDATE
                </Button>
              </DialogActions>
            </Form>
          </Formik>
        </Dialog>
        {isPermissionOpen && (
          <PermissionTree
            onOpen={handlePermissionOpen}
            onClose={handlePermissionClose}
            rowSelectionId={rowSelectionModel}
          />
        )}
      </Box>
      {/* <WinDialog title="test dialog" open={open} onClose={handleWinClose}>
        
        <Adduser />
      </WinDialog> */}
    </>
  );
}
