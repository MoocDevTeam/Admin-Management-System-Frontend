import { Box, CircularProgress } from '@mui/material'
import React from 'react'

export default function LoadingSpinner() {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}
        >
            <CircularProgress size={30} />
        </Box>
    )
}
