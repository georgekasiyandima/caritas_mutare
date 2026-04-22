import React from 'react';
import { Box, Container, Grid, Stack, Typography, Button, LinearProgress } from '@mui/material';
import {
  ArrowForward as ArrowIcon,
  CheckCircleOutline as CheckIcon,
  AccountBalanceWalletOutlined as WalletIcon,
  ReceiptLongOutlined as ReceiptIcon,
  PublicOutlined as PublicIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface AllocationSlice {
  /** i18n key under home.transparency.allocation.items, falling back to label */
  key: string;
  /** Percentage of donations directed here (0–100). */
  percent: number;
  /** Fallback label if i18n missing. */
  fallbackLabel: string;
  /** Tone color from theme palette. */
  color: 'primary.main' | 'info.main' | 'success.main' | 'warning.main';
}

const ALLOCATIONS: AllocationSlice[] = [
  { key: 'programs', percent: 82, fallbackLabel: 'Direct programmes', color: 'primary.main' },
  { key: 'capacity', percent: 12, fallbackLabel: 'Staff & capacity', color: 'info.main' },
  { key: 'admin', percent: 6, fallbackLabel: 'Administration', color: 'warning.main' },
];

const PROMISES = [
  { key: 'audited', icon: <ReceiptIcon />, fallback: 'Independently audited every year' },
  { key: 'localised', icon: <PublicIcon />, fallback: 'Funds spent in the Diocese of Mutare' },
  { key: 'reported', icon: <CheckIcon />, fallback: 'Outcomes reported back to donors' },
];

/**
 * Donor-trust block modelled on charity:water's "100% model" section.
 * Goal: in one glance, show where money goes and the accountability promises
 * behind it. Numbers are placeholders — they should be replaced with the
 * actual figures from Caritas Mutare's most recent audited report.
 */
const TransparencyBlock: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ py: { xs: 6, md: 9 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid item xs={12} md={5}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <WalletIcon sx={{ color: 'primary.main' }} />
              <Typography
                variant="overline"
                sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2 }}
              >
                {t('home.transparency.overline', 'Transparency')}
              </Typography>
            </Stack>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontFamily: '"Merriweather", Georgia, serif',
                fontWeight: 700,
                lineHeight: 1.15,
                color: 'text.primary',
                mb: 2.5,
                fontSize: { xs: '1.85rem', md: '2.4rem' },
              }}
            >
              {t('home.transparency.title', 'Every gift is accounted for.')}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 3, maxWidth: 480 }}
            >
              {t(
                'home.transparency.body',
                'We publish our audited accounts each year. The vast majority of every donation goes directly to community programmes — food, livelihoods, inclusion and emergency response — across the Diocese of Mutare.'
              )}
            </Typography>
            <Stack spacing={1.25} sx={{ mb: 3.5 }}>
              {PROMISES.map((promise) => (
                <Stack key={promise.key} direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ color: 'success.main', display: 'flex' }}>{promise.icon}</Box>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                    {t(`home.transparency.promises.${promise.key}`, promise.fallback)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Button
              component={RouterLink}
              to="/about"
              variant="text"
              color="primary"
              endIcon={<ArrowIcon />}
              sx={{ fontWeight: 700, px: 0 }}
            >
              {t('home.transparency.cta', 'Read our annual report')}
            </Button>
          </Grid>

          <Grid item xs={12} md={7}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                bgcolor: 'rgba(13, 92, 99, 0.04)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack
                direction="row"
                alignItems="baseline"
                spacing={1.5}
                sx={{ mb: { xs: 3, md: 4 } }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontFamily: '"Merriweather", Georgia, serif',
                    fontWeight: 700,
                    fontSize: { xs: '3.2rem', md: '4.2rem' },
                    lineHeight: 1,
                    color: 'primary.main',
                  }}
                >
                  82%
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    maxWidth: 320,
                    lineHeight: 1.5,
                  }}
                >
                  {t(
                    'home.transparency.headlineStat',
                    'of every dollar funds direct programme work in communities.'
                  )}
                </Typography>
              </Stack>

              <Stack spacing={2.5}>
                {ALLOCATIONS.map((slice) => (
                  <Box key={slice.key}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {t(`home.transparency.allocation.items.${slice.key}`, slice.fallbackLabel)}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {slice.percent}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={slice.percent}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(15,23,42,0.06)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: slice.color,
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 3,
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  opacity: 0.85,
                }}
              >
                {t(
                  'home.transparency.note',
                  'Indicative split based on the most recent operating period. Final figures published in the annual audited report.'
                )}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TransparencyBlock;
