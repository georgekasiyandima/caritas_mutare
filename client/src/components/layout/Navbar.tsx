import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Stack,
  Divider,
  ButtonBase,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  FavoriteBorder as HeartIcon,
  AdminPanelSettingsOutlined as AdminIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Public-site primary navigation.
 *
 * Trimmed to the items most likely to drive a visitor toward an action:
 *  - About (mission, leadership, history)
 *  - Programs (what we do)
 *  - News (proof we are still doing it)
 *  - Volunteer
 *  - Contact
 *
 * Donate is treated as the primary CTA, never as a regular nav item.
 * Admin / staff sign-in is intentionally not in this menu — it lives in
 * the footer so it doesn't dilute the public experience.
 */
const NAV_ITEMS: Array<{ key: string; path: string }> = [
  { key: 'about', path: '/about' },
  { key: 'programs', path: '/programs' },
  { key: 'news', path: '/news' },
  { key: 'volunteer', path: '/volunteer' },
  { key: 'contact', path: '/contact' },
];

const TRANSPARENT_PATHS = new Set<string>(['/']);

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLandingPage = TRANSPARENT_PATHS.has(location.pathname);
  const transparent = isLandingPage && !scrolled && !isMobile;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navTextColor = transparent ? 'common.white' : 'text.primary';
  const logoSrc = '/images/logo/caritas-mutare-new-logo.png';

  /** Compact two-state language switch — EN · SH. */
  const LanguageSwitch: React.FC<{ size?: 'small' | 'medium' }> = ({ size = 'small' }) => {
    const baseColor = transparent ? 'rgba(255,255,255,0.85)' : 'text.secondary';
    const activeColor = transparent ? 'common.white' : 'primary.main';
    const fontSize = size === 'small' ? '0.78rem' : '0.9rem';
    return (
      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
        sx={{
          px: 1,
          py: 0.5,
          borderRadius: 999,
          border: '1px solid',
          borderColor: transparent ? 'rgba(255,255,255,0.4)' : 'divider',
          ml: 1,
        }}
      >
        {(['en', 'sh'] as const).map((lng, idx) => {
          const active = i18n.language.startsWith(lng);
          return (
            <React.Fragment key={lng}>
              {idx > 0 && (
                <Box sx={{ width: 1, height: 14, bgcolor: transparent ? 'rgba(255,255,255,0.35)' : 'divider' }} />
              )}
              <ButtonBase
                onClick={() => i18n.changeLanguage(lng)}
                sx={{
                  px: 0.75,
                  fontSize,
                  fontWeight: active ? 700 : 500,
                  color: active ? activeColor : baseColor,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  borderRadius: 1,
                  transition: 'color .2s ease',
                  '&:hover': { color: activeColor },
                }}
                aria-pressed={active}
                aria-label={lng === 'en' ? 'English' : 'Shona'}
              >
                {lng}
              </ButtonBase>
            </React.Fragment>
          );
        })}
      </Stack>
    );
  };

  const desktopMenu = (
    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ ml: 'auto' }}>
      {NAV_ITEMS.map((item) => {
        const active =
          location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <Button
            key={item.key}
            component={Link}
            to={item.path}
            disableRipple
            sx={{
              color: navTextColor,
              fontWeight: active ? 700 : 500,
              fontSize: '0.9rem',
              px: 1.5,
              py: 0.75,
              letterSpacing: 0.1,
              position: 'relative',
              '&:hover': { bgcolor: transparent ? 'rgba(255,255,255,0.08)' : 'action.hover' },
              '&::after': active
                ? {
                    content: '""',
                    position: 'absolute',
                    left: '30%',
                    right: '30%',
                    bottom: 4,
                    height: 2,
                    bgcolor: transparent ? 'common.white' : 'primary.main',
                    borderRadius: 1,
                  }
                : undefined,
            }}
          >
            {t(`nav.${item.key}`)}
          </Button>
        );
      })}

      <LanguageSwitch />

      <Tooltip title={user ? t('nav.admin', 'Admin') : t('nav.staffSignIn', 'Staff sign-in')} arrow>
        <IconButton
          component={Link}
          to={user ? '/admin' : '/admin/login'}
          aria-label={user ? t('nav.admin', 'Admin') : t('nav.staffSignIn', 'Staff sign-in')}
          sx={{
            ml: 0.5,
            color: navTextColor,
            border: '1px solid',
            borderColor: transparent ? 'rgba(255,255,255,0.35)' : 'divider',
            borderRadius: 999,
            width: 36,
            height: 36,
            '&:hover': {
              bgcolor: transparent ? 'rgba(255,255,255,0.1)' : 'action.hover',
              borderColor: transparent ? 'common.white' : 'primary.main',
            },
          }}
        >
          <AdminIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Button
        component={Link}
        to="/donate"
        variant="contained"
        color="primary"
        endIcon={<ArrowForwardIcon />}
        sx={{
          ml: 1.5,
          fontWeight: 700,
          fontSize: '0.875rem',
          borderRadius: 999,
          px: 2.5,
          py: 0.85,
          boxShadow: transparent ? '0 6px 18px rgba(0,0,0,0.35)' : '0 4px 12px rgba(125,0,0,0.25)',
          '&:hover': { boxShadow: '0 8px 22px rgba(125,0,0,0.4)' },
        }}
      >
        {t('nav.donate')}
      </Button>
    </Stack>
  );

  const mobileMenu = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      PaperProps={{ sx: { width: { xs: '88%', sm: 380 } } }}
    >
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{ lineHeight: 0 }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Box
            component="img"
            src={logoSrc}
            alt="Caritas Mutare"
            sx={{ height: 60, objectFit: 'contain' }}
          />
        </Box>
        <IconButton onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      <List sx={{ flexGrow: 1, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" sx={{ py: 1.4 }}>
            <ListItemText
              primary={t('nav.home')}
              primaryTypographyProps={{
                fontWeight: location.pathname === '/' ? 700 : 500,
                fontSize: '1.05rem',
              }}
            />
          </ListItemButton>
        </ListItem>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton component={Link} to={item.path} sx={{ py: 1.4 }}>
              <ListItemText
                primary={t(`nav.${item.key}`)}
                primaryTypographyProps={{
                  fontWeight: location.pathname.startsWith(item.path) ? 700 : 500,
                  fontSize: '1.05rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/leadership" sx={{ py: 1.4 }}>
            <ListItemText
              primary={t('nav.leadership')}
              primaryTypographyProps={{
                fontWeight: location.pathname.startsWith('/leadership') ? 700 : 500,
                fontSize: '1.05rem',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Button
          component={Link}
          to={user ? '/admin' : '/admin/login'}
          variant="outlined"
          color="inherit"
          startIcon={<AdminIcon />}
          sx={{
            borderRadius: 999,
            fontWeight: 600,
            justifyContent: 'flex-start',
            borderColor: 'divider',
            color: 'text.primary',
            '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
          }}
        >
          {user ? t('nav.admin', 'Admin') : t('nav.staffSignIn', 'Staff sign-in')}
        </Button>
        <Button
          component={Link}
          to="/donate"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<HeartIcon />}
          sx={{ borderRadius: 999, fontWeight: 700, py: 1.2 }}
        >
          {t('nav.donate')}
        </Button>
        <Stack direction="row" spacing={1}>
          <Button
            fullWidth
            variant={i18n.language === 'en' ? 'contained' : 'outlined'}
            color="inherit"
            onClick={() => i18n.changeLanguage('en')}
            size="small"
            sx={{ fontWeight: 600 }}
          >
            English
          </Button>
          <Button
            fullWidth
            variant={i18n.language === 'sh' ? 'contained' : 'outlined'}
            color="inherit"
            onClick={() => i18n.changeLanguage('sh')}
            size="small"
            sx={{ fontWeight: 600 }}
          >
            Shona
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: transparent ? 'transparent' : 'rgba(255,255,255,0.96)',
          backdropFilter: transparent ? 'none' : 'blur(8px)',
          color: navTextColor,
          borderBottom: transparent ? 'none' : '1px solid',
          borderColor: 'divider',
          transition: 'background-color .3s ease, border-color .3s ease, box-shadow .3s ease',
          boxShadow: transparent ? 'none' : '0 2px 10px rgba(15,23,42,0.04)',
        }}
      >
        <Toolbar disableGutters sx={{ minHeight: { xs: 72, sm: 88, md: 96 }, px: { xs: 2, md: 3 } }}>
          {!isLandingPage && (
            <Tooltip title={t('nav.backHome', 'Back to home')} arrow>
              <IconButton
                component={Link}
                to="/"
                aria-label={t('nav.backHome', 'Back to home')}
                size="small"
                sx={{
                  mr: { xs: 1, sm: 1.5 },
                  width: 36,
                  height: 36,
                  color: navTextColor,
                  border: '1px solid',
                  borderColor: transparent ? 'rgba(255,255,255,0.35)' : 'divider',
                  borderRadius: 999,
                  transition: 'background-color .2s, border-color .2s, transform .2s',
                  '&:hover': {
                    bgcolor: transparent ? 'rgba(255,255,255,0.1)' : 'action.hover',
                    borderColor: transparent ? 'common.white' : 'primary.main',
                    transform: 'translateX(-2px)',
                  },
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              lineHeight: 0,
              '&:focus': { outline: 'none' },
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: 4,
              },
              filter: transparent ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' : 'none',
            }}
          >
            <Box
              component="img"
              src={logoSrc}
              alt="Caritas Zimbabwe Roman Catholic Diocese of Mutare"
              sx={{
                display: 'block',
                height: { xs: 56, sm: 72, md: 80 },
                maxWidth: { xs: 240, sm: 340, md: 400 },
                objectFit: 'contain',
              }}
            />
          </Box>

          {isMobile ? (
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Button
                component={Link}
                to="/donate"
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  borderRadius: 999,
                  fontWeight: 700,
                  px: 2,
                  py: 0.6,
                  fontSize: '0.8rem',
                }}
              >
                {t('nav.donate')}
              </Button>
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{ color: navTextColor }}
                aria-label="Open menu"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            desktopMenu
          )}
        </Toolbar>
      </AppBar>

      {mobileMenu}
    </>
  );
};

export default Navbar;
