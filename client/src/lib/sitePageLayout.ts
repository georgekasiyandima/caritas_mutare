import type { SxProps, Theme } from '@mui/material/styles';

/** Matches homepage alternate section wash */
export const SECTION_BG_ALT = '#f3f1ed';

export const pageRoot: SxProps<Theme> = {
  minHeight: '100vh',
  bgcolor: 'background.default',
};

/** Top band: light, bordered — same rhythm as HomePage hero */
export const pageHero: SxProps<Theme> = {
  pt: { xs: 14, md: 16 },
  pb: { xs: 5, md: 7 },
  bgcolor: 'background.paper',
  borderBottom: '1px solid',
  borderColor: 'divider',
};

/** Use when a back link / toolbar sits above the hero */
export const pageHeroCompactTop: SxProps<Theme> = {
  pt: { xs: 3, md: 4 },
  pb: { xs: 5, md: 7 },
  bgcolor: 'background.paper',
  borderBottom: '1px solid',
  borderColor: 'divider',
};

export const pageOverline: SxProps<Theme> = {
  color: 'info.main',
  fontWeight: 700,
  letterSpacing: 2,
};

export const pageH1: SxProps<Theme> = {
  fontFamily: '"Merriweather", Georgia, serif',
  fontWeight: 700,
  color: 'text.primary',
  lineHeight: 1.2,
};

export const pageLead: SxProps<Theme> = {
  color: 'text.secondary',
  maxWidth: 640,
  lineHeight: 1.75,
  fontSize: { md: '1.05rem' },
};

export const outlineCard: SxProps<Theme> = {
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  boxShadow: 'none',
};

export const outlineCardHover: SxProps<Theme> = {
  transition: 'box-shadow 0.2s, transform 0.2s',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
    transform: 'translateY(-2px)',
  },
};

export const sectionVerticalPadding: SxProps<Theme> = {
  py: { xs: 5, md: 7 },
};

export const formCardHeader: SxProps<Theme> = {
  bgcolor: 'rgba(13, 92, 99, 0.06)',
  color: 'text.primary',
  p: 3,
  textAlign: 'center',
  borderBottom: '1px solid',
  borderColor: 'divider',
};

export function closingCtaSectionSx(theme: Theme): SxProps<Theme> {
  return {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: theme.palette.common.white,
    py: { xs: 6, md: 8 },
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)',
      pointerEvents: 'none',
    },
  };
}
