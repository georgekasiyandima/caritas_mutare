import React from 'react';
import { Container, Typography, Box, CircularProgress, Grid, Button, Stack, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  ArrowBack as ArrowBackIcon,
  Favorite as HeartIcon,
  Share as ShareIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import HeroBanner from '../components/HeroBanner';
import SEO from '../components/SEO';
import {
  SECTION_BG_ALT,
  pageRoot,
  outlineCard,
} from '../lib/sitePageLayout';

interface GalleryItem {
  src: string;
  caption: string;
}

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  const { data, isLoading, error } = useQuery(['news', id], async () => {
    const response = await fetch(`/api/news/${id}`);
    return response.json();
  });

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = data?.article?.title_en ?? 'Caritas Mutare';
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({ title, url });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — silent; rare */
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ ...pageRoot, pt: { xs: 14, md: 16 } }}>
        <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  if (error || !data?.article) {
    return (
      <Box sx={{ ...pageRoot, pt: { xs: 14, md: 16 } }}>
        <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="h5" color="error" sx={{ mb: 2, fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700 }}>
            Article not found
          </Typography>
          <Button variant="contained" onClick={() => navigate('/news')} startIcon={<ArrowBackIcon />}>
            Back to news
          </Button>
        </Container>
      </Box>
    );
  }

  const { article } = data;
  const gallery: GalleryItem[] = Array.isArray(article.gallery) ? article.gallery : [];
  const dateStr = new Date(article.published_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const meta = article.read_time_minutes != null
    ? `${dateStr} · ${article.read_time_minutes} min read`
    : dateStr;

  return (
    <Box sx={pageRoot}>
      <SEO
        title={article.title_en}
        description={article.excerpt_en ?? undefined}
        image={article.featured_image ?? undefined}
        canonicalPath={`/news/${id}`}
        type="article"
        publishedAt={article.published_at}
      />

      {article.featured_image ? (
        <HeroBanner
          image={article.featured_image}
          imageAlt={article.title_en}
          size="standard"
          overlay={0.58}
          eyebrow={article.category ?? 'News'}
          title={article.title_en}
          subtitle={article.excerpt_en ?? undefined}
          caption={meta}
        />
      ) : (
        <Box sx={{ pt: { xs: 12, md: 14 }, pb: 3, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Container maxWidth="md">
            <Typography variant="overline" sx={{ color: 'info.main', fontWeight: 700, letterSpacing: 2 }}>
              {article.category ?? 'News'}
            </Typography>
            <Typography variant="h3" component="h1" sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mt: 1, mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
              {article.title_en}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {meta}
            </Typography>
          </Container>
        </Box>
      )}

      <Container maxWidth="md" sx={{ pt: 2.5 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/news')}
          sx={{ textTransform: 'none', color: 'info.main', fontWeight: 700 }}
          size="small"
        >
          All news
        </Button>
      </Container>

      <Box sx={{ bgcolor: SECTION_BG_ALT, py: { xs: 5, md: 7 }, mt: 2 }}>
        <Container maxWidth="md">
          <Box sx={{ ...outlineCard, p: { xs: 3, md: 4 }, mb: 4 }}>
            <Typography variant="body1" sx={{ lineHeight: 1.9, whiteSpace: 'pre-wrap', fontSize: '1.05rem' }}>
              {article.content_en}
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Share + respond bar: classic charity storytelling pattern —
                give the reader an action the moment they finish reading. */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
            >
              <Button
                onClick={handleShare}
                startIcon={copied ? <CopyIcon /> : <ShareIcon />}
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  borderRadius: 999,
                  borderColor: 'divider',
                  color: 'text.primary',
                  fontWeight: 600,
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                }}
              >
                {copied ? 'Link copied' : 'Share this story'}
              </Button>
              <Button
                onClick={() => navigate('/donate')}
                variant="contained"
                startIcon={<HeartIcon />}
                sx={{
                  textTransform: 'none',
                  borderRadius: 999,
                  fontWeight: 700,
                  px: 3,
                  py: 1.1,
                  boxShadow: 'none',
                  '&:hover': { boxShadow: '0 4px 12px rgba(13,92,99,0.18)' },
                }}
              >
                Support this work
              </Button>
            </Stack>
          </Box>

          {gallery.length > 0 && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontFamily: '"Merriweather", Georgia, serif', fontWeight: 700, mb: 3 }}>
                Photos
              </Typography>
              <Grid container spacing={3}>
                {gallery.map((item, idx) => (
                  <Grid item xs={12} key={idx}>
                    <Box
                      component="img"
                      src={item.src}
                      alt={item.caption}
                      sx={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: 2,
                        display: 'block',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, fontStyle: 'italic' }}
                    >
                      {item.caption}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default NewsDetailPage;
