import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Avatar,
  InputAdornment,
  TextField,
  IconButton,
} from "@mui/material";
import Header from "../../components/header";
import colors from "../../theme";
import AlterDialog from "../../components/alterDialog";
import UserList from "./userList";
import { useEffect } from "react";
import getRequest from "../../request/getRequest";
import deleteRequest from "../../request/delRequest";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GridSearchIcon } from "@mui/x-data-grid";
import { genderNameToEnum } from "../../components/util/gender";
import { useDispatch, useSelector } from "react-redux";
import { setRoleNames } from "../../store/roleSlice";
import { UpdateUser } from "./updateUser";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
export default function User() {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [open, setOpen] = useState(false);
  const [pageData, setPageData] = useState({ items: [], total: 0 });
  const [alertMessage, setAlertMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const roleNames = useSelector((state) => state.role.roleNames);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [filteredUserList, setFilteredUserList] = useState({
    items: [],
    total: 0,
  });
  const [pageSearch, setPageSearch] = useState({
    pageSize: 100,
    pageIndex: 1,
  });

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  //store user data
  const [selectedUser, setSelectedUser] = useState(null);

  const baseUrl = process.env.REACT_APP_BASE_API_URL;
  const columns = [
    // { field: "id", headerName: "ID" },
    {
      field: "userName",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
      renderCell: (row) => {
        if (row.row.gender === 1) {
          return "Male";
        } else if (row.row.gender === 2) {
          return "Female";
        } else {
          return "Other";
        }
      },
    },
    {
      field: "age",
      headerName: "Age",
      flex: 1,
    },
    {
      field: "avatar",
      headerName: "Avatar",
      flex: 1,
      renderCell: (param) => {
        return (
          <Avatar
            src="https://jr-prac.s3.ap-southeast-2.amazonaws.com/user3.png"
            sx={{ width: 50, height: 50 }}
          ></Avatar>
        );
      },
    },
    {
      field: "operation",
      headerName: "operation",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Button
              color="success"
              startIcon={<ModeEditIcon />}
              variant="text"
              onClick={(e) => handleOpenUpdateDialog(e, params.row)}
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
        (user) =>
          user.userName.toLowerCase().includes(searchQuery) ||
          user.email.toLowerCase().includes(searchQuery) ||
          user.age === +searchQuery ||
          user.gender === genderNameToEnum(searchQuery)
      );
      setFilteredUserList({
        items: [...filteredRole],
        total: filteredRole.length,
      });
    }, 300); //debounce

    return () => clearTimeout(timer);
  }, [searchQuery, pageData]);

  useEffect(() => {
    let getUser = async (param) => {
      let result = await getRequest("user/GetByPage", param);
      console.log("result", result);
      if (result.isSuccess === true) {
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
    getUser(filterPagedResultRequestDto);
  }, [pageSearch]);

  useEffect(() => {
    async function getRole(param) {
      let result;
      try {
        result = await getRequest("/Role/GetByPage", param);
        if (result.isSuccess === true) {
          dispatch(
            setRoleNames({ items: result.data.items, total: result.data.total })
          );
        } else {
          return;
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
    if (roleNames.total > 0) {
      return;
    } else {
      getRole(filterPagedResultRequestDto);
    }
  }, []);

  const handlePaginationModel = (e) => {
    setPageSearch((preState) => ({
      ...preState,
      page: e.page + 1,
      pageSize: e.pageSize,
    }));
  };

  const handleUpdate = (e, row) => {
    e.stopPropagation();
  };

  function handleAddUser() {
    navigate("/user/add");
  }

  // This function is triggered when the user clicks "UPDATE"
  const handleOpenUpdateDialog = (event, rowData) => {
    event.stopPropagation(); // prevents row selection triggered by the DataGrid
    setSelectedUser(rowData); // store the user data to pass to the dialog
    setIsUpdateDialogOpen(true); // open the dialog
  };

  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
  };

  //callback for child
  const handleUserUpdated = (updatedUser) => {
    setPageData((prevData) => {
      const newItems = prevData.items.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      return { ...prevData, items: newItems };
    });
    setIsUpdateDialogOpen(false); //close the userUpdate dialog
  };

  function handleDelete() {
    if (rowSelectionModel.length === 0) {
      setAlertMessage("Please select one or more users");
      setOpen(true);
      return;
    }
    setAlertMessage(
      `Are you sure to delete ${rowSelectionModel.length} ${
        rowSelectionModel.length > 1 ? "users" : "user"
      } ?`
    );
    setOpen(true);
  }

  const handleWinClose = async (data) => {
    console.log("handleWinClose", data);
    let result;
    setOpen(false);
    if (!data.isOk || rowSelectionModel.length === 0) {
      return;
    }
    try {
      await Promise.all(
        rowSelectionModel.map((id) => {
          result = deleteRequest(`User/Delete/${id}`);
          return result;
        })
      );
      setRowSelectionModel([]);
      toast.success("Delete Success!");
    } catch (error) {
      toast.error(result.message);
    }
    setPageSearch({ page: 1, pageSize: pageSearch.pageSize });
  };

  return (
    <>
      <Box m="20px">
        <Header title="Users" subtitle="Managing the User Members" />
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
                placeholder="Search a user ..."
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
                          setFilteredUserList({ items: [], total: 0 }),
                          setSearchQuery("")
                        )}
                      >
                        {searchQuery.length > 0 ? "x" : ""}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="contained" onClick={handleAddUser}>
                Add User
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
          <UserList
            columns={columns}
            pageData={
              filteredUserList.items.length
                ? { ...filteredUserList, total: pageData.total }
                : pageData
            }
            setPaginationModel={handlePaginationModel}
            setRowSelectionModel={setRowSelectionModel}
          ></UserList>

          {selectedUser && (
            <UpdateUser
              open={isUpdateDialogOpen}
              onClose={handleCloseUpdateDialog}
              data={selectedUser}
              onUserUpdated={handleUserUpdated}
            />
          )}
        </Box>
        <AlterDialog
          title="Warning"
          alertType="warning"
          open={open}
          onClose={handleWinClose}
        >
          {alertMessage}
        </AlterDialog>
      </Box>

      {/* <WinDialog title="test dialog" open={open} onClose={handleWinClose}> 
        <Adduser />
      </WinDialog> */}
    </>
  );
}
