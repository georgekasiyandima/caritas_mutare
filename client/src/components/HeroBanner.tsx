import React from 'react';
import { Box, Container, Stack, Typography, Button, Chip } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

export interface HeroCTA {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'ghost';
}

export interface HeroBannerProps {
  image: string;
  imageAlt?: string;
  imagePosition?: string;
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryCta?: HeroCTA;
  secondaryCta?: HeroCTA;
  /** Visual height preset. `tall` is for homepage; `standard` for interior pages. */
  size?: 'tall' | 'standard';
  /** Darkness of the overlay (0–1). Higher = more contrast over bright images. */
  overlay?: number;
  /** Optional caption shown subtly in the lower corner. */
  caption?: string;
  /** Optional supporting content (e.g. stats ribbon) rendered below the hero block, inside the overlay. */
  footer?: React.ReactNode;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  image,
  imageAlt = '',
  imagePosition = 'center center',
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  size = 'tall',
  overlay = 0.55,
  caption,
  footer,
}) => {
  const minH = size === 'tall' ? { xs: 520, sm: 580, md: 640, lg: 700 } : { xs: 340, sm: 380, md: 440 };
  const topPad = size === 'tall' ? { xs: 18, md: 22 } : { xs: 10, md: 12 };

  const renderCta = (cta: HeroCTA, primary: boolean) => {
    const common = {
      size: 'large' as const,
      onClick: cta.onClick,
      href: cta.href,
      sx: {
        px: 3.5,
        py: 1.4,
        fontWeight: 700,
        fontSize: { xs: '0.95rem', md: '1rem' },
        letterSpacing: 0.2,
      },
    };
    if (primary) {
      return (
        <Button
          {...common}
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          sx={{
            ...common.sx,
            bgcolor: 'primary.main',
            color: 'common.white',
            boxShadow: '0 10px 28px rgba(125,0,0,0.35)',
            '&:hover': { bgcolor: 'primary.dark', boxShadow: '0 12px 32px rgba(125,0,0,0.45)' },
          }}
        >
          {cta.label}
        </Button>
      );
    }
    return (
      <Button
        {...common}
        variant="text"
        sx={{
          ...common.sx,
          color: 'common.white',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 14,
            right: 14,
            bottom: 8,
            height: '1px',
            bgcolor: 'rgba(255,255,255,0.55)',
            transition: 'background-color .2s',
          },
          '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', '&::after': { bgcolor: 'common.white' } },
        }}
      >
        {cta.label}
      </Button>
    );
  };

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: minH,
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
        backgroundColor: 'grey.900',
        color: 'common.white',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: imagePosition,
          backgroundRepeat: 'no-repeat',
          transform: 'scale(1.02)',
        }}
      />
      {imageAlt && (
        <Box
          component="img"
          src={image}
          alt={imageAlt}
          sx={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
        />
      )}

      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, rgba(0,0,0,${Math.min(0.35, overlay * 0.6)}) 0%, rgba(0,0,0,${overlay * 0.15}) 40%, rgba(0,0,0,${overlay}) 100%), linear-gradient(92deg, rgba(0,0,0,${overlay * 0.85}) 0%, rgba(0,0,0,${overlay * 0.4}) 55%, rgba(0,0,0,0) 100%)`,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          pt: topPad,
          pb: { xs: 5, md: 7 },
          width: '100%',
        }}
      >
        <Box sx={{ maxWidth: { xs: '100%', md: 760 } }}>
          {eyebrow && (
            <Chip
              label={eyebrow}
              size="small"
              sx={{
                mb: 2.5,
                bgcolor: 'rgba(255,255,255,0.14)',
                color: 'common.white',
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                fontSize: '0.7rem',
                borderRadius: 1,
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            />
          )}

          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontFamily: '"Merriweather", Georgia, serif',
              fontWeight: 700,
              color: 'common.white',
              lineHeight: 1.1,
              fontSize: { xs: '2.15rem', sm: '2.75rem', md: '3.4rem', lg: '3.9rem' },
              textShadow: '0 2px 24px rgba(0,0,0,0.45)',
              mb: subtitle ? 2 : 3,
              maxWidth: 820,
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.92)',
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.7,
                maxWidth: 620,
                mb: 3.5,
                textShadow: '0 1px 8px rgba(0,0,0,0.35)',
              }}
            >
              {subtitle}
            </Typography>
          )}

          {(primaryCta || secondaryCta) && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 2 }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
            >
              {primaryCta && renderCta(primaryCta, true)}
              {secondaryCta && renderCta(secondaryCta, false)}
            </Stack>
          )}
        </Box>

        {footer && (
          <Box sx={{ mt: { xs: 4, md: 5 } }}>{footer}</Box>
        )}

        {caption && (
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              right: 16,
              bottom: 12,
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.7rem',
              letterSpacing: 0.3,
              display: { xs: 'none', md: 'block' },
            }}
          >
            {caption}
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default HeroBanner;
