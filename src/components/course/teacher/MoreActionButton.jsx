import { Box, IconButton, Menu, MenuItem, Button } from "@mui/material";
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

export const MoreActionButton = ({onUpdate, onDelete, onAssign}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem>
          <Button
            variant="text"
            color="success"
            startIcon={<AssignmentIndIcon />}
            onClick={(event) => {
              event.stopPropagation(); //prevent row selection
              onAssign();
              handleClose();
            }}
          >
            Assgin          
            </Button>
        </MenuItem>
        <MenuItem>
          <Button
            variant="text"
            color="success"
            startIcon={<ModeEditIcon />}
            onClick={(event) => {
              event.stopPropagation(); //prevent row selection
              onUpdate();
              handleClose();
            }}
          >
            update
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            variant="text"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={(event) => {
              event.stopPropagation(); //prevent row selection
              onDelete();
              handleClose();
            }}
          >
            Delete
          </Button>
        </MenuItem>
      </Menu>
    </Box>
  );
};
