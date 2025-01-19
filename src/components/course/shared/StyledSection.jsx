import React from "react";
import { Box } from "@mui/material";

export default function StyledSection({ children, sx = {} }) {
  return (
    <Box
      sx={{
        width: "100%",
        padding: (theme) => theme.spacing(3), 
        boxSizing: "border-box",
        boxShadow: (theme) => theme.shadows[2], 
        borderRadius: (theme) => theme.shape.borderRadius, 
        ...sx, 
      }}
    >
      {children}
    </Box>
  );
}
