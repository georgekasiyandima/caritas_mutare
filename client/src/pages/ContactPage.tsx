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
import BackToTopButton from '../components/BackToTopButton.tsx';
import ReturnHomeButton from '../components/ReturnHomeButton.tsx';

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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 8,
          pt: 16, // Prevent navbar overlap
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant={isMobile ? 'h3' : 'h2'} 
              component="h1" 
              gutterBottom 
              sx={{ fontWeight: 'bold', mb: 3, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
        {t('contact.title')}
      </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.9, 
                maxWidth: 600, 
                mx: 'auto',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
        {t('contact.description')}
      </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>

      <Grid container spacing={6}>
        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Address Card */}
            <Card elevation={3} sx={{ 
              borderRadius: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ backgroundColor: 'primary.main' }}>
                    <LocationIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t('contact.address')}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Cnr Jason Moyo and Herbert Chitepo<br />
                  Mutare, Zimbabwe
                </Typography>
                <Chip 
                  label="City Center" 
                  size="small" 
                  color="primary" 
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>

            {/* Phone Card */}
            <Card elevation={3} sx={{ 
              borderRadius: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ backgroundColor: 'success.main' }}>
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
            <Card elevation={3} sx={{ 
              borderRadius: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ backgroundColor: 'info.main' }}>
                    <EmailIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t('contact.email')}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  egumbeze@caritasmutare.org
                </Typography>
                <Chip 
                  label="Response within 24 hours" 
                  size="small" 
                  color="info" 
                />
              </CardContent>
            </Card>

            {/* Office Hours Card */}
            <Card elevation={3} sx={{ 
              borderRadius: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ backgroundColor: 'warning.main' }}>
                    <ScheduleIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Office Hours
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Monday - Friday:</strong> 8:00 AM - 5:00 PM
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Saturday:</strong> 9:00 AM - 1:00 PM
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <strong>Sunday:</strong> Closed
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Map Card */}
            <Card elevation={3} sx={{ 
              borderRadius: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ backgroundColor: 'secondary.main' }}>
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
                    Located in the heart of Mutare city center
                </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Card elevation={4} sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                p: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                Send us a Message
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
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
      <ReturnHomeButton variant="compact" position="top-left" />
    </Box>
  );
};

export default ContactPage;





