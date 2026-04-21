import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import {
  Construction as ConstructionIcon,
  Schedule as ScheduleIcon,
  NotificationsActive as NotificationIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  pageRoot,
  pageHero,
  pageOverline,
  pageH1,
  pageLead,
  outlineCard,
  outlineCardHover,
  SECTION_BG_ALT,
} from '../lib/sitePageLayout';

interface WorkInProgressPageProps {
  title?: string;
  description?: string;
  expectedLaunch?: string;
  features?: string[];
  showBackButton?: boolean;
}

const WorkInProgressPage: React.FC<WorkInProgressPageProps> = ({
  title = 'Coming Soon',
  description = "We're working hard to bring you something amazing!",
  expectedLaunch = 'Early 2025',
  features = [
    'Interactive content',
    'Real-time updates',
    'Mobile optimization',
    'Enhanced user experience',
  ],
  showBackButton = true,
}) => {
  const navigate = useNavigate();
  const cardSx = { ...outlineCard, ...outlineCardHover };

  return (
    <Box sx={pageRoot}>
      <Box sx={pageHero}>
        <Container maxWidth="md">
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Typography variant="overline" sx={{ ...pageOverline, display: 'block' }}>
              In progress
            </Typography>
            <Typography variant="h2" component="h1" sx={{ ...pageH1, fontSize: { xs: '1.75rem', sm: '2rem' } }}>
              {title}
            </Typography>
            <Typography variant="body1" sx={{ ...pageLead, maxWidth: 560 }}>
              {description}
            </Typography>
            <Chip
              icon={<ScheduleIcon />}
              label={`Expected: ${expectedLaunch}`}
              size="small"
              sx={{
                bgcolor: 'rgba(13, 92, 99, 0.08)',
                color: 'info.dark',
                fontWeight: 600,
                '& .MuiChip-icon': { color: 'info.dark' },
              }}
            />
          </Stack>
        </Container>
      </Box>

      <Box sx={{ bgcolor: SECTION_BG_ALT, py: { xs: 5, md: 7 } }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ ...cardSx, p: { xs: 3, md: 4 } }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                mx: 'auto',
                mb: 3,
                bgcolor: 'rgba(13, 92, 99, 0.1)',
                color: 'info.dark',
              }}
            >
              <ConstructionIcon sx={{ fontSize: 36 }} />
            </Avatar>

            {features.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
                  Planned highlights
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                  {features.map((feature, index) => (
                    <Chip
                      key={index}
                      icon={<NotificationIcon sx={{ fontSize: '1rem !important', color: 'info.dark !important' }} />}
                      label={feature}
                      variant="outlined"
                      sx={{ borderColor: 'divider', bgcolor: 'background.paper' }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
              Want to be notified when this page launches?
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <Button variant="contained" color="primary" size="large" sx={{ px: 4, fontWeight: 600 }} onClick={() => navigate('/contact')}>
                Contact us
              </Button>
              {showBackButton && (
                <Button variant="text" color="info" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ fontWeight: 600 }}>
                  Go back
                </Button>
              )}
            </Box>
          </Paper>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Questions? Email{' '}
              <Typography component="span" variant="body2" sx={{ color: 'info.dark', fontWeight: 600 }}>
                egumbeze@caritasmutare.org
              </Typography>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default WorkInProgressPage;
