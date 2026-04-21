import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Stack,
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
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CountUpAnimation from '../../components/CountUpAnimation';
import BackToTopButton from '../../components/BackToTopButton';
import {
  pageRoot,
  pageHero,
  pageOverline,
  pageH1,
  pageLead,
  SECTION_BG_ALT,
  closingCtaSectionSx,
} from '../../lib/sitePageLayout';

const SoupKitchenPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Real image gallery data
  const imageGallery = [
    {
      src: '/images/programs/soup-kitchen/gallery/new/soup-kitchen-new-1.png',
      alt: 'Soup kitchen beneficiaries receiving food packs',
      category: 'Community Meals',
      placeholder: false
    },
    {
      src: '/images/programs/soup-kitchen/gallery/new/soup-kitchen-new-2.png',
      alt: 'Volunteers cooking and serving at the soup kitchen',
      category: 'Volunteer Service',
      placeholder: false
    },
    {
      src: '/images/programs/soup-kitchen/gallery/new/soup-kitchen-new-3.png',
      alt: 'Soup kitchen team preparing hot meals',
      category: 'Kitchen Operations',
      placeholder: false
    },
    {
      src: '/images/programs/soup-kitchen/gallery/new/soup-kitchen-new-4.png',
      alt: 'Community members queued for soup kitchen support',
      category: 'Beneficiary Support',
      placeholder: false
    },
    {
      src: '/images/programs/soup-kitchen/gallery/new/soup-kitchen-new-5.png',
      alt: 'Food distribution at soup kitchen service point',
      category: 'Food Distribution',
      placeholder: false
    },
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
    <Box sx={pageRoot}>
      <Box sx={pageHero}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={2.5} sx={{ textAlign: { xs: 'center', md: 'left' }, alignItems: { xs: 'center', md: 'flex-start' } }}>
                <Chip
                  label={t('programs.soupkitchen.title')}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(13, 92, 99, 0.08)',
                    color: 'info.dark',
                    fontWeight: 600,
                    borderRadius: 1,
                  }}
                />
                <Typography variant="overline" sx={{ ...pageOverline, display: 'block' }}>
                  Own programme
                </Typography>
                <Typography variant={isMobile ? 'h3' : 'h2'} component="h1" sx={{ ...pageH1 }}>
                  Soup Kitchen Program
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 600, color: 'text.secondary' }}>
                  Feeding hope, nourishing community
                </Typography>
                <Typography variant="body1" sx={{ ...pageLead, textAlign: { xs: 'center', md: 'left' } }}>
                  Every last Friday of the month, our Soup Kitchen brings the community together
                  to share nutritious meals with those who need it most. From homeless individuals
                  to senior citizens, refugees to young families — we serve with love and dignity.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1, width: { xs: '100%', sm: 'auto' } }}>
                  <Button variant="contained" color="primary" size="large" sx={{ px: 3, py: 1.25, fontWeight: 600 }} onClick={() => navigate('/volunteer')}>
                    {t('nav.volunteer')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{ px: 3, py: 1.25, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                    onClick={() => navigate('/donate')}
                  >
                    {t('nav.donate')}
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button
                    component="a"
                    href="https://www.facebook.com/share/1DoS9a5mzU/"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{ color: 'info.main', fontWeight: 600 }}
                    startIcon={<FacebookIcon />}
                  >
                    Facebook
                  </Button>
                  <Button
                    component="a"
                    href="https://www.linkedin.com/in/caritas-zimbabwe-diocese-of-mutare-460272300?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{ color: 'info.main', fontWeight: 600 }}
                    startIcon={<LinkedInIcon />}
                  >
                    LinkedIn
                  </Button>
                </Stack>
              </Stack>
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
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    backgroundColor: 'grey.100',
                    '&:hover': {
                      transform: 'scale(1.01)',
                      transition: 'transform 0.3s ease',
                    }
                  }}
                >
                  <img
                    src="/images/programs/soup-kitchen/gallery/new/soup-kitchen-new-1.png"
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
                <Box
                  sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    boxShadow: 'none',
                    p: 3,
                    textAlign: 'center',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                      transform: 'translateY(-2px)',
                    },
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
                </Box>
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
      <Box sx={{ bgcolor: SECTION_BG_ALT, py: { xs: 5, md: 7 } }}>
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

      <Box sx={closingCtaSectionSx(theme)}>
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 2, color: 'common.white' }}>
            {t('home.closingCta.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.92, lineHeight: 1.75, maxWidth: 560, mx: 'auto', color: 'common.white' }}>
            Whether you can volunteer your time, donate resources, or simply spread the word,
            every contribution helps us serve more meals and touch more lives in our community.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/volunteer')}
              sx={{
                bgcolor: 'common.white',
                color: 'primary.main',
                px: 4,
                fontWeight: 600,
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              {t('nav.volunteer')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/donate')}
              sx={{
                color: 'common.white',
                borderColor: 'rgba(255,255,255,0.85)',
                borderWidth: 2,
                px: 4,
                fontWeight: 600,
                '&:hover': { borderColor: 'common.white', bgcolor: 'rgba(255,255,255,0.08)', borderWidth: 2 },
              }}
            >
              {t('nav.donate')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Floating Components */}
      <BackToTopButton />
    </Box>
  );
};

export default SoupKitchenPage;
