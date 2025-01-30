import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';

export default function JudgementQuestionDetails({ answer, explanation }) {
  return (
    <Box sx={{ mx: 2, my: 1 }}>
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2,
          bgcolor: 'background.paper',
          width: '100%'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ mr: 1 }}>
            Answer:
          </Typography>
          <Chip 
            label={answer ? "True" : "False"}
            color={answer ? "success" : "error"}
            size="small"
          />
        </Box>
        {explanation && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Explanation: {explanation}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
