import React from 'react';
import { Box, Card, CardActionArea, Chip, Stack, Typography } from '@mui/material';
import { ArrowForward as ArrowIcon } from '@mui/icons-material';

export type StoryCardAspect = '4/3' | '16/9' | '16/10' | '1/1';

export interface StoryCardProps {
  /** Featured photograph for the story. */
  image?: string;
  /** Accessible alt text for the image. */
  imageAlt?: string;
  /** CSS object-position for fine framing (e.g. "center 35%"). */
  imagePosition?: string;
  /** "cover" (default) crops to fill; "contain" keeps the whole image visible (good for logos). */
  imageFit?: 'cover' | 'contain';
  /** Aspect ratio of the image area. */
  aspect?: StoryCardAspect;
  /** Small uppercase tag above the title (e.g. "Programme", "News", project acronym). */
  category: string;
  /** Card headline. */
  title: string;
  /** Supporting text — kept short, clamped to 3 lines. */
  description?: string;
  /** Optional metadata line at the bottom (e.g. "Mutare · 1,200 reached"). */
  meta?: string;
  /** Optional partner / donor logos shown discreetly above the meta line. */
  logos?: string[];
  /** Call-to-action label. */
  cta: string;
  /** Clicking the card invokes this handler. */
  onClick: () => void;
}

const ASPECT_PADDING: Record<StoryCardAspect, string> = {
  '4/3': '75%',
  '16/9': '56.25%',
  '16/10': '62.5%',
  '1/1': '100%',
};

/**
 * Editorial card used across the public site for projects, news, and stories.
 * Image-forward, hover-lifts on desktop, respects prefers-reduced-motion.
 */
const StoryCard: React.FC<StoryCardProps> = ({
  image,
  imageAlt = '',
  imagePosition = 'center center',
  imageFit = 'cover',
  aspect = '4/3',
  category,
  title,
  description,
  meta,
  logos,
  cta,
  onClick,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'transform 220ms ease, box-shadow 220ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 14px 32px rgba(15, 23, 42, 0.10)',
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '&:hover': { transform: 'none', boxShadow: '0 4px 12px rgba(15,23,42,0.06)' },
        },
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            pt: ASPECT_PADDING[aspect],
            bgcolor: imageFit === 'contain' ? 'grey.50' : 'grey.100',
            overflow: 'hidden',
          }}
        >
          {image ? (
            <Box
              component="img"
              src={image}
              alt={imageAlt}
              loading="lazy"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: imageFit,
                objectPosition: imagePosition,
                transition: 'transform 600ms ease',
                '.MuiCardActionArea-root:hover &': {
                  transform: imageFit === 'cover' ? 'scale(1.04)' : 'none',
                },
                '@media (prefers-reduced-motion: reduce)': {
                  '.MuiCardActionArea-root:hover &': { transform: 'none' },
                },
              }}
            />
          ) : (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.disabled',
                fontSize: '0.85rem',
              }}
            >
              {category}
            </Box>
          )}
        </Box>

        <Box sx={{ p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Chip
            label={category}
            size="small"
            sx={{
              alignSelf: 'flex-start',
              mb: 1.5,
              bgcolor: 'rgba(13, 92, 99, 0.08)',
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: 'uppercase',
              fontSize: '0.7rem',
              height: 22,
              borderRadius: 1,
            }}
          />
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontFamily: '"Merriweather", Georgia, serif',
              fontWeight: 700,
              lineHeight: 1.3,
              color: 'text.primary',
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: { md: '2.6em' },
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.6,
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </Typography>
          )}
          <Box sx={{ flexGrow: 1 }} />

          {logos && logos.length > 0 && (
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.25, opacity: 0.75 }}>
              {logos.slice(0, 3).map((src, idx) => (
                <Box
                  key={`${src}-${idx}`}
                  component="img"
                  src={src}
                  alt=""
                  loading="lazy"
                  sx={{
                    height: 22,
                    width: 'auto',
                    maxWidth: 80,
                    objectFit: 'contain',
                    filter: 'grayscale(20%)',
                  }}
                />
              ))}
            </Stack>
          )}

          {meta && (
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', mb: 1.5, opacity: 0.85 }}
            >
              {meta}
            </Typography>
          )}
          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            sx={{ color: 'primary.main', fontWeight: 700 }}
          >
            <Typography
              variant="button"
              sx={{ letterSpacing: 0.5, textTransform: 'none', fontWeight: 700 }}
            >
              {cta}
            </Typography>
            <ArrowIcon
              fontSize="small"
              sx={{
                transition: 'transform 220ms ease',
                '.MuiCardActionArea-root:hover &': { transform: 'translateX(3px)' },
                '@media (prefers-reduced-motion: reduce)': {
                  '.MuiCardActionArea-root:hover &': { transform: 'none' },
                },
              }}
            />
          </Stack>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default StoryCard;
