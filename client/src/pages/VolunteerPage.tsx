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
  Avatar,
} from '@mui/material';
import {
  VolunteerActivism as VolunteerIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  LocalHospital as HealthIcon,
  Agriculture as AgricultureIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import BackToTopButton from '../components/BackToTopButton';
import HeroBanner from '../components/HeroBanner';
import SEO from '../components/SEO';
import {
  pageRoot,
  outlineCard,
  outlineCardHover,
  formCardHeader,
} from '../lib/sitePageLayout';
import { orgContact } from '../lib/organisation';
import { apiPost, ApiError } from '../lib/api';
import { Link as RouterLink } from 'react-router-dom';

const volCardSx = { ...outlineCard, ...outlineCardHover };

const EMPTY_FORM = {
  full_name: '',
  email: '',
  phone: '',
  skills: '',
  availability: '',
  interests: '',
  message: '',
};

function fieldErrorsFromApi(details: unknown): Record<string, string> {
  if (!details || typeof details !== 'object' || !('errors' in details)) {
    return {};
  }
  const list = (details as { errors?: Array<{ path?: string; msg?: string }> }).errors;
  if (!Array.isArray(list)) return {};

  const mapped: Record<string, string> = {};
  list.forEach((err) => {
    if (err.path && err.msg && !mapped[err.path]) {
      mapped[err.path] = err.msg;
    }
  });
  return mapped;
}

const VolunteerPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [honeypot, setHoneypot] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const volunteerOpportunities = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Education Projects',
      description: 'Help with tutoring, literacy projects, and educational workshops for children and adults.',
      skills: ['Teaching', 'Mentoring', 'Communication'],
      timeCommitment: '2-4 hours/week'
    },
    {
      icon: <HealthIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      title: 'Healthcare Support',
      description: 'Assist with health campaigns, medical outreach, and community health education.',
      skills: ['Healthcare', 'First Aid', 'Health Education'],
      timeCommitment: '4-8 hours/week'
    },
    {
      icon: <AgricultureIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Agricultural Projects',
      description: 'Support farming initiatives, food security projects, and sustainable agriculture.',
      skills: ['Farming', 'Gardening', 'Sustainability'],
      timeCommitment: '3-6 hours/week'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Community Outreach',
      description: 'Engage with community members, organize events, and support social projects.',
      skills: ['Community Engagement', 'Event Planning', 'Social Work'],
      timeCommitment: '2-5 hours/week'
    },
    {
      icon: <WorkIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Administrative Support',
      description: 'Help with office tasks, data entry, communications, and program coordination.',
      skills: ['Administration', 'Data Entry', 'Communication'],
      timeCommitment: '3-6 hours/week'
    },
    {
      icon: <VolunteerIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Soup Kitchen',
      description: 'Prepare and serve meals, organize food distribution, and support vulnerable families.',
      skills: ['Food Service', 'Organization', 'Compassion'],
      timeCommitment: 'Last Friday monthly'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    setFieldErrors({});

    try {
      await apiPost('/api/volunteers', {
        ...formData,
        company_website: honeypot,
      });
      setSubmitStatus('success');
      setFormData(EMPTY_FORM);
      setHoneypot('');
    } catch (error) {
      setSubmitStatus('error');
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        setFieldErrors(fieldErrorsFromApi(error.details));
      } else {
        setErrorMessage('There was an error submitting your application. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <Box sx={pageRoot}>
        <SEO
          title={t('volunteer.seo.title', 'Volunteer with Caritas Mutare')}
          description={t(
            'volunteer.seo.description',
            'Join our mission to serve communities across the Diocese of Mutare with compassion and dedication.'
          )}
          canonicalPath="/volunteer"
        />
        <Container maxWidth="sm" sx={{ pt: { xs: 14, md: 16 }, pb: { xs: 8, md: 10 } }}>
          <Card elevation={0} sx={{ ...outlineCard, textAlign: 'center', overflow: 'hidden' }}>
            <Box sx={{ bgcolor: 'rgba(46, 125, 50, 0.08)', py: { xs: 3.5, md: 4 }, px: 3 }}>
              <Avatar
                sx={{
                  bgcolor: 'success.main',
                  color: 'common.white',
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 1.5,
                }}
              >
                <VolunteerIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontFamily: '"Merriweather", Georgia, serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  lineHeight: 1.3,
                  mb: 1,
                }}
              >
                Thank you for your application
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                We appreciate your interest in volunteering with Caritas Mutare.
              </Typography>
            </Box>
            <CardContent sx={{ px: { xs: 3, md: 4 }, py: { xs: 3, md: 3.5 } }}>
              <Typography
                variant="body1"
                sx={{ mb: 2, lineHeight: 1.75, maxWidth: 440, mx: 'auto' }}
              >
                Your volunteer application has been received successfully. Our team will review it and
                contact you within 2–3 business days to discuss next steps.
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, lineHeight: 1.7, maxWidth: 400, mx: 'auto' }}
              >
                In the meantime, feel free to explore our projects and learn more about our community
                impact.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/programs"
                  sx={{
                    textTransform: 'none',
                    px: 3,
                    py: 1.25,
                    borderRadius: 999,
                    fontWeight: 700,
                  }}
                >
                  Explore projects
                </Button>
                <Button
                  variant="text"
                  size="large"
                  onClick={() => setSubmitStatus('idle')}
                  sx={{ textTransform: 'none', fontWeight: 600, px: 2 }}
                >
                  Submit another application
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
        <BackToTopButton />
      </Box>
    );
  }

  return (
    <Box sx={pageRoot}>
      <SEO
        title={t('volunteer.seo.title', 'Volunteer with Caritas Mutare')}
        description={t(
          'volunteer.seo.description',
          'Join our mission to serve communities across the Diocese of Mutare with compassion and dedication.'
        )}
        image="/images/programs/soup-kitchen/soup-kitchen-gallery-07.png"
        canonicalPath="/volunteer"
      />

      <HeroBanner
        image="/images/programs/soup-kitchen/soup-kitchen-gallery-07.png"
        imageAlt="Caritas Mutare volunteers preparing meals together at the Soup Kitchen"
        imagePosition="center 42%"
        size="standard"
        overlay={0.6}
        eyebrow={t('volunteer.hero.eyebrow', 'Serve with us')}
        title={t('volunteer.title')}
        subtitle={t(
          'volunteer.hero.subtitle',
          'Join our mission to serve the community with compassion and dedication. Your time and skills can make a real difference in people’s lives.'
        )}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Grid container spacing={6}>
          {/* Volunteer Opportunities */}
          <Grid item xs={12} md={8}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 4, textAlign: 'center' }}
            >
              Volunteer Opportunities
            </Typography>
            <Grid container spacing={4}>
              {volunteerOpportunities.map((opportunity, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      ...volCardSx,
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        {opportunity.icon}
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {opportunity.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                        {opportunity.description}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          Required Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {opportunity.skills.map((skill, skillIndex) => (
                            <Chip
                              key={skillIndex}
                              label={skill}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          ))}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                        <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {opportunity.timeCommitment}
      </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Application Form */}
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{
              ...outlineCard,
              overflow: 'hidden',
              position: 'sticky',
              top: 24,
            }}>
              <Box sx={formCardHeader}>
                <Avatar sx={{ bgcolor: 'rgba(13, 92, 99, 0.12)', width: 56, height: 56, mx: 'auto', mb: 2, color: 'info.dark' }}>
                  <VolunteerIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 0.5 }}>
                  Join our team
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fill out the form to start your volunteer journey.
                </Typography>
              </Box>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit} noValidate style={{ position: 'relative' }}>
                  <Box
                    aria-hidden="true"
                    sx={{
                      position: 'absolute',
                      left: '-10000px',
                      width: 1,
                      height: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <TextField
                      name="company_website"
                      label="Company website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                      label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                      variant="outlined"
                      error={Boolean(fieldErrors.full_name)}
                      helperText={fieldErrors.full_name}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  fullWidth
                      label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                      variant="outlined"
                      error={Boolean(fieldErrors.email)}
                      helperText={fieldErrors.email}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  fullWidth
                      label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                      variant="outlined"
                      error={Boolean(fieldErrors.phone)}
                      helperText={fieldErrors.phone}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                      label="Skills & Experience"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                      placeholder="Tell us about your relevant skills and experience..."
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                      label="Availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                      placeholder="When are you available to volunteer?"
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                      label="Areas of Interest"
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                      placeholder="Which programs or activities interest you most?"
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                      label="Additional Information"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                      placeholder="Any additional information you'd like to share..."
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                  </Box>

                  {submitStatus === 'error' && (
                    <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
                {errorMessage || 'There was an error submitting your application. Please try again.'}
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
                          Submitting Application...
                        </Typography>
                </Box>
              ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VolunteerIcon />
                        Submit Application
                      </Box>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
          </Grid>
        </Grid>

        {/* Contact Information */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 4, textAlign: 'center' }}
          >
            Questions About Volunteering?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={0} sx={{ ...volCardSx, textAlign: 'center', p: 3 }}>
                <Avatar sx={{ bgcolor: 'rgba(13, 92, 99, 0.12)', width: 56, height: 56, mx: 'auto', mb: 2, color: 'info.dark' }}>
                  <EmailIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Email Us
                </Typography>
                <Typography
                  component="a"
                  href={`mailto:${orgContact.email.primary}`}
                  variant="body2"
                  sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                  {orgContact.email.primary}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={0} sx={{ ...volCardSx, textAlign: 'center', p: 3 }}>
                <Avatar sx={{ bgcolor: 'rgba(13, 92, 99, 0.12)', width: 56, height: 56, mx: 'auto', mb: 2, color: 'info.dark' }}>
                  <PhoneIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Call Us
                </Typography>
                <Typography
                  component="a"
                  href={`tel:${orgContact.phones.main.replace(/\s/g, '')}`}
                  variant="body2"
                  sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                  {orgContact.phones.main}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={0} sx={{ ...volCardSx, textAlign: 'center', p: 3 }}>
                <Avatar sx={{ bgcolor: 'rgba(13, 92, 99, 0.12)', width: 56, height: 56, mx: 'auto', mb: 2, color: 'info.dark' }}>
                  <LocationIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Visit Us
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {orgContact.address.short}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
    </Container>

      {/* Floating Components */}
      <BackToTopButton />
    </Box>
  );
};

export default VolunteerPage;





