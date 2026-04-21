import React, { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Groups as BeneficiariesIcon,
  EventNote as ActivityIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/admin/PageHeader';
import { apiGet, ApiError } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

interface Project {
  id: number;
  code: string | null;
  name: string;
  thematic_area: string;
  donor: string | null;
  district: string | null;
  ward: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ProjectDetailResponse {
  project: Project;
  stats: {
    beneficiaries: number;
    activity_logs: number;
  };
}

const STATUS_COLOR: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
  planning: 'info',
  active: 'primary',
  completed: 'success',
  on_hold: 'warning',
  cancelled: 'error',
};

const Field: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ mt: 0.5 }}>
      {value ?? '—'}
    </Typography>
  </Box>
);

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await apiGet<ProjectDetailResponse>(`/api/system/projects/${id}`);
      setDetail(response);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load project.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !detail) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/projects')} sx={{ mb: 2 }}>
          Back to projects
        </Button>
        <Alert severity="error">{error || 'Project not found.'}</Alert>
      </Box>
    );
  }

  const { project, stats } = detail;

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} component={RouterLink} to="/admin/projects" sx={{ mb: 1 }}>
        Back to projects
      </Button>

      <PageHeader
        title={project.name}
        subtitle={project.code ? `Project code: ${project.code}` : undefined}
        actions={
          <Chip
            label={project.status.replace('_', ' ')}
            color={STATUS_COLOR[project.status] || 'default'}
            sx={{ textTransform: 'capitalize' }}
          />
        }
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  Beneficiaries
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.beneficiaries}
                </Typography>
              </Box>
              <BeneficiariesIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
            </Stack>
            <Button
              component={RouterLink}
              to={`/admin/beneficiaries?project_id=${project.id}`}
              size="small"
              sx={{ mt: 1 }}
            >
              View beneficiaries
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  Activity logs
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.activity_logs}
                </Typography>
              </Box>
              <ActivityIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
            </Stack>
            <Button
              component={RouterLink}
              to={`/admin/activity-logs?project_id=${project.id}`}
              size="small"
              sx={{ mt: 1 }}
            >
              View activity
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Project details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Field label="Thematic area" value={project.thematic_area} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Field label="Donor" value={project.donor} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Field label="District / ward" value={[project.district, project.ward].filter(Boolean).join(' / ') || '—'} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Field label="Start date" value={project.start_date} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Field label="End date" value={project.end_date} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Field label="Last updated" value={project.updated_at} />
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Field
              label="Notes"
              value={project.notes ? <span style={{ whiteSpace: 'pre-wrap' }}>{project.notes}</span> : '—'}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProjectDetailPage;
