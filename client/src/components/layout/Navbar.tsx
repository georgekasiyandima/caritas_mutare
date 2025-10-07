import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  useTheme,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Language as LanguageIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.tsx';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<null | HTMLElement>(null);

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setLanguageMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'leadership', path: '/leadership' },
    { key: 'programs', path: '/programs' },
    { key: 'news', path: '/news' },
    { key: 'donate', path: '/donate' },
    { key: 'volunteer', path: '/volunteer' },
    { key: 'contact', path: '/contact' },
  ];

  const mobileMenu = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250 }}>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemText primary={t(`nav.${item.key}`)} />
              </ListItemButton>
            </ListItem>
          ))}
          {user && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin">
                <ListItemText primary={t('nav.admin')} />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );

  const desktopMenu = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {navItems.map((item) => (
        <Button
          key={item.key}
          color="inherit"
          component={Link}
          to={item.path}
          sx={{ textTransform: 'none' }}
        >
          {t(`nav.${item.key}`)}
        </Button>
      ))}
      
      <IconButton
        color="inherit"
        onClick={(e) => setLanguageMenuAnchor(e.currentTarget)}
      >
        <LanguageIcon />
      </IconButton>

      <Menu
        anchorEl={languageMenuAnchor}
        open={Boolean(languageMenuAnchor)}
        onClose={() => setLanguageMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleLanguageChange('en')}>
          English
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange('sh')}>
          Shona
        </MenuItem>
      </Menu>

      {user ? (
        <>
          <IconButton color="inherit" component={Link} to="/admin">
            <AccountIcon />
          </IconButton>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <Button color="inherit" component={Link} to="/admin/login">
          {t('nav.admin')}
        </Button>
      )}
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar
              src="/cari2.png"
              alt="Caritas Mutare Logo"
              sx={{ 
                width: 70, 
                height: 70, 
                mr: 2,
              }}
            />
            <Box>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: 'black',
                  fontWeight: 'bold',
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontSize: '1.2rem',
                  lineHeight: 1.2,
                }}
              >
                Caritas Zimbabwe Mutare
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  display: 'block',
                  lineHeight: 1,
                }}
              >
                Catholic Community Development Organization
              </Typography>
            </Box>
          </Box>

          {isMobile ? (
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            desktopMenu
          )}
        </Toolbar>
      </AppBar>

      {mobileMenu}
      
      {/* Add spacing for fixed app bar */}
      <Toolbar />
    </>
  );
};

export default Navbar;





