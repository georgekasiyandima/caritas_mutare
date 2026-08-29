import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { partnerLogosForSite, technicalSisterOrgs } from '../lib/caritasProjects';

interface PartnerLogoStripProps {
  title?: string;
  sisterTitle?: string;
  variant?: 'light' | 'dark';
  compact?: boolean;
  /** Footer stays logos-only; public pages also list sister organisations. */
  includeSisterOrgs?: boolean;
}

/**
 * Renders the strip of supporter / partner logos.
 * Any logo that fails to load is hidden rather than leaving an empty white
 * card in the layout. Partners without a file yet show their name instead.
 */
const PartnerLogoStrip: React.FC<PartnerLogoStripProps> = ({
  title = 'Supported by',
  sisterTitle = 'Technical partners & sister organisations',
  variant = 'light',
  compact = false,
  includeSisterOrgs = true,
}) => {
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const visiblePartners = partnerLogosForSite.filter((p) => !hidden.has(p.name));
  if (visiblePartners.length === 0 && technicalSisterOrgs.length === 0) return null;

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
        {title && visiblePartners.length > 0 && (
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
        {visiblePartners.length > 0 && (
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
                  minHeight: compact ? 44 : 52,
                  minWidth: 88,
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
                {partner.logoUrl ? (
                  <Box
                    component="img"
                    src={partner.logoUrl}
                    alt={partner.name}
                    loading="lazy"
                    onError={() => handleError(partner.name)}
                    sx={{
                      height: compact ? 42 : 56,
                      maxWidth: compact ? 168 : 200,
                      width: 'auto',
                      objectFit: 'contain',
                      opacity: 0.95,
                      display: 'block',
                      '&:hover': { opacity: 1 },
                    }}
                  />
                ) : (
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: 0.2,
                      color: 'text.primary',
                      textAlign: 'center',
                      lineHeight: 1.3,
                      maxWidth: 140,
                    }}
                  >
                    {partner.name}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {includeSisterOrgs && technicalSisterOrgs.length > 0 && (
          <Box sx={{ mt: visiblePartners.length > 0 ? 3.5 : 0 }}>
            <Typography
              variant="subtitle2"
              textAlign="center"
              sx={{
                mb: 1.5,
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: variant === 'dark' ? 'grey.400' : 'text.secondary',
              }}
            >
              {sisterTitle}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              {technicalSisterOrgs.map((name) => (
                <Box
                  key={name}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 999,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    backgroundColor: variant === 'dark' ? 'rgba(255,255,255,0.92)' : 'white',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PartnerLogoStrip;
