import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Paper,
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

interface SoupLog {
  id: number;
  service_date: string;
  location: string | null;
  meals_served: number;
  beneficiary_count: number;
  volunteer_count: number;
  stock_notes: string | null;
  notes: string | null;
  created_at: string;
}

interface SoupResponse {
  data: SoupLog[];
  pagination: { page: number; pageSize: number; total: number };
  totals: { meals: number; beneficiaries: number; volunteers: number };
}

const emptyForm = {
  service_date: new Date().toISOString().slice(0, 10),
  location: '',
  meals_served: '',
  beneficiary_count: '',
  volunteer_count: '',
  stock_notes: '',
  notes: '',
};

type FormState = typeof emptyForm;

const SoupKitchenPage: React.FC = () => {
  const toast = useToast();

  const [rows, setRows] = useState<SoupLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [totals, setTotals] = useState({ meals: 0, beneficiaries: 0, volunteers: 0 });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState<SoupLog | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadRows = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGet<SoupResponse>('/api/system/soup-kitchen', {
        page: page + 1,
        pageSize,
        from: from || undefined,
        to: to || undefined,
      });
      setRows(response.data);
      setTotal(response.pagination.total);
      setTotals(response.totals);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load soup kitchen logs.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, from, to, toast]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  };

  const openEdit = (log: SoupLog) => {
    setEditingId(log.id);
    setForm({
      service_date: log.service_date,
      location: log.location || '',
      meals_served: String(log.meals_served || ''),
      beneficiary_count: String(log.beneficiary_count || ''),
      volunteer_count: String(log.volunteer_count || ''),
      stock_notes: log.stock_notes || '',
      notes: log.notes || '',
    });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.service_date) {
      toast.error('Service date is required.');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        ...form,
        meals_served: form.meals_served ? Number(form.meals_served) : 0,
        beneficiary_count: form.beneficiary_count ? Number(form.beneficiary_count) : 0,
        volunteer_count: form.volunteer_count ? Number(form.volunteer_count) : 0,
      };
      if (editingId) {
        await apiPatch(`/api/system/soup-kitchen/${editingId}`, payload);
        toast.success('Soup kitchen entry updated.');
      } else {
        await apiPost('/api/system/soup-kitchen', payload);
        toast.success('Soup kitchen entry recorded.');
      }
      setDrawerOpen(false);
      await loadRows();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to save entry.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      setDeleteLoading(true);
      await apiDelete(`/api/system/soup-kitchen/${deleting.id}`);
      toast.success('Entry deleted.');
      setDeleting(null);
      await loadRows();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to delete entry.';
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await apiDownload('/api/system/soup-kitchen/export', {
        from: from || undefined,
        to: to || undefined,
      });
      toast.success('Export downloaded.');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Export failed.';
      toast.error(message);
    }
  };

  const filtersActive = useMemo(() => Boolean(from || to), [from, to]);

  return (
    <Box>
      <PageHeader
        title="Soup Kitchen"
        subtitle="Daily service log for the soup kitchen programme. Totals update as you filter by date range."
        actions={
          <>
            <Button startIcon={<DownloadIcon />} variant="outlined" onClick={handleExport}>
              Export CSV
            </Button>
            <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}>
              New entry
            </Button>
          </>
        }
      />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Meals served', value: totals.meals },
          { label: 'Beneficiaries reached', value: totals.beneficiaries },
          { label: 'Volunteer engagements', value: totals.volunteers },
        ].map((kpi) => (
          <Grid item xs={12} sm={4} key={kpi.label}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  {kpi.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {kpi.value.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
          <TextField
            type="date"
            size="small"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={from}
            onChange={(e) => {
              setPage(0);
              setFrom(e.target.value);
            }}
          />
          <TextField
            type="date"
            size="small"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={to}
            onChange={(e) => {
              setPage(0);
              setTo(e.target.value);
            }}
          />
          {filtersActive && (
            <Button
              onClick={() => {
                setFrom('');
                setTo('');
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
          title={filtersActive ? 'No entries in that date range.' : 'No entries yet.'}
          description="Every service day should be recorded — this is what fuels our beneficiary reporting."
          actionLabel="New entry"
          onAction={openCreate}
        />
      ) : (
        <Paper variant="outlined">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="right">Meals</TableCell>
                  <TableCell align="right">Beneficiaries</TableCell>
                  <TableCell align="right">Volunteers</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((log) => (
                  <TableRow hover key={log.id}>
                    <TableCell>{log.service_date}</TableCell>
                    <TableCell>{log.location || '—'}</TableCell>
                    <TableCell align="right">{log.meals_served}</TableCell>
                    <TableCell align="right">{log.beneficiary_count}</TableCell>
                    <TableCell align="right">{log.volunteer_count}</TableCell>
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
            {editingId ? 'Edit soup kitchen entry' : 'New soup kitchen entry'}
          </Typography>
          <Stack spacing={2}>
            <TextField
              type="date"
              label="Service date"
              required
              InputLabelProps={{ shrink: true }}
              value={form.service_date}
              onChange={(e) => setForm((f) => ({ ...f, service_date: e.target.value }))}
            />
            <TextField
              label="Location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              helperText="e.g. Holy Trinity Parish, Sakubva"
            />
            <Stack direction="row" spacing={2}>
              <TextField
                type="number"
                label="Meals served"
                fullWidth
                inputProps={{ min: 0 }}
                value={form.meals_served}
                onChange={(e) => setForm((f) => ({ ...f, meals_served: e.target.value }))}
              />
              <TextField
                type="number"
                label="Beneficiary count"
                fullWidth
                inputProps={{ min: 0 }}
                value={form.beneficiary_count}
                onChange={(e) => setForm((f) => ({ ...f, beneficiary_count: e.target.value }))}
              />
              <TextField
                type="number"
                label="Volunteers"
                fullWidth
                inputProps={{ min: 0 }}
                value={form.volunteer_count}
                onChange={(e) => setForm((f) => ({ ...f, volunteer_count: e.target.value }))}
              />
            </Stack>
            <TextField
              label="Stock notes"
              multiline
              minRows={2}
              value={form.stock_notes}
              onChange={(e) => setForm((f) => ({ ...f, stock_notes: e.target.value }))}
              helperText="Ingredient levels, gaps, donations received"
            />
            <TextField
              label="General notes"
              multiline
              minRows={2}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 2 }}>
              <Button onClick={() => setDrawerOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Record entry'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete entry?"
        message={
          deleting
            ? `This will remove the soup kitchen entry for ${deleting.service_date}. The action is logged in the audit trail.`
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

export default SoupKitchenPage;
