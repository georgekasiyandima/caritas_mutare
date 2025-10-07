import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  useTheme,
  Chip,
} from '@mui/material';
import {
  Construction as ConstructionIcon,
  Schedule as ScheduleIcon,
  NotificationsActive as NotificationIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface WorkInProgressPageProps {
  title?: string;
  description?: string;
  expectedLaunch?: string;
  features?: string[];
  showBackButton?: boolean;
}

const WorkInProgressPage: React.FC<WorkInProgressPageProps> = ({
  title = "Coming Soon",
  description = "We're working hard to bring you something amazing!",
  expectedLaunch = "Early 2025",
  features = [
    "Interactive content",
    "Real-time updates",
    "Mobile optimization",
    "Enhanced user experience"
  ],
  showBackButton = true
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      backgroundColor: 'background.default',
      py: 8
    }}>
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative Elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
            }}
          />

          {/* Main Content */}
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 4,
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: '4px solid rgba(255,255,255,0.3)',
            }}
          >
            <ConstructionIcon sx={{ fontSize: 60 }} />
          </Avatar>

          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            {title}
          </Typography>

          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            {description}
          </Typography>

          {/* Expected Launch */}
          <Box sx={{ mb: 4 }}>
            <Chip
              icon={<ScheduleIcon />}
              label={`Expected Launch: ${expectedLaunch}`}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1rem',
                py: 2,
                px: 3,
                '& .MuiChip-icon': {
                  fontSize: '1.2rem',
                },
              }}
            />
          </Box>

          {/* Features Preview */}
          {features.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                What to Expect:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                {features.map((feature, index) => (
                  <Chip
                    key={index}
                    icon={<NotificationIcon />}
                    label={feature}
                    variant="outlined"
                    sx={{
                      borderColor: 'rgba(255,255,255,0.5)',
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& .MuiChip-icon': {
                        color: 'white',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Call to Action */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Want to be notified when this launches?
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
              onClick={() => navigate('/contact')}
            >
              Get Notified
            </Button>
          </Box>

          {/* Back Button */}
          {showBackButton && (
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                color: 'white',
                textTransform: 'none',
                opacity: 0.8,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  opacity: 1,
                },
              }}
            >
              Go Back
            </Button>
          )}
        </Paper>

        {/* Additional Info */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Questions? Contact us at{' '}
            <Typography
              component="span"
              variant="body2"
              sx={{ color: 'primary.main', fontWeight: 'bold' }}
            >
              egumbeze@caritasmutare.org
            </Typography>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default WorkInProgressPage;
