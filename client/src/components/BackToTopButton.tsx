import React, { useState, useEffect } from 'react';
import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';

interface BackToTopButtonProps {
  threshold?: number;
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({ threshold = 100 }) => {
  const [show, setShow] = useState(false);

  const handleScroll = () => {
    setShow(window.scrollY > threshold);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Zoom in={show}>
      <Fab
        onClick={handleClick}
        color="primary"
        size="medium"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          backgroundColor: 'primary.main',
          color: 'white',
          boxShadow: 4,
          '&:hover': {
            backgroundColor: 'primary.dark',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
        }}
        aria-label="Back to top"
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
};

export default BackToTopButton;
