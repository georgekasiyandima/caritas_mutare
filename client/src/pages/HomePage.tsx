import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Category as CategoryIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CountUpAnimation from '../components/CountUpAnimation';
import BackToTopButton from '../components/BackToTopButton';
import WhatsAppWidget from '../components/WhatsAppWidget';
import PartnerLogoStrip from '../components/PartnerLogoStrip';
import ImageCarousel from '../components/ImageCarousel';
import SocialRail from '../components/SocialRail';
import { useQuery } from 'react-query';
import { getActiveProjects, generalImpactImages } from '../lib/caritasProjects';
// import { getLatestNews, getOrganizationStats } from '../data/contentManager';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get organization statistics (temporary fallback)
  const organizationStats = {
    families_served: 500,
    communities_reached: 50,
    lives_impacted: 1000,
    years_of_service: 10,
    active_programs: 5,
    total_volunteers: 100,
    annual_budget: 500000
  };

  // Fetch latest news articles
  const { data: newsData } = useQuery('latestNews', async () => {
    const response = await fetch('/api/news/featured/latest?limit=3');
    return response.json();
  }, {
    initialData: { articles: [] } // Use empty array as fallback
  });

  const featuredProjects = getActiveProjects().slice(0, 6);

  // Carousel: mix general impact images with project highlights (hero + first gallery image per project)
  const carouselImages = React.useMemo(() => {
    const list: { src: string; alt: string }[] = [...generalImpactImages];
    getActiveProjects().forEach((p) => {
      if (p.heroImage) list.push({ src: p.heroImage, alt: p.title_en });
      if (p.galleryImages?.[0] && p.galleryImages[0] !== p.heroImage) {
        list.push({ src: p.galleryImages[0], alt: `${p.title_en} - gallery` });
      }
    });
    return list;
  }, []);

  const statsData = [
    { number: `${organizationStats.families_served}+`, label: 'Families Served' },
    { number: `${organizationStats.communities_reached}+`, label: 'Communities Reached' },
    { number: `${organizationStats.lives_impacted}+`, label: 'Lives Impacted' },
    { number: `${organizationStats.years_of_service}+`, label: 'Years of Service' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 8,
          pt: 16, // Added top padding to prevent navbar overlap
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            {t('hero.title')}
          </Typography>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            component="h2"
            gutterBottom
            sx={{ opacity: 0.9, mb: 3 }}
          >
            {t('hero.subtitle')}
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: 600, mx: 'auto', mb: 4, opacity: 0.8 }}
          >
            {t('hero.description')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              onClick={() => navigate('/about')}
              sx={{ 
                textTransform: 'none', 
                px: 4,
                color: 'primary.main',
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              {t('hero.learnMore')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/donate')}
              sx={{
                textTransform: 'none',
                px: 4,
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {t('hero.donateNow')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Partner logos strip */}
      <PartnerLogoStrip title="Supported by" variant="light" compact />

      {/* Statistics Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {statsData.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  backgroundColor: 'primary.50',
                }}
              >
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
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Projects Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            {t('programs.title')}
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mb: 4, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
          >
            {t('programs.description')}
          </Typography>

          <Grid container spacing={3}>
            {featuredProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  {project.heroImage && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={project.heroImage}
                      alt={project.title_en}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 2 }}>
                    {!project.heroImage && (
                      <Box sx={{ mb: 1 }}>
                        <CategoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                      </Box>
                    )}
                    <Typography variant="h6" component="h3" gutterBottom>
                      {project.acronym ? `${project.acronym}: ` : ''}{project.title_en}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {project.summary_en}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {project.target} · {project.duration}
                    </Typography>
                    {(project.donorLogoUrls?.length ?? 0) > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        {project.donorLogoUrls?.slice(0, 3).map((url) => (
                          <Box
                            key={url}
                            component="img"
                            src={url}
                            alt=""
                            sx={{ height: 24, objectFit: 'contain' }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button
                      size="small"
                      onClick={() => navigate(project.route)}
                      sx={{ color: 'primary.main' }}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button variant="outlined" onClick={() => navigate('/programs')} sx={{ textTransform: 'none' }}>
              View all projects
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Latest News Section */}
      {newsData?.articles && newsData.articles.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 4 }}
          >
            {t('news.title')}
          </Typography>

          <Grid container spacing={3}>
            {newsData.articles.map((article: any) => (
              <Grid item xs={12} md={4} key={article.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate(`/news/${article.id}`)}
                >
                  {article.featured_image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={article.featured_image}
                      alt={article.title_en}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {article.title_en}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {article.excerpt_en}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(article.published_at).toLocaleDateString()}
                      </Typography>
                      {article.read_time_minutes != null && (
                        <>
                          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>·</Typography>
                          <Typography variant="caption" color="text.secondary">{article.read_time_minutes} min read</Typography>
                        </>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small">
                      {t('news.readMore')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/news')}
              sx={{ textTransform: 'none' }}
            >
              View All News
            </Button>
          </Box>
        </Container>
      )}

      {/* Impact carousel – highlights from projects and general impact */}
      {carouselImages.length > 0 && (
        <Box sx={{ backgroundColor: 'grey.50', py: 6 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
              Our Impact
            </Typography>
            <Typography variant="body1" textAlign="center" sx={{ mb: 4, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              Glimpses of community engagement and project work across the diocese.
            </Typography>
            <ImageCarousel images={carouselImages} maxImages={10} height={{ xs: 240, md: 380 }} />
          </Container>
        </Box>
      )}

      {/* Call to Action Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 6,
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Join Our Mission
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Together, we can make a difference in the lives of those we serve.
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
                color: 'primary.main',
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              {t('nav.volunteer')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/donate')}
              sx={{
                textTransform: 'none',
                px: 4,
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {t('nav.donate')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Floating Components */}
      <BackToTopButton />
      <SocialRail />
      <WhatsAppWidget 
        phoneNumber="+263774671893"
        welcomeMessage="Hello! Thank you for your interest in Caritas Mutare. How can we help you today?"
        position="bottom-left"
      />
    </Box>
  );
};

export default HomePage;





