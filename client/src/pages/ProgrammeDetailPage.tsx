import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Stack,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import BackToTopButton from '../components/BackToTopButton';
import HeroBanner from '../components/HeroBanner';
import SEO from '../components/SEO';
import { getProjectBySlug, getProjectByRoute, type CaritasProject } from '../lib/caritasProjects';
import {
  SECTION_BG_ALT,
  pageRoot,
  outlineCard,
} from '../lib/sitePageLayout';

const detailCardSx = { ...outlineCard, mb: 3 };

const ProgrammeDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [galleryIndex, setGalleryIndex] = useState(0);

  const project: CaritasProject | undefined = slug
    ? getProjectBySlug(slug) ?? getProjectByRoute(`/programs/${slug}`)
    : undefined;

  if (!project) {
    return (
      <Box sx={{ ...pageRoot, minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, pt: 14 }}>
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

  // Captions line up 1-to-1 with the galleryImages array in `caritasProjects.ts`.
  // Keep the order in sync when images are added or reordered.
  const soupKitchenGalleryCaptions = [
    'Caritas Mutare volunteers preparing meals together in large pots at the Soup Kitchen.',
    'Carmelite Nun helping in preparation of meals.',
    'A volunteer serving a hot meal to a community member at the Soup Kitchen.',
    'Elderly community members receiving their meals at the Soup Kitchen.',
    'Community members queuing for a nutritious meal served once a month.',
    'Soup Kitchen attendees with their meals at the distribution site.',
    'Soup Kitchen attendees receiving their meals.',
    'Soup Kitchen attendee receiving a meal at the serving counter.',
    'Soup Kitchen volunteers preparing meals for the vulnerable individuals who receive meals.',
    'One of the children living and working on the street after getting his meal during the Soup Kitchen.',
    'Volunteers preparing fresh salad and vegetables for Soup Kitchen meals.',
  ];

  const cfnshppGalleryCaptions = [
    'Chikona Ward 7 farmers preparing a tree nursery seedbed in the micro irrigation',
    'Tree nursery established in Manzou',
    'Community Participation Weir Dam construction for the micro irrigation',
    'Cattle dipping Munyanyazi Dip tank in Ward 17',
  ];

  const icspGalleryCaptions: (string | undefined)[] = [
    undefined,
    "One of the lead farmer's field showcasing of small grain",
    'Community garden in Mafunga Village Ward 30',
    'Community garden in Mafunga Village Ward 30',
  ];

  const ilpGalleryCaptions = [
    'Goat pens and goats distributed in Chipinge under the Inclusive livelihoods project',
    'Fowl runs built under the inclusive livelihoods project',
  ];

  const didrrGalleryCaptions: (string | undefined)[] = [
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

  const statusLabel = project.status === 'ongoing' ? 'Ongoing' : project.status === 'completed' ? 'Completed' : 'Active';

  return (
    <Box sx={pageRoot}>
      <SEO
        title={project.acronym ? `${project.acronym} — ${project.title_en}` : project.title_en}
        description={project.summary_en}
        image={project.heroImage}
        canonicalPath={project.route}
      />

      {project.heroImage ? (
        <HeroBanner
          image={project.heroImage}
          imageAlt={project.title_en}
          imagePosition={project.heroImagePosition}
          size="standard"
          overlay={0.6}
          eyebrow={`${statusLabel} · ${project.location}`}
          title={project.acronym ? `${project.acronym}: ${project.title_en}` : project.title_en}
          subtitle={project.summary_en}
          primaryCta={{
            label: 'Support this programme',
            onClick: () => navigate('/donate'),
          }}
          secondaryCta={{
            label: 'All projects',
            onClick: () => navigate('/programs'),
          }}
        />
      ) : (
        <Box sx={{ pt: { xs: 12, md: 14 }, pb: 3, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Container maxWidth="lg">
            <Typography variant="overline" sx={{ color: 'info.main', fontWeight: 700, letterSpacing: 2 }}>
              {statusLabel}
            </Typography>
            <Typography variant="h3" component="h1" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mt: 1, mb: 2 }}>
              {project.acronym ? `${project.acronym}: ${project.title_en}` : project.title_en}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720, lineHeight: 1.75 }}>
              {project.summary_en}
            </Typography>
          </Container>
        </Box>
      )}

      {/* Back link strip under hero */}
      <Container maxWidth="lg" sx={{ pt: 2.5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/programs')}
          sx={{ textTransform: 'none', color: 'info.main', fontWeight: 700 }}
          size="small"
        >
          All projects
        </Button>
      </Container>

      {/* Donor logos strip (below hero) */}
      {(project.donorLogoUrls?.length ?? 0) > 0 && (
        <Container maxWidth="lg" sx={{ pt: 3 }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1.5, mr: 1 }}>
              Funded by
            </Typography>
            {project.donorLogoUrls?.map((url) => (
              <Box
                key={url}
                component="img"
                src={url}
                alt=""
                sx={{ height: 32, maxWidth: 140, objectFit: 'contain', opacity: 0.9 }}
              />
            ))}
          </Stack>
        </Container>
      )}

      <Box sx={{ bgcolor: SECTION_BG_ALT, py: { xs: 5, md: 6 }, mt: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card elevation={0} sx={detailCardSx}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                    About this programme
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
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
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
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
                        <Typography key={i} component="li" variant="body1" sx={{ mb: 0.5, lineHeight: 1.7 }}>
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
                  <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.5 }}>
                    At a glance
                  </Typography>

                  <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
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
                                height: 32,
                                maxWidth: 120,
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
                    color="primary"
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                    sx={{ mt: 3, textTransform: 'none', fontWeight: 700, borderRadius: 999, py: 1.25 }}
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
