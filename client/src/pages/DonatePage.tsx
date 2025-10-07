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
  Chip,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Favorite as HeartIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
  Public as PublicIcon,
  School as SchoolIcon,
  LocalHospital as HealthIcon,
  Agriculture as AgricultureIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  Payment as PaymentIcon,
  Verified as VerifiedIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import BackToTopButton from '../components/BackToTopButton.tsx';
import ReturnHomeButton from '../components/ReturnHomeButton.tsx';

const DonatePage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    message: '',
    is_anonymous: false,
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'ZWL', name: 'Zimbabwe Dollar', symbol: 'Z$' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
  ];

  const suggestedAmounts = [25, 50, 100, 250, 500, 1000];

  const donationImpact = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      amount: '$50',
      impact: 'Educational Materials',
      description: 'Provide textbooks and school supplies for 5 children'
    },
    {
      icon: <HealthIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      amount: '$100',
      impact: 'Healthcare Support',
      description: 'Cover medical expenses for 3 families for a month'
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      amount: '$75',
      impact: 'Soup Kitchen',
      description: 'Provide nutritious meals for 25 people'
    },
    {
      icon: <AgricultureIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      amount: '$150',
      impact: 'Agricultural Support',
      description: 'Fund seeds and tools for sustainable farming'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      amount: '$200',
      impact: 'Community Development',
      description: 'Support community workshops and training programs'
    }
  ];

  const paymentMethods = [
    {
      icon: <CardIcon sx={{ fontSize: 30 }} />,
      name: 'Credit/Debit Card',
      description: 'Secure online payment',
      popular: true
    },
    {
      icon: <BankIcon sx={{ fontSize: 30 }} />,
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      popular: false
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 30 }} />,
      name: 'Mobile Money',
      description: 'EcoCash, OneMoney, Telecash',
      popular: false
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // In a real implementation, you would send this to your backend
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      setSubmitStatus('success');
      setFormData({
        amount: '',
        currency: 'USD',
        donor_name: '',
        donor_email: '',
        donor_phone: '',
        message: '',
        is_anonymous: false,
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Card elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                color: 'white',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', width: 80, height: 80, mx: 'auto', mb: 3 }}>
                <HeartIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Thank You for Your Generous Donation!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Your support makes a real difference in our community
              </Typography>
            </Box>
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
                Your donation has been received successfully. You will receive a confirmation email with your donation receipt within the next few minutes.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Your generosity helps us continue our mission to serve the most vulnerable in our community. Together, we can make a lasting impact.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => setSubmitStatus('idle')}
                sx={{
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Make Another Donation
              </Button>
            </CardContent>
          </Card>
        </Container>
        <BackToTopButton />
        <ReturnHomeButton variant="compact" position="top-left" />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 8,
          pt: 16, // Prevent navbar overlap
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 3, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              {t('donate.title')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                maxWidth: 600,
                mx: 'auto',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              Your generosity transforms lives and builds hope in our community. Every donation, no matter the size, makes a meaningful difference.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          {/* Donation Form */}
          <Grid item xs={12} md={8}>
            <Card elevation={4} sx={{
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white',
                  p: 3,
                  textAlign: 'center',
                }}
              >
                <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                  <HeartIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Make a Donation
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Secure and tax-deductible donations
                </Typography>
              </Box>
              <CardContent sx={{ p: 4 }}>
                <form onSubmit={handleSubmit}>
                  {/* Donation Amount */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                      Choose Your Donation Amount
                    </Typography>
                    
                    {/* Suggested amounts */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      {suggestedAmounts.map((amount) => (
                        <Grid item xs={6} sm={4} key={amount}>
                          <Button
                            fullWidth
                            variant={formData.amount === amount.toString() ? 'contained' : 'outlined'}
                            onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                            sx={{ 
                              textTransform: 'none',
                              py: 1.5,
                              fontSize: '1rem',
                              fontWeight: 600,
                              borderRadius: 2,
                            }}
                          >
                            {currencies.find(c => c.code === formData.currency)?.symbol}{amount}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>

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
                          variant="outlined"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <InputLabel>Currency</InputLabel>
                          <Select
                            name="currency"
                            value={formData.currency}
                            onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                            label="Currency"
                            sx={{ borderRadius: 2 }}
                          >
                            {currencies.map((currency) => (
                              <MenuItem key={currency.code} value={currency.code}>
                                {currency.symbol} {currency.code}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider sx={{ my: 4 }} />

                  {/* Donor Information */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                      Donor Information
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="donor_name"
                          value={formData.donor_name}
                          onChange={handleInputChange}
                          required
                          variant="outlined"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="donor_email"
                          type="email"
                          value={formData.donor_email}
                          onChange={handleInputChange}
                          variant="outlined"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="donor_phone"
                          value={formData.donor_phone}
                          onChange={handleInputChange}
                          variant="outlined"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Message (Optional)"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Share why you're supporting Caritas Mutare..."
                          variant="outlined"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                    </Grid>

                    <FormControlLabel
                      control={
                        <Checkbox
                          name="is_anonymous"
                          checked={formData.is_anonymous}
                          onChange={handleInputChange}
                          sx={{ color: 'primary.main' }}
                        />
                      }
                      label="Make this donation anonymous"
                      sx={{ mt: 2 }}
                    />
                  </Box>

                  <Divider sx={{ my: 4 }} />

                  {/* Payment Methods */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                      Payment Method
                    </Typography>
                    <Grid container spacing={2}>
                      {paymentMethods.map((method, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                          <Card
                            sx={{
                              p: 2,
                              textAlign: 'center',
                              cursor: 'pointer',
                              border: '2px solid',
                              borderColor: 'grey.300',
                              '&:hover': {
                                borderColor: 'primary.main',
                                backgroundColor: 'primary.50',
                              },
                              transition: 'all 0.2s',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                              {method.icon}
                              {method.popular && (
                                <Chip
                                  label="Popular"
                                  size="small"
                                  color="primary"
                                  sx={{ ml: 1, fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {method.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {method.description}
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {submitStatus === 'error' && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                      There was an error processing your donation. Please try again.
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                      textTransform: 'none',
                      py: 2,
                      mt: 3,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isSubmitting ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={24} color="inherit" />
                        <Typography variant="body1">
                          Processing Donation...
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HeartIcon />
                        Donate Now
                      </Box>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Impact Information */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Your Impact */}
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                    Your Donation Impact
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {donationImpact.map((impact, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {impact.icon}
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {impact.amount} - {impact.impact}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {impact.description}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Security & Trust */}
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar sx={{ backgroundColor: 'success.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                    <SecurityIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Secure & Trusted
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                      <VerifiedIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="body2">SSL Encrypted</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                      <VerifiedIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="body2">Tax Deductible</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                      <VerifiedIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="body2">Receipt Provided</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                    Questions About Donating?
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ backgroundColor: 'primary.main', width: 40, height: 40 }}>
                        <EmailIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Email Us
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          egumbeze@caritasmutare.org
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ backgroundColor: 'success.main', width: 40, height: 40 }}>
                        <PhoneIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Call Us
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          +263 77 467 1893
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ backgroundColor: 'info.main', width: 40, height: 40 }}>
                        <LocationIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Visit Us
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Cnr Jason Moyo and Herbert Chitepo, Mutare
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Floating Components */}
      <BackToTopButton />
      <ReturnHomeButton variant="compact" position="top-left" />
    </Box>
  );
};

export default DonatePage;





