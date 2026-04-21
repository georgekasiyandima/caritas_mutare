import React, { useCallback, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TablePagination,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import PageHeader from '../../components/admin/PageHeader';
import EmptyState from '../../components/admin/EmptyState';
import { apiGet, ApiError } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';

interface AuditLog {
  id: number;
  actor_id: number | null;
  actor_username: string | null;
  action: string;
  entity: string;
  entity_id: number | null;
  before: unknown;
  after: unknown;
  metadata: { ip?: string | null; userAgent?: string | null; method?: string; path?: string } | null;
  created_at: string;
}

interface AuditResponse {
  data: AuditLog[];
  pagination: { page: number; pageSize: number; total: number };
}

const ENTITIES = ['projects', 'beneficiaries', 'activity_logs', 'soup_kitchen_logs', 'auth'];
const ACTIONS = ['create', 'update', 'delete', 'export', 'login', 'login_failed', 'logout'];

const ACTION_COLOR: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
  create: 'success',
  update: 'info',
  delete: 'error',
  export: 'primary',
  login: 'success',
  login_failed: 'warning',
  logout: 'default',
};

const AuditLogPage: React.FC = () => {
  const toast = useToast();

  const [rows, setRows] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const [entity, setEntity] = useState('');
  const [action, setAction] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGet<AuditResponse>('/api/system/audit-logs', {
        page: page + 1,
        pageSize,
        entity: entity || undefined,
        action: action || undefined,
      });
      setRows(response.data);
      setTotal(response.pagination.total);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load audit log.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, entity, action, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Box>
      <PageHeader
        title="Audit log"
        subtitle="Every admin change is recorded here. Read-only — nobody on the team can modify or delete these entries."
      />

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Entity</InputLabel>
            <Select
              label="Entity"
              value={entity}
              onChange={(e) => {
                setPage(0);
                setEntity(e.target.value);
              }}
            >
              <MenuItem value="">All</MenuItem>
              {ENTITIES.map((e) => (
                <MenuItem key={e} value={e}>
                  {e.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Action</InputLabel>
            <Select
              label="Action"
              value={action}
              onChange={(e) => {
                setPage(0);
                setAction(e.target.value);
              }}
            >
              <MenuItem value="">All</MenuItem>
              {ACTIONS.map((a) => (
                <MenuItem key={a} value={a}>
                  {a.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 ? (
        <EmptyState title="No audit entries." description="Admin activity will appear here as the team works." />
      ) : (
        <Paper variant="outlined">
          {rows.map((row) => (
            <Accordion key={row.id} disableGutters square>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
                  <Chip
                    size="small"
                    label={row.action}
                    color={ACTION_COLOR[row.action] || 'default'}
                    sx={{ textTransform: 'capitalize', minWidth: 80 }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 120, textTransform: 'capitalize' }}>
                    {row.entity.replace('_', ' ')}
                    {row.entity_id ? ` #${row.entity_id}` : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                    {row.actor_username || 'system'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.created_at}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: 'action.hover' }}>
                <Stack spacing={2}>
                  {row.metadata && (
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Metadata
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                        {row.metadata.method} {row.metadata.path} · IP {row.metadata.ip || 'n/a'}
                      </Typography>
                    </Box>
                  )}
                  {row.before ? (
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Before
                      </Typography>
                      <Box
                        component="pre"
                        sx={{
                          m: 0,
                          p: 1.5,
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          fontSize: 12,
                          overflow: 'auto',
                        }}
                      >
                        {JSON.stringify(row.before, null, 2)}
                      </Box>
                    </Box>
                  ) : null}
                  {row.after ? (
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        After
                      </Typography>
                      <Box
                        component="pre"
                        sx={{
                          m: 0,
                          p: 1.5,
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          fontSize: 12,
                          overflow: 'auto',
                        }}
                      >
                        {JSON.stringify(row.after, null, 2)}
                      </Box>
                    </Box>
                  ) : null}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
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
            rowsPerPageOptions={[25, 50, 100, 200]}
          />
        </Paper>
      )}
    </Box>
  );
};

export default AuditLogPage;
