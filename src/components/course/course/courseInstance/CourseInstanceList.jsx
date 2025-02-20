import React, { useState } from "react";

import { DataGrid } from "@mui/x-data-grid";

//different from TestList(double-clicking a cell) that it can enter the edit mode by a single click while listening to click event
// DataGrid<singleClickEdit> doesn't work
export default function CourseInstanceList(props) {
  const [cellModesModel, setCellModesModel] = useState({});

  return (
    <>
      <DataGrid
        style={{ minHeight: "480px" }}
        checkboxSelection
        pageSizeOptions={[10, 25, 50, 100]}
        paginationMode="server"
        rowCount={props.pageData.total}
        columns={props.columns}
        rows={props.pageData.items}
        onPaginationModelChange={props.setPaginationModel}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          props.setRowSelectionModel(newRowSelectionModel);
        }}
        cellModesModel={cellModesModel}
        onCellClick={(params) => {
          if (params.isEditable) {
            setCellModesModel((prev) => ({
              ...prev,
              [params.id]: { ...prev[params.id], [params.field]: { mode: "edit" } },
            }));
          }
        }}
      />
    </>
  );
}
