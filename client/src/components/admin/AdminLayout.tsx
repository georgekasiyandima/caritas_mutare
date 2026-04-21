import React, { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  FolderSpecial as ProjectsIcon,
  Groups as BeneficiariesIcon,
  EventNote as ActivityIcon,
  RestaurantMenu as SoupKitchenIcon,
  History as AuditIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const DRAWER_WIDTH = 260;

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[];
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: <DashboardIcon />, end: true },
  { to: '/admin/projects', label: 'Projects', icon: <ProjectsIcon /> },
  { to: '/admin/beneficiaries', label: 'Beneficiaries', icon: <BeneficiariesIcon /> },
  { to: '/admin/activity-logs', label: 'Activity Logs', icon: <ActivityIcon /> },
  { to: '/admin/soup-kitchen', label: 'Soup Kitchen', icon: <SoupKitchenIcon /> },
  { to: '/admin/audit-log', label: 'Audit Log', icon: <AuditIcon />, roles: ['admin'] },
];

const AdminLayout: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();
  const toast = useToast();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const handler = () => {
      toast.warning('Your session has expired. Please sign in again.');
      navigate('/admin/login');
    };
    window.addEventListener('auth:unauthorized', handler);
    return () => window.removeEventListener('auth:unauthorized', handler);
  }, [toast, navigate]);

  useEffect(() => {
    if (!isDesktop) setMobileOpen(false);
  }, [location.pathname, isDesktop]);

  const visibleItems = useMemo(
    () => NAV_ITEMS.filter((item) => !item.roles || hasRole(...item.roles)),
    [hasRole]
  );

  const isActive = (item: NavItem) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to);

  const handleLogout = async () => {
    setMenuAnchor(null);
    await logout();
    toast.success('You have been signed out.');
    navigate('/admin/login');
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          variant="rounded"
          sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 40, height: 40 }}
        >
          CM
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
            Caritas Mutare
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Operations Console
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, px: 1.5, py: 2 }}>
        {visibleItems.map((item) => {
          const active = isActive(item);
          return (
            <ListItemButton
              key={item.to}
              component={RouterLink}
              to={item.to}
              selected={active}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: active ? 'inherit' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 600 : 500 }} />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ px: 3, py: 2 }}>
        <Tooltip title="Open public website">
          <IconButton
            component={RouterLink}
            to="/"
            target="_blank"
            rel="noopener"
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <OpenInNewIcon fontSize="small" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              View public site
            </Typography>
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setMobileOpen((v) => !v)}
            sx={{ display: { md: 'none' } }}
            aria-label="Open navigation"
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.1 }}>
              {visibleItems.find((item) => isActive(item))?.label || 'Admin'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Internal use only — all changes are logged.
            </Typography>
          </Box>
          {user && (
            <>
              <Chip
                size="small"
                label={user.role}
                color={user.role === 'admin' ? 'primary' : 'default'}
                variant="outlined"
                sx={{ textTransform: 'capitalize', display: { xs: 'none', sm: 'inline-flex' } }}
              />
              <IconButton
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                aria-label="Open user menu"
                sx={{ p: 0.5 }}
              >
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Box sx={{ px: 2, py: 1.5, minWidth: 200 }}>
                  <Typography variant="subtitle2">{user.username}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Sign out
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: 1,
              borderColor: 'divider',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          px: { xs: 2, md: 4 },
          pt: { xs: 10, md: 12 },
          pb: 6,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
