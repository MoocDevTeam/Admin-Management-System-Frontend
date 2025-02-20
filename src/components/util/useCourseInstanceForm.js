import { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import the UTC plugin
dayjs.extend(utc); // Enable UTC support

// The hook focuses on handling form state and validation logic
export const useCourseInstanceForm = (open, onUpdate, onSubmit, selectedRowData) => {
  const formik = useFormik({
    initialValues: {
      moocCourseId: "",
      //improve the user experience
      status: 0, // Default to "Close"
      permission: 0, // Default to "Private"
      startDate: "",
      endDate: "",
      description: "",
    },
    // Defines validation rules using Yup
    validationSchema: Yup.object({
      moocCourseId: Yup.string().required("Course title is required"),
      status: Yup.number().required("Status is required"),
      permission: Yup.number().required("Permission is required"),
      startDate: Yup.date().nullable().required("Start Date is required"),
      endDate: Yup.date()
        .nullable()
        .required("End Date is required")
        // Ensure endDate is after startDate
        .test("is-after-start-date", "End Date must be later than Start Date", function (endDate) {
          const startDate = this.parent.startDate;
          return startDate && endDate ? dayjs(endDate).isAfter(dayjs(startDate)) : false;
        }),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values) => {
      const formattedInstance = {
        ...values,
        // Although we have converted format in <DateTimePicker value={...}>,
        // we still need to ensure the date-time values are in the correct UTC format
        startDate: values.startDate ? dayjs(values.startDate).utc().toISOString() : null,
        endDate: values.endDate ? dayjs(values.endDate).utc().toISOString() : null,
      };
      if (selectedRowData) {
        // call onUpdate in edit mode
        onUpdate({ ...formattedInstance, id: selectedRowData.id });
      } else {
        // Otherwise, add a new course instance
        onSubmit(formattedInstance);
      }
    },
  });

  // Sync formik values when modal opens (for updates)
  useEffect(
    () => {
      if (open) {
        // Ensures the form is always reset when modal opens
        formik.resetForm();
        if (selectedRowData) {
          formik.setValues({
            moocCourseId: selectedRowData.moocCourseId,
            status: selectedRowData.status === "Open" ? 1 : 0,
            permission: selectedRowData.permission === "Public" ? 1 : 0,
            startDate: selectedRowData.startDate ? dayjs.utc(selectedRowData.startDate) : null, // Treat as UTC
            endDate: selectedRowData.endDate ? dayjs.utc(selectedRowData.endDate) : null,
            description: selectedRowData.description,
          });
        }
      }
    },
    // use "open" to reset the form when reopening the modal
    // selectedRowData is set asynchronously based on rowSelectionModel
    // need both in the dependency array
    [selectedRowData, open]
  );

  return formik;
};
