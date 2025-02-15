import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import the UTC plugin
dayjs.extend(utc); // Enable UTC support

// The hook focuses on managing the form state,
// while CourseInstanceModal handles rendering and submission logic(handleSubmit).
export const useCourseInstanceForm = (selectedRowData) => {
  const [courseInstance, setCourseInstance] = useState({
    moocCourseId: "",
    //improve the user experience
    status: 0, // Default to "Close"
    permission: 0, // Default to "Private"
    startDate: null,
    endDate: null,
    description: "",
  });

  // Sync selectedRowData when modal opens (for updates)
  useEffect(() => {
    if (selectedRowData) {
      setCourseInstance({
        moocCourseId: selectedRowData.moocCourseId,
        status: selectedRowData.status === "Open" ? 1 : 0,
        permission: selectedRowData.permission === "Public" ? 1 : 0,
        startDate: selectedRowData.startDate ? dayjs.utc(selectedRowData.startDate) : null, // Treat as UTC
        endDate: selectedRowData.endDate ? dayjs.utc(selectedRowData.endDate) : null,
        description: selectedRowData.description,
      });
    } else {
      // resets the courseInstance when selectedRowData is null
      setCourseInstance({
        moocCourseId: "",
        status: 0,
        permission: 0,
        startDate: null,
        endDate: null,
        description: "",
      });
    }
  }, [selectedRowData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCourseInstance((prev) => ({
      ...prev,
      // Dynamically updates the field based on 'name'
      // convert the status and permission back to numeric values (0 or 1)
      [name]: name === "status" || name === "permission" ? Number(value) : value,
    }));
  };

  const handleDateInputChange = (name, date) => {
    setCourseInstance((prev) => ({
      ...prev,
      [name]: date ? dayjs.utc(date).toISOString() : null, // Convert to UTC and store as ISO string
    }));
  };

  return { courseInstance, handleInputChange, handleDateInputChange };
};
