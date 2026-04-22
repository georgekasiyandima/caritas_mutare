import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import PartnerLogoStrip from '../PartnerLogoStrip';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const siteLinks = [
    { key: 'about', path: '/about' },
    { key: 'leadership', path: '/leadership' },
    { key: 'programs', path: '/programs' },
    { key: 'news', path: '/news' },
  ];

  const engageLinks = [
    { key: 'donate', path: '/donate' },
    { key: 'volunteer', path: '/volunteer' },
    { key: 'contact', path: '/contact' },
  ];

  const socialIconSx = {
    color: 'rgba(255,255,255,0.75)',
    transition: 'color .2s, background-color .2s',
    '&:hover': { color: 'common.white', bgcolor: 'rgba(255,255,255,0.08)' },
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#141414',
        color: 'common.white',
        mt: 'auto',
      }}
    >
      {/* Partner band */}
      <Box sx={{ bgcolor: '#faf9f7', py: 2.5 }}>
        <PartnerLogoStrip title={t('footer.partnersTitle', 'In partnership with')} variant="light" compact />
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Brand & mission */}
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src="/images/logo/caritas-mutare-new-logo.png"
              alt="Caritas Mutare"
              sx={{
                height: 72,
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
                opacity: 0.92,
                mb: 2,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.7,
                maxWidth: 320,
                mb: 2.5,
              }}
            >
              {t('footer.description')}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <IconButton
                size="small"
                component="a"
                href="https://www.facebook.com/share/1DoS9a5mzU/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                sx={socialIconSx}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                component="a"
                href="https://www.linkedin.com/in/caritas-zimbabwe-diocese-of-mutare-460272300"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                sx={socialIconSx}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                component="a"
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                sx={socialIconSx}
              >
                <YouTubeIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                component="a"
                href="mailto:admin@caritasmutare.org"
                aria-label="Email"
                sx={socialIconSx}
              >
                <EmailIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Site links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography
              variant="overline"
              sx={{
                color: 'rgba(255,255,255,0.55)',
                fontWeight: 700,
                letterSpacing: 1.5,
                mb: 1.5,
                display: 'block',
              }}
            >
              {t('footer.explore', 'Explore')}
            </Typography>
            <Stack spacing={1}>
              {siteLinks.map((link) => (
                <Link
                  key={link.key}
                  component={RouterLink}
                  to={link.path}
                  color="inherit"
                  underline="none"
                  sx={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '0.9rem',
                    transition: 'color .2s, padding-left .2s',
                    '&:hover': { color: 'common.white', pl: 0.5 },
                  }}
                >
                  {t(`nav.${link.key}`)}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Engage */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography
              variant="overline"
              sx={{
                color: 'rgba(255,255,255,0.55)',
                fontWeight: 700,
                letterSpacing: 1.5,
                mb: 1.5,
                display: 'block',
              }}
            >
              {t('footer.engage', 'Get involved')}
            </Typography>
            <Stack spacing={1}>
              {engageLinks.map((link) => (
                <Link
                  key={link.key}
                  component={RouterLink}
                  to={link.path}
                  color="inherit"
                  underline="none"
                  sx={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '0.9rem',
                    transition: 'color .2s, padding-left .2s',
                    '&:hover': { color: 'common.white', pl: 0.5 },
                  }}
                >
                  {t(`nav.${link.key}`)}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Visit & contact */}
          <Grid item xs={12} sm={4} md={4}>
            <Typography
              variant="overline"
              sx={{
                color: 'rgba(255,255,255,0.55)',
                fontWeight: 700,
                letterSpacing: 1.5,
                mb: 1.5,
                display: 'block',
              }}
            >
              {t('footer.visit', 'Visit & contact')}
            </Typography>
            <Stack spacing={1.5} sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
              <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                <LocationIcon fontSize="small" sx={{ mt: 0.2, color: 'rgba(255,255,255,0.55)' }} />
                <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'inherit' }}>
                  Mai Maria Village, Stand No. 19449<br />
                  Dangamvura Township, Triangle of Raheen<br />
                  Mutare District, Zimbabwe
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
                <PhoneIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.55)' }} />
                <Link
                  href="tel:+263774671893"
                  underline="hover"
                  sx={{ color: 'inherit', fontSize: '0.9rem' }}
                >
                  +263 77 467 1893
                </Link>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
                <EmailIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.55)' }} />
                <Link
                  href="mailto:admin@caritasmutare.org"
                  underline="hover"
                  sx={{ color: 'inherit', fontSize: '0.9rem' }}
                >
                  admin@caritasmutare.org
                </Link>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                <ScheduleIcon fontSize="small" sx={{ mt: 0.2, color: 'rgba(255,255,255,0.55)' }} />
                <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'inherit' }}>
                  Mon–Thu: 08:00 – 16:45<br />
                  Fri: 08:00 – 13:00
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 4, md: 5 }, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' }}>
              © {new Date().getFullYear()} Caritas Zimbabwe · Diocese of Mutare. {t('footer.copyrightSuffix', 'All rights reserved.')}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.72rem',
                fontStyle: 'italic',
                letterSpacing: 0.3,
              }}
            >
              {t('footer.poweredBy', 'Powered by faith, hope, and love')} · A member of Caritas Internationalis
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Link
              component={RouterLink}
              to="/admin/login"
              underline="none"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.8rem',
                fontWeight: 600,
                px: 1.75,
                py: 0.75,
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                transition: 'all .2s ease',
                '&:hover': {
                  color: 'common.white',
                  borderColor: 'rgba(255,255,255,0.6)',
                  bgcolor: 'rgba(255,255,255,0.05)',
                },
              }}
            >
              {t('nav.staffSignIn', 'Staff sign-in')}
              <ArrowForwardIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} />
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
