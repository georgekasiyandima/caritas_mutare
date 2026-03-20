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
} from '@mui/material';
import {
  Person as PersonIcon,
  Church as ChurchIcon,
  Handshake as PartnershipIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import BackToTopButton from '../components/BackToTopButton';
import { partnerLogosForSite } from '../lib/caritasProjects';

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
  const { t } = useTranslation();

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
      name: "Fr. Ernest Gumbeze",
      position: "Development Coordinator",
      role: "Development Coordinator",
      description:
        "Leads Caritas Mutare’s mission and strategy, coordinating all projects and operations across the Diocese. Fr. Gumbeze provides overall development leadership and represents Caritas within the diocesan structures.",
      email: "egumbeze@caritasmutare.org",
      phone: "+263 77 467 1893",
      category: "director",
    },
    {
      id: 2,
      name: "Sister Angeline",
      position: "Coordinator – Own projects",
      role: "Strategic direction for Caritas-owned projects",
      description:
        "Oversees Caritas Mutare’s own projects, providing strategic direction and day-to-day oversight. Ensures that initiatives such as Mai Maria Village, the Soup Kitchen and education projects remain sustainable and aligned with Caritas values.",
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
      description: '',
      type: 'Key partner',
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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Leadership & Partners
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
            Caritas Mutare is guided by the Bishop of the Diocese and a dedicated management team that oversees projects,
            finances and learning in close collaboration with partners.
          </Typography>
        </Box>

        {/* Leadership Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}
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
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: 'center',
                      p: 3,
                      borderRadius: 3,
                      boxShadow: 3,
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
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
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

      <Divider sx={{ my: 6 }} />

      {/* Partners Section */}
      <Box>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          Our Partners
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
          Caritas Mutare works in collaboration with various local and international partners to maximize our impact and reach more communities in need.
        </Typography>
        
        <Grid container spacing={3}>
          {partners.map((partner) => (
            <Grid item xs={12} sm={6} md={3} key={partner.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  p: 3,
                  minHeight: '280px',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 0
                }}>
                  {/* Logo Section - Fixed Height */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    mb: 2,
                    minHeight: '80px'
                  }}>
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} logo`}
                      style={{
                        height: '60px',
                        width: '120px',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                  
                  {/* Content Section */}
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          lineHeight: 1.3,
                          mb: 1,
                          minHeight: '2.6rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {partner.name}
                      </Typography>
                      
                      <Chip
                        label={partner.type}
                        size="small"
                        color="success"
                        sx={{ mb: 2, fontSize: '0.75rem' }}
                      />
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        fontSize: '0.875rem',
                        lineHeight: 1.4,
                        minHeight: '3.5rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {partner.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mission Statement */}
      <Box sx={{ mt: 6, p: 4, backgroundColor: 'primary.50', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Our Mission
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto', fontStyle: 'italic' }}>
          "To serve the poor and promote integral human development through community-based programs that address the root causes of poverty and injustice, guided by Catholic social teaching and working in solidarity with our partners."
        </Typography>
      </Box>
    </Container>

      {/* Floating Components */}
      <BackToTopButton />
    </Box>
  );
};

export default LeadershipPage;
