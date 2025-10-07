import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Restaurant as RestaurantIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  LocalDining as FoodIcon,
  VolunteerActivism as VolunteerIcon,
  Favorite as HeartIcon,
  FamilyRestroom as FamilyIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CountUpAnimation from '../../components/CountUpAnimation.tsx';
import BackToTopButton from '../../components/BackToTopButton.tsx';
import ReturnHomeButton from '../../components/ReturnHomeButton.tsx';

const SoupKitchenPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Real image gallery data
  const imageGallery = [
    {
      src: '/images/programs/soup-kitchen/gallery/beneficiaries/beneficiaries_community_meal_2025.jpg',
      alt: 'Community members sharing a meal together',
      category: 'Community Meals',
      placeholder: false
    },
    {
      src: '/images/programs/soup-kitchen/gallery/volunteers/volunteer_cooking_team1_25.jpg',
      alt: 'Volunteers preparing nutritious meals',
      category: 'Volunteers',
      placeholder: false
    },
    {
      src: '/images/programs/soup-kitchen/gallery/beneficiaries/seniors_enjoying_meal_25.jpg',
      alt: 'Senior citizens enjoying a warm meal',
      category: 'Senior Support',
      placeholder: false
    },
    {
      src: '/images/programs/soup-kitchen/gallery/beneficiaries/beneficiaries_enjoying_meal_25.jpg',
      alt: 'Families coming together for community meal',
      category: 'Family Support',
      placeholder: false
    },
    {
      src: '/images/programs/soup-kitchen/gallery/volunteers/volunteers_cooking_team_2025.jpg',
      alt: 'Volunteers serving meals with care and compassion',
      category: 'Volunteer Service',
      placeholder: false
    },
    {
      src: '/images/programs/soup-kitchen/gallery/volunteers/volunteer_cooking_team3_25.jpg',
      alt: 'Dedicated volunteers working together',
      category: 'Team Work',
      placeholder: false
    },
    {
      src: '/images/programs/soup-kitchen/gallery/beneficiaries/beneficiaries_community_meal02_25.jpg',
      alt: 'Community members enjoying warm meals',
      category: 'Community Spirit',
      placeholder: false
    },
    {
      src: '/images/programs/soup-kitchen/gallery/beneficiaries/seniors_enjoying_meal1_25.jpg',
      alt: 'Senior citizens enjoying nutritious meals together',
      category: 'Senior Spirit',
      placeholder: false
    },
    {
      src: '/images/programs/soup-kitchen/gallery/beneficiaries/beneficiaries_community_meal_25.jpg',
      alt: 'Community members sharing meals in fellowship',
      category: 'Community Fellowship',
      placeholder: false
    },
    {
      src: '/images/programs/soup-kitchen/gallery/beneficiaries/beneficiaries_community_meal02_25.jpg',
      alt: 'Community members enjoying meals together',
      category: 'Community Unity',
      placeholder: false
    },
    {
      src: '/images/programs/soup-kitchen/gallery/beneficiaries/seniors_community_meal_25.jpg',
      alt: 'Senior citizens sharing community meals',
      category: 'Senior Community',
      placeholder: false
    },
    {
      src: '/images/programs/soup-kitchen/gallery/volunteers/volunteer_community_AU_25.jpg',
      alt: 'Student volunteers from AU university serving the community',
      category: 'Student Volunteers',
      placeholder: false
    }
  ];

  // Mock data for the soup kitchen program
  const programStats = [
    { icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />, number: '200+', label: 'Meals Served Monthly' },
    { icon: <FamilyIcon sx={{ fontSize: 40, color: 'warning.main' }} />, number: '50+', label: 'Families Supported' },
    { icon: <VolunteerIcon sx={{ fontSize: 40, color: 'success.main' }} />, number: '15+', label: 'Active Volunteers' },
    { icon: <HeartIcon sx={{ fontSize: 40, color: 'error.main' }} />, number: '3+', label: 'Years of Service' },
  ];

  const beneficiaries = [
    {
      category: 'Homeless Community',
      description: 'Providing warm, nutritious meals to those experiencing homelessness, offering not just food but dignity and hope.',
      icon: <PeopleIcon sx={{ fontSize: 30, color: 'primary.main' }} />,
      count: '40+ individuals'
    },
    {
      category: 'Senior Citizens',
      description: 'Supporting our elderly community members who may struggle with food security and social isolation.',
      icon: <PeopleIcon sx={{ fontSize: 30, color: 'secondary.main' }} />,
      count: '25+ seniors'
    },
    {
      category: 'Refugees & Migrants',
      description: 'Welcoming newcomers to our community with warm meals and helping them feel at home in Mutare.',
      icon: <PeopleIcon sx={{ fontSize: 30, color: 'success.main' }} />,
      count: '30+ families'
    },
    {
      category: 'Youth & Children',
      description: 'Ensuring young people have access to nutritious meals, supporting their growth and development.',
      icon: <PeopleIcon sx={{ fontSize: 30, color: 'warning.main' }} />,
      count: '50+ children'
    }
  ];

  const programFeatures = [
    {
      title: 'Last Friday of Every Month',
      description: 'Regular monthly service ensuring consistent support for our community members in need.',
      icon: <ScheduleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    {
      title: 'Nutritious Meals',
      description: 'Preparing wholesome, balanced meals that provide essential nutrition for vulnerable community members.',
      icon: <FoodIcon sx={{ fontSize: 40, color: 'warning.main' }} />
    },
    {
      title: 'Community Gathering',
      description: 'Creating a warm, welcoming environment where people can share meals and build connections.',
      icon: <HeartIcon sx={{ fontSize: 40, color: 'error.main' }} />
    },
    {
      title: 'Volunteer Powered',
      description: 'Run by dedicated community volunteers who believe in the power of service and compassion.',
      icon: <VolunteerIcon sx={{ fontSize: 40, color: 'success.main' }} />
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 10,
          pt: 18, // Increased top padding to prevent navbar overlap
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          minHeight: '70vh',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 'bold',
                    textAlign: 'center',
                    mb: 2,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Soup Kitchen Program
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 3, 
                    opacity: 0.95,
                    textAlign: 'center',
                    fontWeight: 500,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  Feeding Hope, Nourishing Community
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 4, 
                    fontSize: '1.1rem', 
                    lineHeight: 1.6,
                    textAlign: 'center',
                    maxWidth: '600px',
                    mx: 'auto',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  Every last Friday of the month, our Soup Kitchen brings the community together 
                  to share nutritious meals with those who need it most. From homeless individuals 
                  to senior citizens, refugees to young families - we serve with love and dignity.
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 3, 
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  mt: 4
                }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: 'white',
                      color: 'primary.main',
                      textTransform: 'none',
                      px: 6,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => navigate('/volunteer')}
                  >
                    Volunteer with Us
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      borderWidth: 2,
                      textTransform: 'none',
                      px: 6,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                        borderWidth: 2,
                      },
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => navigate('/donate')}
                  >
                    Support This Program
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 3
              }}>
                {/* Hero Image */}
                <Box
                  sx={{
                    height: 350,
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    backgroundColor: '#f5f5f5', // Fallback background
                    '&:hover': {
                      transform: 'scale(1.02)',
                      transition: 'transform 0.3s ease',
                    }
                  }}
                >
                  <img
                    src="/images/programs/soup-kitchen/gallery/beneficiaries/beneficiaries_community_meal01_25.jpg"
                    alt="Community members enjoying a meal together at the soup kitchen"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center center',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      display: 'block',
                    }}
                  />
                  {/* Overlay for better text contrast */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '40%',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
                    }}
                  />
                </Box>
                
                {/* Next Event Info */}
                <Paper
                  elevation={8}
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    color: 'text.primary',
                    borderRadius: 3,
                    textAlign: 'center',
                  }}
                >
                  <RestaurantIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Next Soup Kitchen
                  </Typography>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Last Friday
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    of Every Month
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2">
                    <LocationIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    Holy Trinity Cathedral Mutare
                  </Typography>
                  <Typography variant="body2">
                    <ScheduleIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    12:00 PM - 2:00 PM
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Our Impact
        </Typography>
        <Grid container spacing={3}>
          {programStats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <CountUpAnimation
                    end={stat.number}
                    variant="h4"
                    color="primary"
                    fontWeight="bold"
                    duration={2500}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Who We Serve Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            Who We Serve
          </Typography>
          <Grid container spacing={4}>
            {beneficiaries.map((beneficiary, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      backgroundColor: 'primary.light',
                      mr: 3,
                    }}
                  >
                    {beneficiary.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {beneficiary.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {beneficiary.description}
                    </Typography>
                    <Chip
                      label={beneficiary.count}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Program Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          What Makes Our Soup Kitchen Special
        </Typography>
        <Grid container spacing={4}>
          {programFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  p: 4,
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Image Gallery Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          Moments of Hope & Community
        </Typography>
        <Grid container spacing={3}>
          {imageGallery.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => setSelectedImage(image.src)}
              >
                {image.placeholder ? (
                  <Box
                    sx={{
                      height: 250,
                      backgroundColor: 'grey.100',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed',
                      borderColor: 'grey.300',
                    }}
                  >
                    <RestaurantIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      {image.alt}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Click to add your image here
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: 250,
                      overflow: 'hidden',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5', // Fallback background
                    }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        minWidth: '100%',
                        minHeight: '100%',
                        display: 'block',
                      }}
                    />
                  </Box>
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {image.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {image.alt}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Image Modal */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Gallery image"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Call to Action Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 10,
          position: 'relative',
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              mb: 3, 
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '1.8rem', md: '2.2rem' }
            }}
          >
            Be Part of This Mission
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 6, 
              fontSize: '1.2rem', 
              maxWidth: 700, 
              mx: 'auto', 
              textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
              lineHeight: 1.6
            }}
          >
            Whether you can volunteer your time, donate resources, or simply spread the word, 
            every contribution helps us serve more meals and touch more lives in our community.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                textTransform: 'none',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                },
                transition: 'all 0.3s ease',
              }}
              onClick={() => navigate('/volunteer')}
            >
              Volunteer Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                borderWidth: 2,
                textTransform: 'none',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white',
                  transform: 'translateY(-2px)',
                  borderWidth: 2,
                },
                transition: 'all 0.3s ease',
              }}
              onClick={() => navigate('/donate')}
            >
              Donate Today
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Floating Components */}
      <BackToTopButton />
      <ReturnHomeButton variant="compact" position="top-left" />
    </Box>
  );
};

export default SoupKitchenPage;
