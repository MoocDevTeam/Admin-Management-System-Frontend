import dayjs from "dayjs";

//column Definitions for Table
const columns = [
  { field: "id", headerName: "ID" },
  {
    field: "moocCourseTitle",
    headerName: "Course Title",
    flex: 1,
    cellClassName: "course-column--cell",
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
  },
  {
    field: "permission",
    headerName: "Permission",
    flex: 1,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    flex: 1,
    valueFormatter: (params) => dayjs(params).format("DD/MM/YYYY"), //params: 2025-03-05T14:29:29.827373, params.value: undefined
  },
  {
    field: "endDate",
    headerName: "End Date",
    flex: 1,
    // renderEditCell: (params) => <DateTimeEditCell {...params} />,
    valueFormatter: (params) => dayjs(params).format("DD/MM/YYYY"),
  },
  {
    field: "createdUserName",
    headerName: "Created By",
    flex: 1,
  },
  {
    field: "updatedUserName",
    headerName: "Updated By",
    flex: 1,
  },
];

export default columns;
