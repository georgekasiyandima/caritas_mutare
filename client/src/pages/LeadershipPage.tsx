import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Stack,
} from '@mui/material';
import {
  Person as PersonIcon,
  Church as ChurchIcon,
  Handshake as PartnershipIcon,
} from '@mui/icons-material';
import BackToTopButton from '../components/BackToTopButton';
import { partnerLogosForSite } from '../lib/caritasProjects';
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

const leadCardSx = { ...outlineCard, ...outlineCardHover };

interface LeadershipMember {
  id: number;
  name: string;
  position: string;
  role: string;
  description: string;
  image?: string;
  email?: string;
  phone?: string;
  category: 'director' | 'bishop' | 'management' | 'partner';
}

const LeadershipPage: React.FC = () => {
  const leadership: LeadershipMember[] = [
    {
      id: 0,
      name: "Bishop Paul Horan (O'CARM)",
      position: "Bishop of the Diocese of Mutare",
      role: "Overall authority",
      description:
        "As the Bishop of the Diocese of Mutare, Bishop Paul Horan provides spiritual guidance and overall authority for Caritas Mutare, ensuring the organization remains rooted in Catholic social teaching and serves communities with compassion and integrity.",
      image: "/images/leadership/bishop-horan.png",
      category: "bishop",
    },
    {
      id: 1,
      name: "Development Coordinator",
      position: "Development Coordinator",
      role: "Development Coordinator",
      description:
        "Leads Caritas Mutare’s mission and strategy, coordinating all projects and operations across the Diocese, and represents Caritas within diocesan structures.",
      category: "director",
    },
    {
      id: 2,
      name: "Own Projects Coordination",
      position: "Coordinator – Own projects",
      role: "Strategic direction for Caritas-owned projects",
      description:
        "Caritas Mutare also has its own projects with initiatives such as Mai Maria Village, the Soup Kitchen and education support. This coordination stream provides strategic direction and day-to-day oversight.",
      category: "management",
    },
    {
      id: 3,
      name: "Programs Manager",
      position: "Programs Manager",
      role: "Oversight of all organizational projects",
      description:
        "Coordinates the full project portfolio, ensuring effective planning, implementation and reporting across all thematic areas. Works closely with project officers, M&E and finance to deliver quality and impact.",
      category: "management",
    },
    {
      id: 4,
      name: "Finance Manager",
      position: "Finance & Administration Manager",
      role: "Finance, HR and administration oversight",
      description:
        "Leads the Finance Department, overseeing financial management, human resources and administration. Supported by the Finance Assistant and Administration Officer to ensure resources are used transparently and accountably.",
      category: "management",
    },
    {
      id: 5,
      name: "Finance Assistant & Administration Officer",
      position: "Finance Assistant & Administration Officer",
      role: "Support to finance and administration",
      description:
        "Provides day-to-day support with bookkeeping, payments, documentation and office administration, helping projects run smoothly and in line with donor and diocesan requirements.",
      category: "management",
    },
    {
      id: 6,
      name: "M&E Officer",
      position: "Monitoring & Evaluation Officer",
      role: "Tracking results and learning",
      description:
        "Designs and implements monitoring and evaluation systems, tracks project performance and documents learning. Works with project officers and the Programs Manager to ensure evidence-based decision-making.",
      category: "management",
    },
    {
      id: 7,
      name: "Project Officers",
      position: "Project Officers",
      role: "Frontline project implementation",
      description:
        "Lead day-to-day implementation of specific projects in communities, coordinating with local structures and partners to deliver activities and support participants.",
      category: "management",
    },
  ];

  const partners = partnerLogosForSite
    .filter((p) => p.name !== 'Caritas Mutare')
    .map((p, index) => ({
      id: index + 1,
      name: p.name,
      logo: p.logoUrl,
    }));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'director':
        return <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />;
      case 'bishop':
        return <ChurchIcon sx={{ fontSize: 40, color: 'primary.main' }} />;
      case 'management':
        return <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />;
      case 'partner':
        return <PartnershipIcon sx={{ fontSize: 40, color: 'primary.main' }} />;
      default:
        return <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'director':
        return 'primary';
      case 'bishop':
        return 'secondary';
      case 'management':
        return 'primary';
      case 'partner':
        return 'success';
      default:
        return 'default';
    }
  };

  const bishop = leadership.find((m) => m.category === 'bishop');
  const managementAndDirectors = leadership.filter((m) => m.category === 'director' || m.category === 'management');

  return (
    <Box sx={pageRoot}>
      <Box sx={pageHero}>
        <Container maxWidth="lg">
          <Stack spacing={2.5} alignItems="center" textAlign="center">
            <Chip
              label="Governance & partners"
              size="small"
              sx={{
                bgcolor: 'rgba(13, 92, 99, 0.08)',
                color: 'info.dark',
                fontWeight: 600,
                borderRadius: 1,
              }}
            />
            <Typography variant="overline" sx={{ ...pageOverline, display: 'block' }}>
              Who leads Caritas
            </Typography>
            <Typography variant="h2" component="h1" sx={{ ...pageH1, fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }}>
              Leadership & Partners
            </Typography>
            <Typography variant="body1" sx={{ ...pageLead, maxWidth: 720 }}>
              Caritas Mutare is guided by the Bishop of the Diocese and a dedicated management team that oversees projects,
              finances and learning in close collaboration with partners.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ ...sectionVerticalPadding, bgcolor: SECTION_BG_ALT }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 2, textAlign: 'center' }}
          >
            Board of Directors
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, textAlign: 'center', maxWidth: 820, mx: 'auto', lineHeight: 1.75 }}
          >
            Caritas Mutare is led by a Board of Directors composed of 7 members — Chairperson and Vice-Chairperson,
            Secretary and Vice-Secretary, Treasurer, and two Committee Members — providing strategic oversight and
            ensuring accountability to the Diocese, donors and communities we serve.
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {[
              { role: 'Chairperson', note: 'and Vice-Chairperson' },
              { role: 'Secretary', note: 'and Vice-Secretary' },
              { role: 'Treasurer', note: 'Finance oversight' },
              { role: 'Committee Members', note: 'Two members · subject-matter counsel' },
            ].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.role}>
                <Card
                  elevation={0}
                  sx={{
                    ...leadCardSx,
                    textAlign: 'center',
                    py: 2.5,
                    px: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 0.5,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {item.role}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {item.note}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      </Box>

      <Box sx={{ ...sectionVerticalPadding, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        {/* Leadership Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 4, textAlign: 'center' }}
          >
            Our leadership structure
          </Typography>

          {/* Bishop – overall authority */}
          {bishop && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{ textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary', mb: 2, textAlign: 'center' }}
              >
                Overall authority
              </Typography>
              <Grid container justifyContent="center">
                <Grid item xs={12} md={8}>
                  <Card
                    elevation={0}
                    sx={{
                      ...leadCardSx,
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: 'center',
                      p: 3,
                    }}
                  >
                    <Box sx={{ textAlign: 'center', mr: { md: 3 }, mb: { xs: 2, md: 0 } }}>
                      {bishop.image ? (
                        <Avatar
                          src={bishop.image}
                          alt={bishop.name}
                          sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                        />
                      ) : (
                        <Box sx={{ mb: 2 }}>{getCategoryIcon(bishop.category)}</Box>
                      )}
                      <Chip
                        label={bishop.position}
                        color={getCategoryColor(bishop.category) as any}
                        sx={{ mb: 1 }}
                      />
                    </Box>
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                      <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {bishop.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {bishop.description}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Management and coordination team */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: 'text.secondary',
                mb: 2,
                textAlign: 'center',
              }}
            >
              Management & coordination
            </Typography>
            <Grid container spacing={4}>
              {managementAndDirectors.map((member) => (
                <Grid item xs={12} md={4} key={member.id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      ...leadCardSx,
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        {member.image ? (
                          <Avatar
                            src={member.image}
                            alt={member.name}
                            sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
                          />
                        ) : (
                          <Box sx={{ mb: 1 }}>{getCategoryIcon(member.category)}</Box>
                        )}
                      </Box>

                      <Chip
                        label={member.position}
                        color={getCategoryColor(member.category) as any}
                        size="small"
                        sx={{ mb: 1 }}
                      />

                      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {member.name}
                      </Typography>

                      <Typography variant="body2" color="primary" gutterBottom>
                        {member.role}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {member.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
      </Box>

      <Divider />

      {/* Partners Section */}
      <Box sx={{ ...sectionVerticalPadding, bgcolor: SECTION_BG_ALT }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Our Partners
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
          Caritas Mutare works in collaboration with various local and international partners to maximize our impact and reach more communities in need.
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
          {partners.map((partner) => (
            <Grid item xs={6} sm={4} md={3} key={partner.id}>
              <Card
                elevation={0}
                sx={{
                  height: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  p: 2.5,
                  gap: 1.5,
                  ...leadCardSx,
                }}
              >
                <Box
                  component="img"
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  sx={{
                    height: 48,
                    maxWidth: '100%',
                    objectFit: 'contain',
                    opacity: 0.95,
                  }}
                  loading="lazy"
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    fontSize: '0.78rem',
                    lineHeight: 1.2,
                    letterSpacing: 0.2,
                  }}
                >
                  {partner.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      </Box>

      <BackToTopButton />
    </Box>
  );
};

export default LeadershipPage;
