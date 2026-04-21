import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Drawer,
  FormControl,
  FormControlLabel,
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
} from '@mui/icons-material';
import PageHeader from '../../components/admin/PageHeader';
import EmptyState from '../../components/admin/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { apiDelete, apiDownload, apiGet, apiPatch, apiPost, ApiError } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

interface Beneficiary {
  id: number;
  project_id: number | null;
  project_name?: string | null;
  beneficiary_type: string;
  full_name: string | null;
  household_name: string | null;
  phone: string | null;
  district: string | null;
  ward: string | null;
  village: string | null;
  gender: string;
  age_group: string;
  date_of_birth: string | null;
  household_size: number | null;
  consent_collected: number | boolean;
  disability_inclusion: string;
  vulnerability_tags: string[];
  registered_on: string | null;
  notes: string | null;
  created_at: string;
}

interface BeneficiariesResponse {
  data: Beneficiary[];
  pagination: { page: number; pageSize: number; total: number };
}

interface ProjectOption {
  id: number;
  name: string;
}

const GENDER_OPTIONS = ['female', 'male', 'other', 'unspecified'];
const AGE_GROUPS = ['under_5', '5_12', '13_17', '18_35', '36_59', '60_plus', 'unspecified'];
const DISABILITY_OPTIONS = ['none', 'physical', 'sensory', 'intellectual', 'psychosocial', 'not_specified'];
const TYPE_OPTIONS = ['individual', 'household'];

const emptyForm = {
  project_id: '',
  beneficiary_type: 'individual',
  full_name: '',
  household_name: '',
  phone: '',
  district: '',
  ward: '',
  village: '',
  gender: 'unspecified',
  age_group: 'unspecified',
  date_of_birth: '',
  household_size: '',
  consent_collected: false,
  disability_inclusion: 'not_specified',
  vulnerability_tags: '',
  registered_on: '',
  notes: '',
};

type BeneficiaryForm = typeof emptyForm;

function formatLabel(value: string | null | undefined) {
  if (!value) return '—';
  return value.replace(/_/g, ' ');
}

