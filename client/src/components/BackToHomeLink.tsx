import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';

const BackToHomeLink: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/') return null;

  return (
    <Link
      to="/"
      style={{ textDecoration: 'none' }}
      className="back-to-home-link"
    >
      <Typography
        component="span"
        variant="body2"
        sx={{
          color: 'text.secondary',
          '&:hover': { color: 'primary.main' },
          transition: 'color 0.2s',
        }}
      >
        ← Back to home
      </Typography>
    </Link>
  );
};

export default BackToHomeLink;
