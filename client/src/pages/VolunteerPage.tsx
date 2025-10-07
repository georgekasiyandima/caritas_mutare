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
import { useMutation } from 'react-query';
import BackToTopButton from '../components/BackToTopButton.tsx';
import ReturnHomeButton from '../components/ReturnHomeButton.tsx';

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
      title: 'Education Programs',
      description: 'Help with tutoring, literacy programs, and educational workshops for children and adults.',
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
      description: 'Support farming initiatives, food security programs, and sustainable agriculture.',
      skills: ['Farming', 'Gardening', 'Sustainability'],
      timeCommitment: '3-6 hours/week'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Community Outreach',
      description: 'Engage with community members, organize events, and support social programs.',
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
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Card elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                color: 'white',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', width: 80, height: 80, mx: 'auto', mb: 3 }}>
                <VolunteerIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Thank You for Your Application!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                We appreciate your interest in volunteering with Caritas Mutare
              </Typography>
            </Box>
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
                Your volunteer application has been received successfully. Our team will review your application and contact you within 2-3 business days to discuss next steps.
            </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                In the meantime, feel free to explore our programs and learn more about our community impact.
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
        <ReturnHomeButton variant="compact" position="top-left" />
      </Box>
    );
  }

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
        {t('volunteer.title')}
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
              Join our mission to serve the community with compassion and dedication. Your time and skills can make a real difference in people's lives.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          {/* Volunteer Opportunities */}
          <Grid item xs={12} md={8}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}
            >
              Volunteer Opportunities
            </Typography>
            <Grid container spacing={4}>
              {volunteerOpportunities.map((opportunity, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    elevation={3}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
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
            <Card elevation={4} sx={{
              borderRadius: 4,
              overflow: 'hidden',
              position: 'sticky',
              top: 24,
            }}>
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white',
                  p: 3,
                  textAlign: 'center',
                }}
              >
                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                  <VolunteerIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Join Our Team
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Fill out the form to start your volunteer journey
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
            sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}
          >
            Questions About Volunteering?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={3} sx={{
                borderRadius: 3,
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
              }}>
                <Avatar sx={{ backgroundColor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                  <EmailIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Email Us
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  egumbeze@caritasmutare.org
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={3} sx={{
                borderRadius: 3,
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
              }}>
                <Avatar sx={{ backgroundColor: 'success.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                  <PhoneIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Call Us
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  +263 77 467 1893
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={3} sx={{
                borderRadius: 3,
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
              }}>
                <Avatar sx={{ backgroundColor: 'info.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                  <LocationIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Visit Us
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cnr Jason Moyo and Herbert Chitepo, Mutare
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
    </Container>

      {/* Floating Components */}
      <BackToTopButton />
      <ReturnHomeButton variant="compact" position="top-left" />
    </Box>
  );
};

export default VolunteerPage;





