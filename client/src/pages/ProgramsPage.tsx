import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const ProgramsPage: React.FC = () => {
  const { t } = useTranslation();

  const programs = [
    'education',
    'healthcare',
    'agriculture',
    'livelihood',
    'emergency',
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 6 }}>
        {t('programs.title')}
      </Typography>

      <Typography variant="body1" sx={{ textAlign: 'center', mb: 6, color: 'text.secondary' }}>
        {t('programs.description')}
      </Typography>

      <Grid container spacing={4}>
        {programs.map((program) => (
          <Grid item xs={12} md={6} key={program}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom color="primary">
                  {t(`programs.${program}.title`)}
                </Typography>
                <Typography variant="body1">
                  {t(`programs.${program}.description`)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProgramsPage;





