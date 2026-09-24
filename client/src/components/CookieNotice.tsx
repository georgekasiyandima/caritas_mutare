import React, { useState } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'caritas_privacy_notice_seen';

/**
 * Honest first-visit note. This site does not set advertising cookies.
 * Language (and staff sign-in) live in localStorage, not tracking cookies.
 */
const CookieNotice: React.FC = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== '1';
    } catch {
      return false;
    }
  });

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* private mode — still hide for this visit */
    }
    setVisible(false);
  };

  return (
    <Paper
      elevation={0}
      role="dialog"
      aria-label={t('privacy.noticeAria', 'Privacy notice')}
      sx={{
        position: 'fixed',
        left: { xs: 12, md: 24 },
        right: { xs: 12, md: 'auto' },
        bottom: { xs: 88, md: 24 },
        zIndex: 1250,
        maxWidth: 400,
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={1.5}>
        <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
          {t(
            'privacy.notice',
            'We do not use advertising cookies. This site remembers your language on this device. Staff sign-in is stored only if you sign in.'
          )}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <Button component={RouterLink} to="/privacy" size="small" onClick={dismiss}>
            {t('privacy.learnMore', 'Learn more')}
          </Button>
          <Button variant="contained" size="small" onClick={dismiss}>
            {t('privacy.ok', 'OK')}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default CookieNotice;
