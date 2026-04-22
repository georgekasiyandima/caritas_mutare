import React from 'react';
import { Box, Container, Grid, Typography, Stack } from '@mui/material';
import { FormatQuote as QuoteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export interface CommunityVoiceProps {
  /** Pull quote in English. */
  quoteEn: string;
  /** Pull quote in Shona (optional — falls back to English when missing). */
  quoteSh?: string;
  /**
   * The voice's attribution — generic role + community is preferred over a
   * named individual unless explicit, written consent has been obtained.
   * E.g. "A mother of three · Ward 7, Bumba".
   */
  attribution: string;
  /** Field photograph that supports the voice. */
  image: string;
  /** Alt text for the photograph. */
  imageAlt: string;
  /** Optional CSS object-position. */
  imagePosition?: string;
  /** Programme tag shown above the quote (e.g. "SERARP — Bumba"). */
  programmeTag: string;
}

/**
 * A single, generously-spaced testimonial block.
 * Designed to interrupt the page rhythm with a moment of human voice —
 * charity:water uses these to translate big numbers into one person's reality.
 *
 * Editorial guideline: never show a named beneficiary's face without
 * informed, signed consent. Prefer role + place attribution by default.
 */
const CommunityVoiceBlock: React.FC<CommunityVoiceProps> = ({
  quoteEn,
  quoteSh,
  attribution,
  image,
  imageAlt,
  imagePosition = 'center center',
  programmeTag,
}) => {
  const { i18n } = useTranslation();
  const isShona = i18n.language?.startsWith('sh');
  const quote = isShona && quoteSh ? quoteSh : quoteEn;

  return (
    <Box sx={{ py: { xs: 6, md: 9 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                aspectRatio: { xs: '4/3', md: '5/6' },
                maxHeight: { md: 560 },
                boxShadow: '0 24px 56px rgba(15,23,42,0.18)',
              }}
            >
              <Box
                component="img"
                src={image}
                alt={imageAlt}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: imagePosition,
                  display: 'block',
                }}
              />
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)',
                }}
              />
              <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: { xs: 2.5, md: 3 } }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.85)',
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                  }}
                >
                  {programmeTag}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={2.5} sx={{ position: 'relative', maxWidth: 560 }}>
              <QuoteIcon
                aria-hidden
                sx={{
                  fontSize: 64,
                  color: 'primary.main',
                  opacity: 0.18,
                  transform: 'scaleX(-1)',
                  ml: -1,
                }}
              />
              <Typography
                component="blockquote"
                sx={{
                  fontFamily: '"Merriweather", Georgia, serif',
                  fontWeight: 400,
                  fontSize: { xs: '1.4rem', md: '1.85rem' },
                  lineHeight: 1.5,
                  color: 'text.primary',
                  m: 0,
                  fontStyle: 'italic',
                }}
              >
                “{quote}”
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  aria-hidden
                  sx={{
                    width: 48,
                    height: 2,
                    bgcolor: 'primary.main',
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    letterSpacing: 0.3,
                  }}
                >
                  {attribution}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CommunityVoiceBlock;
