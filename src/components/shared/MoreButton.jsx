import React, { useState } from "react";
import { Box, Menu, MenuItem, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const MoreButton = ({ showAdd = false, showEdit = false, showDelete = false, onAdd, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          sx: {
            width: "100px", 
          },
        }}
      >
        {showAdd && <MenuItem onClick={(event) => { onAdd(); handleClose(event); }}>Add</MenuItem>}
        {showEdit && <MenuItem onClick={(event) => { onEdit(); handleClose(event); }}>Edit</MenuItem>}
        {showDelete && <MenuItem onClick={(event) => { onDelete(); handleClose(event); }}>Delete</MenuItem>}
      </Menu>
    </Box>
  );
};

export default MoreButton;
