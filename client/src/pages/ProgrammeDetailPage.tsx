import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import BackToTopButton from '../components/BackToTopButton';
import { getProjectBySlug, getProjectByRoute, type CaritasProject } from '../lib/caritasProjects';

const ProgrammeDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [galleryIndex, setGalleryIndex] = useState(0);

  const project: CaritasProject | undefined = slug
    ? getProjectBySlug(slug) ?? getProjectByRoute(`/programs/${slug}`)
    : undefined;

  if (!project) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5">Project not found</Typography>
        <Button variant="contained" onClick={() => navigate('/programs')}>
          Back to projects
        </Button>
      </Box>
    );
  }

  const galleryImages = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : project.heroImage
      ? [project.heroImage]
      : [];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Back link */}
      <Container maxWidth="lg" sx={{ pt: 12, pb: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/programs')}
          sx={{ textTransform: 'none' }}
        >
          Back to projects
        </Button>
      </Container>

      {/* Hero */}
      <Box
        sx={{
          background: project.heroImage
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%), url(${project.heroImage}) center/cover`
            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: project.heroImage ? 'white' : 'white',
          textShadow: project.heroImage ? '1px 1px 3px rgba(0,0,0,0.8)' : 'none',
          py: 6,
          minHeight: 280,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Container maxWidth="lg" sx={{ pb: 2 }}>
          <Chip
            label={project.status === 'ongoing' ? 'Ongoing' : 'Active'}
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.25)',
              color: 'white',
              mb: 1,
            }}
          />
          <Typography variant={isMobile ? 'h4' : 'h3'} component="h1" sx={{ fontWeight: 'bold' }}>
            {project.acronym ? `${project.acronym}: ` : ''}
            {project.title_en}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95, mt: 0.5 }}>
            {project.location} · {project.duration}
          </Typography>
          {(project.donorLogoUrls?.length ?? 0) > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
              {project.donorLogoUrls?.map((url) => (
                <Box
                  key={url}
                  component="img"
                  src={url}
                  alt=""
                  sx={{
                    height: 36,
                    maxWidth: 140,
                    objectFit: 'contain',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: 1,
                    p: 0.5,
                  }}
                />
              ))}
            </Box>
          )}
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  About this programme
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                  {project.description_en}
                </Typography>
              </CardContent>
            </Card>

            {project.theoryOfChange_en && (
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Theory of change
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {project.theoryOfChange_en}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {project.keyPathways.length > 0 && (
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Key pathways
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                    {project.keyPathways.map((path, i) => (
                      <Typography key={i} component="li" variant="body1" sx={{ mb: 0.5, lineHeight: 1.6 }}>
                        {path}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {galleryImages.length > 0 && (
              <Card>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Gallery
                  </Typography>
                  <CardMedia
                    component="img"
                    image={galleryImages[galleryIndex]}
                    alt={`${project.title_en} gallery`}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      maxHeight: 420,
                      width: '100%',
                      objectFit:
                        project.id === 'st-theresa-preschool' || project.id === 'serarp'
                          ? 'contain'
                          : 'cover',
                      backgroundColor:
                        project.id === 'st-theresa-preschool' || project.id === 'serarp'
                          ? 'grey.100'
                          : 'transparent',
                    }}
                  />
                  {project.id === 'st-theresa-preschool' && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {galleryIndex === 0
                        ? 'St Theresa Pre-school children during 2025 ECD B Graduation.'
                        : 'St Theresa Caritas Pre-school children performing during the Caritas Mutare Day of the Poor on 15 November 2025.'}
                    </Typography>
                  )}
                  {project.id === 'serarp' && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {[
                        'Vocational training session under SERARP project.',
                        'Mechanics class in progress at Nyanyadzi Training College.',
                        'Building class during their plastering class.',
                        'Group photo for Citizen Monitoring and Advocacy Training participants.',
                        'A moment of refreshing for women in the edutainment event.',
                        'TSURO gender champions explaining gender roles and responsibilities of men, women, girls and boys through a family tree.',
                      ][galleryIndex] || ''}
                    </Typography>
                  )}

                  {galleryImages.length > 1 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {galleryImages.map((src, i) => (
                        <Box
                          key={src}
                          component="button"
                          onClick={() => setGalleryIndex(i)}
                          sx={{
                            width: 56,
                            height: 56,
                            p: 0,
                            border: '2px solid',
                            borderColor: i === galleryIndex ? 'primary.main' : 'divider',
                            borderRadius: 1,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                          }}
                        >
                          <Box
                            component="img"
                            src={src}
                            alt=""
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 100 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Target
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {project.target}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Location
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {project.location}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Duration
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {project.duration}
                </Typography>
                {project.staff && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Staff
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {project.staff}
                    </Typography>
                  </>
                )}
                {project.donors.length > 0 && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Donors
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {project.donors.join(', ')}
                    </Typography>
                  </>
                )}
                {project.partners.length > 0 && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Partners
                    </Typography>
                    <Typography variant="body2">
                      {project.partners.join(', ')}
                    </Typography>
                  </>
                )}
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3, textTransform: 'none' }}
                  onClick={() => navigate('/donate')}
                >
                  Support this programme
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <BackToTopButton />
    </Box>
  );
};

export default ProgrammeDetailPage;
