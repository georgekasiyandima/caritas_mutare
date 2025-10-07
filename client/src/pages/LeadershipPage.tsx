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

interface LeadershipMember {
  id: number;
  name: string;
  position: string;
  role: string;
  description: string;
  image?: string;
  email?: string;
  phone?: string;
  category: 'director' | 'bishop' | 'partner';
}

const LeadershipPage: React.FC = () => {
  const { t } = useTranslation();

  const leadership: LeadershipMember[] = [
    {
      id: 1,
      name: "Fr. E Gumbeze",
      position: "Director",
      role: "Executive Director",
      description: "Leading Caritas Mutare with extensive experience in community development and humanitarian work. Fr. Gumbeze oversees all programs and operations, ensuring the organization's mission is carried out effectively across the diocese.",
      email: "egumbeze@caritasmutare.org",
      phone: "+263 77 467 1893",
      category: "director"
    },
    {
      id: 2,
      name: "Bishop P. Horan",
      position: "Bishop of the Diocese of Mutare",
      role: "Overall Authority",
      description: "As the Bishop of the Diocese of Mutare, Bishop P. Horan provides spiritual guidance and overall authority for Caritas Mutare. His leadership ensures the organization remains true to Catholic social teaching and serves the community with compassion and integrity.",
      category: "bishop"
    }
  ];

  const partners = [
    {
      id: 1,
      name: "Caritas Internationalis",
      description: "Global confederation of Catholic relief, development and social service organizations",
      type: "International Partner"
    },
    {
      id: 2,
      name: "Caritas Zimbabwe",
      description: "National Caritas organization coordinating humanitarian efforts across Zimbabwe",
      type: "National Partner"
    },
    {
      id: 3,
      name: "Catholic Relief Services (CRS)",
      description: "International humanitarian agency providing emergency relief and development programs",
      type: "International Partner"
    },
    {
      id: 4,
      name: "Local Community Organizations",
      description: "Various community-based organizations and groups working in the diocese",
      type: "Local Partner"
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'director':
        return <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />;
      case 'bishop':
        return <ChurchIcon sx={{ fontSize: 40, color: 'primary.main' }} />;
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
      case 'partner':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Leadership & Partners
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
          Meet the dedicated leaders and partners who guide Caritas Mutare in serving the community with compassion and excellence.
        </Typography>
      </Box>

      {/* Leadership Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          Our Leadership
        </Typography>
        
        <Grid container spacing={4}>
          {leadership.map((member) => (
            <Grid item xs={12} md={6} key={member.id}>
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
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 3 }}>
                    {member.image ? (
                      <Avatar
                        src={member.image}
                        alt={member.name}
                        sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                      />
                    ) : (
                      <Box sx={{ mb: 2 }}>
                        {getCategoryIcon(member.category)}
                      </Box>
                    )}
                  </Box>
                  
                  <Chip
                    label={member.position}
                    color={getCategoryColor(member.category) as any}
                    sx={{ mb: 2 }}
                  />
                  
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {member.name}
                  </Typography>
                  
                  <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3 }}>
                    {member.role}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {member.description}
                  </Typography>
                  
                  {member.email && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Email:</strong> {member.email}
                    </Typography>
                  )}
                  
                  {member.phone && (
                    <Typography variant="body2">
                      <strong>Phone:</strong> {member.phone}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
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
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <PartnershipIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {partner.name}
                  </Typography>
                  
                  <Chip
                    label={partner.type}
                    size="small"
                    color="success"
                    sx={{ mb: 2 }}
                  />
                  
                  <Typography variant="body2" color="text.secondary">
                    {partner.description}
                  </Typography>
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
  );
};

export default LeadershipPage;
