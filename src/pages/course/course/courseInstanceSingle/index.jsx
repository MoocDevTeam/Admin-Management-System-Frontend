import React, { useState, useEffect } from "react";
import Header from "../../../../components/header";
import getRequest from "../../../../request/getRequest";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import toast from "react-hot-toast";

export default function CourseInstanceSingle() {
  const [loading, setLoading] = useState(true);
  const [courseInstance, setCourseInstance] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest("/", null, setLoading);
        if (response?.isSuccess) {
          setCourseInstance(response?.data || []);
          setError("");
        } else {
          const errorMessage = response?.message || "An error occurred while fetching data.";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (err) {
        setError("Failed to fetch data");
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  return (
    <Box m="20px">
      <Header title="Course Instance" subtitle="Managing Course Instance" />

    </Box>
  );
}
