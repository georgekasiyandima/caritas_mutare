import React from 'react';
import { Button, Box, Avatar, Typography, useTheme } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ReturnHomeButtonProps {
  variant?: 'floating' | 'inline' | 'compact';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const ReturnHomeButton: React.FC<ReturnHomeButtonProps> = ({ 
  variant = 'floating', 
  position = 'top-left' 
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleClick = () => {
    navigate('/');
  };

  const getPositionStyles = () => {
    const positions = {
      'top-left': { top: 24, left: 24 },
      'top-right': { top: 24, right: 24 },
      'bottom-left': { bottom: 24, left: 24 },
      'bottom-right': { bottom: 24, right: 24 },
    };
    return positions[position];
  };

  const renderFloating = () => (
    <Button
      onClick={handleClick}
      sx={{
        position: 'fixed',
        ...getPositionStyles(),
        zIndex: 1000,
        minWidth: 'auto',
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: 'white',
        color: 'primary.main',
        boxShadow: 4,
        border: '2px solid',
        borderColor: 'primary.main',
        '&:hover': {
          backgroundColor: 'primary.main',
          color: 'white',
          transform: 'scale(1.1)',
          boxShadow: 6,
        },
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Return to home"
    >
      <HomeIcon sx={{ fontSize: 24 }} />
    </Button>
  );

  const renderInline = () => (
    <Button
      onClick={handleClick}
      variant="outlined"
      startIcon={<HomeIcon />}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        py: 1.5,
        borderColor: 'primary.main',
        color: 'primary.main',
        '&:hover': {
          backgroundColor: 'primary.main',
          color: 'white',
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
        transition: 'all 0.3s ease',
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        Return Home
      </Typography>
    </Button>
  );

  const renderCompact = () => (
    <Box
      onClick={handleClick}
      sx={{
        position: 'fixed',
        ...getPositionStyles(),
        zIndex: 1000,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 3,
        px: 2,
        py: 1,
        boxShadow: 3,
        border: '1px solid',
        borderColor: 'primary.light',
        '&:hover': {
          backgroundColor: 'primary.main',
          color: 'white',
          transform: 'translateY(-2px)',
          boxShadow: 6,
        },
        transition: 'all 0.3s ease',
      }}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          backgroundColor: 'primary.main',
          mr: 1,
        }}
      >
        <HomeIcon sx={{ fontSize: 18 }} />
      </Avatar>
      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
        Home
      </Typography>
    </Box>
  );

  switch (variant) {
    case 'inline':
      return renderInline();
    case 'compact':
      return renderCompact();
    default:
      return renderFloating();
  }
};

export default ReturnHomeButton;
