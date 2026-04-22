import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  useTheme,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowForward as ArrowForwardIcon, FormatQuote as FormatQuoteIcon } from '@mui/icons-material';
import HeroBanner from '../components/HeroBanner';
import SEO from '../components/SEO';
import PartnerLogoStrip from '../components/PartnerLogoStrip';
import {
  SECTION_BG_ALT,
  pageRoot,
  pageOverline,
  outlineCard,
  outlineCardHover,
  sectionVerticalPadding,
  closingCtaSectionSx,
} from '../lib/sitePageLayout';

const cardSx = { ...outlineCard, ...outlineCardHover } as const;

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  // Hard-coded About hero so it stays mission-aligned ("Promoting dignified
  // lives") regardless of changes to the shared impact-carousel ordering.
  const heroImageSource = {
    src: '/images/general/promoting-dignified-lives-1.png',
    alt: 'Promoting dignified lives in a safe environment across the Diocese of Mutare',
    objectPosition: 'center 35%',
  };

  const values = [
    'Dignity of human beings',
    'Solidarity / sharing',
    'Service',
    'Subsidiarity and partnership',
    'Compassion',
    'Hope',
    'Equality',
    'Justice',
    'Stewardship',
  ];

  const thematicAreas = [
    'Food security and livelihoods',
    'Emergency humanitarian response and resilience',
    'Community infrastructure building and maintenance',
    'Climate resilience and natural resource management',
    'Institutional and community capacity development',
    'Youth and women empowerment and development',
    'Including persons with disabilities in humanitarian response and livelihoods',
  ];

  const govStakeholders = [
    'Department of Agricultural Technical and Extension Services ABAOS (Agricultural Business Advisory Officers): providing agricultural extension services and advice to farmers, including persons with disabilities in all projects.',
    'Ministry of Women Affairs: advancing women’s empowerment.',
    'Department of Social Development: supporting vulnerable populations.',
    'Environmental Management Agency (EMA): driving environmental protection.',
    'Forestry Commission: enhancing biodiversity and restoration.',
    'Ministry of Health and Child Care: promoting health and wellbeing.',
    'Local leaders & community structures: mobilizing communities.',
    'Rural Infrastructure Development Agent (RIDA): supporting water supply systems.',
    'Ministry of Youth Empowerment, Development and Vocational Training.',
    'Zimbabwe Republic Police Victim Friendly Unit.',
  ];

  const sisterOrgs = [
    'Caritas Zimbabwe National Office',
    'Youth Alive Zimbabwe (YAZIM)',
    'The Catholic Commission for Justice and Peace in Zimbabwe',
    'Mutare Diocese Safeguarding Office',
    'Mutare Diocese Health Commission',
    'Mutare Diocese Education Commission',
  ];

  return (
    <Box sx={pageRoot}>
      <SEO
        title="About Caritas Mutare"
        description="Rooted in Catholic social teaching, Caritas Mutare accompanies vulnerable communities towards dignity, resilience and sustainable livelihoods across the Diocese of Mutare."
        image={heroImageSource?.src}
        canonicalPath="/about"
      />

      {heroImageSource && (
        <HeroBanner
          image={heroImageSource.src}
          imageAlt={heroImageSource.alt}
          imagePosition={heroImageSource.objectPosition}
          size="standard"
          overlay={0.6}
          eyebrow="Who we are"
          title="About Caritas Mutare"
          subtitle="Rooted in Catholic social teaching, we accompany vulnerable communities towards dignity, resilience and sustainable livelihoods across the Diocese of Mutare."
          primaryCta={{
            label: 'Our projects',
            onClick: () => navigate('/programs'),
          }}
          secondaryCta={{
            label: 'Meet the team',
            onClick: () => navigate('/leadership'),
          }}
        />
      )}

      {/* Mission quote band */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', position: 'relative' }}>
            <FormatQuoteIcon
              sx={{
                position: 'absolute',
                top: -18,
                left: '50%',
                transform: 'translateX(-50%) rotate(180deg)',
                fontSize: 80,
                color: 'primary.main',
                opacity: 0.08,
                pointerEvents: 'none',
              }}
            />
            <Typography
              variant="overline"
              sx={{ ...pageOverline, display: 'block', mb: 1.5 }}
            >
              Our mission
            </Typography>
            <Typography
              variant="h4"
              component="p"
              sx={{
                fontFamily: '"Merriweather", Georgia, serif',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'text.primary',
                lineHeight: 1.5,
                fontSize: { xs: '1.25rem', md: '1.55rem' },
              }}
            >
              Guided by the Social Teachings of the Roman Catholic Church, Caritas Zimbabwe Roman Catholic Diocese of Mutare
              works <Box component="span" sx={{ color: 'primary.main', fontWeight: 700, fontStyle: 'normal' }}>
                to promote food security, social protection, environmental management, water and sanitation
              </Box> for the vulnerable — men, women, boys and girls, inclusive of persons with disabilities — in a
              sustainable manner within the Diocese of Mutare.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Vision, Values, Thematic Areas */}
      <Box sx={{ ...sectionVerticalPadding, bgcolor: SECTION_BG_ALT }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5, maxWidth: 720, mx: 'auto' }}>
            <Typography variant="overline" sx={{ ...pageOverline, display: 'block', mb: 1 }}>
              What drives us
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}
            >
              Vision, values and focus areas
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ ...cardSx, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.5 }}>
                    Vision
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Merriweather", Georgia, serif',
                      fontWeight: 700,
                      fontStyle: 'italic',
                      mt: 1,
                      lineHeight: 1.5,
                    }}
                  >
                    “God-loving communities that are empowered in sustainable livelihoods and living with dignity.”
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ ...cardSx, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.5 }}>
                    Our values
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                    Catholic social teachings are the foundation of our work. The values at the heart of that teaching guide us every day.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {values.map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(13,92,99,0.08)',
                          color: 'info.dark',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ ...cardSx, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.5 }}>
                    Thematic areas
                  </Typography>
                  <List dense disablePadding sx={{ mt: 1 }}>
                    {thematicAreas.map((area) => (
                      <ListItem key={area} sx={{ py: 0.4, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 20, mt: 0.6 }}>
                          <FiberManualRecordIcon sx={{ fontSize: 8, color: 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={area}
                          primaryTypographyProps={{
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            lineHeight: 1.5,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Partners + stakeholders */}
      <Box sx={{ ...sectionVerticalPadding }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5, maxWidth: 760, mx: 'auto' }}>
            <Typography variant="overline" sx={{ ...pageOverline, display: 'block', mb: 1 }}>
              How we work
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 2 }}
            >
              Partnerships and coordination
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
              Caritas Mutare implements its projects through strong partnerships with government line ministries,
              sister organisations and local community structures. Coordination keeps our work accountable, locally
              led, and aligned with national priorities.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Card elevation={0} sx={cardSx}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                    Government stakeholders & line ministries
                  </Typography>
                  <Box
                    sx={{
                      columnCount: { xs: 1, sm: 2 },
                      columnGap: 3,
                      mt: 1,
                    }}
                  >
                    {govStakeholders.map((item) => (
                      <Box
                        key={item}
                        sx={{
                          breakInside: 'avoid',
                          pageBreakInside: 'avoid',
                          display: 'flex',
                          gap: 1,
                          alignItems: 'flex-start',
                          mb: 1.25,
                        }}
                      >
                        <FiberManualRecordIcon
                          sx={{ fontSize: 7, color: 'primary.main', mt: '0.6em', flexShrink: 0 }}
                        />
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card elevation={0} sx={{ ...cardSx, mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                    Technical partners & sister organisations
                  </Typography>
                  <List dense>
                    {sisterOrgs.map((partner) => (
                      <ListItem key={partner} sx={{ py: 0.3 }}>
                        <ListItemText primary={partner} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              <Card elevation={0} sx={cardSx}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                    Team & M&amp;E
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.7 }}>
                    Led by our Development Coordinator, Caritas Mutare has a structured team to drive its mission
                    — including the Programs Manager, Finance Department, and dedicated Project Officers. An M&amp;E
                    Officer ensures projects are tracked and evaluated for impact.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    The team maintains strong gender balance, bringing varied perspectives to community needs.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
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
    </Box>
  );
};

export default AboutPage;
