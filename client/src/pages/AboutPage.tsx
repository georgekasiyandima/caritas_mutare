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
} from '@mui/material';

const AboutPage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Box
        sx={(theme) => ({
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        })}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            About Caritas Mutare
          </Typography>
          <Typography
            variant="h6"
            sx={{ maxWidth: 720, mx: 'auto', opacity: 0.9 }}
          >
            Rooted in Catholic social teaching, Caritas Mutare accompanies vulnerable communities towards dignity,
            resilience and sustainable livelihoods across the Diocese of Mutare.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom color="primary">
                Vision
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                “God loving communities that are empowered in sustainable livelihoods and living with dignity”.
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ height: { xs: 16, md: 24 } }} />

          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom color="primary">
                Mission
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                Guided by the Social Teachings of the Roman Catholic Church, Caritas Zimbabwe Diocese of Mutare thrives
                “to promote food security, social protection, environmental management, water and sanitation for the
                vulnerable men, women, boys and girls in a sustainable manner within the Diocese of Mutare”.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom color="primary">
                Values
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Catholic Church’s social teachings are the basic foundation of our organization. At the heart of the
                Catholic social tradition are the following values which guide us:
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

          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom color="primary">
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

      <Box sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom color="primary">
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

            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom color="primary">
                  Technical partners and sister organizations
                </Typography>
                <List dense>
                  {[
                    'Caritas Zimbabwe National Office',
                    'Youth Alive Zimbabwe (YAZIM)',
                    'Fambidzanayi Permaculture',
                    'Women and Land in Zimbabwe',
                    'Zimbabwe Women Lawyers Association (ZWLA)',
                    'Federation of Organizations of Disabled People in Zimbabwe (FODPZ)',
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
            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom color="primary">
                  Caritas Mutare management and staffing
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                  Caritas Mutare, led by Fr. Ernest Gumbeze as Development Coordinator, has a structured team to drive
                  its mission. Sister Angeline oversees the organization’s own projects, providing strategic direction
                  and guidance. The Programs Manager oversees all organizational projects, ensuring effective
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

            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom color="primary">
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
      </Box>
    </Container>
    </Box>
  );
};

export default AboutPage;





