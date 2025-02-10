import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import colors from "../../../../theme";

const Container = styled(Box)(({ theme }) => ({
  margin: "40px 0 0 0",
  minHeight: "500px",
  height: "100%",
  "& .MuiDataGrid-root": {
    border: "none",
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "none",
  },
  "& .course-column--cell": {
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
}));

export default Container;
