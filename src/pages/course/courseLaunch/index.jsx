import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box } from "@mui/material";
import Header from "../../../components/header";
import TestList from "../../test/testList";
import deleteRequest from "../../../request/delRequest";
import getRequest from "../../../request/getRequest";
import postRequest from "../../../request/postRequest";
import toast from "react-hot-toast";
import { fetchCourses } from "../../../store/courseSlice";
import Container from "../../../components/course/course/courseInstance/Container";
import columns from "../../../components/util/columns";
import CourseInstanceModal from "../../../components/course/course/courseInstance/CourseInstanceModal";
import DataGridActionButtons from "../../../components/course/course/courseInstance/DataGridActionButtons";

export default function CourseLaunch() {
  const dispatch = useDispatch();
  // Get courses from Redux store
  const courses = useSelector((state) => state.course.courses);

  const [pageSearch, setPageSearch] = useState({
    pageSize: 10,
    page: 1,
  });

  const [pageData, setPageData] = useState({ items: [], total: 0 });
  //rowSelectionModel is useful for multi-select operations like deletion, where it only stores the selected row IDs
  //When user selects rows with IDs 1 and 5, onRowSelectionModelChange fires then setRowSelectionModel([1, 5]) updates state.
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); //"add" or "update"

  //handlePageSearchChange
  const handlePaginationModel = (e) => {
    setPageSearch((preState) => ({
      ...preState,
      page: e.page + 1, //The page value starts from 0 (zero-based index), so add 1 to make it user-friendly
      pageSize: e.pageSize,
    }));
  };

  const handleCourseInstanceUpdate = async (updatedCourseInstance) => {
    try {
      // console.log("updatedCourseInstance: ", updatedCourseInstance);
      const response = await postRequest("/CourseInstance/update", updatedCourseInstance);
      if (response.isSuccess) {
        toast.success("Course instance updated successfully!");
        setPageSearch((prevState) => ({ ...prevState, page: 1 })); // Refresh data
        handleIsModalClose();
      } else {
        toast.error("Failed to update course instance");
      }
    } catch (error) {
      console.error("Error updating course instance:", error);
      toast.error("An error occurred while updating the course instance");
    }
  };

  const handleDeleteCourseInstance = async () => {
    let ids = rowSelectionModel.join(",");
    const result = await deleteRequest(`/courseInstance/Delete/${ids}`);
    if (result.isSuccess) {
      toast.success("delete success!");
    } else {
      // console.log(result.message);
      toast("Failed to delete course instance(s)");
    }
    //clear selected row
    setRowSelectionModel([]); //clear selected row
    setPageSearch((preState) => ({ ...preState, page: 1 }));
  };

  const handleIsModalOpen = (mode) => {
    if (courses.length === 0) {
      dispatch(fetchCourses());
    }
    setModalMode(mode);

    if (mode === "add") {
      // Clear selected row IDs (clear selectedRowData)
      setRowSelectionModel([]);
    }

    setIsModalOpen(true);
  };

  const handleIsModalClose = () => setIsModalOpen(false);

  const handleSubmit = async (courseInstance) => {
    try {
      const response = await postRequest("/CourseInstance/add", courseInstance);
      if (response.isSuccess) {
        toast.success("Course instance added successfully!");
        setPageSearch((prevState) => ({ ...prevState, page: 1 })); // Refresh data
        handleIsModalClose();
      } else {
        toast.error("Failed to add course instance");
      }
    } catch (error) {
      console.error("Error adding course instance:", error);
      toast.error("An error occurred while adding the course instance");
    }
  };

  //fetch data and rerender when pageSearch changes
  useEffect(() => {
    let getCourseInstance = async (param) => {
      let result = await getRequest("/courseInstance/GetByPage", param);
      if (result.status === 200) {
        // console.log("API Response data:", result.data);
        setPageData(result.data);
      } else {
        // If the new request fails, we need to clear the previous data
        setPageData({ items: [], total: 0 });
      }
    };
    let filterPagedResultRequestDto = {
      Filter: "",
      PageIndex: pageSearch.page,
      PageSize: pageSearch.pageSize,
      Sorting: "",
    };
    getCourseInstance(filterPagedResultRequestDto);
  }, [pageSearch]);

  return (
    <Box m="20px">
      <Header title="Course Launch" subtitle="Managing the course launch" />
      <Container>
        <Box sx={{ mb: "15px" }}>
          <DataGridActionButtons
            onAdd={() => handleIsModalOpen("add")}
            onUpdate={() => handleIsModalOpen("update")}
            onDelete={handleDeleteCourseInstance}
            isRowSelected={rowSelectionModel.length > 0}
            isSingleRowSelected={rowSelectionModel.length === 1}
          />
        </Box>
        <TestList
          columns={columns}
          pageData={pageData}
          setPaginationModel={handlePaginationModel}
          setRowSelectionModel={setRowSelectionModel}></TestList>
        <CourseInstanceModal
          open={isModalOpen}
          courses={courses}
          onSubmit={handleSubmit} // for ADD
          onUpdate={handleCourseInstanceUpdate} // for UPDATE
          onClose={handleIsModalClose}
          mode={modalMode}
          selectedRowData={
            //Only pass selectedRowData when in update mode
            modalMode === "update" && rowSelectionModel.length > 0
              ? pageData.items.find((item) => item.id === rowSelectionModel[0])
              : null
          }
        />
      </Container>
    </Box>
  );
}
