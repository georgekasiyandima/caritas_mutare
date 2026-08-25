import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import {
  DirectionsRun as RunIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Restaurant as KitchenIcon,
  Route as RouteIcon,
  Event as EventIcon,
  Payments as PaymentsIcon,
  WhatsApp as WhatsAppIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import BackToTopButton from '../components/BackToTopButton';
import HeroBanner from '../components/HeroBanner';
import SEO from '../components/SEO';
import type { SxProps, Theme } from '@mui/material';
import {
  pageRoot,
  outlineCard,
  outlineCardHover,
  closingCtaSectionSx,
  SECTION_BG_ALT,
} from '../lib/sitePageLayout';
import { orgContact } from '../lib/organisation';
import { marathonEvent, type MarathonImage } from '../lib/marathonEvent';

const factCardSx: SxProps<Theme> = [outlineCard, { height: '100%' }] as SxProps<Theme>;
const actionCardSx: SxProps<Theme> = [outlineCard, outlineCardHover, { height: '100%' }] as SxProps<Theme>;
const glanceCardSx: SxProps<Theme> = [outlineCard, { height: '100%' }] as SxProps<Theme>;
const photoButtonSx: SxProps<Theme> = [
  outlineCard,
  {
    p: 0,
    overflow: 'hidden',
    width: '100%',
    cursor: 'pointer',
    display: 'block',
    bgcolor: 'transparent',
  },
] as SxProps<Theme>;

function whatsappRegisterUrl() {
  const digits = orgContact.phones.main.replace(/[^\d]/g, '');
  const text = `Hello, I would like to register for the ${marathonEvent.name} (USD ${marathonEvent.entryFeeUsd}).`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function mailtoRegisterUrl() {
  const subject = encodeURIComponent(`${marathonEvent.shortName} registration`);
  const body = encodeURIComponent(
    `Hello Caritas Mutare,\n\nI would like to take part in the ${marathonEvent.name}.\n\nName:\nPhone:\nPreferred contact:\n\nThank you.`
  );
  return `mailto:${orgContact.email.primary}?subject=${subject}&body=${body}`;
}

const FACTS = [
  {
    icon: <RunIcon sx={{ fontSize: 32 }} />,
    value: `${marathonEvent.distanceKm} km`,
    label: 'Half marathon',
    color: '#7D0000',
  },
  {
    icon: <PaymentsIcon sx={{ fontSize: 32 }} />,
    value: `USD ${marathonEvent.entryFeeUsd}`,
    label: 'Entry fee',
    color: '#0D5C63',
  },
  {
    icon: <KitchenIcon sx={{ fontSize: 32 }} />,
    value: marathonEvent.cause.title,
    label: 'Where your entry goes',
    color: '#B7410E',
  },
];

const MarathonPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [lightbox, setLightbox] = useState<MarathonImage | null>(null);
  const racePhotos = marathonEvent.raceGallery;

  return (
    <Box sx={pageRoot}>
      <SEO
        title={marathonEvent.name}
        description={`Run ${marathonEvent.distanceKm}km with Caritas Mutare. USD ${marathonEvent.entryFeeUsd} entry supports the Soup Kitchen in Mutare.`}
        image={marathonEvent.hero.src}
        canonicalPath={marathonEvent.path}
      />

      <HeroBanner
        image={marathonEvent.hero.src}
        imageAlt={marathonEvent.hero.alt}
        imagePosition={marathonEvent.hero.objectPosition}
        size="standard"
        overlay={0.58}
        eyebrow="Annual community race"
        title={marathonEvent.shortName}
        subtitle={`USD ${marathonEvent.entryFeeUsd} entry. Run to support the Soup Kitchen — feeding neighbours who come through the door.`}
        primaryCta={{
          label: 'Register your interest',
          onClick: () => {
            document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          },
        }}
        secondaryCta={{
          label: 'The Soup Kitchen',
          onClick: () => navigate(marathonEvent.cause.path),
        }}
        caption={marathonEvent.hero.caption}
      />

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {FACTS.map((fact) => (
              <Grid item xs={12} sm={4} key={fact.label}>
                <Card elevation={0} sx={factCardSx}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: `${fact.color}14`,
                        color: fact.color,
                        mb: 2,
                      }}
                    >
                      {fact.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 0.5 }}
                    >
                      {fact.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {fact.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: SECTION_BG_ALT, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2 }}>
                The event
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mt: 1, mb: 2 }}
              >
                Run with us. Feed a neighbour.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
                The Caritas Mutare Charity Run is our annual community race — not a commercial
                sporting brand. The banner on the start line says it plainly: run to support the
                Soup Kitchen, feeding the less privileged. Your entry fee of USD{' '}
                {marathonEvent.entryFeeUsd} helps buy food, fuel and the hands that cook.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                The 21km is the flagship distance. Shorter community distances run on the same
                day. Date and route will be published here as soon as the team confirms them.
                Until then, register your interest and we will reach you with the details.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card elevation={0} sx={glanceCardSx}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.5 }}>
                    At a glance
                  </Typography>
                  <Stack spacing={2.5} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <EventIcon sx={{ color: 'primary.main', mt: 0.25 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {marathonEvent.dateLabel}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <RouteIcon sx={{ color: 'primary.main', mt: 0.25 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Route
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {marathonEvent.routeLabel}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <RunIcon sx={{ color: 'primary.main', mt: 0.25 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Distance
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {marathonEvent.distanceKm} kilometres · {marathonEvent.locationLabel}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <KitchenIcon sx={{ color: 'primary.main', mt: 0.25 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Cause
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Soup Kitchen, Mutare
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {racePhotos.length > 0 && (
        <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 4, maxWidth: 640, mx: 'auto' }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2 }}>
                This year’s race
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mt: 1 }}
              >
                From the course
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {racePhotos.map((img) => (
                <Grid item xs={12} sm={6} md={4} key={img.src}>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setLightbox(img)}
                    sx={photoButtonSx}
                  >
                    <Box
                      component="img"
                      src={img.src}
                      alt={img.alt}
                      sx={{
                        width: '100%',
                        height: { xs: 220, md: 240 },
                        objectFit: 'cover',
                        objectPosition: img.objectPosition ?? 'center',
                        display: 'block',
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      <Box
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: racePhotos.length > 0 ? SECTION_BG_ALT : 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'flex-end' }}
            sx={{ mb: 4 }}
          >
            <Box sx={{ maxWidth: 640 }}>
              <Typography variant="overline" sx={{ color: 'info.main', fontWeight: 700, letterSpacing: 2 }}>
                Why we run
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mt: 1, mb: 1 }}
              >
                A meal, served with dignity
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                The Soup Kitchen is a monthly community of care — not a one-off drop. Entry fees help
                buy food, fuel and the hands that cook.
              </Typography>
            </Box>
            <Button
              variant="text"
              color="info"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate(marathonEvent.cause.path)}
              sx={{ fontWeight: 700 }}
            >
              Visit the Soup Kitchen
            </Button>
          </Stack>
          <Grid container spacing={2}>
            {marathonEvent.kitchenGallery.map((img) => (
              <Grid item xs={12} sm={6} md={3} key={img.src}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => setLightbox(img)}
                  sx={photoButtonSx}
                >
                  <Box
                    component="img"
                    src={img.src}
                    alt={img.alt}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      objectPosition: img.objectPosition ?? 'center',
                      display: 'block',
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        id="register"
        sx={{ py: { xs: 6, md: 8 }, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5, maxWidth: 640, mx: 'auto' }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2 }}>
              Take part
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mt: 1, mb: 1.5 }}
            >
              Register your interest
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
              Online race registration is not open yet. Send your name and we will confirm the date,
              route and how to pay the USD {marathonEvent.entryFeeUsd} entry.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={actionCardSx}>
                <CardContent sx={{ p: 3 }}>
                  <EmailIcon sx={{ color: 'primary.main', mb: 1.5 }} />
                  <Typography variant="h6" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 1 }}>
                    Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                    Write to the office with your name and phone number.
                  </Typography>
                  <Button
                    component="a"
                    href={mailtoRegisterUrl()}
                    variant="outlined"
                    fullWidth
                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 999 }}
                  >
                    {orgContact.email.primary}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={actionCardSx}>
                <CardContent sx={{ p: 3 }}>
                  <WhatsAppIcon sx={{ color: '#25D366', mb: 1.5 }} />
                  <Typography variant="h6" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 1 }}>
                    WhatsApp
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                    Message the team the way many parishioners already do.
                  </Typography>
                  <Button
                    component="a"
                    href={whatsappRegisterUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    fullWidth
                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 999 }}
                  >
                    {orgContact.phones.main}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={actionCardSx}>
                <CardContent sx={{ p: 3 }}>
                  <PhoneIcon sx={{ color: 'primary.main', mb: 1.5 }} />
                  <Typography variant="h6" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 1 }}>
                    Contact form
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                    Use the public form if you prefer to write from the site.
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/contact')}
                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 999 }}
                  >
                    Open contact
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={closingCtaSectionSx(theme)}>
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography
            variant="overline"
            sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 700, letterSpacing: 2, mb: 2, display: 'block' }}
          >
            Cannot run this year?
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontFamily: '"Merriweather", Georgia, serif',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.85rem', md: '2.35rem' },
              lineHeight: 1.2,
            }}
          >
            A gift still feeds the kitchen
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.92, lineHeight: 1.75, maxWidth: 560, mx: 'auto' }}>
            You can support the Soup Kitchen directly, or volunteer on a serving day.
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
              Donate
            </Button>
            <Button
              variant="text"
              size="large"
              onClick={() => navigate('/volunteer')}
              sx={{ color: 'common.white', fontWeight: 700 }}
            >
              Volunteer
            </Button>
          </Stack>
        </Container>
      </Box>

      <BackToTopButton />

      <Dialog open={Boolean(lightbox)} onClose={() => setLightbox(null)} maxWidth="md" fullWidth>
        {lightbox && (
          <Box
            component="img"
            src={lightbox.src}
            alt={lightbox.alt}
            sx={{ width: '100%', display: 'block' }}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default MarathonPage;
