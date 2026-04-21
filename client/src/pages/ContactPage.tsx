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
  Public as PublicIcon,
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
                  Mai Maria Village Dangamvura<br />
                  Stand No. 19449 Dangamvura Township<br />
                  Triangle of Raheen, Mutare District
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
                    <strong>Main:</strong> +263 77 467 1893
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Office:</strong> +263 20 60504
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Fax:</strong> +263 20 65077
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
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  admin@caritasmutare.org
                </Typography>
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
                  <Typography variant="body1" color="text.secondary">
                    <strong>Monday - Thursday:</strong> 8:00 AM - 4:45 PM
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Friday:</strong> 8:00 AM - 1:00 PM
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Map Card */}
            <Card elevation={0} sx={contactCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'rgba(13, 92, 99, 0.12)', color: 'info.dark' }}>
                    <MapIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Office Location
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    height: 250,
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '2px solid #e0e0e0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.1234567890!2d32.6167!3d-18.9707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a5a1b2c3d4e5%3A0x1234567890abcdef!2sMutare%2C%20Zimbabwe!5e0!3m2!1sen!2szw!4v1234567890123!5m2!1sen!2szw"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Caritas Mutare Office Location"
                  />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PublicIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                    Mai Maria Village, Dangamvura, Mutare District
                </Typography>
                </Box>
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
                              py: 2, 
                              mt: 3,
                              borderRadius: 3,
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                              '&:hover': {
                                boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                                transform: 'translateY(-2px)',
                              },
                              transition: 'all 0.3s ease',
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





