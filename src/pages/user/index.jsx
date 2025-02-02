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

export default function User() {
  const [pageSearch, setpageSearch] = useState({
    pageSize: 100,
    page: 1,
  });
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [open, setOpen] = useState(false);
  const [pageData, setPageData] = useState({ items: [], total: 0 });
  const [alertMessage, setAlertMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUserList, setFilteredUserList] = useState({
    items: [],
    total: 0,
  });
  const navigate = useNavigate();
  let baseUrl = process.env.REACT_APP_BASE_API_URL;

  const columns = [
    { field: "id", headerName: "ID" },
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
      renderCell: (row) => {
        return (
          <Avatar
            src={baseUrl + row.row.avatar}
            sx={{ width: 50, height: 50 }}
          ></Avatar>
        );
      },
    },
    {
      field: "operation",
      headerName: "opertation",
      flex: 1,
      renderCell: (row) => {
        return (
          <Box>
            <Button variant="text" onClick={handleUpdate(row)}>
              Update
            </Button>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    let getUser = async (param) => {
      let result = await getRequest(`${baseUrl}/api/user/GetByPage`, param);
      if (result.status === 200) {
        setPageData(result.data);
        console.log("user result.data", result.data);
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

  const handlePaginationModel = (e) => {
    setpageSearch((preState) => ({
      ...preState,
      page: e.page + 1,
      pageSize: e.pageSize,
    }));
  };

  const handleUpdate = (row) => {};
  function handleAddUser() {
    navigate("/user/add");
  }

  function handleDelete() {
    if (rowSelectionModel.length === 0) {
      setAlertMessage("Please select one or more users");
      setOpen(true);
      return;
    }
    setAlertMessage("Are you sure to delete?");
    setOpen(true);
  }

  const handleWinClose = async (data) => {
    console.log("handleWinClose", data);
    setOpen(false);
    if (!data.isOk || rowSelectionModel.length === 0) {
      return;
    }

    let ids = rowSelectionModel.join(",");
    let result = await deleteRequest(`${baseUrl}/api/User/Delete/${ids}`);
    if (result.isSuccess) {
      toast.success("delete success!");
    } else {
      toast.error(result.message);
    }

    setpageSearch({ page: 1, pageSize: pageSearch.pageSize });
  };

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
  }, [searchQuery, pageData.items]);

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
              filteredUserList.items.length > 0 ? filteredUserList : pageData
            }
            setPaginationModel={handlePaginationModel}
            setRowSelectionModel={setRowSelectionModel}
          ></UserList>
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
