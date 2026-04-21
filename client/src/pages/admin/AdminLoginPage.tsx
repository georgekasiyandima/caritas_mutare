import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Box,
  CircularProgress,
  Stack,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  pageRoot,
  pageHero,
  pageOverline,
  pageH1,
  pageLead,
  outlineCard,
  formCardHeader,
} from '../../lib/sitePageLayout';

interface LocationState {
  from?: string;
}

const AdminLoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const state = (location.state as LocationState | null) || null;
  const redirectTo = state?.from && state.from.startsWith('/admin') && state.from !== '/admin/login'
    ? state.from
    : '/admin';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      if (result.ok) {
        navigate(redirectTo, { replace: true });
      } else {
        setError(result.message || t('admin.login.invalidCredentials'));
      }
    } catch (_err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={pageRoot}>
      <Box sx={pageHero}>
        <Container maxWidth="sm">
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Chip
              label="Staff access"
              size="small"
              sx={{
                bgcolor: 'rgba(13, 92, 99, 0.08)',
                color: 'info.dark',
                fontWeight: 600,
                borderRadius: 1,
              }}
            />
            <Typography variant="overline" sx={{ ...pageOverline, display: 'block' }}>
              Caritas Mutare
            </Typography>
            <Typography variant="h2" component="h1" sx={{ ...pageH1, fontSize: { xs: '1.75rem', sm: '2rem' } }}>
              {t('admin.login.title')}
            </Typography>
            <Typography variant="body2" sx={{ ...pageLead, fontSize: '0.95rem' }}>
              Sign in with your administrator credentials. Sessions are secured with a signed token.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ py: { xs: 5, md: 7 } }}>
        <Card elevation={0} sx={{ ...outlineCard, overflow: 'hidden' }}>
          <Box sx={formCardHeader}>
            <Typography variant="subtitle1" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
              Credentials
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Use the username and password issued by your organisation.
            </Typography>
          </Box>
          <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('admin.login.username')}
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              margin="normal"
              required
              autoFocus
            />

            <TextField
              fullWidth
              label={t('admin.login.password')}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isLoading}
              sx={{ textTransform: 'none', py: 1.5, mt: 3, fontWeight: 600 }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Logging in...
                </Box>
              ) : (
                t('admin.login.login')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      </Container>
    </Box>
  );
};

export default AdminLoginPage;





