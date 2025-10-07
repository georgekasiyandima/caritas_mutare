import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { key: 'about', path: '/about' },
    { key: 'leadership', path: '/leadership' },
    { key: 'programs', path: '/programs' },
    { key: 'news', path: '/news' },
    { key: 'donate', path: '/donate' },
    { key: 'volunteer', path: '/volunteer' },
    { key: 'contact', path: '/contact' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.900',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              {t('hero.title')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
              {t('footer.description')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton color="inherit" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              {t('footer.quickLinks')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {quickLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.path}
                  color="inherit"
                  underline="hover"
                  sx={{ textDecoration: 'none' }}
                >
                  {t(`nav.${link.key}`)}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              {t('footer.contactInfo')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon fontSize="small" />
                <Typography variant="body2">
                  Cnr Jason Moyo and Herbert Chitepo, Mutare, Zimbabwe
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">
                  +263 77 467 1893 / 02020 60504 / 65077
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" />
                <Typography variant="body2">
                  egumbeze@caritasmutare.org
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: 'grey.700' }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {t('footer.copyright')}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.6, mt: 1 }}>
            {t('footer.poweredBy')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;





