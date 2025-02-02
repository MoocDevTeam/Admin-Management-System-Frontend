import React, { useState, useEffect } from "react";
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
import getRequest from "../../request/getRequest";
import deleteRequest from "../../request/delRequest";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GridSearchIcon } from "@mui/x-data-grid";

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
  const [alertMessage, setAlartMessage] = useState("");
  const [open, setOpen] = useState(false);
  let baseUrl = process.env.REACT_APP_BASE_API_URL;

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
  }, [pageSearch]);

  const navigate = useNavigate();
  function handleAddRole() {
    navigate("/role/add");
  }
  const handleUpdate = (row) => {};
  const handlePaginationModel = (e) => {
    setPageSearch((preState) => ({
      ...preState,
      page: e.page + 1,
      pageSize: e.pageSize,
    }));
  };
  function handleDelete() {
    if (rowSelectionModel.length === 0) {
      setAlartMessage("Please select items");
      setOpen(true);
      return;
    }
    setAlartMessage("Are you sure to delete these items?");
    setOpen(true);
  }

  const handleWinClose = async (data) => {
    console.log("handleWinClose", data);
    setOpen(false);
    if (!data.isOk || rowSelectionModel.length === 0) {
      return;
    }
    let ids = rowSelectionModel.join(",");
    let result = await deleteRequest(`/user/Delete/${ids}`);
    if (result.isSuccess) {
      toast.success("delete success!");
    } else {
      toast.error(result.message);
    }
    setPageSearch({ page: 1, pageSize: pageSearch.pageSize });
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    console.log("pageData.item:", pageData.items);
    const filteredRole = [...pageData.items].filter(
      (role) =>
        role.roleName.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query)
    );
    setFilteredRoleList({
      items: [...filteredRole],
      total: filteredRole.length,
    });
    console.log("filteredRoleList:", filteredRole);
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
      headerName: "Opertation",
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
                placeholder="Search role ..."
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
              <Button color="secondary" variant="contained" onClick={handleDelete}>
                Delete
              </Button>
            </Stack>
          </Box>
          <RoleList
            columns={columns}
            pageData={filteredRoleList.items.length > 0 ? filteredRoleList : pageData}
            setPaginationModel={handlePaginationModel}
            setRowSelectionModel={setRowSelectionModel}
          ></RoleList>
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
