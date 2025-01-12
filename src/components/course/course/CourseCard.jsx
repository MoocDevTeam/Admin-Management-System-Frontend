import React from "react";
import { Card, Typography, styled, Box } from "@mui/material";

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1),
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[4],
  },
}));

const ImageBox = styled(Box)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  marginRight: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[200],
  backgroundSize: "cover",
  backgroundPosition: "center",
}));

export default function CourseCard({ title, category, description, imageUrl }) {
  return (
    <StyledCard style={{ width: "300px" }}>
      <ImageBox style={{ backgroundImage: `url(${imageUrl})` }} />
      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {category}
        </Typography>
        <Typography variant="body1">{description}</Typography>
      </Box>
    </StyledCard>
  );
}
