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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BackToTopButton from '../components/BackToTopButton';
import PartnerLogoStrip from '../components/PartnerLogoStrip';
import { getActiveProjects, caritasProjects } from '../lib/caritasProjects';
import {
  SECTION_BG_ALT,
  pageRoot,
  pageHero,
  pageOverline,
  pageH1,
  pageLead,
  outlineCard,
  outlineCardHover,
  closingCtaSectionSx,
} from '../lib/sitePageLayout';

const projectCardSx = { ...outlineCard, ...outlineCardHover };

const ProgramsPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const projects = getActiveProjects();

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
      <Box sx={pageHero}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto' }}>
            <Typography variant="overline" sx={{ ...pageOverline, display: 'block', mb: 1 }}>
              What we implement
            </Typography>
            <Typography variant={isMobile ? 'h3' : 'h2'} component="h1" sx={{ ...pageH1, mb: 2 }}>
              {t('programs.title')}
            </Typography>
            <Typography variant="body1" sx={{ ...pageLead, mx: 'auto' }}>
              {t('programs.description')}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Caritas Mutare Projects Overview */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Typography variant="overline" sx={{ ...pageOverline, display: 'block', textAlign: 'center', mb: 1 }}>
          Portfolio
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 2 }}
        >
          Caritas Mutare projects overview
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          sx={{ mb: 4, color: 'text.secondary', maxWidth: 800, mx: 'auto', lineHeight: 1.75 }}
        >
          A one-stop snapshot of all Caritas Mutare projects across the Diocese –
          including status, locations, target groups and duration.
        </Typography>

        <TableContainer component={Paper} elevation={0} sx={{ ...outlineCard, overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Target</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
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
                    if (match) {
                      navigate(match.route);
                    }
                  }}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{row.status}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.target}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Project cards from canonical data */}
      <Box sx={{ bgcolor: SECTION_BG_ALT, py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ ...pageOverline, display: 'block', textAlign: 'center', mb: 1 }}>
            In communities
          </Typography>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 5 }}>
            Our projects
          </Typography>
          <Grid container spacing={4}>
            {projects.map((project) => (
              <Grid item xs={12} md={6} key={project.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    ...projectCardSx,
                  }}
                >
                  {project.heroImage && (
                    <Box sx={{ position: 'relative', height: 220, overflow: 'hidden', backgroundColor: 'grey.200' }}>
                      <Box
                        aria-hidden
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage: `url(${project.heroImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: project.heroImagePosition ?? 'center center',
                          filter: 'blur(8px)',
                          transform: 'scale(1.08)',
                          opacity: 0.5,
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
                  <CardContent sx={{ flexGrow: 1, p: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 1, lineHeight: 1.35 }}>
                      {project.acronym ? `${project.acronym}: ` : ''}
                      {project.title_en}
                    </Typography>
                    <Chip
                      label={project.status === 'ongoing' ? 'Ongoing' : 'Active'}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(13, 92, 99, 0.08)',
                        color: 'info.dark',
                        fontWeight: 600,
                      }}
                    />
                  </CardContent>
                  <CardContent sx={{ flexGrow: 1, p: 3, pt: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {project.summary_en}
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1.5, mb: 2, borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Target:</strong> {project.target}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Location:</strong> {project.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Duration:</strong> {project.duration}
                      </Typography>
                    </Paper>
                    {(project.donorLogoUrls?.length ?? 0) > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                          Funded by:
                        </Typography>
                        {project.donorLogoUrls?.map((url) => (
                          <Box
                            key={url}
                            component="img"
                            src={url}
                            alt=""
                            sx={{ height: 28, objectFit: 'contain' }}
                          />
                        ))}
                      </Box>
                    )}
                    {project.keyPathways.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Key pathways
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {project.keyPathways.slice(0, 3).map((path, i) => (
                            <Chip
                              key={i}
                              label={path.split('→')[0].trim()}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="text"
                      fullWidth
                      onClick={() => navigate(project.route)}
                      sx={{
                        textTransform: 'none',
                        py: 1.25,
                        fontWeight: 600,
                        color: 'info.main',
                      }}
                    >
                      {t('home.projects.learnMore')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Partner strip */}
      <PartnerLogoStrip title={t('home.partnersTitle')} variant="light" />

      {/* CTA */}
      <Box sx={closingCtaSectionSx(theme)}>
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 2 }}>
            {t('home.closingCta.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.92, lineHeight: 1.75, maxWidth: 520, mx: 'auto' }}>
            {t('home.closingCta.body')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/volunteer')}
              sx={{
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                bgcolor: 'common.white',
                color: 'primary.main',
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
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                color: 'common.white',
                borderColor: 'rgba(255,255,255,0.85)',
                borderWidth: 2,
                '&:hover': { borderColor: 'common.white', bgcolor: 'rgba(255,255,255,0.08)', borderWidth: 2 },
              }}
            >
              {t('nav.donate')}
            </Button>
          </Box>
        </Container>
      </Box>

      <BackToTopButton />
    </Box>
  );
};

export default ProgramsPage;
