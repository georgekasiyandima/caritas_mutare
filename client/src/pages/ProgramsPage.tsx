import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Avatar,
  Paper,
} from '@mui/material';
import {
  School as SchoolIcon,
  LocalHospital as HealthIcon,
  Agriculture as AgricultureIcon,
  Work as WorkIcon,
  CrisisAlert as EmergencyIcon,
  Restaurant as RestaurantIcon,
  People as PeopleIcon,
  Favorite as HeartIcon,
  TrendingUp as ImpactIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BackToTopButton from '../components/BackToTopButton.tsx';
import ReturnHomeButton from '../components/ReturnHomeButton.tsx';

const ProgramsPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const programs = [
    {
      key: 'soupkitchen',
      title: 'Soup Kitchen',
      description: 'Monthly community meals served every last Friday to support vulnerable families',
      icon: <RestaurantIcon sx={{ fontSize: 50 }} />,
      color: 'primary.main',
      stats: { beneficiaries: '200+', frequency: 'Monthly', location: 'Holy Trinity Cathedral' },
      features: ['Nutritious Meals', 'Community Support', 'Volunteer Opportunities', 'Family Focus'],
      status: 'active',
      route: '/programs/soup-kitchen'
    },
    {
      key: 'education',
      title: 'Education',
      description: 'Supporting educational development through scholarships, materials, and training programs',
      icon: <SchoolIcon sx={{ fontSize: 50 }} />,
      color: 'primary.main',
      stats: { students: '150+', schools: '5', scholarships: '25' },
      features: ['Scholarships', 'School Supplies', 'Teacher Training', 'Literacy Programs'],
      status: 'active',
      route: '/programs/education'
    },
    {
      key: 'healthcare',
      title: 'Healthcare',
      description: 'Improving community health through medical support, health education, and wellness programs',
      icon: <HealthIcon sx={{ fontSize: 50 }} />,
      color: 'error.main',
      stats: { patients: '500+', clinics: '3', campaigns: '12' },
      features: ['Medical Support', 'Health Education', 'Wellness Programs', 'Emergency Care'],
      status: 'active',
      route: '/programs/healthcare'
    },
    {
      key: 'agriculture',
      title: 'Agriculture',
      description: 'Promoting sustainable farming practices and food security in the community',
      icon: <AgricultureIcon sx={{ fontSize: 50 }} />,
      color: 'success.main',
      stats: { farmers: '75+', hectares: '50', harvests: '3/year' },
      features: ['Sustainable Farming', 'Seed Distribution', 'Training Programs', 'Food Security'],
      status: 'active',
      route: '/programs/agriculture'
    },
    {
      key: 'livelihood',
      title: 'Livelihood Support',
      description: 'Empowering community members through skills training and income-generating activities',
      icon: <WorkIcon sx={{ fontSize: 50 }} />,
      color: 'warning.main',
      stats: { participants: '100+', workshops: '20', businesses: '15' },
      features: ['Skills Training', 'Microfinance', 'Business Support', 'Employment Programs'],
      status: 'active',
      route: '/programs'
    },
    {
      key: 'emergency',
      title: 'Emergency Response',
      description: 'Providing immediate assistance during natural disasters and crisis situations',
      icon: <EmergencyIcon sx={{ fontSize: 50 }} />,
      color: 'error.main',
      stats: { responses: '10+', families: '300+', relief: '24/7' },
      features: ['Disaster Relief', 'Emergency Shelter', 'Food Distribution', 'Medical Aid'],
      status: 'active',
      route: '/programs'
    }
  ];

  const programStats = [
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      number: '1,200+',
      label: 'Total Beneficiaries',
      description: 'Community members served across all programs'
    },
    {
      icon: <ImpactIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      number: '6',
      label: 'Active Programs',
      description: 'Comprehensive community development initiatives'
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      number: '365',
      label: 'Days of Service',
      description: 'Year-round commitment to community support'
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      number: '15+',
      label: 'Community Locations',
      description: 'Serving across Mutare and surrounding areas'
    }
  ];

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
        {t('programs.title')}
      </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                maxWidth: 700,
                mx: 'auto',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
        {t('programs.description')}
      </Typography>
          </Box>
        </Container>
      </Box>

      {/* Program Statistics */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 6 }}
        >
          Our Impact in Numbers
        </Typography>
      <Grid container spacing={4}>
          {programStats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
                  {stat.number}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {stat.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Programs Overview */}
      <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 6 }}
          >
            Our Programs
          </Typography>
          <Grid container spacing={4}>
            {programs.map((program) => (
              <Grid item xs={12} md={6} key={program.key}>
                <Card
                  elevation={4}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 8,
                    },
                  }}
                >
                  {/* Program Header */}
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${program.color} 0%, ${program.color}dd 100%)`,
                      color: 'white',
                      p: 3,
                      textAlign: 'center',
                    }}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {program.icon}
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {program.title}
                    </Typography>
                    <Chip
                      label={program.status === 'active' ? 'Active' : 'Coming Soon'}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                      {program.description}
                    </Typography>

                    {/* Program Statistics */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Key Statistics
                      </Typography>
                      <Grid container spacing={1}>
                        {Object.entries(program.stats).map(([key, value]) => (
                          <Grid item xs={6} key={key}>
                            <Paper
                              elevation={1}
                              sx={{
                                p: 1.5,
                                textAlign: 'center',
                                borderRadius: 2,
                                backgroundColor: 'primary.50',
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {value}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    {/* Program Features */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Key Features
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {program.features.map((feature, index) => (
                          <Chip
                            key={index}
                            label={feature}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        ))}
                      </Box>
                    </Box>
              </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(program.route)}
                      sx={{
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        backgroundColor: program.color,
                        '&:hover': {
                          backgroundColor: program.color,
                          opacity: 0.9,
                        },
                      }}
                    >
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Card
          elevation={4}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
          }}
        >
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <Avatar
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 3,
              }}
            >
              <HeartIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Join Our Mission
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: 600, mx: 'auto' }}>
              Together, we can make a lasting impact in our community. Get involved and help us serve those in need.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={() => navigate('/volunteer')}
                sx={{
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  },
                }}
              >
                Volunteer With Us
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/donate')}
                sx={{
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Make a Donation
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Floating Components */}
      <BackToTopButton />
      <ReturnHomeButton variant="compact" position="top-left" />
    </Box>
  );
};

export default ProgramsPage;





