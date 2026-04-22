import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Container, IconButton, Slide, Stack, Typography } from '@mui/material';
import { Close as CloseIcon, FavoriteBorder as HeartIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';

/**
 * Shows after the user scrolls past the hero on public pages and stays pinned
 * until dismissed. Suppressed on /donate and anywhere under /admin.
 *
 * Dismissal is stored in sessionStorage so the bar disappears for the rest of
 * the visit but returns on the next session — gentle, not naggy.
 */
const DISMISS_KEY = 'caritas_donate_bar_dismissed';
const SHOW_AFTER_PX = 560;

const StickyDonateBar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  const suppressed = useMemo(() => {
    const p = location.pathname;
    return p.startsWith('/admin') || p.startsWith('/donate');
  }, [location.pathname]);

  useEffect(() => {
    if (suppressed || dismissed) return;
    let ticking = false;
    const handle = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setVisible(window.scrollY > SHOW_AFTER_PX);
        ticking = false;
      });
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, [suppressed, dismissed]);

  if (suppressed || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* sessionStorage can be blocked in private mode; ignore */
    }
  };

  return (
    <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
      <Box
        role="complementary"
        aria-label={t('stickyDonate.ariaLabel')}
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (theme) => theme.zIndex.appBar + 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          boxShadow: '0 -8px 32px rgba(15, 23, 42, 0.22)',
          py: { xs: 1.25, md: 1.5 },
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'row', md: 'row' }}
            spacing={{ xs: 1.5, md: 3 }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flexGrow: 1 }}>
              <HeartIcon sx={{ display: { xs: 'none', sm: 'inline-flex' }, opacity: 0.9 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis' }}
                  noWrap
                >
                  {t('stickyDonate.title')}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.85, display: { xs: 'none', md: 'block' } }}
                >
                  {t('stickyDonate.subtitle')}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
              <Button
                component={RouterLink}
                to="/donate"
                variant="contained"
                size="medium"
                sx={{
                  bgcolor: 'common.white',
                  color: 'primary.main',
                  fontWeight: 700,
                  px: { xs: 2, md: 3 },
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                {t('stickyDonate.cta')}
              </Button>
              <IconButton
                onClick={handleDismiss}
                aria-label={t('stickyDonate.dismiss')}
                size="small"
                sx={{ color: 'common.white', opacity: 0.85, '&:hover': { opacity: 1 } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Slide>
  );
};

export default StickyDonateBar;
