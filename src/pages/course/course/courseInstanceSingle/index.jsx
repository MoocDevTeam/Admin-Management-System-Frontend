import React from "react";
import Header from "../../../../components/header";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography } from "@mui/material";
import colors from "../../../../theme";
import toast from "react-hot-toast";
import StyledSection from "../../../../components/course/shared/StyledSection";
import SessionList from "../../../../components/course/course/courseInstance/session/SessionList";
import formatToAustralianDate from "../../../../utils/formatToAustralianDate";
import getRequest from "../../../../request/getRequest";
import StyledBreadcrumbs from "../../../../components/course/course/courseInstance/Breadcrumbs";

export default function CourseInstanceSingle() {
  const { courseId, courseInstanceId } = useParams();

  const {
    data: courseInstance,
    isLoading,
    error,
  } = useQuery(
    ["courseInstance", courseId, courseInstanceId],
    async () => {
      const response = await getRequest(`/MoocCourse/GetById/${courseId}`);
      console.log("response: ", response.data);
      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to fetch data.");
      }
      return response.data.courseInstances.find(
        (instance) => Number(instance.id) === Number(courseInstanceId)
      );
    },
    {
      enabled: !!courseId && !!courseInstanceId,
      onError: (err) => {
        toast.error(err.message || "Failed to fetch course instance data.");
      },
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!courseInstance) {
    return <div>Course Instance not found</div>;
  }

  return (
    <Box m="20px">
      <Header
        title={courseInstance?.moocCourseTitle}
        subtitle={`Managing ${
          courseInstance?.moocCourseTitle
        } ${courseInstance?.description.toLowerCase()}`}
      />

      <StyledBreadcrumbs courseId={courseId} courseInstance={courseInstance} />

      <StyledSection sx={{ marginTop: "16px" }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          Details
        </Typography>
        <Typography variant="body1">{`Total Sessions: ${courseInstance.sessions.length}`}</Typography>
        <Typography variant="body1">{`Created by faculty staff: ${courseInstance.createdByUserId}`}</Typography>
        <Typography variant="body1">{`Last Update: ${formatToAustralianDate(
          courseInstance.updatedAt
        )}`}</Typography>
        <Typography variant="body1">{`Start Date: ${formatToAustralianDate(
          courseInstance.startDate
        )}`}</Typography>
        <Typography variant="body1">{`End Date: ${formatToAustralianDate(
          courseInstance.endDate
        )}`}</Typography>
      </StyledSection>

      <StyledSection
        sx={{ marginTop: "16px", backgroundColor: colors.primary[400] }}
      >
        <SessionList
          sessions={courseInstance.sessions}
          courseInstanceId={courseInstanceId}
        />
      </StyledSection>
    </Box>
  );
}
