import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  FileDownload as DownloadIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/admin/PageHeader';
import EmptyState from '../../components/admin/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { apiDelete, apiDownload, apiGet, apiPatch, apiPost, ApiError } from '../../lib/api';
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

interface ProjectsResponse {
  data: Project[];
  pagination: { page: number; pageSize: number; total: number };
}

interface FilterOptions {
  statuses: string[];
  thematicAreas: string[];
  districts: string[];
}

const STATUS_OPTIONS = ['planning', 'active', 'completed', 'on_hold', 'cancelled'];
const STATUS_COLOR: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
  planning: 'info',
  active: 'primary',
  completed: 'success',
  on_hold: 'warning',
  cancelled: 'error',
};

const emptyForm = {
  code: '',
  name: '',
  thematic_area: '',
  donor: '',
  district: '',
  ward: '',
  status: 'planning',
  start_date: '',
  end_date: '',
  notes: '',
};

type ProjectForm = typeof emptyForm;

const ProjectsPage: React.FC = () => {
  const toast = useToast();

  const [rows, setRows] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [thematicFilter, setThematicFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ statuses: [], thematicAreas: [], districts: [] });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState<Project | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadRows = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGet<ProjectsResponse>('/api/system/projects', {
        page: page + 1,
        pageSize,
        q: q || undefined,
        status: statusFilter || undefined,
        thematic_area: thematicFilter || undefined,
        district: districtFilter || undefined,
      });
      setRows(response.data);
      setTotal(response.pagination.total);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load projects.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, q, statusFilter, thematicFilter, districtFilter, toast]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  useEffect(() => {
    (async () => {
      try {
        const options = await apiGet<FilterOptions>('/api/system/projects/filter-options');
        setFilterOptions(options);
      } catch {
        // silent — filters just won't be pre-populated
      }
    })();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      code: project.code || '',
      name: project.name,
      thematic_area: project.thematic_area || '',
      donor: project.donor || '',
      district: project.district || '',
      ward: project.ward || '',
      status: project.status || 'planning',
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      notes: project.notes || '',
    });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Project name is required.');
      return;
    }
    if (!form.thematic_area.trim()) {
      toast.error('Thematic area is required.');
      return;
    }
    try {
      setSaving(true);
      if (editingId) {
        await apiPatch(`/api/system/projects/${editingId}`, form);
        toast.success('Project updated.');
      } else {
        await apiPost('/api/system/projects', form);
        toast.success('Project created.');
      }
      setDrawerOpen(false);
      await loadRows();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to save project.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      setDeleteLoading(true);
      await apiDelete(`/api/system/projects/${deleting.id}`);
      toast.success('Project deleted.');
      setDeleting(null);
      await loadRows();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to delete project.';
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await apiDownload('/api/system/projects/export', {
        q: q || undefined,
        status: statusFilter || undefined,
        thematic_area: thematicFilter || undefined,
        district: districtFilter || undefined,
      });
      toast.success('Export downloaded.');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Export failed.';
      toast.error(message);
    }
  };

  const filtersActive = useMemo(
    () => Boolean(q || statusFilter || thematicFilter || districtFilter),
    [q, statusFilter, thematicFilter, districtFilter]
  );

  return (
    <Box>
      <PageHeader
        title="Projects"
        subtitle="Active and historical programme work. Each project can have its own beneficiaries and activity log."
        actions={
          <>
            <Button startIcon={<DownloadIcon />} variant="outlined" onClick={handleExport}>
              Export CSV
            </Button>
            <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}>
              New project
            </Button>
          </>
        }
      />

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <TextField
            size="small"
            placeholder="Search name, code, donor…"
            value={q}
            onChange={(e) => {
              setPage(0);
              setQ(e.target.value);
            }}
            InputProps={{ startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> }}
            sx={{ flexGrow: 1, minWidth: 220 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => {
                setPage(0);
                setStatusFilter(e.target.value);
              }}
            >
              <MenuItem value="">All</MenuItem>
              {(filterOptions.statuses.length ? filterOptions.statuses : STATUS_OPTIONS).map((s) => (
                <MenuItem key={s} value={s}>
                  {s.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Thematic area</InputLabel>
            <Select
              label="Thematic area"
              value={thematicFilter}
              onChange={(e) => {
                setPage(0);
                setThematicFilter(e.target.value);
              }}
            >
              <MenuItem value="">All</MenuItem>
              {filterOptions.thematicAreas.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>District</InputLabel>
            <Select
              label="District"
              value={districtFilter}
              onChange={(e) => {
                setPage(0);
                setDistrictFilter(e.target.value);
              }}
            >
              <MenuItem value="">All</MenuItem>
              {filterOptions.districts.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {filtersActive && (
            <Button
              onClick={() => {
                setQ('');
                setStatusFilter('');
                setThematicFilter('');
                setDistrictFilter('');
                setPage(0);
              }}
            >
              Clear
            </Button>
          )}
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 ? (
        <EmptyState
          title={filtersActive ? 'No projects match those filters.' : 'No projects yet.'}
          description={
            filtersActive
              ? 'Try clearing filters or adjusting your search.'
              : 'Create your first project to start tracking beneficiaries and activities against it.'
          }
          actionLabel={filtersActive ? undefined : 'Create project'}
          onAction={filtersActive ? undefined : openCreate}
        />
      ) : (
        <Paper variant="outlined">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Thematic area</TableCell>
                  <TableCell>District</TableCell>
                  <TableCell>Donor</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((project) => (
                  <TableRow hover key={project.id}>
                    <TableCell>{project.code || '—'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {project.name}
                      </Typography>
                      {project.ward && (
                        <Typography variant="caption" color="text.secondary">
                          {project.ward}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{project.thematic_area}</TableCell>
                    <TableCell>{project.district || '—'}</TableCell>
                    <TableCell>{project.donor || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={project.status.replace('_', ' ')}
                        color={STATUS_COLOR[project.status] || 'default'}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      {project.start_date || '—'}
                      {project.end_date ? ` → ${project.end_date}` : ''}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Open">
                        <IconButton size="small" component={RouterLink} to={`/admin/projects/${project.id}`}>
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(project)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => setDeleting(project)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_e, newPage) => setPage(newPage)}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </Paper>
      )}

      <Drawer anchor="right" open={drawerOpen} onClose={() => !saving && setDrawerOpen(false)}>
        <Box sx={{ width: { xs: '100vw', sm: 480 }, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editingId ? 'Edit project' : 'New project'}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Project name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Code"
                fullWidth
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <TextField
              label="Thematic area"
              required
              value={form.thematic_area}
              onChange={(e) => setForm((f) => ({ ...f, thematic_area: e.target.value }))}
              helperText="e.g. Food Security, Agriculture, Education, WASH"
            />
            <TextField
              label="Donor"
              value={form.donor}
              onChange={(e) => setForm((f) => ({ ...f, donor: e.target.value }))}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="District"
                fullWidth
                value={form.district}
                onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
              />
              <TextField
                label="Ward"
                fullWidth
                value={form.ward}
                onChange={(e) => setForm((f) => ({ ...f, ward: e.target.value }))}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                type="date"
                label="Start date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.start_date}
                onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
              />
              <TextField
                type="date"
                label="End date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.end_date}
                onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
              />
            </Stack>
            <TextField
              label="Notes"
              multiline
              minRows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 2 }}>
              <Button onClick={() => setDrawerOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create project'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete project?"
        message={
          deleting
            ? `This will permanently delete "${deleting.name}" and any linked beneficiaries or activity logs cannot be recovered. This action is logged in the audit trail.`
            : ''
        }
        confirmLabel="Delete"
        destructive
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </Box>
  );
};

export default ProjectsPage;
