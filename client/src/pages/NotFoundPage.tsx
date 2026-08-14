import { Box, Typography, Button, Stack, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        px: 3,
        gap: 2,
        bgcolor: 'background.default',
      }}
    >
      {/* Minimal brand mark */}
      <Typography
        variant="overline"
        sx={{
          color: 'primary.main',
          fontWeight: 700,
          letterSpacing: 2,
          mb: 1,
        }}
      >
        Caritas Mutare
      </Typography>

      {/* Large muted code */}
      <Typography
        variant="h1"
        component="h1"
        sx={{
          fontSize: { xs: '4.5rem', md: '6rem' },
          fontWeight: 800,
          color: 'text.disabled',
          lineHeight: 1,
          mb: 1,
        }}
      >
        404
      </Typography>

      {/* Human message */}
      <Typography
        variant="h4"
        component="div"
        sx={{
          fontFamily: '"Merriweather", Georgia, serif',
          fontWeight: 700,
          mb: 1,
        }}
      >
        We can’t find that page
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 420, mb: 3, lineHeight: 1.7 }}
      >
        The link may be broken, or the page may have been moved. Let’s get you
        back to something useful.
      </Typography>

      {/* Primary CTA */}
      <Button
        component={RouterLink}
        to="/"
        variant="contained"
        size="large"
        sx={{ fontWeight: 700, px: 4, py: 1.25, mb: 3 }}
      >
        Go to Home
      </Button>

      {/* Secondary useful links */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        divider={
          <Box
            sx={{
              width: { sm: '1px' },
              height: { sm: 16 },
              bgcolor: 'divider',
              display: { xs: 'none', sm: 'block' },
            }}
          />
        }
        alignItems="center"
      >
        <MuiLink
          component={RouterLink}
          to="/programs"
          underline="hover"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          Programs
        </MuiLink>
        <MuiLink
          component={RouterLink}
          to="/donate"
          underline="hover"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          Donate
        </MuiLink>
        <MuiLink
          component={RouterLink}
          to="/contact"
          underline="hover"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          Contact
        </MuiLink>
      </Stack>
    </Box>
  );
}