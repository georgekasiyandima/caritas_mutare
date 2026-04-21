import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  FolderSpecial as ProjectsIcon,
  Groups as BeneficiariesIcon,
  EventNote as ActivityIcon,
  RestaurantMenu as SoupKitchenIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/admin/PageHeader';
import { apiGet, ApiError } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface OverviewResponse {
  totals: {
    projects: number;
    beneficiaries: number;
    soup_kitchen_logs: number;
    activity_logs: number;
  };
  breakdowns: {
    projects_by_status: Array<{ status: string; count: number }>;
    beneficiaries_by_gender: Array<{ gender: string; count: number }>;
    beneficiaries_by_disability: Array<{ disability_inclusion: string; count: number }>;
  };
  recent_projects: Array<{
    id: number;
    name: string;
    status: string;
    thematic_area: string;
    district: string | null;
    updated_at: string;
  }>;
}

const KPI_CARDS: Array<{
  key: keyof OverviewResponse['totals'];
  label: string;
  icon: React.ReactNode;
  to: string;
  color: string;
}> = [
  { key: 'projects', label: 'Projects', icon: <ProjectsIcon />, to: '/admin/projects', color: '#7D0000' },
  { key: 'beneficiaries', label: 'Beneficiaries', icon: <BeneficiariesIcon />, to: '/admin/beneficiaries', color: '#0d5c63' },
  { key: 'activity_logs', label: 'Activity Logs', icon: <ActivityIcon />, to: '/admin/activity-logs', color: '#b36b00' },
  { key: 'soup_kitchen_logs', label: 'Soup Kitchen Entries', icon: <SoupKitchenIcon />, to: '/admin/soup-kitchen', color: '#3d6b4a' },
];

const STATUS_COLORS: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
  planning: 'info',
  active: 'primary',
  completed: 'success',
  on_hold: 'warning',
  cancelled: 'error',
};

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await apiGet<OverviewResponse>('/api/system/overview');
        if (!cancelled) setOverview(data);
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof ApiError ? err.message : 'Unable to load dashboard.';
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box>
      <PageHeader
        title={`Welcome back${user ? `, ${user.username}` : ''}.`}
        subtitle="Today's operational snapshot across programmes, beneficiaries, and service delivery."
        actions={
          <>
            <Button component={RouterLink} to="/admin/projects" variant="outlined">
              Manage projects
            </Button>
            <Button component={RouterLink} to="/admin/beneficiaries" variant="contained">
              Register beneficiary
            </Button>
          </>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : overview ? (
        <>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {KPI_CARDS.map((card) => (
              <Grid item xs={12} sm={6} md={3} key={card.key}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardActionArea component={RouterLink} to={card.to} sx={{ height: '100%' }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            bgcolor: card.color,
                            color: 'common.white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {card.icon}
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
                            {card.label}
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                            {overview.totals[card.key].toLocaleString()}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h6">Recent projects</Typography>
                  <Button
                    component={RouterLink}
                    to="/admin/projects"
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                  >
                    View all
                  </Button>
                </Stack>
                {overview.recent_projects.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No projects yet — create your first one from the Projects tab.
                  </Typography>
                ) : (
                  <Stack spacing={1.5} divider={<Divider flexItem />}>
                    {overview.recent_projects.map((project) => (
                      <Stack
                        key={project.id}
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle2" noWrap>
                            {project.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {project.thematic_area || 'No thematic area'}
                            {project.district ? ` • ${project.district}` : ''}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={project.status.replace('_', ' ')}
                          color={STATUS_COLORS[project.status] || 'default'}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Projects by status
                </Typography>
                {overview.breakdowns.projects_by_status.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No projects yet.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {overview.breakdowns.projects_by_status.map((row) => (
                      <Stack key={row.status} direction="row" justifyContent="space-between" alignItems="center">
                        <Chip
                          size="small"
                          label={row.status.replace('_', ' ')}
                          color={STATUS_COLORS[row.status] || 'default'}
                          sx={{ textTransform: 'capitalize' }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.count}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Paper>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Beneficiaries by gender
                </Typography>
                {overview.breakdowns.beneficiaries_by_gender.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No beneficiaries registered yet.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {overview.breakdowns.beneficiaries_by_gender.map((row) => (
                      <Stack key={row.gender || 'unspecified'} direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {(row.gender || 'unspecified').replace('_', ' ')}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.count}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : null}
    </Box>
  );
};

export default DashboardHome;
