import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

export interface CarouselImage {
  src: string;
  alt: string;
  /** Optional focal point for image alignment (e.g. 'center top'). */
  objectPosition?: string;
}

const INTERVAL_MS = 5000;

interface ImageCarouselProps {
  images: CarouselImage[];
  /** Max number of images to show (optional). */
  maxImages?: number;
  /** Height of the carousel in px (default: 360 on desktop, 240 on mobile). */
  height?: number | { xs?: number; sm?: number; md?: number };
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  maxImages = 10,
  height,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [index, setIndex] = useState(0);
  const [slideImages] = useState(() => shuffle(images).slice(0, maxImages));

  const go = useCallback((delta: number) => {
    setIndex((i) => {
      const next = i + delta;
      if (next < 0) return slideImages.length - 1;
      if (next >= slideImages.length) return 0;
      return next;
    });
  }, [slideImages.length]);

  useEffect(() => {
    const id = setInterval(() => go(1), INTERVAL_MS);
    return () => clearInterval(id);
  }, [go]);

  if (slideImages.length === 0) return null;

  const effectiveHeight = height ?? (isMobile ? 240 : 380);
  const heightSx =
    typeof effectiveHeight === 'object'
      ? { height: { xs: effectiveHeight.xs ?? 240, sm: effectiveHeight.sm, md: effectiveHeight.md ?? 380 } }
      : { height: effectiveHeight };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: 'grey.200',
        ...heightSx,
        '& > div': { height: '100%' },
      }}
    >
      {slideImages.map((img, i) => (
        <Box
          key={`${img.src}-${i}`}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: i === index ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
            zIndex: i === index ? 1 : 0,
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${img.src})`,
              backgroundSize: 'cover',
              backgroundPosition: img.objectPosition ?? 'center center',
              filter: 'blur(10px)',
              transform: 'scale(1.06)',
              opacity: 0.55,
            }}
          />
          <Box
            component="img"
            src={img.src}
            alt={img.alt}
            sx={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              height: '100%',
              objectFit: { xs: 'contain', md: 'cover' },
              objectPosition: img.objectPosition ?? 'center center',
              display: 'block',
            }}
          />
        </Box>
      ))}

      {slideImages.length > 1 && (
        <>
          <IconButton
            onClick={() => go(-1)}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(255,255,255,0.7)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
            }}
            size="small"
          >
            <ArrowBack />
          </IconButton>
          <IconButton
            onClick={() => go(1)}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'rgba(255,255,255,0.7)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
            }}
            size="small"
          >
            <ArrowBack sx={{ transform: 'rotate(180deg)' }} />
          </IconButton>
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 0,
              right: 0,
              zIndex: 2,
              display: 'flex',
              justifyContent: 'center',
              gap: 0.75,
            }}
          >
            {slideImages.map((_, i) => (
              <Box
                key={i}
                onClick={() => setIndex(i)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: i === index ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: i === index ? 'white' : 'rgba(255,255,255,0.8)' },
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ImageCarousel;
