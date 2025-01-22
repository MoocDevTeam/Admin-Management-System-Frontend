import React from "react";
import { Box } from "@mui/material";

export default function FlexList({ children, sx = {} }) {
  return (
    <Box display="flex" justifyContent="left" flexWrap="wrap" gap={10} sx={{ marginTop: "16px", ...sx }}>
      {children}
    </Box>
  );
}
