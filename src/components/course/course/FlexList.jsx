import React from "react";
import { Box } from "@mui/material";

export default function FlexList({ children }) {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="left" gap={2}>
      {children}
    </Box>
  );
}
