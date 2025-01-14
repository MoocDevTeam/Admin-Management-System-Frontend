import React, { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { filterCourses } from "../../../store/courseSlice";

const FilterDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilter = (category) => {
    dispatch(filterCourses(category)); 
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleOpen}
      >
        Filter
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleFilter("all")}>All</MenuItem>
        <MenuItem onClick={() => handleFilter("Programming Language")}>Programming Language</MenuItem>
        <MenuItem onClick={() => handleFilter("Business and Accounting")}>Business and Accounting</MenuItem>
        <MenuItem onClick={() => handleFilter("Social")}>Social</MenuItem>
      </Menu>
    </>
  );
};

export default FilterDropdown;
