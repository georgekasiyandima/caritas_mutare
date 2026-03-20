import React from 'react';
import { Box, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Facebook, Instagram, Email } from '@mui/icons-material';
import { mockContactInfo } from '../data/mockData';

const SocialRail: React.FC = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const socials = [
    {
      key: 'facebook',
      label: 'Facebook',
      href: mockContactInfo.social_media.facebook,
      icon: <Facebook sx={{ fontSize: 20 }} />,
    },
    {
      key: 'twitter',
      label: 'X (Twitter)',
      href: mockContactInfo.social_media.twitter,
      icon: (
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: '4px',
            border: '1.5px solid currentColor',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          X
        </Box>
      ),
    },
    {
      key: 'instagram',
      label: 'Instagram',
      href: mockContactInfo.social_media.instagram,
      icon: <Instagram sx={{ fontSize: 20 }} />,
    },
    {
      key: 'email',
      label: 'Email',
      href: `mailto:${mockContactInfo.email.general}`,
      icon: <Email sx={{ fontSize: 20 }} />,
    },
    {
      key: 'youtube',
      label: 'YouTube',
      href: '#',
      icon: (
        <Box
          sx={{
            width: 20,
            height: 14,
            borderRadius: '6px',
            backgroundColor: '#FF0000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderLeft: '6px solid white',
              borderTop: '4px solid transparent',
              borderBottom: '4px solid transparent',
            }}
          />
        </Box>
      ),
    },
  ];

  if (isXs) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        right: { xs: 8, md: 16 },
        transform: 'translateY(-50%)',
        zIndex: 1200,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: 0.75,
          py: 1,
          borderRadius: 999,
          backgroundColor: 'rgba(255,255,255,0.96)',
          boxShadow: 3,
          gap: 0.5,
        }}
      >
        {socials.map((item) => (
          <Tooltip key={item.key} title={item.label}>
            <IconButton
              component="a"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                mx: 0.25,
                color: 'primary.main',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default SocialRail;

