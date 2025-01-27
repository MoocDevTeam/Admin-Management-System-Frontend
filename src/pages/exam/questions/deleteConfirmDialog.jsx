import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

export default function DeleteConfirmDialog({ open, onClose, selectedCount }) {
  const handleConfirm = async () => {
    try {
      // TODO: call delete api
      // await api.delete('/questions', { ids: selectedItems });
      console.log('Deleting questions');
      onClose(true);
    } catch (error) {
      console.error('Failed to delete questions:', error);
      onClose(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon color="warning" />
        Confirm Deletion
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete {selectedCount} selected question{selectedCount > 1 ? 's' : ''}?
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
