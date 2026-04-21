import React, { useMemo } from 'react';
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
  Stack,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Category as CategoryIcon,
  ArrowForward as ArrowForwardIcon,
  WaterDropOutlined,
  VolunteerActivismOutlined,
  Diversity3Outlined,
  GroupsOutlined,
} from '@mui/icons-material';
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
import { SECTION_BG_ALT } from '../lib/sitePageLayout';

const thematicIconSx = { fontSize: 32, color: 'info.main' } as const;
const THEMATIC_KEYS = ['food', 'humanitarian', 'disability', 'community'] as const;

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const organizationStats = {
    families_served: '50000+',
    communities_reached: '100+',
    lives_impacted: '500 000+',
    years_of_service: '50+',
  };

  const { data: newsData } = useQuery(
    'latestNews',
    async () => {
      const response = await fetch('/api/news/featured/latest?limit=3');
      return response.json();
    },
    {
      initialData: { articles: [] },
    }
  );

  const featuredProjects = getActiveProjects().slice(0, 6);

  const carouselImages = React.useMemo(() => {
    const list: { src: string; alt: string; objectPosition?: string }[] = [...generalImpactImages];
    getActiveProjects().forEach((p) => {
      if (p.heroImage) list.push({ src: p.heroImage, alt: p.title_en, objectPosition: p.heroImagePosition });
      if (p.galleryImages?.[0] && p.galleryImages[0] !== p.heroImage) {
        list.push({ src: p.galleryImages[0], alt: `${p.title_en} - gallery`, objectPosition: p.heroImagePosition });
      }
    });
    const seen = new Set<string>();
    return list.filter((img) => {
      if (seen.has(img.src)) return false;
      seen.add(img.src);
      return true;
    });
  }, []);

  const heroImage = carouselImages[0] ?? generalImpactImages[0];

  const thematicFocus = useMemo(
    () =>
      THEMATIC_KEYS.map((key) => ({
        key,
        title: t(`home.thematic.items.${key}.title`),
        blurb: t(`home.thematic.items.${key}.blurb`),
        icon:
          key === 'food' ? (
            <WaterDropOutlined sx={thematicIconSx} />
          ) : key === 'humanitarian' ? (
            <VolunteerActivismOutlined sx={thematicIconSx} />
          ) : key === 'disability' ? (
            <Diversity3Outlined sx={thematicIconSx} />
          ) : (
            <GroupsOutlined sx={thematicIconSx} />
          ),
      })),
    [t]
  );

  const statsData = [
    { number: organizationStats.families_served, label: t('home.stats.familiesServed') },
    { number: organizationStats.communities_reached, label: t('home.stats.communitiesReached') },
    { number: organizationStats.lives_impacted, label: t('home.stats.livesImpacted') },
    { number: organizationStats.years_of_service, label: t('home.stats.yearsOfService') },
  ];

  return (
    <Box component="main" sx={{ bgcolor: 'background.default' }}>
      {/* Split hero — clarity first, image as proof */}
      <Box
        sx={{
          pt: { xs: 14, md: 16 },
          pb: { xs: 6, md: 8 },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={2.5} sx={{ textAlign: { xs: 'center', md: 'left' }, alignItems: { xs: 'center', md: 'flex-start' } }}>
                <Chip
                  label={t('hero.subtitle')}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(13, 92, 99, 0.08)',
                    color: 'info.dark',
                    fontWeight: 600,
                    borderRadius: 1,
                    maxWidth: '100%',
                    height: 'auto',
                    py: 0.5,
                    '& .MuiChip-label': { whiteSpace: 'normal', textAlign: { xs: 'center', md: 'left' } },
                  }}
                />
                <Typography
                  variant={isMobile ? 'h3' : 'h2'}
                  component="h1"
                  sx={{
                    fontFamily: '"Merriweather", Georgia, serif',
                    fontWeight: 700,
                    color: 'text.primary',
                    lineHeight: 1.2,
                  }}
                >
                  {t('hero.title')}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: 520,
                    fontSize: { md: '1.05rem' },
                    lineHeight: 1.7,
                  }}
                >
                  {t('hero.description')}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1, width: { xs: '100%', sm: 'auto' } }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/about')}
                    sx={{ px: 3, py: 1.25, fontWeight: 600 }}
                  >
                    {t('hero.learnMore')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/donate')}
                    sx={{ px: 3, py: 1.25, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                  >
                    {t('hero.donateNow')}
                  </Button>
                </Stack>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ pt: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button size="small" onClick={() => navigate('/programs')} sx={{ color: 'info.main', fontWeight: 600 }}>
                    {t('home.pathways.projects')}
                  </Button>
                  <Typography component="span" variant="body2" color="text.disabled">
                    ·
                  </Typography>
                  <Button size="small" onClick={() => navigate('/programs/soup-kitchen')} sx={{ color: 'info.main', fontWeight: 600 }}>
                    {t('home.pathways.soupKitchen')}
                  </Button>
                  <Typography component="span" variant="body2" color="text.disabled">
                    ·
                  </Typography>
                  <Button size="small" onClick={() => navigate('/contact')} sx={{ color: 'info.main', fontWeight: 600 }}>
                    {t('home.pathways.contact')}
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              {heroImage && (
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
                    border: '1px solid',
                    borderColor: 'divider',
                    aspectRatio: { xs: '4/3', md: '5/4' },
                    maxHeight: { md: 440 },
                  }}
                >
                  <Box
                    component="img"
                    src={heroImage.src}
                    alt={heroImage.alt}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: heroImage.objectPosition ?? 'center center',
                      display: 'block',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.55))',
                      py: 2,
                      px: 2.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'common.white', fontWeight: 500, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                      {t('home.heroImageCaption')}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      <PartnerLogoStrip title={t('home.partnersTitle')} variant="light" compact />

      {/* Impact metrics — credibility */}
      <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: SECTION_BG_ALT }}>
        <Container maxWidth="lg">
          <Typography
            variant="overline"
            sx={{ color: 'info.main', fontWeight: 700, letterSpacing: 2, display: 'block', textAlign: 'center', mb: 1 }}
          >
            {t('home.stats.overline')}
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 4, maxWidth: 640, mx: 'auto' }}
          >
            {t('home.stats.headline')}
          </Typography>
          <Grid container spacing={2}>
            {statsData.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CountUpAnimation
                    end={stat.number}
                    variant="h4"
                    color="primary"
                    fontWeight="bold"
                    duration={2200}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Thematic focus — pathways without clutter */}
      <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="flex-start">
            <Grid item xs={12} md={4}>
              <Typography variant="overline" sx={{ color: 'info.main', fontWeight: 700, letterSpacing: 2 }}>
                {t('home.thematic.overline')}
              </Typography>
              <Typography variant="h4" component="h2" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mt: 1, mb: 2 }}>
                {t('home.thematic.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75, mb: 2 }}>
                {t('home.thematic.intro')}
              </Typography>
              <Button variant="text" color="info" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/about')} sx={{ fontWeight: 600, px: 0 }}>
                {t('home.thematic.cta')}
              </Button>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                {thematicFocus.map((item) => (
                  <Grid item xs={12} sm={6} key={item.key}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        height: '100%',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: SECTION_BG_ALT,
                        transition: 'border-color 0.2s',
                        '&:hover': { borderColor: 'info.light' },
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box sx={{ mt: 0.25 }}>{item.icon}</Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                            {item.blurb}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Divider />

      {/* Projects */}
      <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: SECTION_BG_ALT }}>
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 720, mb: 4 }}>
            <Typography variant="overline" sx={{ color: 'info.main', fontWeight: 700, letterSpacing: 2 }}>
              {t('programs.title')}
            </Typography>
            <Typography variant="h4" component="h2" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mt: 1, mb: 2 }}>
              {t('home.projects.headline')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
              {t('programs.description')}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {featuredProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(15,23,42,0.1)',
                    },
                  }}
                >
                  {project.heroImage && (
                    <Box sx={{ position: 'relative', height: 168, overflow: 'hidden', bgcolor: 'grey.100' }}>
                      <Box
                        aria-hidden
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage: `url(${project.heroImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: project.heroImagePosition ?? 'center center',
                          filter: 'blur(10px)',
                          transform: 'scale(1.06)',
                          opacity: 0.45,
                        }}
                      />
                      <Box
                        component="img"
                        src={project.heroImage}
                        alt={project.title_en}
                        sx={{
                          position: 'relative',
                          zIndex: 1,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          objectPosition: project.heroImagePosition ?? 'center center',
                          display: 'block',
                        }}
                      />
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1, py: 2.5 }}>
                    {!project.heroImage && (
                      <Box sx={{ mb: 1 }}>
                        <CategoryIcon sx={{ fontSize: 36, color: 'primary.main' }} />
                      </Box>
                    )}
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 700, lineHeight: 1.35 }}>
                      {project.acronym ? `${project.acronym}: ` : ''}
                      {project.title_en}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.65 }}>
                      {project.summary_en}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {project.target} · {project.duration}
                    </Typography>
                    {(project.donorLogoUrls?.length ?? 0) > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                        {project.donorLogoUrls?.slice(0, 3).map((url) => (
                          <Box
                            key={url}
                            component="img"
                            src={url}
                            alt=""
                            sx={{ height: 22, objectFit: 'contain', opacity: 0.9 }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-start', px: 2, pb: 2.5, pt: 0 }}>
                    <Button size="medium" onClick={() => navigate(project.route)} sx={{ color: 'info.main', fontWeight: 600 }}>
                      {t('home.projects.learnMore')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Button variant="contained" color="primary" onClick={() => navigate('/programs')} sx={{ px: 3 }}>
              {t('home.projects.viewAll')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* News */}
      {newsData?.articles && newsData.articles.length > 0 && (
        <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 1 }}>
              {t('news.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 560 }}>
              {t('home.news.intro')}
            </Typography>

            <Grid container spacing={3}>
              {newsData.articles.map((article: { id: number; title_en: string; excerpt_en?: string; featured_image?: string; published_at: string; read_time_minutes?: number }) => (
                <Grid item xs={12} md={4} key={article.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => navigate(`/news/${article.id}`)}
                  >
                    {article.featured_image && (
                      <CardMedia component="img" height="200" image={article.featured_image} alt={article.title_en} />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
                        {article.title_en}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.65 }}>
                        {article.excerpt_en}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(article.published_at).toLocaleDateString()}
                        </Typography>
                        {article.read_time_minutes != null && (
                          <>
                            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>
                              ·
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {t('home.news.minRead', { count: article.read_time_minutes })}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" sx={{ color: 'info.main', fontWeight: 600 }}>
                        {t('news.readMore')}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Button variant="outlined" onClick={() => navigate('/news')} sx={{ borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
                {t('home.news.viewAll')}
              </Button>
            </Box>
          </Container>
        </Box>
      )}

      {/* Impact gallery */}
      {carouselImages.length > 0 && (
        <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: SECTION_BG_ALT }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 1 }}>
              {t('home.impact.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 640, lineHeight: 1.75 }}>
              {t('home.impact.intro')}
            </Typography>
            <ImageCarousel images={carouselImages} maxImages={10} height={{ xs: 240, md: 400 }} />
          </Container>
        </Box>
      )}

      {/* Closing CTA */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'common.white',
          py: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" component="h2" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 2 }}>
            {t('home.closingCta.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.92, lineHeight: 1.75, maxWidth: 520, mx: 'auto' }}>
            {t('home.closingCta.body')}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
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
          </Stack>
        </Container>
      </Box>

      <BackToTopButton />
      <SocialRail />
      <WhatsAppWidget
        phoneNumber="+263774671893"
        welcomeMessage={t('home.whatsappWelcome')}
        position="bottom-left"
      />
    </Box>
  );
};

export default HomePage;
