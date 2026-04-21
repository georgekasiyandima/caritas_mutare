import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Language as LanguageIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
    { key: 'programs', path: '/programs' }, // label comes from nav.programs -> \"Projects\"
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
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64 }, px: 2 }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'block',
              flexGrow: 1,
              textDecoration: 'none',
              lineHeight: 0,
              '&:focus': { outline: 'none' },
              '&:focus-visible': { outline: '1px solid', outlineColor: 'primary.main', outlineOffset: 4 },
            }}
          >
            <Box
              component="img"
              src="/images/logo/caritas-mutare-new-logo.png"
              alt="Caritas Zimbabwe - Diocese of Mutare"
              sx={{
                display: 'block',
                height: { xs: 52, sm: 62 },
                maxWidth: 360,
                objectFit: 'contain',
              }}
            />
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





