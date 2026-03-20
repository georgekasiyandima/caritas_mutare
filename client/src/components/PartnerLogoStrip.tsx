import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { partnerLogosForSite } from '../lib/caritasProjects';

interface PartnerLogoStripProps {
  title?: string;
  variant?: 'light' | 'dark';
  compact?: boolean;
}

const PartnerLogoStrip: React.FC<PartnerLogoStripProps> = ({
  title = 'Supported by',
  variant = 'light',
  compact = false,
}) => {
  return (
    <Box
      sx={{
        py: compact ? 3 : 4,
        backgroundColor: variant === 'dark' ? 'grey.900' : 'grey.50',
        borderTop: variant === 'dark' ? 'none' : '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        {title && (
          <Typography
            variant="subtitle2"
            textAlign="center"
            sx={{
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: variant === 'dark' ? 'grey.400' : 'text.secondary',
            }}
          >
            {title}
          </Typography>
        )}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {partnerLogosForSite.map((partner) => (
            <Box
              key={partner.name}
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                backgroundColor: 'white',
                boxShadow: variant === 'dark' ? 2 : 0,
                border: '1px solid',
                borderColor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={partner.logoUrl}
                alt={partner.name}
                sx={{
                  height: compact ? 30 : 36,
                  maxWidth: 120,
                  objectFit: 'contain',
                  opacity: 0.95,
                  '&:hover': { opacity: 1 },
                }}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default PartnerLogoStrip;
