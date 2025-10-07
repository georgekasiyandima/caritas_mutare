import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

const DonatePage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    message: '',
    is_anonymous: false,
  });

  const donationMutation = useMutation(async (data: any) => {
    const response = await fetch('/api/donations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Donation failed');
    }

    return response.json();
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    donationMutation.mutate(formData);
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'ZWL', name: 'Zimbabwe Dollar' },
    { code: 'ZAR', name: 'South African Rand' },
  ];

  const suggestedAmounts = [25, 50, 100, 250, 500];

  if (donationMutation.isSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              {t('donate.thankYou')}
            </Alert>
            <Typography variant="h6" gutterBottom>
              Your donation of {formData.currency} {formData.amount} has been processed successfully.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Thank you for supporting Caritas Mutare's mission to serve the community.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
        {t('donate.title')}
      </Typography>

      <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>
        {t('donate.description')}
      </Typography>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            {/* Donation Amount */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {t('donate.amount')}
              </Typography>
              
              {/* Suggested amounts */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                {suggestedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={formData.amount === amount.toString() ? 'contained' : 'outlined'}
                    onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                    sx={{ textTransform: 'none' }}
                  >
                    {formData.currency} {amount}
                  </Button>
                ))}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Custom Amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    type="number"
                    inputProps={{ min: 1 }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>{t('donate.currency')}</InputLabel>
                    <Select
                      name="currency"
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      label={t('donate.currency')}
                    >
                      {currencies.map((currency) => (
                        <MenuItem key={currency.code} value={currency.code}>
                          {currency.name} ({currency.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Donor Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {t('donate.donorInfo')}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('donate.name')}
                    name="donor_name"
                    value={formData.donor_name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('donate.email')}
                    name="donor_email"
                    type="email"
                    value={formData.donor_email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('donate.phone')}
                    name="donor_phone"
                    value={formData.donor_phone}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label={t('donate.message')}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>

              <FormControlLabel
                control={
                  <Checkbox
                    name="is_anonymous"
                    checked={formData.is_anonymous}
                    onChange={handleInputChange}
                  />
                }
                label={t('donate.anonymous')}
                sx={{ mt: 2 }}
              />
            </Box>

            {donationMutation.isError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                There was an error processing your donation. Please try again.
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={donationMutation.isLoading}
              sx={{ textTransform: 'none', py: 1.5 }}
            >
              {donationMutation.isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  {t('donate.processing')}
                </Box>
              ) : (
                t('donate.submit')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DonatePage;





