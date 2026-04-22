import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Map as MapIcon,
  Schedule as ScheduleIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import BackToTopButton from '../components/BackToTopButton';
import {
  pageRoot,
  pageHero,
  pageOverline,
  pageH1,
  pageLead,
  outlineCard,
  outlineCardHover,
  formCardHeader,
} from '../lib/sitePageLayout';
import { orgContact } from '../lib/organisation';

const contactCardSx = { ...outlineCard, ...outlineCardHover };

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // In a real implementation, you would send this to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={pageRoot}>
      <Box sx={pageHero}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto' }}>
            <Typography variant="overline" sx={{ ...pageOverline, display: 'block', mb: 1 }}>
              Get in touch
            </Typography>
            <Typography variant={isMobile ? 'h3' : 'h2'} component="h1" sx={{ ...pageH1, mb: 2 }}>
              {t('contact.title')}
            </Typography>
            <Typography variant="body1" sx={{ ...pageLead, mx: 'auto' }}>
              {t('contact.description')}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>

      <Grid container spacing={6}>
        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Address Card */}
            <Card elevation={0} sx={contactCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(13, 92, 99, 0.12)', color: 'info.dark' }}>
                    <LocationIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t('contact.address')}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {orgContact.address.lines.map((line, idx) => (
                    <React.Fragment key={line}>
                      {line}
                      {idx < orgContact.address.lines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </Typography>
                <Chip
                  label="Mai Maria Village"
                  size="small"
                  color="primary"
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>

            {/* Phone Card */}
            <Card elevation={0} sx={contactCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(13, 92, 99, 0.12)', color: 'info.dark' }}>
                    <PhoneIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t('contact.phone')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Main:</strong>{' '}
                    <Box
                      component="a"
                      href={`tel:${orgContact.phones.main.replace(/\s/g, '')}`}
                      sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                    >
                      {orgContact.phones.main}
                    </Box>
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Office:</strong> {orgContact.phones.office}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Fax:</strong> {orgContact.phones.fax}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Email Card */}
            <Card elevation={0} sx={contactCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(13, 92, 99, 0.12)', color: 'info.dark' }}>
                    <EmailIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t('contact.email')}
                  </Typography>
                </Box>
                <Box
                  component="a"
                  href={`mailto:${orgContact.email.primary}`}
                  sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' }, display: 'block', mb: 2 }}
                >
                  <Typography variant="body1" color="inherit">
                    {orgContact.email.primary}
                  </Typography>
                </Box>
                <Chip
                  label="Response within 24 hours"
                  size="small"
                  color="info"
                />
              </CardContent>
            </Card>

            {/* Office Hours Card */}
            <Card elevation={0} sx={contactCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(13, 92, 99, 0.12)', color: 'info.dark' }}>
                    <ScheduleIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Office Hours
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {orgContact.hours.map((h) => (
                    <Typography key={h.days} variant="body1" color="text.secondary">
                      <strong>{h.days}:</strong> {h.time}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Map Card */}
            <Card elevation={0} sx={contactCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(13, 92, 99, 0.12)', color: 'info.dark' }}>
                      <MapIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Office Location
                    </Typography>
                  </Box>
                  <Button
                    component="a"
                    href={orgContact.maps.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                    sx={{ textTransform: 'none', fontWeight: 600, color: 'primary.main' }}
                  >
                    Directions
                  </Button>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    height: 250,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <iframe
                    src={orgContact.maps.embedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    title="Caritas Mutare · Mai Maria Village, Dangamvura"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {orgContact.address.short}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ ...outlineCard, overflow: 'hidden' }}>
            <Box sx={formCardHeader}>
              <Typography variant="h5" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 1 }}>
                Send us a message
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We will respond as soon as we can — usually within one working day.
              </Typography>
            </Box>
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('contact.form.name')}
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('contact.form.email')}
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('contact.form.subject')}
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      label={t('contact.form.message')}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                </Grid>

                {submitStatus === 'success' && (
                  <Alert severity="success" sx={{ mt: 3 }}>
                    {t('contact.form.thankYou')}
                  </Alert>
                )}

                {submitStatus === 'error' && (
                  <Alert severity="error" sx={{ mt: 3 }}>
                    There was an error sending your message. Please try again.
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isSubmitting}
                            sx={{
                              textTransform: 'none',
                              py: 1.75,
                              mt: 3,
                              borderRadius: 999,
                              fontSize: '1rem',
                              fontWeight: 700,
                              boxShadow: 'none',
                              '&:hover': { boxShadow: '0 4px 12px rgba(13,92,99,0.18)' },
                              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                              transition: 'box-shadow .2s ease',
                            }}
                >
                  {isSubmitting ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CircularProgress size={24} color="inherit" />
                                <Typography variant="body1">
                      {t('contact.form.processing')}
                                </Typography>
                    </Box>
                  ) : (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmailIcon />
                                {t('contact.form.submit')}
                              </Box>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Container>

      {/* Floating Components */}
      <BackToTopButton />
    </Box>
  );
};

export default ContactPage;





