import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
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
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileDownload as DownloadIcon,
} from '@mui/icons-material';
import PageHeader from '../../components/admin/PageHeader';
import EmptyState from '../../components/admin/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { apiDelete, apiDownload, apiGet, apiPatch, apiPost, ApiError } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

interface ActivityLog {
  id: number;
  project_id: number;
  project_name?: string | null;
  activity_date: string;
  activity_title: string;
  output_count: number | null;
  notes: string | null;
  created_at: string;
}

interface ActivityResponse {
  data: ActivityLog[];
  pagination: { page: number; pageSize: number; total: number };
}

interface ProjectOption {
  id: number;
  name: string;
}

const emptyForm = {
  project_id: '',
  activity_date: new Date().toISOString().slice(0, 10),
  activity_title: '',
  output_count: '',
  notes: '',
};

type FormState = typeof emptyForm;

const ActivityLogsPage: React.FC = () => {
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const [rows, setRows] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const [projectFilter, setProjectFilter] = useState(searchParams.get('project_id') || '');
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState<ActivityLog | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadRows = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGet<ActivityResponse>('/api/system/activity-logs', {
        page: page + 1,
        pageSize,
        project_id: projectFilter || undefined,
      });
      setRows(response.data);
      setTotal(response.pagination.total);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load activity logs.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, projectFilter, toast]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  useEffect(() => {
    (async () => {
      try {
        const response = await apiGet<{ data: ProjectOption[] }>('/api/system/projects', { pageSize: 200 });
        setProjectOptions(response.data.map((p) => ({ id: p.id, name: p.name })));
      } catch {
        // no-op
      }
    })();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, project_id: projectFilter });
    setDrawerOpen(true);
  };

  const openEdit = (log: ActivityLog) => {
    setEditingId(log.id);
    setForm({
      project_id: String(log.project_id),
      activity_date: log.activity_date,
      activity_title: log.activity_title,
      output_count: log.output_count != null ? String(log.output_count) : '',
      notes: log.notes || '',
    });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.project_id) {
      toast.error('Choose a project.');
      return;
    }
    if (!form.activity_title.trim()) {
      toast.error('Activity title is required.');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        ...form,
        project_id: Number(form.project_id),
        output_count: form.output_count ? Number(form.output_count) : 0,
      };
      if (editingId) {
        await apiPatch(`/api/system/activity-logs/${editingId}`, payload);
        toast.success('Activity updated.');
      } else {
        await apiPost('/api/system/activity-logs', payload);
        toast.success('Activity recorded.');
      }
      setDrawerOpen(false);
      await loadRows();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to save activity.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      setDeleteLoading(true);
      await apiDelete(`/api/system/activity-logs/${deleting.id}`);
      toast.success('Activity deleted.');
      setDeleting(null);
      await loadRows();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to delete activity.';
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await apiDownload('/api/system/activity-logs/export', {
        project_id: projectFilter || undefined,
      });
      toast.success('Export downloaded.');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Export failed.';
      toast.error(message);
    }
  };

  const filtersActive = useMemo(() => Boolean(projectFilter), [projectFilter]);

  return (
    <Box>
      <PageHeader
        title="Activity Logs"
        subtitle="Day-to-day record of what the team actually delivered. These feed into donor reports."
        actions={
          <>
            <Button startIcon={<DownloadIcon />} variant="outlined" onClick={handleExport}>
              Export CSV
            </Button>
            <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}>
              Log activity
            </Button>
          </>
        }
      />

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 240 }}>
            <InputLabel>Project</InputLabel>
            <Select
              label="Project"
              value={projectFilter}
              onChange={(e) => {
                setPage(0);
                setProjectFilter(e.target.value);
              }}
            >
              <MenuItem value="">All projects</MenuItem>
              {projectOptions.map((p) => (
                <MenuItem key={p.id} value={String(p.id)}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {filtersActive && <Button onClick={() => setProjectFilter('')}>Clear</Button>}
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 ? (
        <EmptyState
          title={filtersActive ? 'No activities for that project yet.' : 'No activities logged yet.'}
          description="Capture field work, trainings, distributions, and monitoring visits — these become the proof points for donors."
          actionLabel="Log activity"
          onAction={openCreate}
        />
      ) : (
        <Paper variant="outlined">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Activity</TableCell>
                  <TableCell align="right">Output</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((log) => (
                  <TableRow hover key={log.id}>
                    <TableCell>{log.activity_date}</TableCell>
                    <TableCell>{log.project_name || '—'}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{log.activity_title}</TableCell>
                    <TableCell align="right">{log.output_count ?? 0}</TableCell>
                    <TableCell sx={{ maxWidth: 320 }}>
                      <Typography variant="body2" noWrap title={log.notes || undefined}>
                        {log.notes || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(log)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => setDeleting(log)}>
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
            {editingId ? 'Edit activity' : 'Log activity'}
          </Typography>
          <Stack spacing={2}>
            <FormControl required>
              <InputLabel>Project</InputLabel>
              <Select
                label="Project"
                value={form.project_id}
                onChange={(e) => setForm((f) => ({ ...f, project_id: e.target.value }))}
              >
                <MenuItem value="" disabled>
                  Select a project…
                </MenuItem>
                {projectOptions.map((p) => (
                  <MenuItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="date"
              label="Activity date"
              InputLabelProps={{ shrink: true }}
              value={form.activity_date}
              onChange={(e) => setForm((f) => ({ ...f, activity_date: e.target.value }))}
            />

            <TextField
              label="Activity title"
              required
              value={form.activity_title}
              onChange={(e) => setForm((f) => ({ ...f, activity_title: e.target.value }))}
              helperText="e.g. Seed distribution — ward 12"
            />

            <TextField
              type="number"
              label="Output (count)"
              helperText="Quantifiable output, e.g. number of farmers reached, kits distributed"
              inputProps={{ min: 0 }}
              value={form.output_count}
              onChange={(e) => setForm((f) => ({ ...f, output_count: e.target.value }))}
            />

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
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Log activity'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete activity?"
        message={
          deleting
            ? `This will remove "${deleting.activity_title}" from ${deleting.activity_date}. The action is logged in the audit trail.`
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

export default ActivityLogsPage;
