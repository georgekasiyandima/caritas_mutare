import React from 'react';
import { Box, LinearProgress } from '@mui/material';

/**
 * Quiet in-page wait. Shown while a lazy route chunk loads — header and
 * footer stay up when this sits inside PublicLayout / AdminLayout.
 */
const LoadingSpinner: React.FC = () => {
  return (
    <Box
      role="status"
      aria-label="Loading"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: { xs: 280, md: 360 },
        px: 3,
        py: 6,
        gap: 2.5,
      }}
    >
      <Box
        component="img"
        src="/images/logo/caritas-mutare-clear.png"
        alt=""
        sx={{ height: { xs: 48, md: 56 }, maxWidth: 280, objectFit: 'contain' }}
      />
      <LinearProgress
        sx={{
          width: 160,
          height: 3,
          borderRadius: 999,
          bgcolor: 'rgba(125, 0, 0, 0.12)',
          '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' },
        }}
      />
    </Box>
  );
};

export default LoadingSpinner;
