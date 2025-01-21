import React from "react";

import { DataGrid } from "@mui/x-data-grid";

export default function TeacherList(props) {
  return (
    <>
      <DataGrid style={{minHeight:'480px'}}
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
      />
    </>
  );
}
