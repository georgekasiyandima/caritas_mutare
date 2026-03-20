import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
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
import {
  People as PeopleIcon,
  TrendingUp as ImpactIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Favorite as HeartIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BackToTopButton from '../components/BackToTopButton';
import PartnerLogoStrip from '../components/PartnerLogoStrip';
import { getActiveProjects, caritasProjects } from '../lib/caritasProjects';

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

  const programStats = [
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      number: `${projects.length}`,
      label: 'Active projects',
      description: 'Donor-funded and Caritas-led initiatives',
    },
    {
      icon: <ImpactIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      number: '7',
      label: 'Districts',
      description: 'Across the Diocese of Mutare',
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      number: '365',
      label: 'Days of service',
      description: 'Year-round commitment',
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      number: 'Manicaland',
      label: 'Region',
      description: 'Buhera, Chimanimani, Chipinge, Makoni, Mutare, Mutasa, Nyanga',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Hero */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 8,
          pt: 16,
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
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {t('programs.description')}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Caritas Mutare Projects Overview */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 3 }}
        >
          Caritas Mutare Projects Overview
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          sx={{ mb: 4, color: 'text.secondary', maxWidth: 800, mx: 'auto' }}
        >
          A one-stop snapshot of all Caritas Mutare projects across the Diocese –
          including status, locations, target groups and duration.
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
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
      <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            Our projects
          </Typography>
          <Grid container spacing={4}>
            {projects.map((project) => (
              <Grid item xs={12} md={6} key={project.id}>
                <Card
                  elevation={4}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 8,
                    },
                  }}
                >
                  {project.heroImage && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={project.heroImage}
                      alt={project.title_en}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      color: 'white',
                      p: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {project.acronym ? `${project.acronym}: ` : ''}
                      {project.title_en}
                    </Typography>
                    <Chip
                      label={project.status === 'ongoing' ? 'Ongoing' : 'Active'}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
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
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(project.route)}
                      sx={{
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                      }}
                    >
                      Learn more
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Partner strip */}
      <PartnerLogoStrip title="Supported by" variant="light" />

      {/* CTA */}
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
            <HeartIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Join our mission
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: 600, mx: 'auto' }}>
              Together we can make a lasting impact. Get involved and help us serve those in need.
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
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                }}
              >
                Volunteer with us
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
                  '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Make a donation
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <BackToTopButton />
    </Box>
  );
};

export default ProgramsPage;
