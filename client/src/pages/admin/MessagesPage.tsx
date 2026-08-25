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
import { MailOutline as MailIcon } from '@mui/icons-material';
import PageHeader from '../../components/admin/PageHeader';
import EmptyState from '../../components/admin/EmptyState';
import { apiGet, apiPatch, ApiError } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

type MessageStatus = 'unread' | 'read' | 'replied' | 'archived';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  created_at: string;
}

interface MessagesResponse {
  data: ContactMessage[];
  pagination: { page: number; pageSize: number; total: number };
  unread_count: number;
}

const STATUS_COLOR: Record<MessageStatus, 'warning' | 'default' | 'success' | 'info'> = {
  unread: 'warning',
  read: 'default',
  replied: 'success',
  archived: 'info',
};

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

const MessagesPage: React.FC = () => {
  const toast = useToast();

  const [rows, setRows] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadRows = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGet<MessagesResponse>('/api/contact', {
        page: page + 1,
        pageSize,
        status: status || undefined,
        q: appliedSearch || undefined,
      });
      setRows(response.data);
      setTotal(response.pagination.total);
      setUnreadCount(response.unread_count);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load messages.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, status, appliedSearch, toast]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const updateStatus = async (id: number, nextStatus: MessageStatus) => {
    try {
      setUpdating(true);
      const response = await apiPatch<{ data: ContactMessage }>(`/api/contact/${id}`, {
        status: nextStatus,
      });
      const updated = response.data;
      setRows((prev) => prev.map((row) => (row.id === id ? updated : row)));
      setSelected((prev) => (prev && prev.id === id ? updated : prev));
      await loadRows();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to update message.';
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const openMessage = async (row: ContactMessage) => {
    setSelected(row);
    if (row.status === 'unread') {
      await updateStatus(row.id, 'read');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Messages"
        subtitle="Enquiries from the public contact form. Reply from your mailbox; mark status here so the team can see what is done."
        actions={
          unreadCount > 0 ? (
            <Chip label={`${unreadCount} unread`} color="warning" />
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
              <MenuItem value="unread">Unread</MenuItem>
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="replied">Replied</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Search"
            placeholder="Name, email, or subject"
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
          icon={<MailIcon />}
          title="No messages."
          description="When someone submits the public contact form, it will appear here."
        />
      ) : (
        <Paper variant="outlined">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>From</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Received</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => void openMessage(row)}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: row.status === 'unread' ? 700 : 400,
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'inherit' }}>
                      <Typography variant="body2" sx={{ fontWeight: row.status === 'unread' ? 700 : 600 }}>
                        {row.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: row.status === 'unread' ? 600 : 400 }}>
                      {row.subject}
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
                {selected.subject}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selected.name} · {selected.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatWhen(selected.created_at)}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
              {selected.message}
            </Typography>
            <Stack spacing={1}>
              <Button
                variant="contained"
                href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                disabled={updating}
              >
                Reply by email
              </Button>
              <Button
                variant="outlined"
                disabled={updating || selected.status === 'replied'}
                onClick={() => void updateStatus(selected.id, 'replied')}
              >
                Mark as replied
              </Button>
              <Button
                variant="outlined"
                disabled={updating || selected.status === 'archived'}
                onClick={() => void updateStatus(selected.id, 'archived')}
              >
                Archive
              </Button>
            </Stack>
          </Stack>
        )}
      </Drawer>
    </Box>
  );
};

export default MessagesPage;
