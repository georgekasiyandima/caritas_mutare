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
  Stack,
  Chip,
} from '@mui/material';
import {
  SECTION_BG_ALT,
  pageRoot,
  pageHero,
  pageOverline,
  pageH1,
  pageLead,
  outlineCard,
  outlineCardHover,
  sectionVerticalPadding,
} from '../lib/sitePageLayout';

const cardSx = { ...outlineCard, ...outlineCardHover } as const;

const AboutPage: React.FC = () => {
  return (
    <Box sx={pageRoot}>
      <Box sx={pageHero}>
        <Container maxWidth="lg">
          <Stack spacing={2.5} alignItems="center" textAlign="center">
            <Chip
              label="Who we are"
              size="small"
              sx={{
                bgcolor: 'rgba(13, 92, 99, 0.08)',
                color: 'info.dark',
                fontWeight: 600,
                borderRadius: 1,
              }}
            />
            <Typography variant="overline" sx={{ ...pageOverline, display: 'block' }}>
              Our story
            </Typography>
            <Typography variant="h2" component="h1" sx={{ ...pageH1, fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }}>
              About Caritas Mutare
            </Typography>
            <Typography variant="body1" sx={{ ...pageLead, maxWidth: 720, textAlign: 'center' }}>
              Rooted in Catholic social teaching, Caritas Mutare accompanies vulnerable communities towards dignity,
              resilience and sustainable livelihoods across the Diocese of Mutare.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ ...sectionVerticalPadding, bgcolor: SECTION_BG_ALT }}>
        <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={cardSx}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                Vision
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                “God loving communities that are empowered in sustainable livelihoods and living with dignity”.
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ height: { xs: 16, md: 24 } }} />

          <Card elevation={0} sx={cardSx}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                Mission
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                Guided by the Social Teachings of the Roman Catholic Church, Caritas Zimbabwe Diocese of Mutare thrives
                “to promote food security, social protection, environmental management, water and sanitation for the
                vulnerable men, women, boys and girls, inclusive of persons with disabilities, in a sustainable manner within the Diocese of Mutare”.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                Values
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Catholic Church’s social teachings are the basic foundation of our organization. At the heart of the
                Catholic Church social teachings are the following values which guide us:
              </Typography>
              <List dense>
                {[
                  'Dignity of human beings',
                  'Solidarity / sharing',
                  'Service',
                  'Subsidiarity and partnership',
                  'Compassion',
                  'Hope',
                  'Equality',
                  'Justice',
                  'Stewardship',
                ].map((value) => (
                  <ListItem key={value} sx={{ py: 0.3 }}>
                    <ListItemText primary={value} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card elevation={0} sx={cardSx}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                Thematic Areas
              </Typography>
              <List dense>
                {[
                  'Food security and livelihoods',
                  'Emergency humanitarian response and resilience',
                  'Community infrastructure building and maintenance',
                  'Climate resilience and natural resource management',
                  'Institutional and community capacity development',
                  'Youth and women empowerment and development',
                  'Including persons with disabilities in humanitarian response and livelihoods',
                ].map((area) => (
                  <ListItem key={area} sx={{ py: 0.3 }}>
                    <ListItemText primary={area} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
        </Container>
      </Box>

      <Box sx={{ ...sectionVerticalPadding, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ ...cardSx, mb: 3 }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                  Collaboration and coordination with key stakeholders
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                  Caritas Mutare implements its projects through strong partnerships with government stakeholders, sister
                  organizations and other technical partners, including local structures.
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Government stakeholders and line ministries
                </Typography>
                <List dense>
                  {[
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
                  ].map((item) => (
                    <ListItem key={item} sx={{ py: 0.3 }}>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            <Card elevation={0} sx={cardSx}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                  Technical partners and sister organizations
                </Typography>
                <List dense>
                  {[
                    'Caritas Zimbabwe National Office',
                    'Youth Alive Zimbabwe (YAZIM)',
                    'The Catholic Commission for Justice and Peace in Zimbabwe',
                    'Mutare Diocese Safeguarding Office',
                    'Mutare Diocese Health Commission',
                    'Mutare Diocese Education Commission',
                  ].map((partner) => (
                    <ListItem key={partner} sx={{ py: 0.3 }}>
                      <ListItemText primary={partner} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ ...cardSx, mb: 3 }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                  Caritas Mutare management and staffing
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                  Caritas Mutare, led by the Development Coordinator, has a structured team to drive
                  its mission. Caritas Mutare also has its own projects with initiatives such as Mai Maria Village,
                  the Soup Kitchen and education support. The Programs Manager oversees all organizational projects, ensuring effective
                  implementation and coordination.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                  The Finance Department, headed by a Finance Manager who is part of the Caritas management team and
                  also oversees human resources and administration issues, is supported by a Finance Assistant and
                  Administration Officer, managing financial resources and administrative tasks.
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  The organization’s staffing and management team has a strong gender balance. This diversity brings
                  varied perspectives, enhancing Caritas Mutare’s effectiveness in addressing community needs.
                </Typography>
              </CardContent>
            </Card>

            <Card elevation={0} sx={cardSx}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                  Monitoring and Evaluation (M&amp;E)
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  The Monitoring and Evaluation (M&amp;E) Department, led by an M&amp;E Officer reporting to the
                  Programs Manager, ensures projects are tracked and evaluated for impact. Each project has a dedicated
                  Project Officer driving specific project goals and outcomes. This structure enables Caritas Mutare to
                  effectively manage its projects, ensuring accountability and transparency, and promotes collaboration
                  and efficiency in serving communities.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;





