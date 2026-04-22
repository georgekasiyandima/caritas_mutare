import React, { useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Stack,
  Divider,
  useTheme,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  RestaurantOutlined,
  VolunteerActivismOutlined,
  Diversity3Outlined,
  GroupsOutlined,
  FormatQuote as FormatQuoteIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CountUpAnimation from '../components/CountUpAnimation';
import BackToTopButton from '../components/BackToTopButton';
import PartnerLogoStrip from '../components/PartnerLogoStrip';
import ImageCarousel from '../components/ImageCarousel';
import SocialRail from '../components/SocialRail';
import HeroBanner from '../components/HeroBanner';
import StoryCard from '../components/StoryCard';
import TransparencyBlock from '../components/TransparencyBlock';
import CommunityVoiceBlock from '../components/CommunityVoiceBlock';
import SEO from '../components/SEO';
import { useQuery } from 'react-query';
import { getActiveProjects, generalImpactImages } from '../lib/caritasProjects';
import { SECTION_BG_ALT } from '../lib/sitePageLayout';

const thematicIconSx = { fontSize: 32, color: 'info.main' } as const;
const THEMATIC_KEYS = ['food', 'humanitarian', 'disability', 'community'] as const;

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

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

  const activeProjects = getActiveProjects();
  const featuredProjects = activeProjects.slice(0, 6);

  const carouselImages = useMemo(() => {
    const list: { src: string; alt: string; objectPosition?: string }[] = [...generalImpactImages];
    activeProjects.forEach((p) => {
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
  }, [activeProjects]);

  const heroImage = carouselImages[0] ?? generalImpactImages[0];
  const spotlightProject = activeProjects[0];

  const thematicFocus = useMemo(
    () =>
      THEMATIC_KEYS.map((key) => ({
        key,
        title: t(`home.thematic.items.${key}.title`),
        blurb: t(`home.thematic.items.${key}.blurb`),
        icon:
          key === 'food' ? (
            <RestaurantOutlined sx={thematicIconSx} />
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
    { number: organizationStats.lives_impacted, label: t('home.stats.livesImpacted') },
    { number: organizationStats.families_served, label: t('home.stats.familiesServed') },
    { number: organizationStats.communities_reached, label: t('home.stats.communitiesReached') },
    { number: organizationStats.years_of_service, label: t('home.stats.yearsOfService') },
  ];

  return (
    <Box component="main" sx={{ bgcolor: 'background.default' }}>
      <SEO
        title={t('seo.home.title', 'Serving communities with dignity and hope')}
        description={t(
          'seo.home.description',
          'Caritas Mutare is the development and humanitarian arm of the Catholic Diocese of Mutare, Zimbabwe. We work alongside families and parishes to deliver food security, livelihoods, inclusion, and emergency response.'
        )}
        image={heroImage?.src}
        canonicalPath="/"
      />

      {/* Cinematic hero */}
      {heroImage && (
        <HeroBanner
          image={heroImage.src}
          imageAlt={heroImage.alt}
          imagePosition={heroImage.objectPosition}
          eyebrow={t('home.hero.eyebrow', 'Caritas Zimbabwe · Diocese of Mutare')}
          title={t('home.hero.title', 'Restoring dignity. One family, one community at a time.')}
          subtitle={t(
            'home.hero.subtitle',
            'For over 50 years, we have walked alongside families in eastern Zimbabwe — delivering food, livelihoods, inclusion and emergency response rooted in Catholic social teaching.'
          )}
          primaryCta={{
            label: t('home.hero.ctaPrimary', 'Support our work'),
            onClick: () => navigate('/donate'),
          }}
          secondaryCta={{
            label: t('home.hero.ctaSecondary', 'See what we do'),
            onClick: () => navigate('/programs'),
          }}
          caption={t('home.heroImageCaption')}
          footer={
            <Stack
              direction={{ xs: 'row', md: 'row' }}
              spacing={{ xs: 2, md: 5 }}
              divider={
                <Box
                  sx={{
                    width: '1px',
                    alignSelf: 'stretch',
                    bgcolor: 'rgba(255,255,255,0.25)',
                    display: { xs: 'none', sm: 'block' },
                  }}
                />
              }
              flexWrap="wrap"
              useFlexGap
              sx={{ rowGap: 2 }}
            >
              {statsData.map((stat) => (
                <Box key={stat.label} sx={{ minWidth: { xs: 130, md: 'auto' } }}>
                  <CountUpAnimation
                    end={stat.number}
                    variant="h5"
                    color="common.white"
                    fontWeight={800}
                    duration={1800}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.82)',
                      fontWeight: 500,
                      letterSpacing: 0.4,
                      textTransform: 'uppercase',
                      fontSize: '0.7rem',
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          }
        />
      )}

      <PartnerLogoStrip title={t('home.partnersTitle')} variant="light" compact />

      {/* Mission sentence — a plain, confident declaration */}
      <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, display: 'block', textAlign: 'center', mb: 2 }}
          >
            {t('home.mission.overline', 'Why we exist')}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontFamily: '"Merriweather", Georgia, serif',
              fontWeight: 400,
              fontSize: { xs: '1.35rem', md: '1.75rem' },
              lineHeight: 1.5,
              textAlign: 'center',
              color: 'text.primary',
              maxWidth: 780,
              mx: 'auto',
              position: 'relative',
            }}
          >
            <FormatQuoteIcon
              aria-hidden
              sx={{
                color: 'primary.main',
                opacity: 0.2,
                position: 'absolute',
                top: -24,
                left: { xs: 0, md: -44 },
                fontSize: 56,
                transform: 'scaleX(-1)',
              }}
            />
            {t(
              'home.mission.statement',
              'Poverty is not an accident. Neither is hope. Across the Diocese of Mutare, we turn solidarity into practical, measurable change — with the dignity of every person at the centre.'
            )}
          </Typography>
        </Container>
      </Box>

      {/* Thematic focus */}
      <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: SECTION_BG_ALT }}>
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
              <Button
                variant="text"
                color="info"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/about')}
                sx={{ fontWeight: 700, px: 0 }}
              >
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
                        bgcolor: 'background.paper',
                        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          borderColor: 'info.light',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(15,23,42,0.06)',
                        },
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

      {/* Featured project spotlight */}
      {spotlightProject && spotlightProject.heroImage && (
        <Box sx={{ py: { xs: 5, md: 8 }, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 3,
                    overflow: 'hidden',
                    aspectRatio: { xs: '4/3', md: '5/6' },
                    maxHeight: { md: 560 },
                    boxShadow: '0 28px 60px rgba(15,23,42,0.18)',
                  }}
                >
                  <Box
                    component="img"
                    src={spotlightProject.heroImage}
                    alt={spotlightProject.title_en}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: spotlightProject.heroImagePosition ?? 'center center',
                      display: 'block',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      p: { xs: 2.5, md: 3.5 },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255,255,255,0.85)',
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                      }}
                    >
                      {t('home.spotlight.overline', 'Field story')}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'common.white',
                        fontWeight: 600,
                        mt: 0.5,
                        fontSize: { xs: '0.95rem', md: '1.05rem' },
                        textShadow: '0 1px 6px rgba(0,0,0,0.5)',
                      }}
                    >
                      {spotlightProject.location}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="overline"
                  sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2 }}
                >
                  {t('home.spotlight.eyebrow', 'Featured programme')}
                </Typography>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontFamily: '"Merriweather", Georgia, serif',
                    fontWeight: 700,
                    mt: 1,
                    mb: 2,
                    lineHeight: 1.15,
                    fontSize: { xs: '1.85rem', md: '2.35rem' },
                  }}
                >
                  {spotlightProject.acronym ? `${spotlightProject.acronym}: ` : ''}
                  {spotlightProject.title_en}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.8, mb: 3, fontSize: { md: '1.05rem' } }}
                >
                  {spotlightProject.summary_en}
                </Typography>
                <Stack direction="row" spacing={4} sx={{ mb: 3 }} flexWrap="wrap" useFlexGap>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                      {t('home.spotlight.reach', 'Reach')}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {spotlightProject.target}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                      {t('home.spotlight.duration', 'Duration')}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {spotlightProject.duration}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(spotlightProject.route)}
                    sx={{ fontWeight: 700, px: 3 }}
                  >
                    {t('home.spotlight.cta', 'Read the story')}
                  </Button>
                  <Button
                    variant="text"
                    color="info"
                    size="large"
                    onClick={() => navigate('/donate')}
                    sx={{ fontWeight: 700 }}
                  >
                    {t('home.spotlight.donateCta', 'Support this work')}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      {/* Community voice — one human moment after the spotlight */}
      <CommunityVoiceBlock
        quoteEn={t(
          'home.voice.quote',
          "When the rains failed, we thought we had nothing left. Then we learned a different way to farm — and our children ate."
        )}
        quoteSh={t(
          'home.voice.quoteSh',
          "Pakatadza mvura, taifunga kuti hatichine chimwe. Takadzidza imwe nzira yekurima — vana vedu vakadya."
        )}
        attribution={t('home.voice.attribution', 'A mother of three · Ward 7, Bumba')}
        programmeTag={t('home.voice.programmeTag', 'SERARP · Bumba')}
        image="/images/programs/agriculture/woman-okra-field.png"
        imageAlt={t('home.voice.imageAlt', 'A farmer tending her okra field — programme work in eastern Zimbabwe')}
        imagePosition="center 44%"
      />

      <Divider />

      {/* Projects grid */}
      <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: SECTION_BG_ALT }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'flex-end' }}
            sx={{ mb: 4 }}
          >
            <Box sx={{ maxWidth: 720 }}>
              <Typography variant="overline" sx={{ color: 'info.main', fontWeight: 700, letterSpacing: 2 }}>
                {t('programs.title')}
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mt: 1, mb: 1 }}
              >
                {t('home.projects.headline')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                {t('programs.description')}
              </Typography>
            </Box>
            <Button
              variant="text"
              color="info"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/programs')}
              sx={{ fontWeight: 700, display: { xs: 'none', md: 'inline-flex' } }}
            >
              {t('home.projects.viewAll')}
            </Button>
          </Stack>

          <Grid container spacing={3}>
            {featuredProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <StoryCard
                  image={project.heroImage}
                  imageAlt={project.title_en}
                  imagePosition={project.heroImagePosition}
                  imageFit="contain"
                  aspect="4/3"
                  category={project.acronym ?? t('home.projects.category', 'Programme')}
                  title={project.title_en}
                  description={project.summary_en}
                  meta={`${project.target} · ${project.duration}`}
                  logos={project.donorLogoUrls}
                  cta={t('home.projects.learnMore')}
                  onClick={() => navigate(project.route)}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, display: { xs: 'block', md: 'none' } }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/programs')}
              sx={{ fontWeight: 700 }}
            >
              {t('home.projects.viewAll')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Donor trust — the "where your gift goes" promise */}
      <TransparencyBlock />

      {/* News */}
      {newsData?.articles && newsData.articles.length > 0 && (
        <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'flex-end' }}
              sx={{ mb: 4 }}
            >
              <Box sx={{ maxWidth: 560 }}>
                <Typography variant="overline" sx={{ color: 'info.main', fontWeight: 700, letterSpacing: 2 }}>
                  {t('home.news.overline', 'From the field')}
                </Typography>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mt: 1, mb: 1 }}
                >
                  {t('news.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  {t('home.news.intro')}
                </Typography>
              </Box>
              <Button
                variant="text"
                color="info"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/news')}
                sx={{ fontWeight: 700, display: { xs: 'none', md: 'inline-flex' } }}
              >
                {t('home.news.viewAll')}
              </Button>
            </Stack>

            <Grid container spacing={3}>
              {newsData.articles.map(
                (article: {
                  id: number;
                  title_en: string;
                  excerpt_en?: string;
                  featured_image?: string;
                  published_at: string;
                  read_time_minutes?: number;
                }) => {
                  const dateLabel = new Date(article.published_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });
                  const meta =
                    article.read_time_minutes != null
                      ? `${dateLabel} · ${t('home.news.minRead', { count: article.read_time_minutes })}`
                      : dateLabel;
                  return (
                    <Grid item xs={12} sm={6} md={4} key={article.id}>
                      <StoryCard
                        image={article.featured_image}
                        imageAlt={article.title_en}
                        aspect="16/10"
                        category={t('home.news.category', 'News')}
                        title={article.title_en}
                        description={article.excerpt_en}
                        meta={meta}
                        cta={t('news.readMore')}
                        onClick={() => navigate(`/news/${article.id}`)}
                      />
                    </Grid>
                  );
                }
              )}
            </Grid>

            <Box sx={{ mt: 4, display: { xs: 'block', md: 'none' } }}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => navigate('/news')}
                sx={{ fontWeight: 700, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
              >
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
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 45%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography
            variant="overline"
            sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 700, letterSpacing: 2, mb: 2, display: 'block' }}
          >
            {t('home.closingCta.overline', 'Walk with us')}
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontFamily: '"Merriweather", Georgia, serif',
              fontWeight: 700,
              mb: 2.5,
              fontSize: { xs: '1.85rem', md: '2.5rem' },
              lineHeight: 1.2,
            }}
          >
            {t('home.closingCta.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.92, lineHeight: 1.75, maxWidth: 580, mx: 'auto', fontSize: { md: '1.05rem' } }}>
            {t('home.closingCta.body')}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/donate')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: 'common.white',
                color: 'primary.main',
                px: 4,
                py: 1.4,
                fontWeight: 700,
                borderRadius: 999,
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              {t('nav.donate')}
            </Button>
            <Button
              variant="text"
              size="large"
              onClick={() => navigate('/volunteer')}
              sx={{
                color: 'common.white',
                px: 3,
                py: 1.4,
                fontWeight: 700,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              {t('nav.volunteer')}
            </Button>
          </Stack>
        </Container>
      </Box>

      <BackToTopButton />
      <SocialRail />
    </Box>
  );
};

export default HomePage;
