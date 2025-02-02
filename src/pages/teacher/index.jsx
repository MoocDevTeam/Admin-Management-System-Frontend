import Header from "../../components/header";
import { Box, Button, Stack, Dialog, Typography } from "@mui/material";
import TeacherList from "./teacherList";
import React, { useState, useEffect } from "react";
import getRequest from "../../request/getRequest";
import colors from "../../theme";
import dayjs from "dayjs";
import { UserSelectDialog } from "./userSelectDialog";
import deleteRequest from "../../request/delRequest";
import toast from "react-hot-toast";
import WinDialog from "../../components/winDialog";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import WarningIcon from "@mui/icons-material/Warning";
import { UpdateTeacher } from "./updateTeacher";

export default function Teacher() {
  //set default page size
  const [pageSearch, setPageSearch] = useState({
    pageSize: 100,
    page: 1,
  });

  const [pageData, setPageData] = useState({ items: [], total: 0 }); //Get page data to display by default it is empty before fetching data

  const [rowSelectionModel, setRowSelectionModel] = useState([]); //set default row selected to empty array

  //Set dialog open state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //Set windialog open state
  const [isWinDialogOpen, setIsWinDialogOpen] = useState(false);

  //Set update teacher dialog state
  const [isUpdateTeacherDialogOpen, setIsUpdateTeacherDialogOpen] = useState(false);

  //Set selected teacher state
  const [selectedTeacher, setSelectedTeacher]= useState(null);

  //Handle selected teacher state
  const handleSetSelectedTeacher = (rowData) => {
    setSelectedTeacher(rowData);
    setIsUpdateTeacherDialogOpen(true);
  }
  //Handle update teacher dialog
  const handleUpdateTeacherDialogClose = () => setIsUpdateTeacherDialogOpen(false);

  //Handle search dialog open
  const handleSearchOpen = () => setIsDialogOpen(true);
  const handleSearchClose = () => setIsDialogOpen(false);

  //Handle windialog close and open
  const handleWinDialogOpen = () => setIsWinDialogOpen(true);
  const handleWinDialogClose = () => setIsWinDialogOpen(false);

  //set up method to delete teacher
  const handleDeleteTeacher = async () => {
    console.log("Delete teacher");
    if (rowSelectionModel.length === 0) {
      alert("Please select a teacher to delete");
      return;
    } else {
      for (const id of rowSelectionModel) {
        try {
          const result = await deleteRequest(`/teacher/Delete/${id}`);
          if (result.status === 200) {
            toast("Teacher deleted successfully");
            console.log(`deleted teacher with id: ${id}`);
          } else {
            toast("Failed to delete teacher");
          }
        } catch (error) {
          console.error("Error deleting teacher", error);
          toast("Failed to delete teacher");
        }
      }
      setRowSelectionModel([]); //clear selected row
      setIsWinDialogOpen(false); //close the dialog after deletion
      setPageSearch((preState) => ({ ...preState, page: 1 }));
    }
  };

  //Set up setPaginationModel
  const handlePaginationModel = (e) => {
    setPageSearch((preState) => ({
      ...preState,
      page: e.page + 1, //set start page as 1 instead of 0
      pageSize: e.pageSize,
    }));
  };

  //fetche data and rerender when pageSearch changes
  useEffect(() => {
    let getTeacher = async (param) => {
      let result = await getRequest("/teacher/GetByPage", param);
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
    getTeacher(filterPagedResultRequestDto);
  }, [pageSearch]);

  //add teacher by openning the dialog to retrieve user id
  const handleAddTeacher = () => {
    handleSearchOpen();
  };

  //set teacherlist columns
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "displayName",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "title",
      headerName: "Title",
      flex: 0.8,
      cellClassName: "title-column--cell",
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
      cellClassName: "department-column--cell",
    },
    {
      field: "expertise",
      headerName: "Expertise",
      flex: 1.5,
      cellClassName: "expertise-column--cell",
    },
    {
      field: "office",
      headerName: "Office",
      flex: 1,
      cellClassName: "office-column--cell",
    },
    {
      field: "isActive",
      headerName: "Active",
      flex: 0.5,
      cellClassName: "active-column--cell",
      renderCell: (params) => (params.row.isActive ? "Yes" : "No"),
    },
    {
      field: "createdByUserId",
      headerName: "Created By",
      flex: 1,
      cellClassName: "createdByUerId-column--cell",
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1,
      cellClassName: "createdAt-column--cell",
      valueFormatter: (params) => dayjs(params.value).format("DD/MM/YYYY"),
    },
    {
      field: "updatedByUserId",
      headerName: "Updated By",
      flex: 1,
      cellClassName: "updatedByUserId-column--cell",
    },
    {
      field: "updatedAt",
      headerName: "Updated Date",
      flex: 1,
      cellClassName: "updatedAt-column--cell",
      valueFormatter: (params) => dayjs(params.value).format("DD/MM/YYYY"),
    },
    {
      field: "operation",
      headerName: "Operation",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Button
              variant="outlined"
              color="success"
              startIcon={<ModeEditIcon />}
              onClick={(event) => {
                event.stopPropagation(); //prevent row selection
                handleSetSelectedTeacher(params.row); //open update teacher dialog
              }}
            >
              Update
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Teacher" subtitle="Manging Teacher Members"></Header>
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleSearchOpen}
            >
              ADD TEACHER
            </Button>

            <Button
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={setIsWinDialogOpen}
              disabled={rowSelectionModel.length === 0}
            >
              DELETE
            </Button>
          </Stack>
        </Box>
        <TeacherList
          columns={columns}
          pageData={pageData}
          setPaginationModel={handlePaginationModel}
          setRowSelectionModel={setRowSelectionModel}
        ></TeacherList>
      </Box>

      {/* Windialog to search a user before adding a teacher */}
      <UserSelectDialog isOpen={isDialogOpen} onClose={handleSearchClose} />
      
      {/* Alter windialog for delete teacher */}
      <WinDialog 
      open={isWinDialogOpen} 
      onClose={handleWinDialogClose} 
      onOK={handleDeleteTeacher} 
      title={"Confirm Deletion"}
      icon={<WarningIcon color="warning"/>}
      >
      Are you sure you want to delete the selected teacher?
      </WinDialog>

      {/* Update teacher dialog */}
      <UpdateTeacher 
      open={isUpdateTeacherDialogOpen} 
      onClose={handleUpdateTeacherDialogClose}
      data={selectedTeacher}
      />
    </Box>
  );
}
