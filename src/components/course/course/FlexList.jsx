import React from "react";
import { Box } from "@mui/material";

export default function FlexList({ children, sx = {} }) {
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="left"
      gap={3}
      sx={{ marginTop: "16px", ...sx }}
    >
      {children}
    </Box>
  );
}