const BeneficiariesPage: React.FC = () => {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rows, setRows] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const [q, setQ] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [disabilityFilter, setDisabilityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>(searchParams.get('project_id') || '');

  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BeneficiaryForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState<Beneficiary | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadRows = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGet<BeneficiariesResponse>('/api/system/beneficiaries', {
        page: page + 1,
        pageSize,
        q: q || undefined,
        gender: genderFilter || undefined,
        disability_inclusion: disabilityFilter || undefined,
        project_id: projectFilter || undefined,
      });
      setRows(response.data);
      setTotal(response.pagination.total);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load beneficiaries.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, q, genderFilter, disabilityFilter, projectFilter, toast]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  useEffect(() => {
    (async () => {
      try {
        const response = await apiGet<{ data: ProjectOption[] }>('/api/system/projects', {
          pageSize: 200,
        });
        setProjectOptions(response.data.map((p) => ({ id: p.id, name: p.name })));
      } catch {
        // ignore — select will just be empty
      }
    })();
  }, []);

  useEffect(() => {
    if (projectFilter) {
      setSearchParams({ project_id: projectFilter });
    } else if (searchParams.has('project_id')) {
      setSearchParams({});
    }
  }, [projectFilter, setSearchParams, searchParams]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, project_id: projectFilter });
    setDrawerOpen(true);
  };

  const openEdit = (beneficiary: Beneficiary) => {
    setEditingId(beneficiary.id);
    setForm({
      project_id: beneficiary.project_id ? String(beneficiary.project_id) : '',
      beneficiary_type: beneficiary.beneficiary_type || 'individual',
      full_name: beneficiary.full_name || '',
      household_name: beneficiary.household_name || '',
      phone: beneficiary.phone || '',
      district: beneficiary.district || '',
      ward: beneficiary.ward || '',
      village: beneficiary.village || '',
      gender: beneficiary.gender || 'unspecified',
      age_group: beneficiary.age_group || 'unspecified',
      date_of_birth: beneficiary.date_of_birth || '',
      household_size: beneficiary.household_size != null ? String(beneficiary.household_size) : '',
      consent_collected: Boolean(beneficiary.consent_collected),
      disability_inclusion: beneficiary.disability_inclusion || 'not_specified',
      vulnerability_tags: Array.isArray(beneficiary.vulnerability_tags)
        ? beneficiary.vulnerability_tags.join(', ')
        : '',
      registered_on: beneficiary.registered_on || '',
      notes: beneficiary.notes || '',
    });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.full_name.trim() && form.beneficiary_type === 'individual') {
      toast.error('Full name is required for an individual beneficiary.');
      return;
    }
    if (!form.household_name.trim() && form.beneficiary_type === 'household') {
      toast.error('Household name is required for a household beneficiary.');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        ...form,
        project_id: form.project_id ? Number(form.project_id) : null,
        household_size: form.household_size ? Number(form.household_size) : null,
        vulnerability_tags: form.vulnerability_tags
          ? form.vulnerability_tags.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };
      if (editingId) {
        await apiPatch(`/api/system/beneficiaries/${editingId}`, payload);
        toast.success('Beneficiary updated.');
      } else {
        await apiPost('/api/system/beneficiaries', payload);
        toast.success('Beneficiary registered.');
      }
      setDrawerOpen(false);
      await loadRows();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to save beneficiary.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      setDeleteLoading(true);
      await apiDelete(`/api/system/beneficiaries/${deleting.id}`);
      toast.success('Beneficiary deleted.');
      setDeleting(null);
      await loadRows();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to delete beneficiary.';
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await apiDownload('/api/system/beneficiaries/export', {
        q: q || undefined,
        gender: genderFilter || undefined,
        disability_inclusion: disabilityFilter || undefined,
        project_id: projectFilter || undefined,
      });
      toast.success('Export downloaded.');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Export failed.';
      toast.error(message);
    }
  };

  const filtersActive = useMemo(
    () => Boolean(q || genderFilter || disabilityFilter || projectFilter),
    [q, genderFilter, disabilityFilter, projectFilter]
  );

  return (
    <Box>
      <PageHeader
        title="Beneficiaries"
        subtitle="Registered individuals and households. M&E fields flow into reports, so capture them at registration whenever possible."
        actions={
          <>
            <Button startIcon={<DownloadIcon />} variant="outlined" onClick={handleExport}>
              Export CSV
            </Button>
            <Button startIcon={<AddIcon />} variant="contained" onClick={openCreate}>
              Register beneficiary
            </Button>
          </>
        }
      />

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <TextField
            size="small"
            placeholder="Search name, phone, village…"
            value={q}
            onChange={(e) => {
              setPage(0);
              setQ(e.target.value);
            }}
            InputProps={{ startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> }}
            sx={{ flexGrow: 1, minWidth: 220 }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
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
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
              value={genderFilter}
              onChange={(e) => {
                setPage(0);
                setGenderFilter(e.target.value);
              }}
            >
              <MenuItem value="">All</MenuItem>
              {GENDER_OPTIONS.map((g) => (
                <MenuItem key={g} value={g} sx={{ textTransform: 'capitalize' }}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Disability</InputLabel>
            <Select
              label="Disability"
              value={disabilityFilter}
              onChange={(e) => {
                setPage(0);
                setDisabilityFilter(e.target.value);
              }}
            >
              <MenuItem value="">All</MenuItem>
              {DISABILITY_OPTIONS.map((d) => (
                <MenuItem key={d} value={d}>
                  {d.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {filtersActive && (
            <Button
              onClick={() => {
                setQ('');
                setGenderFilter('');
                setDisabilityFilter('');
                setProjectFilter('');
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
          title={filtersActive ? 'No beneficiaries match those filters.' : 'No beneficiaries yet.'}
          description={
            filtersActive
              ? 'Try clearing filters or adjusting your search.'
              : 'Register your first beneficiary. You can always update M&E details later.'
          }
          actionLabel={filtersActive ? undefined : 'Register beneficiary'}
          onAction={filtersActive ? undefined : openCreate}
        />
      ) : (
        <Paper variant="outlined">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Age group</TableCell>
                  <TableCell>HH size</TableCell>
                  <TableCell>Consent</TableCell>
                  <TableCell>Registered</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((b) => (
                  <TableRow hover key={b.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {b.full_name || b.household_name || '—'}
                      </Typography>
                      {b.phone && (
                        <Typography variant="caption" color="text.secondary">
                          {b.phone}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{b.beneficiary_type}</TableCell>
                    <TableCell>{b.project_name || '—'}</TableCell>
                    <TableCell>
                      {[b.district, b.ward, b.village].filter(Boolean).join(' / ') || '—'}
                    </TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{formatLabel(b.gender)}</TableCell>
                    <TableCell>{formatLabel(b.age_group)}</TableCell>
                    <TableCell>{b.household_size ?? '—'}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={b.consent_collected ? 'Yes' : 'No'}
                        color={b.consent_collected ? 'success' : 'default'}
                        variant={b.consent_collected ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell>{b.registered_on || '—'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(b)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => setDeleting(b)}>
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
        <Box sx={{ width: { xs: '100vw', sm: 520 }, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editingId ? 'Edit beneficiary' : 'Register beneficiary'}
          </Typography>
          <Stack spacing={2}>
            <FormControl>
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                value={form.beneficiary_type}
                onChange={(e) => setForm((f) => ({ ...f, beneficiary_type: e.target.value }))}
              >
                {TYPE_OPTIONS.map((t) => (
                  <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {form.beneficiary_type === 'individual' ? (
              <TextField
                label="Full name"
                required
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              />
            ) : (
              <TextField
                label="Household name"
                required
                value={form.household_name}
                onChange={(e) => setForm((f) => ({ ...f, household_name: e.target.value }))}
              />
            )}

            <FormControl>
              <InputLabel>Project</InputLabel>
              <Select
                label="Project"
                value={form.project_id}
                onChange={(e) => setForm((f) => ({ ...f, project_id: e.target.value }))}
              >
                <MenuItem value="">Not linked to a project</MenuItem>
                {projectOptions.map((p) => (
                  <MenuItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
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
            <TextField
              label="Village"
              value={form.village}
              onChange={(e) => setForm((f) => ({ ...f, village: e.target.value }))}
            />

            <Stack direction="row" spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Gender"
                  value={form.gender}
                  onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                >
                  {GENDER_OPTIONS.map((g) => (
                    <MenuItem key={g} value={g} sx={{ textTransform: 'capitalize' }}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Age group</InputLabel>
                <Select
                  label="Age group"
                  value={form.age_group}
                  onChange={(e) => setForm((f) => ({ ...f, age_group: e.target.value }))}
                >
                  {AGE_GROUPS.map((a) => (
                    <MenuItem key={a} value={a}>
                      {a.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                type="date"
                label="Date of birth"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.date_of_birth}
                onChange={(e) => setForm((f) => ({ ...f, date_of_birth: e.target.value }))}
              />
              <TextField
                type="number"
                label="Household size"
                fullWidth
                inputProps={{ min: 0, max: 50 }}
                value={form.household_size}
                onChange={(e) => setForm((f) => ({ ...f, household_size: e.target.value }))}
              />
            </Stack>

            <FormControl>
              <InputLabel>Disability inclusion</InputLabel>
              <Select
                label="Disability inclusion"
                value={form.disability_inclusion}
                onChange={(e) => setForm((f) => ({ ...f, disability_inclusion: e.target.value }))}
              >
                {DISABILITY_OPTIONS.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Vulnerability tags"
              helperText="Comma-separated, e.g. widow, OVC, chronic_illness"
              value={form.vulnerability_tags}
              onChange={(e) => setForm((f) => ({ ...f, vulnerability_tags: e.target.value }))}
            />

            <TextField
              type="date"
              label="Registered on"
              InputLabelProps={{ shrink: true }}
              value={form.registered_on}
              onChange={(e) => setForm((f) => ({ ...f, registered_on: e.target.value }))}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.consent_collected}
                  onChange={(e) => setForm((f) => ({ ...f, consent_collected: e.target.checked }))}
                />
              }
              label="Written/verbal consent collected for data processing"
            />

            <TextField
              label="Notes"
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
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Register beneficiary'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete beneficiary?"
        message={
          deleting
            ? `This will remove ${deleting.full_name || deleting.household_name || 'this beneficiary'} from the registry. The action is logged in the audit trail.`
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

export default BeneficiariesPage;
