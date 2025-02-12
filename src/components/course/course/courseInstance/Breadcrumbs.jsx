import React from "react";
import { Breadcrumbs, Typography, Chip, Link } from "@mui/material";
import colors from "../../../../theme";

const StyledBreadcrumbs = ({ courseId, courseInstance }) => {
  return (
    <Breadcrumbs marginTop="-20px" aria-label="breadcrumb">
      <Link href="/course">
        <Chip
          sx={{
            borderRadius: "8px",
            border: `1px solid ${colors.greenAccent[500]}`,
            backgroundColor: colors.greenAccent[900],
            "&:hover": {
              transform: "translate(0, -1px)",
            },
          }}
          label="Course"
          size="small"
        />
      </Link>
      <Link href={`/course/${courseId}`}>
        <Chip
          sx={{
            borderRadius: "8px",
            border: `1px solid ${colors.greenAccent[500]}`,
            backgroundColor: colors.greenAccent[900],
            "&:hover": {
              transform: "translate(0, -1px)",
            },
          }}
          label={courseInstance?.moocCourseTitle}
          size="small"
        />
      </Link>
      <Typography sx={{ color: "text.primary" }}>
        {courseInstance?.description.toLowerCase()}
      </Typography>
    </Breadcrumbs>
  );
};

export default StyledBreadcrumbs;
