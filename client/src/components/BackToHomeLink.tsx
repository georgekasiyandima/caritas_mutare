import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

/**
 * Floating "Back to home" pill rendered on every interior public page.
 *
 * It sits just below the fixed Navbar on the left edge. Using `position: fixed`
 * keeps the hero banners and first-screen content unaffected — we don't want
 * to push large hero images down or introduce a dead strip of chrome.
 *
 * Hidden on the landing page itself to avoid a meaningless self-link.
 */
const BackToHomeLink: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/') return null;

  return (
    <Box
      component={Link}
      to="/"
      aria-label="Back to home"
      sx={{
        position: 'fixed',
        top: { xs: 74, sm: 82 },
        left: { xs: 12, md: 20 },
        zIndex: 1100,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.5,
        py: 0.75,
        borderRadius: 999,
        bgcolor: 'rgba(255,255,255,0.92)',
        color: 'text.primary',
        textDecoration: 'none',
        fontSize: '0.82rem',
        fontWeight: 600,
        letterSpacing: 0.2,
        boxShadow: '0 4px 14px rgba(15,23,42,0.12)',
        border: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(6px)',
        transition: 'background-color .2s, color .2s, transform .2s',
        '&:hover': {
          bgcolor: 'primary.main',
          color: 'common.white',
          borderColor: 'primary.main',
          transform: 'translateX(-2px)',
        },
      }}
    >
      <ArrowBackIcon sx={{ fontSize: 16 }} />
      Back to home
    </Box>
  );
};

export default BackToHomeLink;
