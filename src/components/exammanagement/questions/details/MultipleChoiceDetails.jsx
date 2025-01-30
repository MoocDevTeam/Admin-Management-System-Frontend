import React from 'react';
import { Box, Table, TableHead, TableBody, TableRow, TableCell, Chip } from '@mui/material';

// multiple choice question details
export default function MultipleChoiceDetails({ options }) {
  return (
    <Box sx={{ 
      border: 1, 
      borderColor: 'divider',
      borderRadius: 1,
      mx: 2,
      my: 1,
      width: '100%'
    }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '8%' }}>Option</TableCell>
            <TableCell sx={{ width: '25%' }}>Answer</TableCell>
            <TableCell sx={{ width: '52%', pl: 4, pr: 4 }}>Explanation</TableCell>
            <TableCell sx={{ width: '15%', pl: 3 }}>Correct</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {options.map((option) => (
            <TableRow key={option.id}>
              <TableCell sx={{ height: '48px', verticalAlign: 'middle' }}>
                {option.id}
              </TableCell>
              <TableCell sx={{ height: '48px', verticalAlign: 'middle' }}>
                {option.text}
              </TableCell>
              <TableCell sx={{ 
                height: '48px', 
                verticalAlign: 'middle',
                pl: 4,
                pr: 4,
                width: '52%',
                maxWidth: '52%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {option.explanation || '-'}
              </TableCell>
              <TableCell sx={{ height: '48px', verticalAlign: 'middle', pl: 3 }}>
                <Box sx={{ 
                  minHeight: '32px', 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}>
                  {option.correct && (
                    <Chip label="Correct" color="success" size="small" />
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
