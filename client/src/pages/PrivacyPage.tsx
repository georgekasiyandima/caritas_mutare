import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { pageRoot, pageHero, pageOverline, pageH1, pageLead, sectionVerticalPadding } from '../lib/sitePageLayout';
import { orgContact } from '../lib/organisation';

const PrivacyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={pageRoot}>
      <SEO
        title={t('privacy.seo.title', 'Privacy')}
        description={t(
          'privacy.seo.description',
          'How Caritas Mutare uses information on this website. We do not use advertising cookies.'
        )}
        canonicalPath="/privacy"
      />

      <Box sx={pageHero}>
        <Container maxWidth="md">
          <Typography variant="overline" sx={pageOverline}>
            {t('privacy.overline', 'Your information')}
          </Typography>
          <Typography variant="h1" sx={{ ...pageH1, mb: 2 }}>
            {t('privacy.title', 'Privacy')}
          </Typography>
          <Typography sx={pageLead}>
            {t(
              'privacy.lead',
              'This site is built to serve the Diocese of Mutare, not to track visitors. Below is what we store, and why.'
            )}
          </Typography>
        </Container>
      </Box>

      <Box sx={{ ...sectionVerticalPadding, bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, fontSize: '1.35rem', mb: 1.5 }}>
            {t('privacy.cookiesTitle', 'Cookies and stored data')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75, mb: 3 }}>
            {t(
              'privacy.cookiesBody',
              'We do not use advertising, analytics, or social-media tracking cookies. The public site does not set a cookie to follow you around the web.'
            )}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75, mb: 3 }}>
            {t(
              'privacy.deviceBody',
              'Your language choice (English or Shona) is saved on this device so the site opens in the language you last used. If you sign in as staff, a sign-in token is saved on that device until you sign out. Both sit in the browser’s own storage, not in a marketing cookie.'
            )}
          </Typography>

          <Typography variant="h2" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, fontSize: '1.35rem', mb: 1.5 }}>
            {t('privacy.formsTitle', 'Contact, volunteer and donate forms')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75, mb: 3 }}>
            {t(
              'privacy.formsBody',
              'When you send a message, volunteer application, or donation pledge, we keep what you typed so the office can reply. We do not sell this information. Staff see it in the portal. Public enquiries are handled at'
            )}{' '}
            <Box component="a" href={`mailto:${orgContact.email.primary}`} sx={{ color: 'info.main' }}>
              {orgContact.email.primary}
            </Box>
            .
          </Typography>

          <Typography variant="h2" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, fontSize: '1.35rem', mb: 1.5 }}>
            {t('privacy.questionsTitle', 'Questions')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
            {t(
              'privacy.questionsBody',
              'Write to the same address if you want a record updated or removed. We will treat that as an office request, not a marketing opt-out — we are not running ads.'
            )}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default PrivacyPage;
