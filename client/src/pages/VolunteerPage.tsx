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

const volCardSx = { ...outlineCard, ...outlineCardHover };

const VolunteerPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    skills: '',
    availability: '',
    interests: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setSubmitStatus('success');
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        skills: '',
        availability: '',
        interests: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <Box sx={pageRoot}>
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
          <Card elevation={0} sx={{ ...outlineCard, overflow: 'hidden', maxWidth: 640, mx: 'auto' }}>
            <Box sx={{ ...formCardHeader, bgcolor: 'rgba(46, 125, 50, 0.08)' }}>
              <Avatar sx={{ bgcolor: 'rgba(46, 125, 50, 0.15)', width: 72, height: 72, mx: 'auto', mb: 2, color: 'success.dark' }}>
                <VolunteerIcon sx={{ fontSize: 36 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 1 }}>
                Thank you for your application
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We appreciate your interest in volunteering with Caritas Mutare.
              </Typography>
            </Box>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
                Your volunteer application has been received successfully. Our team will review your application and contact you within 2-3 business days to discuss next steps.
            </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                In the meantime, feel free to explore our projects and learn more about our community impact.
            </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => setSubmitStatus('idle')}
                sx={{
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Submit Another Application
              </Button>
          </CardContent>
        </Card>
      </Container>
        <BackToTopButton />
      </Box>
    );
  }

  return (
    <Box sx={pageRoot}>
      <Box sx={pageHero}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto' }}>
            <Typography variant="overline" sx={{ ...pageOverline, display: 'block', mb: 1 }}>
              Serve with us
            </Typography>
            <Typography variant={isMobile ? 'h3' : 'h2'} component="h1" sx={{ ...pageH1, mb: 2 }}>
              {t('volunteer.title')}
            </Typography>
            <Typography variant="body1" sx={{ ...pageLead, mx: 'auto' }}>
              Join our mission to serve the community with compassion and dedication. Your time and skills can make a real difference in people&apos;s lives.
            </Typography>
          </Box>
        </Container>
      </Box>

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
          <form onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                      label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                      variant="outlined"
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
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  fullWidth
                      label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                      variant="outlined"
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
                There was an error submitting your application. Please try again.
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





