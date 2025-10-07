import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

const VolunteerPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    skills: '',
    availability: '',
    interests: '',
    message: '',
  });

  const volunteerMutation = useMutation(async (data: any) => {
    const response = await fetch('/api/volunteers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Application failed');
    }

    return response.json();
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    volunteerMutation.mutate(formData);
  };

  if (volunteerMutation.isSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              {t('volunteer.thankYou')}
            </Alert>
            <Typography variant="h6" gutterBottom>
              Thank you for your interest in volunteering with Caritas Mutare.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We will review your application and contact you soon.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
        {t('volunteer.title')}
      </Typography>

      <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>
        {t('volunteer.description')}
      </Typography>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('volunteer.fullName')}
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('volunteer.email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('volunteer.phone')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={t('volunteer.skills')}
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={t('volunteer.availability')}
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={t('volunteer.interests')}
                  name="interests"
                  value={formData.interests}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t('volunteer.message')}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            {volunteerMutation.isError && (
              <Alert severity="error" sx={{ mt: 3 }}>
                There was an error submitting your application. Please try again.
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={volunteerMutation.isLoading}
              sx={{ textTransform: 'none', py: 1.5, mt: 3 }}
            >
              {volunteerMutation.isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  {t('volunteer.processing')}
                </Box>
              ) : (
                t('volunteer.submit')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default VolunteerPage;





