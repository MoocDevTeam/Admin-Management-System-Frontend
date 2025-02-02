import React from "react";
import { Breadcrumbs, Typography, Link } from "@mui/material";

const StyledBreadcrumbs = ({ courseId, courseInstance }) => {
    return (
        <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/course">
                Course
            </Link>
            <Link
                underline="hover"
                color="inherit"
                href={`/course/${courseId}`}
            >
                {courseInstance?.moocCourseTitle}
            </Link>
            <Typography sx={{ color: 'text.primary' }}>{courseInstance?.description.toLowerCase()}</Typography>
        </Breadcrumbs>
    )
}

export default StyledBreadcrumbs;