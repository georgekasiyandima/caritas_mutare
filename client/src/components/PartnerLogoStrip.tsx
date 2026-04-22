import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { partnerLogosForSite } from '../lib/caritasProjects';

interface PartnerLogoStripProps {
  title?: string;
  variant?: 'light' | 'dark';
  compact?: boolean;
}

/**
 * Renders the strip of supporter / partner logos.
 * Any logo that fails to load is hidden rather than leaving an empty white
 * card in the layout. If every logo fails (or the list is empty) the whole
 * strip disappears — a partner band that can't show partners adds no value.
 */
const PartnerLogoStrip: React.FC<PartnerLogoStripProps> = ({
  title = 'Supported by',
  variant = 'light',
  compact = false,
}) => {
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const visiblePartners = partnerLogosForSite.filter((p) => !hidden.has(p.name));
  if (visiblePartners.length === 0) return null;

  const handleError = (name: string) => {
    setHidden((prev) => {
      if (prev.has(name)) return prev;
      const next = new Set(prev);
      next.add(name);
      return next;
    });
  };

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
          {visiblePartners.map((partner) => (
            <Box
              key={partner.name}
              sx={{
                px: 1.75,
                py: 1,
                borderRadius: 2.5,
                backgroundColor: variant === 'dark' ? 'rgba(255,255,255,0.98)' : 'white',
                boxShadow:
                  variant === 'dark'
                    ? '0 8px 24px rgba(0,0,0,0.25)'
                    : '0 4px 16px rgba(15,23,42,0.08)',
                border: '1px solid',
                borderColor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow:
                    variant === 'dark'
                      ? '0 10px 26px rgba(0,0,0,0.32)'
                      : '0 8px 20px rgba(15,23,42,0.14)',
                },
                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',
                  '&:hover': { transform: 'none' },
                },
              }}
            >
              <Box
                component="img"
                src={partner.logoUrl}
                alt={partner.name}
                loading="lazy"
                onError={() => handleError(partner.name)}
                sx={{
                  height: compact ? 30 : 36,
                  maxWidth: 120,
                  objectFit: 'contain',
                  opacity: 0.95,
                  display: 'block',
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
