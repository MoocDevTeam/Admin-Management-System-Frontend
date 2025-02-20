import React from "react";
import { Stack, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

// extract the action buttons (Add, Update, Delete) into ListActionButtons
const DataGridActionButtons = ({ onAdd, onUpdate, onDelete, isRowSelected, isSingleRowSelected }) => {
  return (
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      {/* Disable Add button if at least one row is selected */}
      <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd} disabled={isRowSelected}>
        Add Course Launch
      </Button>
      {/* Disable Update button if no row OR multiple rows are selected */}
      <Button variant="contained" startIcon={<ModeEditIcon />} onClick={onUpdate} disabled={!isSingleRowSelected}>
        Update
      </Button>
      <Button
        color="secondary"
        variant="contained"
        startIcon={<DeleteIcon />}
        onClick={onDelete}
        disabled={!isRowSelected}>
        Delete
      </Button>
    </Stack>
  );
};

export default DataGridActionButtons;
