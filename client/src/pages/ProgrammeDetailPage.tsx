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
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import BackToTopButton from '../components/BackToTopButton';
import { getProjectBySlug, getProjectByRoute, type CaritasProject } from '../lib/caritasProjects';
import {
  SECTION_BG_ALT,
  pageRoot,
  pageHeroCompactTop,
  pageH1,
  pageLead,
  outlineCard,
} from '../lib/sitePageLayout';

const detailCardSx = { ...outlineCard, mb: 3 };

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
      <Box sx={{ ...pageRoot, minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
          Project not found
        </Typography>
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

  const serarpGalleryCaptions = [
    'Mechanics class in progress at Nyanyadzi College.',
    'Building class during their plastering class.',
    'Group photo for Citizen Monitoring and Advocacy training participants.',
    'A moment of refreshing for women in the edutainment event.',
    'Showing Tsuro gender champions explaining gender roles and responsibilities of men, women, girls and boys through a family tree.',
  ];

  /** Order matches `galleryImages` for Soup Kitchen (captions 1, 3, 6 supplied as scene descriptions; 2, 4, 5 from project team). */
  const soupKitchenGalleryCaptions = [
    'Soup kitchen attendees with their meals at the distribution site.',
    'Soup kitchen attendees receiving their meals',
    'Soup kitchen attendee receiving a meal at the serving counter.',
    'Soup Kitchen volunteers preparing meals for the vulnerable individuals who receive meals.',
    'One of the children living and working in the street after getting his meal during the SOUP kitchen',
    'Volunteers preparing fresh salad and vegetables for soup kitchen meals.',
  ];

  const cfnshppGalleryCaptions = [
    'Chikona Ward 7 farmers preparing a tree nursery seedbed in the micro irrigation',
    'Tree nursery established in Manzou',
    'Community Participation Weir Dam construction for the micro irrigation',
    'Cattle dipping Munyanyazi Dip tank in Ward 17',
  ];

  const icspGalleryCaptions = [
    undefined,
    "One of the lead farmer's field showcasing of small grain",
    'Community garden in Mafunga Village Ward 30',
    'Community garden in Mafunga Village Ward 30',
  ];

  const ilpGalleryCaptions = [
    'Goat pens and goats distributed in Chipinge under the Inclusive livelihoods project',
    'Fowl runs built under the inclusive livelihoods project',
  ];

  const didrrGalleryCaptions = [
    'DIDRR Project Mid-Term Review',
    undefined,
  ];

  const galleryCaption =
    project.id === 'serarp'
      ? serarpGalleryCaptions[galleryIndex]
      : project.id === 'soup-kitchen'
        ? soupKitchenGalleryCaptions[galleryIndex]
        : project.id === 'cfnshpp'
          ? cfnshppGalleryCaptions[galleryIndex]
          : project.id === 'cetlrccap'
            ? icspGalleryCaptions[galleryIndex]
            : project.id === 'ilp'
              ? ilpGalleryCaptions[galleryIndex]
            : project.id === 'didrr'
              ? didrrGalleryCaptions[galleryIndex]
              : undefined;

  const galleryImageUsesContain =
    project.id === 'st-theresa-preschool' ||
    project.id === 'serarp' ||
    project.id === 'soup-kitchen' ||
    project.id === 'cfnshpp' ||
    project.id === 'didrr';

  return (
    <Box sx={pageRoot}>
      <Container maxWidth="lg" sx={{ pt: 12, pb: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/programs')}
          sx={{ textTransform: 'none', color: 'info.main', fontWeight: 600 }}
        >
          Back to projects
        </Button>
      </Container>

      <Box sx={{ ...pageHeroCompactTop, pt: { xs: 2, md: 3 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, md: 5 }} alignItems="center">
            <Grid item xs={12} md={project.heroImage ? 6 : 12}>
              <Stack spacing={2} sx={{ textAlign: { xs: 'center', md: 'left' }, alignItems: { xs: 'center', md: 'flex-start' } }}>
                <Chip
                  label={project.status === 'ongoing' ? 'Ongoing' : 'Active'}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(13, 92, 99, 0.08)',
                    color: 'info.dark',
                    fontWeight: 600,
                  }}
                />
                <Typography variant={isMobile ? 'h4' : 'h3'} component="h1" sx={{ ...pageH1 }}>
                  {project.acronym ? `${project.acronym}: ` : ''}
                  {project.title_en}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ ...pageLead, textAlign: { xs: 'center', md: 'left' } }}>
                  {project.location} · {project.duration}
                </Typography>
                {(project.donorLogoUrls?.length ?? 0) > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
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
                          bgcolor: 'grey.50',
                          borderRadius: 1,
                          p: 0.5,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Stack>
            </Grid>
            {project.heroImage && (
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
                    aspectRatio: { xs: '4/3', md: '5/4' },
                    maxHeight: { md: 400 },
                  }}
                >
                  <Box
                    component="img"
                    src={project.heroImage}
                    alt={project.title_en}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: project.heroImagePosition ?? 'center center',
                      display: 'block',
                    }}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ bgcolor: SECTION_BG_ALT, py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card elevation={0} sx={detailCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                  About this programme
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                  {project.description_en}
                </Typography>
              </CardContent>
            </Card>

            {project.theoryOfChange_en && (
              <Card elevation={0} sx={detailCardSx}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                    Theory of change
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {project.theoryOfChange_en}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {project.keyPathways.length > 0 && (
              <Card elevation={0} sx={detailCardSx}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
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
              <Card elevation={0} sx={{ ...outlineCard }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                    Gallery
                  </Typography>
                  <CardMedia
                    component="img"
                    image={galleryImages[galleryIndex]}
                    alt={galleryCaption ?? `${project.title_en} gallery`}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      maxHeight: 420,
                      width: '100%',
                      objectFit: galleryImageUsesContain ? 'contain' : 'cover',
                      backgroundColor: galleryImageUsesContain ? 'grey.100' : 'transparent',
                    }}
                  />
                  {project.id === 'st-theresa-preschool' && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {galleryIndex === 0
                        ? 'St Theresa Pre-school children during 2025 ECD B Graduation.'
                        : 'St Theresa Caritas Pre-school children performing during the Caritas Mutare Day of the Poor on 15 November 2025.'}
                    </Typography>
                  )}
                  {galleryCaption && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {galleryCaption}
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
            <Card elevation={0} sx={{ ...outlineCard, position: 'sticky', top: 100 }}>
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
                    {(project.partnerLogoUrls?.length ?? 0) > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1 }}>
                        {project.partnerLogoUrls?.map((url) => (
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
      </Box>

      <BackToTopButton />
    </Box>
  );
};

export default ProgrammeDetailPage;
