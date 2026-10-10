import React from 'react';
import { Box, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import {
  Facebook,
  LinkedIn,
  EmailOutlined as Email,
} from '@mui/icons-material';
import { iconChromeSx } from '../lib/sitePageLayout';
import { orgContact } from '../lib/organisation';

const SocialRail: React.FC = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const socials = [
    {
      key: 'facebook',
      label: 'Facebook',
      href: orgContact.social.facebook,
      icon: <Facebook sx={iconChromeSx} />,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      href: orgContact.social.linkedin,
      icon: <LinkedIn sx={iconChromeSx} />,
    },
    {
      key: 'email',
      label: 'Email',
      href: `mailto:${orgContact.email.primary}`,
      icon: <Email sx={iconChromeSx} />,
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
