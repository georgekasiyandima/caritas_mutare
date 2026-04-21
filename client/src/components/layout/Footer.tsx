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
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import PartnerLogoStrip from '../PartnerLogoStrip';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { key: 'about', path: '/about' },
    { key: 'leadership', path: '/leadership' },
    { key: 'programs', path: '/programs' }, // label comes from nav.programs -> \"Projects\"
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
              <IconButton
                color="inherit"
                size="small"
                component="a"
                href="https://www.facebook.com/share/1DoS9a5mzU/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                component="a"
                href="https://www.linkedin.com/in/caritas-zimbabwe-diocese-of-mutare-460272300?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                component="a"
                href="mailto:admin@caritasmutare.org"
              >
                <EmailIcon />
              </IconButton>
              <IconButton color="inherit" size="small" component="a" href="#">
                <Box
                  sx={{
                    width: 20,
                    height: 14,
                    borderRadius: '6px',
                    backgroundColor: '#FF0000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 8,
                      height: 8,
                      borderLeft: '6px solid white',
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
                    }}
                  />
                </Box>
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
                  component={RouterLink}
                  to={link.path}
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
                  Mai Maria Village, Stand No. 19449, Dangamvura Township,
                  Triangle of Raheen, Mutare District
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
                  admin@caritasmutare.org
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon fontSize="small" />
                <Typography variant="body2">
                  Mon-Thu: 8:00am-16:45pm | Fri: 8:00am-13:00pm
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: 'grey.700' }} />

        {/* Partner logos on a light band so they stay visible on the dark footer */}
        <PartnerLogoStrip title="Our partners" variant="light" compact />

        <Box sx={{ textAlign: 'center', pt: 2 }}>
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





