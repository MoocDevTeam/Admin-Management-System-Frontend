import React, { useState } from "react";
import { Box, Button, Stack, Avatar } from "@mui/material";
import Header from "../../components/header";
import colors from "../../theme";
import AlterDialog from "../../components/alterDialog";
import UserList from "./userList";

import { useEffect } from "react";
import getRequest from "../../request/getRequest";
import deleteRequest from "../../request/delRequest";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function User() {
  const [pageSearch, setpageSearch] = useState({
    pageSize: 100,
    page: 1,
  });

  let baseUrl = process.env.REACT_APP_BASE_API_URL;
  const handlePaginationModel = (e) => {
    setpageSearch((preState) => ({
      ...preState,
      page: e.page + 1,
      pageSize: e.pageSize,
    }));
  };

  const handleUpdate = (row) => { };

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

  const [pageData, setPageData] = useState({ items: [], total: 0 });

  useEffect(() => {
    let getUser = async (param) => {
      let result = await getRequest("/user/GetByPage", param);
      if (result.status === 200) {
        setPageData(result.data);
      } else {
        setPageData({ items: [], total: 0 });
      }
      console.log("=========", result);
    };

    let filterPagedResultRequestDto = {
      Filter: "",
      PageIndex: pageSearch.page,
      PageSize: pageSearch.pageSize,
      Sorting: "",
    };

    getUser(filterPagedResultRequestDto);
  }, [pageSearch]);

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  function handleAddUser() {
    navigate("/user/add");
  }
  const [alertMessage, setAlartMessage] = useState("");

  function handledelete() {
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

    setpageSearch({ page: 1, pageSize: pageSearch.pageSize });
  };

  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

  return (
    <>
      <Box m="20px">
        <Header title="Users" subtitle="Managing the User Members" />
        <Box
          m="40px 0 0 0"
          minHeight={'500px'}
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

              <Button variant="contained" onClick={handleAddUser}>
                Add User
              </Button>


              <Button
                color="secondary"
                variant="contained"
                onClick={handledelete}
              >
                Delte
              </Button>

            </Stack>
          </Box>
          <UserList
            columns={columns}
            pageData={pageData}
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
