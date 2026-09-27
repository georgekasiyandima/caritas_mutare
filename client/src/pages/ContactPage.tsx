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
  Divider,
  Stack,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import {
  LocationOnOutlined as LocationIcon,
  PhoneOutlined as PhoneIcon,
  EmailOutlined as EmailIcon,
  MapOutlined as MapIcon,
  ScheduleOutlined as ScheduleIcon,
  OpenInNewOutlined as OpenInNewIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import BackToTopButton from '../components/BackToTopButton';
import HeroBanner from '../components/HeroBanner';
import SEO from '../components/SEO';
import {
  pageRoot,
  outlineCard,
  formCardHeader,
  iconBodySx,
  iconChromeSx,
  containedCtaSx,
  sectionVerticalPadding,
} from '../lib/sitePageLayout';
import { orgContact } from '../lib/organisation';
import { apiPost, ApiError } from '../lib/api';

const heroImageSource = {
  src: '/images/programs/serarp/serarp-citizen-monitoring-group.png',
  alt: 'Caritas Mutare community members gathered together in the Diocese of Mutare',
  objectPosition: 'center 35%',
};

const visitCardSx: SxProps<Theme> = [outlineCard, { mb: 3 }] as SxProps<Theme>;
const formCardSx: SxProps<Theme> = [outlineCard, { overflow: 'hidden' }] as SxProps<Theme>;
const submitSx: SxProps<Theme> = [containedCtaSx, { mt: 3 }] as SxProps<Theme>;
const infoIconSx: SxProps<Theme> = [iconBodySx, { color: 'info.main', mt: 0.25 }] as SxProps<Theme>;

const EMPTY_FORM = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

function fieldErrorsFromApi(details: unknown): Record<string, string> {
  if (!details || typeof details !== 'object' || !('errors' in details)) {
    return {};
  }
  const list = (details as { errors?: Array<{ path?: string; msg?: string }> }).errors;
  if (!Array.isArray(list)) return {};

  const mapped: Record<string, string> = {};
  list.forEach((err) => {
    if (err.path && err.msg && !mapped[err.path]) {
      mapped[err.path] = err.msg;
    }
  });
  return mapped;
}

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [honeypot, setHoneypot] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    setFieldErrors({});

    try {
      await apiPost('/api/contact', {
        ...formData,
        company_website: honeypot,
      });
      setSubmitStatus('success');
      setFormData(EMPTY_FORM);
      setHoneypot('');
    } catch (error) {
      setSubmitStatus('error');
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        setFieldErrors(fieldErrorsFromApi(error.details));
      } else {
        setErrorMessage('There was an error sending your message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const linkSx = {
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': { color: 'primary.main' },
  } as const;

  return (
    <Box sx={pageRoot}>
      <SEO
        title={t('contact.seo.title', 'Contact Caritas Mutare')}
        description={t(
          'contact.seo.description',
          'Write to Caritas Mutare at admin@caritasmutare.org or use the form. Office: Mai Maria Village, Dangamvura, Mutare.'
        )}
        image={heroImageSource.src}
        canonicalPath="/contact"
      />

      <HeroBanner
        image={heroImageSource.src}
        imageAlt={heroImageSource.alt}
        imagePosition={heroImageSource.objectPosition}
        size="standard"
        overlay={0.58}
        eyebrow={t('contact.overline', 'Get in touch')}
        title={t('contact.title')}
        subtitle={t('contact.description')}
      />

      <Container maxWidth="lg" sx={sectionVerticalPadding}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Card elevation={0} sx={visitCardSx}>
              <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: '"Merriweather", Georgia, serif',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    mb: 2.5,
                  }}
                >
                  {t('contact.visitTitle', 'Our office')}
                </Typography>

                <Stack spacing={2.5} divider={<Divider flexItem />}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <LocationIcon sx={infoIconSx} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {t('contact.address')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                        {orgContact.address.lines.map((line, idx) => (
                          <React.Fragment key={line}>
                            {line}
                            {idx < orgContact.address.lines.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <PhoneIcon sx={infoIconSx} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {t('contact.phone')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        <Box component="a" href={`tel:${orgContact.phones.main.replace(/\s/g, '')}`} sx={linkSx}>
                          {orgContact.phones.main}
                        </Box>
                        <br />
                        {t('contact.tollFree')}:{' '}
                        <Box component="a" href={`tel:${orgContact.phones.tollFree.replace(/\s/g, '')}`} sx={linkSx}>
                          {orgContact.phones.tollFree}
                        </Box>
                        <br />
                        {orgContact.phones.office}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <EmailIcon sx={infoIconSx} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {t('contact.email')}
                      </Typography>
                      <Typography
                        component="a"
                        href={`mailto:${orgContact.email.primary}`}
                        variant="body2"
                        sx={{ ...linkSx, color: 'text.secondary', display: 'block' }}
                      >
                        {orgContact.email.primary}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <ScheduleIcon sx={infoIconSx} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {t('contact.hoursTitle', 'Office hours')}
                      </Typography>
                      {orgContact.hours.map((h) => (
                        <Typography key={h.days} variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                          {h.days}: {h.time}
                        </Typography>
                      ))}
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card elevation={0} sx={outlineCard}>
              <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }} spacing={2}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <MapIcon sx={{ ...iconBodySx, color: 'info.main' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {t('contact.mapTitle', 'Office location')}
                    </Typography>
                  </Stack>
                  <Button
                    component="a"
                    href={orgContact.maps.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    endIcon={<OpenInNewIcon sx={iconChromeSx} />}
                    sx={{ textTransform: 'none', fontWeight: 700, color: 'primary.main', flexShrink: 0 }}
                  >
                    {t('contact.directions', 'Directions')}
                  </Button>
                </Stack>
                <Box
                  sx={{
                    width: '100%',
                    height: 220,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <iframe
                    src={orgContact.maps.embedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    title="Caritas Mutare · Mai Maria Village, Dangamvura"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                  {orgContact.address.short}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card elevation={0} sx={formCardSx}>
              <Box sx={formCardHeader}>
                <Typography variant="h5" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                  {t('contact.formTitle', 'Send us a message')}
                </Typography>
              </Box>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <form onSubmit={handleSubmit} noValidate style={{ position: 'relative' }}>
                  <Box
                    aria-hidden="true"
                    sx={{
                      position: 'absolute',
                      left: '-10000px',
                      width: 1,
                      height: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <TextField
                      name="company_website"
                      label="Company website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('contact.form.name')}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        error={Boolean(fieldErrors.name)}
                        helperText={fieldErrors.name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('contact.form.email')}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        error={Boolean(fieldErrors.email)}
                        helperText={fieldErrors.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={t('contact.form.subject')}
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        error={Boolean(fieldErrors.subject)}
                        helperText={fieldErrors.subject}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label={t('contact.form.message')}
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        error={Boolean(fieldErrors.message)}
                        helperText={fieldErrors.message}
                      />
                    </Grid>
                  </Grid>

                  {submitStatus === 'success' && (
                    <Alert severity="success" sx={{ mt: 3 }}>
                      {t('contact.form.thankYou')}
                    </Alert>
                  )}

                  {submitStatus === 'error' && (
                    <Alert severity="error" sx={{ mt: 3 }}>
                      {errorMessage || 'There was an error sending your message. Please try again.'}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    startIcon={!isSubmitting ? <EmailIcon /> : undefined}
                    sx={submitSx}
                  >
                    {isSubmitting ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={22} color="inherit" />
                        {t('contact.form.processing')}
                      </Box>
                    ) : (
                      t('contact.form.submit')
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <BackToTopButton />
    </Box>
  );
};

export default ContactPage;
