import React from "react";
import { Card, Typography, styled, Box } from "@mui/material";
import MoreButton from "../../shared/moreMenu";

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1),
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start", 
  "&:hover": {
    backgroundColor: theme.palette.background.light,
    boxShadow: theme.shadows[4],
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: 1,
  alignItems: "center", 
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

const TextBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center", 
}));

export default function CourseCard({ title, category, description, imageUrl }) {
  const handleEdit = () => {console.log("clicked!")};
  const handleDelete = () => {console.log("clicked!")};

  return (
    <StyledCard style={{ width: "380px" }}>
      <ContentBox>
        <ImageBox style={{ backgroundImage: `url(${imageUrl})` }} />
        <TextBox>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {category}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        </TextBox>
      </ContentBox>

      <Box>
        <MoreButton
          showEdit={true}
          showDelete={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Box>
    </StyledCard>
  );
}
