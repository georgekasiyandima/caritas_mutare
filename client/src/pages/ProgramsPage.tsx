import React, { useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Chip,
  useTheme,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BackToTopButton from '../components/BackToTopButton';
import PartnerLogoStrip from '../components/PartnerLogoStrip';
import HeroBanner from '../components/HeroBanner';
import StoryCard from '../components/StoryCard';
import SEO from '../components/SEO';
import { getActiveProjects, caritasProjects, generalImpactImages } from '../lib/caritasProjects';
import {
  SECTION_BG_ALT,
  pageRoot,
  pageOverline,
  outlineCard,
  closingCtaSectionSx,
} from '../lib/sitePageLayout';

const ProgramsPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const projects = getActiveProjects();

  const heroImage = useMemo(() => {
    const withImage = projects.find((p) => p.heroImage);
    if (withImage?.heroImage) {
      return { src: withImage.heroImage, alt: withImage.title_en, position: withImage.heroImagePosition };
    }
    const fallback = generalImpactImages[0];
    return fallback
      ? { src: fallback.src, alt: fallback.alt, position: fallback.objectPosition }
      : null;
  }, [projects]);

  const overviewRows = caritasProjects.map((p) => ({
    id: p.id,
    name: p.acronym ? `${p.acronym} – ${p.title_en}` : p.title_en,
    status: p.status,
    location: p.location,
    target: p.target,
    duration: p.duration,
  }));

  return (
    <Box sx={pageRoot}>
      <SEO
        title={t('programs.seo.title', 'Our projects across the Diocese of Mutare')}
        description={t(
          'programs.seo.description',
          'Donor-funded and Caritas-led initiatives delivering food security, livelihoods, inclusion and emergency response across eastern Zimbabwe.'
        )}
        image={heroImage?.src}
        canonicalPath="/programs"
      />

      {heroImage && (
        <HeroBanner
          image={heroImage.src}
          imageAlt={heroImage.alt}
          imagePosition={heroImage.position}
          size="standard"
          overlay={0.55}
          eyebrow={t('programs.hero.eyebrow', 'What we implement')}
          title={t('programs.title')}
          subtitle={t('programs.description')}
          primaryCta={{
            label: t('programs.hero.ctaPrimary', 'Support our work'),
            onClick: () => navigate('/donate'),
          }}
          secondaryCta={{
            label: t('programs.hero.ctaSecondary', 'Talk to us'),
            onClick: () => navigate('/contact'),
          }}
        />
      )}

      {/* Portfolio table */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Box sx={{ textAlign: 'center', mb: 4, maxWidth: 800, mx: 'auto' }}>
          <Typography variant="overline" sx={{ ...pageOverline, display: 'block', mb: 1 }}>
            {t('programs.portfolio.overline', 'Portfolio')}
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 2 }}
          >
            {t('programs.portfolio.title', 'Caritas Mutare projects overview')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
            {t(
              'programs.portfolio.intro',
              'A one-stop snapshot of all Caritas Mutare projects across the Diocese — status, locations, target groups and duration.'
            )}
          </Typography>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ ...outlineCard, overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 700 }}>{t('programs.portfolio.cols.project', 'Project')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('programs.portfolio.cols.status', 'Status')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('programs.portfolio.cols.location', 'Location')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('programs.portfolio.cols.target', 'Target')}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{t('programs.portfolio.cols.duration', 'Duration')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {overviewRows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    const match = caritasProjects.find((p) => p.id === row.id);
                    if (match) navigate(match.route);
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        bgcolor:
                          row.status === 'active'
                            ? 'rgba(46,125,50,0.12)'
                            : row.status === 'ongoing'
                              ? 'rgba(13,92,99,0.12)'
                              : 'rgba(120,120,120,0.12)',
                        color:
                          row.status === 'active'
                            ? 'success.dark'
                            : row.status === 'ongoing'
                              ? 'info.dark'
                              : 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.target}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Project cards */}
      <Box sx={{ bgcolor: SECTION_BG_ALT, py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5, maxWidth: 720, mx: 'auto' }}>
            <Typography variant="overline" sx={{ ...pageOverline, display: 'block', mb: 1 }}>
              {t('programs.inCommunities', 'In communities')}
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}
            >
              {t('programs.cardsTitle', 'Our projects')}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <StoryCard
                  image={project.heroImage}
                  imageAlt={project.title_en}
                  imagePosition={project.heroImagePosition}
                  imageFit="cover"
                  aspect="4/3"
                  category={project.acronym ?? t('home.projects.category', 'Programme')}
                  title={project.title_en}
                  description={project.summary_en}
                  meta={`${project.target} · ${project.location}`}
                  logos={project.donorLogoUrls}
                  cta={t('home.projects.learnMore')}
                  onClick={() => navigate(project.route)}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <PartnerLogoStrip title={t('home.partnersTitle')} variant="light" />

      {/* Closing CTA */}
      <Box sx={closingCtaSectionSx(theme)}>
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
              fontSize: { xs: '1.85rem', md: '2.35rem' },
              lineHeight: 1.2,
            }}
          >
            {t('home.closingCta.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.92, lineHeight: 1.75, maxWidth: 560, mx: 'auto' }}>
            {t('home.closingCta.body')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/donate')}
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
          </Box>
        </Container>
      </Box>

      <BackToTopButton />
    </Box>
  );
};

export default ProgramsPage;
