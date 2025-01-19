import Header from "../../../components/header";
import { Box, Button, Stack, Avatar } from "@mui/material";
import TeacherList from "./teacherList";
import React,{ useState, useEffect } from "react";
import { TocTwoTone } from "@mui/icons-material";
import getRequest from "../../../request/getRequest";
import { preconnect } from "react-dom";
import colors from "../../../theme";

export default function Teacher() {
  //set default page size
  const [pageSearch, setPageSearch] = useState({
    pageSize: 100,
    page:1
  });
  //get base url for Api
  const baseUrl = process.env.REACT_APP_BASE_API_URL;

  //Get page data to display
  //by default it is empty before fetching data
  const [pageData, setPageData] = useState({items:[], total:0});

  //Set up setPaginationModel
  const handlePaginationModel = (e) => {
    setPageSearch((preState) => ({
      ...preState, 
      page: e.page + 1 , //set start page as 1 instead of 0
      pageSize: e.pageSize, 
    }));
  }
  //set default row selected to empty array
  const [rowSelectionModel, setRowSelectionModel] = useState([]);


  //fetche data and rerender when pageSearch change
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


  //set teacherlist columns
  const columns = [
    { field: "id", headerName: "ID" , flex:0.5},
    {
      field: "displayName",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell"
    },
    {
      field: "title",
      headerName: "Title",
      flex: 0.8,
      cellClassName: "title-column--cell"
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
      cellClassName: "department-column--cell"
    },
    // {
    //   field: "introduction",
    //   headerName: "Introduction",
    //   flex: 1,
    //   cellClassName: "introduction-column--cell"
    // },
    {
      field:"expertise",
      headerName: "Expertise",
      flex: 1.5,
      cellClassName: "expertise-column--cell"
    },
    {
      field: "office",
      headerName: "Office",
      flex: 1,
      cellClassName: "office-column--cell"
    },
    {
      field: "isActive",
      headerName: "Active",
      flex: 0.5,
      cellClassName: "active-column--cell",
      renderCell: (params) => (params.row.isActive? "Yes":"No")
    },
    {
      field: "createdByUserId",
      headerName: "Created By",
      flex: 1,
      cellClassName: "createdByUerId-column--cell"
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1,
      cellClassName: "createdAt-column--cell"
    },
    {
      field: "updatedByUserId",
      headerName: "Updated By",
      flex: 1,
      cellClassName: "updatedByUserId-column--cell"
    },
    {
      field: "updatedAt",
      headerName: "Updated Date",
      flex: 1,
      cellClassName: "updatedAt-column--cell"
    },
    {
      field: "operation",
      headerName: "Operation",
      flex: 1,
      renderCell: (params) => {
        return(
          <Box>
            <Button variant="text">
              Update
              </Button>
            </Box>
        )
      }
    }

  ]


  


  return (
    <Box m="20px">
      
      <Header title="Teacher" subtitle="Manging Teacher Members"></Header>
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

          <Button variant="contained">
            ADD TEACHER
          </Button>

          <Button color="secondary" variant="contained">
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

      
    </Box>
  );
}
