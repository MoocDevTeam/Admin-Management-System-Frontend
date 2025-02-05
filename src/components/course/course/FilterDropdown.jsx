import React, { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { filterCourses } from "../../../store/courseSlice";

const CategoryDummyData = [
  "All",
  "Programming Language",
  "Business and Accounting",
  "Social",
];

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
      <Button variant="outlined" color="primary" onClick={handleOpen}>
        Filter
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {CategoryDummyData.map((item, index) => {
          return (
            <MenuItem onClick={() => handleFilter(`${item}`)}>{item}</MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default FilterDropdown;
