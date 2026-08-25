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
  Typography,
} from '@mui/material';
import { FavoriteBorder as HeartIcon } from '@mui/icons-material';
import PageHeader from '../../components/admin/PageHeader';
import EmptyState from '../../components/admin/EmptyState';
import { apiGet, apiPut, ApiError } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

interface Donation {
  id: number;
  donor_name: string;
  donor_email: string | null;
  donor_phone: string | null;
  amount: number;
  currency: string;
  payment_status: PaymentStatus;
  message: string | null;
  is_anonymous: number | boolean;
  frequency: string | null;
  designation: string | null;
  created_at: string;
}

interface DonationsResponse {
  donations: Donation[];
  pagination: { page: number; limit: number; total: number };
  pending_count: number;
}

const STATUS_COLOR: Record<PaymentStatus, 'warning' | 'success' | 'error' | 'default'> = {
  pending: 'warning',
  completed: 'success',
  failed: 'error',
  refunded: 'default',
};

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function displayName(row: Donation) {
  if (row.is_anonymous) return 'Anonymous';
  return row.donor_name;
}

const DonationsPage: React.FC = () => {
  const toast = useToast();

  const [rows, setRows] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<Donation | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadRows = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGet<DonationsResponse>('/api/donations/admin', {
        page: page + 1,
        limit: pageSize,
        status: status || undefined,
      });
      setRows(response.donations);
      setTotal(response.pagination.total);
      setPendingCount(response.pending_count);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load pledges.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, status, toast]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const updateStatus = async (id: number, payment_status: PaymentStatus) => {
    try {
      setUpdating(true);
      const response = await apiPut<{ donation: Donation }>(`/api/donations/admin/${id}`, {
        payment_status,
      });
      const updated = response.donation;
      setRows((prev) => prev.map((row) => (row.id === id ? updated : row)));
      setSelected((prev) => (prev && prev.id === id ? updated : prev));
      await loadRows();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to update pledge.';
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Pledges"
        subtitle="Public donate-form pledges. Mark completed only after the payment has actually arrived."
        actions={
          pendingCount > 0 ? (
            <Chip label={`${pendingCount} pending`} color="warning" />
          ) : undefined
        }
      />

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
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
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="refunded">Refunded</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<HeartIcon />}
          title="No pledges yet."
          description="When someone submits the donate form, the pledge will appear here as pending."
        />
      ) : (
        <Paper variant="outlined">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Donor</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Received</TableCell>
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
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {displayName(row)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.donor_email || 'No email'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {row.currency} {row.amount}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.payment_status}
                        color={STATUS_COLOR[row.payment_status]}
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
                label={selected.payment_status}
                color={STATUS_COLOR[selected.payment_status]}
                sx={{ textTransform: 'capitalize', mb: 1 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {selected.currency} {selected.amount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {displayName(selected)}
                {selected.donor_email ? ` · ${selected.donor_email}` : ''}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatWhen(selected.created_at)}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
              {selected.message || 'No message'}
            </Typography>
            <Stack spacing={1}>
              {selected.donor_email && (
                <Button
                  variant="contained"
                  href={`mailto:${selected.donor_email}?subject=${encodeURIComponent('Your gift to Caritas Mutare')}`}
                  disabled={updating}
                >
                  Email donor
                </Button>
              )}
              <Button
                variant="outlined"
                disabled={updating || selected.payment_status === 'completed'}
                onClick={() => void updateStatus(selected.id, 'completed')}
              >
                Mark payment received
              </Button>
              <Button
                variant="outlined"
                color="error"
                disabled={updating || selected.payment_status === 'failed'}
                onClick={() => void updateStatus(selected.id, 'failed')}
              >
                Mark failed
              </Button>
            </Stack>
          </Stack>
        )}
      </Drawer>
    </Box>
  );
};

export default DonationsPage;
