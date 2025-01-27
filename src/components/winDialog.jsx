import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
} from "@mui/material";

const WinDialog = (props) => {
  const { onClose, onOK, data, open, title, icon } = props;

  const handleCancle = () => {
    let paramdata = {
      isOk: false,
      data: data,
    };
    if (onClose) {
      onClose(paramdata);
    }
  };

  const handleClose = () => {
    let paramdata = {
      isOk: false,
      data: data,
    };
    if (onClose) {
      onClose(paramdata);
    }
  };

  const handleOk = () => {
    let paramdata = {
      isOk: true,
      data: data,
    };
    if (onOK) {
      onOK(paramdata);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
      {icon && (
        <span style={{ marginRight: "8px", verticalAlign: "middle" }}>
          {icon}
        </span>)}
        {title}
        </DialogTitle>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions>
        <Button
          color="success"
          variant="contained"
          type="submit"
          onClick={handleOk}
        >
          Ok
        </Button>
        <Button color="warning" variant="outlined" onClick={handleCancle}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WinDialog;
