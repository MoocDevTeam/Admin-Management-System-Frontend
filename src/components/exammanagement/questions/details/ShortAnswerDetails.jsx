import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function ShortAnswerDetails({ answer }) {
  return (
    <Box sx={{ mx: 2, my: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        Answer:
      </Typography>
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2,
          bgcolor: 'background.paper',
          minHeight: '60px',
          width: '100%'
        }}
      >
        <Typography sx={{ color: 'text.primary' }}>
          {answer}
        </Typography>
      </Paper>
    </Box>
  );
}
