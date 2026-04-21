import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  TextField,
  MenuItem,
  Alert,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import {
  SECTION_BG_ALT,
  pageRoot,
  pageHero,
  pageOverline,
  pageH1,
  pageLead,
  outlineCard,
  outlineCardHover,
} from '../../lib/sitePageLayout';

const statCardSx = { ...outlineCard, ...outlineCardHover } as const;
const panelCardSx = { ...outlineCard } as const;
const listRowSx = { ...outlineCard } as const;

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [tab, setTab] = React.useState(0);
  const [error, setError] = React.useState('');

  const [overview, setOverview] = React.useState({
    projects: 0,
    beneficiaries: 0,
    soup_kitchen_logs: 0,
  });
  const [projects, setProjects] = React.useState<any[]>([]);
  const [beneficiaries, setBeneficiaries] = React.useState<any[]>([]);

  const [projectForm, setProjectForm] = React.useState({
    code: '',
    name: '',
    thematic_area: '',
    donor: '',
    district: '',
    ward: '',
    status: 'planning',
    notes: '',
  });

  const [beneficiaryForm, setBeneficiaryForm] = React.useState({
    project_id: '',
    beneficiary_type: 'individual',
    full_name: '',
    household_name: '',
    phone: '',
    district: '',
    ward: '',
    village: '',
    disability_inclusion: 'not_specified',
    vulnerability_tags: '',
    notes: '',
  });

  const authorizedFetch = React.useCallback(async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      let message = 'Request failed';
      try {
        const data = await response.json();
        message = data.message || message;
      } catch (_e) {
        // Keep default message when response is not JSON.
      }
      throw new Error(message);
    }
    return response.json();
  }, []);

  const loadData = React.useCallback(async () => {
    try {
      setError('');
      const [overviewRes, projectsRes, beneficiariesRes] = await Promise.all([
        authorizedFetch('/api/system/overview'),
        authorizedFetch('/api/system/projects'),
        authorizedFetch('/api/system/beneficiaries'),
      ]);
      setOverview(
        overviewRes.totals || {
          projects: 0,
          beneficiaries: 0,
          soup_kitchen_logs: 0,
        }
      );
      setProjects(projectsRes.projects || []);
      setBeneficiaries(beneficiariesRes.beneficiaries || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load system data');
    }
  }, [authorizedFetch]);

  React.useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const submitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authorizedFetch('/api/system/projects', {
        method: 'POST',
        body: JSON.stringify(projectForm),
      });
      setProjectForm({
        code: '',
        name: '',
        thematic_area: '',
        donor: '',
        district: '',
        ward: '',
        status: 'planning',
        notes: '',
      });
      await loadData();
    } catch (e: any) {
      setError(e.message || 'Failed to create project');
    }
  };

  const submitBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...beneficiaryForm,
        project_id: beneficiaryForm.project_id ? Number(beneficiaryForm.project_id) : null,
        vulnerability_tags: beneficiaryForm.vulnerability_tags
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
      };
      await authorizedFetch('/api/system/beneficiaries', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setBeneficiaryForm({
        project_id: '',
        beneficiary_type: 'individual',
        full_name: '',
        household_name: '',
        phone: '',
        district: '',
        ward: '',
        village: '',
        disability_inclusion: 'not_specified',
        vulnerability_tags: '',
        notes: '',
      });
      await loadData();
    } catch (e: any) {
      setError(e.message || 'Failed to create beneficiary');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ ...pageRoot, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 12 }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress color="primary" />
          <Typography color="text.secondary">Loading admin area…</Typography>
        </Stack>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <Box sx={pageRoot}>
      <Box sx={pageHero}>
        <Container maxWidth="lg">
          <Typography variant="overline" sx={{ ...pageOverline, display: 'block', mb: 1 }}>
            Operations
          </Typography>
          <Typography variant="h2" component="h1" sx={{ ...pageH1, fontSize: { xs: '1.75rem', sm: '2rem' }, mb: 1.5 }}>
            {t('admin.dashboard.title')}
          </Typography>
          <Typography variant="body1" sx={{ ...pageLead, maxWidth: 560 }}>
            Welcome back, <strong>{user?.username}</strong>. Use the registers below to record projects and beneficiaries. Data is stored in the system database.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ bgcolor: SECTION_BG_ALT, py: { xs: 4, md: 5 }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            {[
              { title: 'System projects', value: overview.projects, color: 'primary.main' },
              { title: 'Beneficiaries', value: overview.beneficiaries, color: 'info.main' },
              { title: 'Soup kitchen logs', value: overview.soup_kitchen_logs, color: 'success.main' },
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={0} sx={statCardSx}>
                  <CardContent sx={{ py: 2.5, textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, color: stat.color, lineHeight: 1.1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Card elevation={0} sx={panelCardSx}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Tabs
            value={tab}
            onChange={(_e, value) => setTab(value)}
            sx={{
              mb: 2,
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
              '& .Mui-selected': { color: 'info.main' },
              '& .MuiTabs-indicator': { bgcolor: 'info.main' },
            }}
          >
            <Tab label="Project register" />
            <Tab label="Beneficiary register" />
          </Tabs>
          <Divider sx={{ mb: 3 }} />

          {tab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                  Add project
                </Typography>
                <Box component="form" onSubmit={submitProject}>
                  <Stack spacing={2}>
                    <TextField label="Project Code" value={projectForm.code} onChange={(e) => setProjectForm({ ...projectForm, code: e.target.value })} />
                    <TextField required label="Project Name" value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} />
                    <TextField required label="Thematic Area" value={projectForm.thematic_area} onChange={(e) => setProjectForm({ ...projectForm, thematic_area: e.target.value })} />
                    <TextField label="Donor" value={projectForm.donor} onChange={(e) => setProjectForm({ ...projectForm, donor: e.target.value })} />
                    <TextField label="District" value={projectForm.district} onChange={(e) => setProjectForm({ ...projectForm, district: e.target.value })} />
                    <TextField label="Ward" value={projectForm.ward} onChange={(e) => setProjectForm({ ...projectForm, ward: e.target.value })} />
                    <TextField
                      select
                      label="Status"
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    >
                      <MenuItem value="planning">Planning</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </TextField>
                    <TextField multiline minRows={3} label="Notes" value={projectForm.notes} onChange={(e) => setProjectForm({ ...projectForm, notes: e.target.value })} />
                    <Button type="submit" variant="contained" sx={{ textTransform: 'none', fontWeight: 600, alignSelf: 'flex-start' }}>
                      Save project
                    </Button>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                  Registered projects
                </Typography>
                <Stack spacing={1.5}>
                  {projects.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No projects yet.
                    </Typography>
                  ) : (
                    projects.map((project) => (
                      <Card key={project.id} elevation={0} sx={listRowSx}>
                        <CardContent sx={{ py: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {project.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {project.code || 'No code'} | {project.thematic_area} | {project.status}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {project.district || 'N/A'} {project.ward ? `- Ward ${project.ward}` : ''}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </Stack>
              </Grid>
            </Grid>
          )}

          {tab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                  Add beneficiary
                </Typography>
                <Box component="form" onSubmit={submitBeneficiary}>
                  <Stack spacing={2}>
                    <TextField
                      select
                      label="Project"
                      value={beneficiaryForm.project_id}
                      onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, project_id: e.target.value })}
                    >
                      <MenuItem value="">Unlinked</MenuItem>
                      {projects.map((project) => (
                        <MenuItem key={project.id} value={String(project.id)}>
                          {project.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      label="Beneficiary Type"
                      value={beneficiaryForm.beneficiary_type}
                      onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, beneficiary_type: e.target.value })}
                    >
                      <MenuItem value="individual">Individual</MenuItem>
                      <MenuItem value="household">Household</MenuItem>
                    </TextField>
                    <TextField required label="Full Name" value={beneficiaryForm.full_name} onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, full_name: e.target.value })} />
                    <TextField label="Household Name" value={beneficiaryForm.household_name} onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, household_name: e.target.value })} />
                    <TextField label="Phone" value={beneficiaryForm.phone} onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, phone: e.target.value })} />
                    <TextField label="District" value={beneficiaryForm.district} onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, district: e.target.value })} />
                    <TextField label="Ward" value={beneficiaryForm.ward} onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, ward: e.target.value })} />
                    <TextField label="Village" value={beneficiaryForm.village} onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, village: e.target.value })} />
                    <TextField
                      select
                      label="Disability Inclusion"
                      value={beneficiaryForm.disability_inclusion}
                      onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, disability_inclusion: e.target.value })}
                    >
                      <MenuItem value="not_specified">Not specified</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </TextField>
                    <TextField
                      label="Vulnerability Tags (comma separated)"
                      value={beneficiaryForm.vulnerability_tags}
                      onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, vulnerability_tags: e.target.value })}
                    />
                    <TextField multiline minRows={3} label="Notes" value={beneficiaryForm.notes} onChange={(e) => setBeneficiaryForm({ ...beneficiaryForm, notes: e.target.value })} />
                    <Button type="submit" variant="contained" sx={{ textTransform: 'none', fontWeight: 600, alignSelf: 'flex-start' }}>
                      Save beneficiary
                    </Button>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
                  Beneficiary register
                </Typography>
                <Stack spacing={1.5}>
                  {beneficiaries.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No beneficiaries yet.
                    </Typography>
                  ) : (
                    beneficiaries.map((beneficiary) => (
                      <Card key={beneficiary.id} elevation={0} sx={listRowSx}>
                        <CardContent sx={{ py: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {beneficiary.full_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {beneficiary.beneficiary_type} | {beneficiary.project_name || 'No project'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {beneficiary.district || 'N/A'} {beneficiary.ward ? `- Ward ${beneficiary.ward}` : ''} {beneficiary.village ? `- ${beneficiary.village}` : ''}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </Stack>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
      </Container>
    </Box>
  );
};

export default AdminDashboard;





