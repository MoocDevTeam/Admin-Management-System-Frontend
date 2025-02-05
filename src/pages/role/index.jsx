import React, { useState } from "react"
import { Box, Button, Stack, Avatar } from "@mui/material"
import Header from "../../components/header"
import colors from "../../theme"
import AlterDialog from "../../components/alterDialog"
import RoleList from "./roleList"

import { useEffect } from "react"
import getRequest from "../../request/getRequest"
import deleteRequest from "../../request/delRequest"

import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function Role() {
  const [pageSearch, setpageSearch] = useState({
    pageSize: 10,
    page: 1,
  })

  let baseUrl = process.env.REACT_APP_BASE_API_URL
  const handlePaginationModel = (e) => {
    setpageSearch((preState) => ({
      ...preState,
      page: e.page + 1,
      pageSize: e.pageSize,
    }))
  }

  const handleUpdate = (row) => {}

  const rows = [
    { id: 1, RoleName: "SuperAdmin", Description: "full power" },
    { id: 2, RoleName: "Admin", Description: "full power" },
    { id: 3, RoleName: "Admin2", Description: "full power" },
    { id: 4, RoleName: "Admin3", Description: "full power" },
    { id: 5, RoleName: "Admin4", Description: "full power" },
    { id: 6, RoleName: "Admin5", Description: "full power" },
    { id: 7, RoleName: "Teacher", Description: "limited Power" },
    { id: 8, RoleName: "Teacher2", Description: "limited Power" },
    { id: 9, RoleName: "Teacher3", Description: "limited Power" },
    { id: 10, RoleName: "Teacher4", Description: "limited Power" },
    { id: 11, RoleName: "Teacher5", Description: "limited Power" },
    { id: 12, RoleName: "Teacher6", Description: "limited Power" },
    { id: 13, RoleName: "Teacher7", Description: "limited Power" },
    { id: 14, RoleName: "Teacher8", Description: "limited Power" },
    { id: 15, RoleName: "Teacher9", Description: "limited Power" },
    { id: 16, RoleName: "Teacher10", Description: "limited Power" },
    { id: 17, RoleName: "Teacher11", Description: "limited Power" },
    { id: 18, RoleName: "Teacher12", Description: "limited Power" },
    { id: 19, RoleName: "Teacher13", Description: "limited Power" },
    { id: 20, RoleName: "Teacher14", Description: "limited Power" },
    { id: 21, RoleName: "Teacher15", Description: "limited Power" },
    { id: 22, RoleName: "Teacher16", Description: "limited Power" },
    { id: 23, RoleName: "Teacher17", Description: "limited Power" },
    { id: 24, RoleName: "Teacher18", Description: "limited Power" },
    { id: 25, RoleName: "Teacher19", Description: "limited Power" },
    { id: 26, RoleName: "Teacher20", Description: "limited Power" },
  ]
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
        )
      },
    },
  ]

  const [pageData, setPageData] = useState({ items: [], total: 0 })

  useEffect(() => {
    let getUser = async (param) => {
      let result = await getRequest(
        "http://localhost:9000/api/Role/GetByPage?PageIndex=1&PageSize=10",
        param
      )
      if (result.status === 200) {
        setPageData(result.data)
      } else {
        setPageData({ items: [], total: 0 })
      }
    }

    let filterPagedResultRequestDto = {
      Filter: "",
      PageIndex: pageSearch.page,
      PageSize: pageSearch.pageSize,
      Sorting: "",
    }
    //setPageData({ items: rows, total: 26 })
    getUser(filterPagedResultRequestDto)
  }, [pageSearch])

  const [open, setOpen] = useState(false)

  const navigate = useNavigate()
  function handleAddUser() {
    navigate("/user/add")
  }
  const [alertMessage, setAlartMessage] = useState("")

  function handledelete() {
    if (rowSelectionModel.length === 0) {
      setAlartMessage("Please select items")
      setOpen(true)
      return
    }
    setAlartMessage("Are you sure to delete these items?")
    setOpen(true)
  }

  const handleWinClose = async (data) => {
    console.log("handleWinClose", data)
    setOpen(false)
    if (!data.isOk || rowSelectionModel.length === 0) {
      return
    }

    let ids = rowSelectionModel.join(",")
    let result = await deleteRequest(`/user/Delete/${ids}`)
    if (result.isSuccess) {
      toast.success("delete success!")
    } else {
      toast.error(result.message)
    }

    setpageSearch({ page: 1, pageSize: pageSearch.pageSize })
  }

  const [rowSelectionModel, setRowSelectionModel] = React.useState([])

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
              <Button variant="contained" onClick={handleAddUser}>
                Add Role
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
          <RoleList
            columns={columns}
            pageData={pageData}
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
  )
}
