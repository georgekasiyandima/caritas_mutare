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
  Divider,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Favorite as HeartIcon,
  Security as SecurityIcon,
  School as SchoolIcon,
  LocalHospital as HealthIcon,
  Agriculture as AgricultureIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  PhoneAndroid as MobileIcon,
  Verified as VerifiedIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ReceiptLong as ReceiptIcon,
  LockOutlined as LockIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BackToTopButton from '../components/BackToTopButton';
import HeroBanner from '../components/HeroBanner';
import SEO from '../components/SEO';
import PartnerLogoStrip from '../components/PartnerLogoStrip';
import { generalImpactImages } from '../lib/caritasProjects';
import type { SxProps, Theme } from '@mui/material';
import {
  pageRoot,
  outlineCard,
  outlineCardHover,
} from '../lib/sitePageLayout';
import { orgContact } from '../lib/organisation';

const sideCardSx: SxProps<Theme> = [outlineCard, outlineCardHover] as SxProps<Theme>;
const impactCardSx: SxProps<Theme> = [outlineCard, outlineCardHover, { height: '100%' }] as SxProps<Theme>;

const DonatePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const heroImageSource = generalImpactImages[0];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'ZiG', name: 'Zimbabwe Gold', symbol: 'ZiG' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
  ];

  const currentSymbol = currencies.find(c => c.code === formData.currency)?.symbol ?? '$';
  const suggestedAmounts = [25, 50, 100, 250, 500, 1000];

  const impactTiers = [
    {
      icon: <RestaurantIcon sx={{ fontSize: 32 }} />,
      color: '#B7410E',
      amount: '$25',
      title: 'A shared meal',
      description: 'Helps supply ingredients and fuel for a Soup Kitchen service, feeding those who come through the door that day.',
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 32 }} />,
      color: '#2A6CC9',
      amount: '$50',
      title: 'Learning materials',
      description: 'Contributes to textbooks, exercise books and basic supplies for pre-school and vulnerable learners we support.',
    },
    {
      icon: <AgricultureIcon sx={{ fontSize: 32 }} />,
      color: '#2E7D32',
      amount: '$150',
      title: 'Seeds and tools',
      description: 'Goes toward inputs and training that help smallholder farmers — including persons with disabilities — grow resilient livelihoods.',
    },
    {
      icon: <HealthIcon sx={{ fontSize: 32 }} />,
      color: '#C2185B',
      amount: '$100',
      title: 'Reach & inclusion',
      description: 'Supports outreach, assistive aids and referrals that keep vulnerable families connected to care.',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 32 }} />,
      color: '#0D5C63',
      amount: '$250+',
      title: 'Community projects',
      description: 'Helps us co-fund community gardens, water points, training of trainers and long-term resilience work.',
    },
  ];

  const paymentMethods = [
    {
      icon: <CardIcon />,
      name: 'Card (via our team)',
      description: 'Contact us to arrange a secure card payment.',
    },
    {
      icon: <BankIcon />,
      name: 'Bank transfer',
      description: 'Direct deposit — our team will share the account details on request.',
    },
    {
      icon: <MobileIcon />,
      name: 'Mobile money',
      description: 'EcoCash, OneMoney, Telecash — supported for local donors.',
    },
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
      await new Promise(resolve => setTimeout(resolve, 1800));
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
      <Box sx={pageRoot}>
        <SEO
          title="Thank you for your gift"
          description="Your generosity helps Caritas Mutare serve the most vulnerable across the Diocese of Mutare."
          canonicalPath="/donate"
        />
        <Container maxWidth="sm" sx={{ pt: { xs: 14, md: 16 }, pb: 8 }}>
          <Card elevation={0} sx={{ ...outlineCard, textAlign: 'center', overflow: 'hidden' }}>
            <Box sx={{ bgcolor: 'rgba(46,125,50,0.08)', py: 5, px: 3 }}>
              <Avatar sx={{ bgcolor: 'success.main', width: 72, height: 72, mx: 'auto', mb: 2 }}>
                <HeartIcon sx={{ fontSize: 36 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 1 }}>
                Thank you
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your intent to give has been received.
              </Typography>
            </Box>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.75 }}>
                A member of our team will reach out shortly to confirm your preferred payment channel and send a
                receipt. If you don’t hear from us within two working days, please email{' '}
                <Box component="a" href={`mailto:${orgContact.email.primary}`} sx={{ color: 'primary.main', fontWeight: 600 }}>
                  {orgContact.email.primary}
                </Box>.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => setSubmitStatus('idle')}
                sx={{ textTransform: 'none', px: 4, py: 1.25, borderRadius: 999, fontWeight: 700 }}
              >
                Make another gift
              </Button>
            </CardContent>
          </Card>
        </Container>
        <BackToTopButton />
      </Box>
    );
  }

  return (
    <Box sx={pageRoot}>
      <SEO
        title="Support Caritas Mutare"
        description="Give to the mission of Caritas Zimbabwe Diocese of Mutare — food security, inclusion, dignity and resilience across the Diocese."
        image={heroImageSource?.src}
        canonicalPath="/donate"
      />

      {heroImageSource && (
        <HeroBanner
          image={heroImageSource.src}
          imageAlt={heroImageSource.alt}
          imagePosition={heroImageSource.objectPosition}
          size="standard"
          overlay={0.62}
          eyebrow="Give with hope"
          title={t('donate.title')}
          subtitle="Every gift — large or small — helps us accompany vulnerable families with food, inclusion and long-term hope."
          primaryCta={{
            label: 'Give now',
            onClick: () => {
              const el = document.getElementById('donate-form');
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            },
          }}
          secondaryCta={{
            label: 'Our projects',
            onClick: () => navigate('/programs'),
          }}
        />
      )}

      {/* Impact tiers */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5, maxWidth: 720, mx: 'auto' }}>
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, display: 'block', mb: 1 }}
            >
              What your gift does
            </Typography>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 2 }}
            >
              Tangible support, measured by our team
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
              These are typical examples of how contributions are deployed across our active programmes — not
              fixed product prices. We report back on actual use through our annual updates.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {impactTiers.map((tier) => (
              <Grid item xs={12} sm={6} md={4} key={tier.title}>
                <Card elevation={0} sx={impactCardSx}>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 52,
                        height: 52,
                        borderRadius: 2,
                        bgcolor: `${tier.color}14`,
                        color: tier.color,
                        mb: 2,
                      }}
                    >
                      {tier.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: '"Merriweather", Georgia, serif',
                        fontWeight: 700,
                        mb: 0.5,
                      }}
                    >
                      {tier.amount}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: tier.color, fontWeight: 700, mb: 1 }}>
                      {tier.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {tier.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Form + side column */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }} id="donate-form">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Form */}
            <Grid item xs={12} md={7}>
              <Card elevation={0} sx={{ ...outlineCard, overflow: 'hidden' }}>
                <Box sx={{ p: { xs: 3, md: 4 }, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2 }}>
                    Pledge your gift
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mt: 1, mb: 1 }}
                  >
                    Make a donation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tell us how much you’d like to give and how to reach you. A team member will confirm the payment
                    channel and issue a receipt where applicable.
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3, md: 4 } }}>
                  {/* Amount */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                    Choose an amount
                  </Typography>
                  <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                    {suggestedAmounts.map((amount) => {
                      const active = formData.amount === amount.toString();
                      return (
                        <Grid item xs={4} sm={2} key={amount}>
                          <Button
                            fullWidth
                            variant={active ? 'contained' : 'outlined'}
                            color="primary"
                            onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                            sx={{
                              textTransform: 'none',
                              py: 1.25,
                              fontWeight: 700,
                              borderRadius: 2,
                              borderWidth: 1.5,
                              '&:hover': { borderWidth: 1.5 },
                            }}
                          >
                            {currentSymbol}
                            {amount}
                          </Button>
                        </Grid>
                      );
                    })}
                  </Grid>

                  <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        label="Custom amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        type="number"
                        inputProps={{ min: 1 }}
                        required
                        variant="outlined"
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

                  <Divider sx={{ mb: 4 }} />

                  {/* Donor info */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                    Your details
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full name"
                        name="donor_name"
                        value={formData.donor_name}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email address"
                        name="donor_email"
                        type="email"
                        value={formData.donor_email}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone (optional)"
                        name="donor_phone"
                        value={formData.donor_phone}
                        onChange={handleInputChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="is_anonymous"
                            checked={formData.is_anonymous}
                            onChange={handleInputChange}
                          />
                        }
                        label="Make this donation anonymous"
                        sx={{ height: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Message (optional)"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Share why you’re supporting Caritas Mutare…"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>

                  {submitStatus === 'error' && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      There was an error processing your pledge. Please try again or email us directly.
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    color="error"
                    sx={{
                      textTransform: 'none',
                      py: 1.5,
                      mt: 1,
                      borderRadius: 999,
                      fontSize: '1.05rem',
                      fontWeight: 700,
                    }}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <HeartIcon />}
                  >
                    {isSubmitting ? 'Sending your pledge…' : `Give ${currentSymbol}${formData.amount || ''}`.trim()}
                  </Button>

                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      mt: 2.5,
                      color: 'text.secondary',
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <LockIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">Your details stay private</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <ReceiptIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">Receipts provided where applicable</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Card>
            </Grid>

            {/* Side column */}
            <Grid item xs={12} md={5}>
              <Stack spacing={3}>
                <Card elevation={0} sx={sideCardSx}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.5 }}>
                      Ways to give
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mt: 1, mb: 2 }}
                    >
                      Payment channels
                    </Typography>
                    <Stack spacing={2}>
                      {paymentMethods.map((method) => (
                        <Box key={method.name} sx={{ display: 'flex', gap: 1.75, alignItems: 'flex-start' }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, color: 'common.white' }}>
                            {method.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {method.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                              {method.description}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

                <Card elevation={0} sx={sideCardSx}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>
                        <SecurityIcon />
                      </Avatar>
                      <Typography
                        variant="h6"
                        sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}
                      >
                        Trust & transparency
                      </Typography>
                    </Box>
                    <Stack spacing={1}>
                      {[
                        'Registered with the Catholic Diocese of Mutare',
                        'Funds tracked per-project in our accounting',
                        'Annual reports shared with partners and donors',
                      ].map((line) => (
                        <Box key={line} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                          <VerifiedIcon sx={{ fontSize: 18, color: 'success.main', mt: 0.25 }} />
                          <Typography variant="body2">{line}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

                <Card elevation={0} sx={sideCardSx}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 2 }}
                    >
                      Prefer to talk?
                    </Typography>
                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <EmailIcon sx={{ color: 'primary.main' }} />
                        <Box
                          component="a"
                          href={`mailto:${orgContact.email.primary}`}
                          sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {orgContact.email.primary}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <PhoneIcon sx={{ color: 'primary.main' }} />
                        <Box
                          component="a"
                          href={`tel:${orgContact.phones.main.replace(/\s/g, '')}`}
                          sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {orgContact.phones.main}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                        <LocationIcon sx={{ color: 'primary.main', mt: 0.3 }} />
                        <Typography variant="body2" sx={{ lineHeight: 1.55 }}>
                          {orgContact.address.short}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <PartnerLogoStrip title={t('home.partnersTitle')} variant="light" />

      <BackToTopButton />
    </Box>
  );
};

export default DonatePage;
