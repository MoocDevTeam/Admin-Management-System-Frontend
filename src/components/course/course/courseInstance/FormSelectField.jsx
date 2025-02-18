import React from "react";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

// This reusable component is for Course, Status and Permission Selection to reduce redundancy
const FormSelectField = ({ formik, name, label, options, disabledMessage }) => {
  return (
    <FormControl fullWidth margin="normal" error={formik.touched[name] && Boolean(formik.errors[name])}>
      <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-select-label`}
        id={`${name}-select`}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        label={label} // the text shown above the input field
      >
        {options.length === 0 ? (
          // If options(courses) is null or undefined, it shows disabledMessage
          <MenuItem disabled> {disabledMessage} </MenuItem>
        ) : (
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        )}
      </Select>
      {/* MUI’s <Select> doesn’t have helperText like <TextField> */}
      {/* <TextField> is an all-in-one input component */}
      {/* <Select> is just a dropdown component that needs to be combined with <FormControl> and <FormHelperText> for full functionality */}
      <FormHelperText>{formik.touched[name] && formik.errors[name]}</FormHelperText>
    </FormControl>
  );
};

export default FormSelectField;
