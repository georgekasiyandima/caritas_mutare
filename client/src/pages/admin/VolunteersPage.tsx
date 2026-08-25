import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  FormControl,
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
  Typography,
} from '@mui/material';
import { VolunteerActivism as VolunteerIcon } from '@mui/icons-material';
import PageHeader from '../../components/admin/PageHeader';
import EmptyState from '../../components/admin/EmptyState';
import { apiGet, apiPut, ApiError } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

type VolunteerStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';

interface Volunteer {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  skills: string | null;
  availability: string | null;
  interests: string | null;
  message: string | null;
  status: VolunteerStatus;
  created_at: string;
}

interface VolunteersResponse {
  volunteers: Volunteer[];
  pagination: { page: number; limit: number; total: number };
  pending_count: number;
}

const STATUS_COLOR: Record<VolunteerStatus, 'warning' | 'success' | 'error' | 'primary' | 'default'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  active: 'primary',
  inactive: 'default',
};

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

const VolunteersPage: React.FC = () => {
  const toast = useToast();

  const [rows, setRows] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const [selected, setSelected] = useState<Volunteer | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadRows = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGet<VolunteersResponse>('/api/volunteers', {
        page: page + 1,
        limit: pageSize,
        status: status || undefined,
        search: appliedSearch || undefined,
      });
      setRows(response.volunteers);
      setTotal(response.pagination.total);
      setPendingCount(response.pending_count);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load volunteers.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, status, appliedSearch, toast]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const updateStatus = async (id: number, nextStatus: VolunteerStatus) => {
    try {
      setUpdating(true);
      const response = await apiPut<{ volunteer: Volunteer }>(`/api/volunteers/${id}`, {
        status: nextStatus,
      });
      const updated = response.volunteer;
      setRows((prev) => prev.map((row) => (row.id === id ? updated : row)));
      setSelected((prev) => (prev && prev.id === id ? updated : prev));
      await loadRows();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to update volunteer.';
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Volunteers"
        subtitle="Applications from the public volunteer form. Review, then approve or follow up by email."
        actions={
          pendingCount > 0 ? (
            <Chip label={`${pendingCount} pending`} color="warning" />
          ) : undefined
        }
      />

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={status}
              onChange={(e) => {
                setPage(0);
                setStatus(e.target.value);
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Search"
            placeholder="Name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setPage(0);
                setAppliedSearch(search.trim());
              }
            }}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="outlined"
            onClick={() => {
              setPage(0);
              setAppliedSearch(search.trim());
            }}
          >
            Search
          </Button>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<VolunteerIcon />}
          title="No volunteer applications."
          description="When someone submits the public volunteer form, it will appear here."
        />
      ) : (
        <Paper variant="outlined">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Interest</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Applied</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => setSelected(row)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: row.status === 'pending' ? 700 : 600 }}
                      >
                        {row.full_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 280 }}>
                        {row.interests || row.skills || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.status}
                        color={STATUS_COLOR[row.status]}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {formatWhen(row.created_at)}
                      </Typography>
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
            onPageChange={(_e, next) => setPage(next)}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Paper>
      )}

      <Drawer
        anchor="right"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 440 }, p: 3 } }}
      >
        {selected && (
          <Stack spacing={2} sx={{ height: '100%' }}>
            <Box>
              <Chip
                size="small"
                label={selected.status}
                color={STATUS_COLOR[selected.status]}
                sx={{ textTransform: 'capitalize', mb: 1 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {selected.full_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selected.email}
                {selected.phone ? ` · ${selected.phone}` : ''}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Applied {formatWhen(selected.created_at)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary">Skills</Typography>
              <Typography variant="body2">{selected.skills || '—'}</Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary">Availability</Typography>
              <Typography variant="body2">{selected.availability || '—'}</Typography>
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary">Interests</Typography>
              <Typography variant="body2">{selected.interests || '—'}</Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="overline" color="text.secondary">Message</Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {selected.message || '—'}
              </Typography>
            </Box>
            <Stack spacing={1}>
              <Button
                variant="contained"
                href={`mailto:${selected.email}?subject=${encodeURIComponent('Volunteer application — Caritas Mutare')}`}
                disabled={updating}
              >
                Email applicant
              </Button>
              <Button
                variant="outlined"
                disabled={updating || selected.status === 'approved'}
                onClick={() => void updateStatus(selected.id, 'approved')}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="error"
                disabled={updating || selected.status === 'rejected'}
                onClick={() => void updateStatus(selected.id, 'rejected')}
              >
                Reject
              </Button>
            </Stack>
          </Stack>
        )}
      </Drawer>
    </Box>
  );
};

export default VolunteersPage;
