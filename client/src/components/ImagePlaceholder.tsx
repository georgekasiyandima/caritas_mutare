import React from 'react';
import { Box, Typography } from '@mui/material';

interface ImagePlaceholderProps {
  width?: number | string;
  height?: number | string;
  text?: string;
  backgroundColor?: string;
  color?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width = 400,
  height = 300,
  text = 'Image Placeholder',
  backgroundColor = '#f5f5f5',
  color = '#666'
}) => {
  return (
    <Box
      sx={{
        width,
        height,
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed #ccc',
        borderRadius: 1,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color,
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default ImagePlaceholder;
