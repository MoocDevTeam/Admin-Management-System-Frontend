import React from 'react';
import {
  Box,
  Stack,
  Typography,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// TODO: This component expects the following props from parent:
// pageSize: number - current page size
// page: number - current page number
// total: number - total number of items
// onPageChange: (newPage: number) => void - handle page change
// onPageSizeChange: (newPageSize: number) => void - handle page size change
// These should be connected to backend pagination API:
// GET /api/[resource]?page=${page}&pageSize=${pageSize}
// Expected response format: { items: Array, total: number }

export default function TablePagination({ 
  pageSize, 
  page, 
  total, 
  onPageChange, 
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25]
}) {
  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
      <Stack spacing={2} direction="row" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Rows per page:
        </Typography>
        <Select
          value={pageSize}
          onChange={(e) => onPageSizeChange(e.target.value)}
          size="small"
        >
          {pageSizeOptions.map(size => (
            <MenuItem key={size} value={size}>{size}</MenuItem>
          ))}
        </Select>
        <Typography variant="body2" color="text.secondary">
          {`${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, total)} of ${total}`}
        </Typography>
        <IconButton 
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <IconButton
          onClick={() => onPageChange(page + 1)}
          disabled={page * pageSize >= total}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
