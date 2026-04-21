import React from 'react';
import { Container, Typography, Box, CircularProgress, Grid, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  SECTION_BG_ALT,
  pageRoot,
  pageHeroCompactTop,
  pageH1,
  outlineCard,
} from '../lib/sitePageLayout';

interface GalleryItem {
  src: string;
  caption: string;
}

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery(['news', id], async () => {
    const response = await fetch(`/api/news/${id}`);
    return response.json();
  });

  if (isLoading) {
    return (
      <Box sx={pageRoot}>
        <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  if (error || !data?.article) {
    return (
      <Box sx={pageRoot}>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography variant="h6" color="error" textAlign="center">
            Article not found
          </Typography>
        </Container>
      </Box>
    );
  }

  const { article } = data;
  const gallery: GalleryItem[] = Array.isArray(article.gallery) ? article.gallery : [];

  return (
    <Box sx={pageRoot}>
      <Box sx={{ ...pageHeroCompactTop, pt: { xs: 12, md: 13 } }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" sx={{ ...pageH1, fontSize: { xs: '1.5rem', sm: '1.75rem' }, mb: 2 }}>
            {article.title_en}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0 }}>
            <Typography variant="body2" color="text.secondary">
              {new Date(article.published_at).toLocaleDateString()}
            </Typography>
            {article.read_time_minutes != null && (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>·</Typography>
                <Typography variant="body2" color="text.secondary">
                  {article.read_time_minutes} min read
                </Typography>
              </>
            )}
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: SECTION_BG_ALT, py: { xs: 5, md: 7 } }}>
        <Container maxWidth="md">
      {article.featured_image && (
        <Box sx={{ mb: 4 }}>
          <Box
            component="img"
            src={article.featured_image}
            alt={article.title_en}
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 3,
              display: 'block',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 12px 32px rgba(15,23,42,0.08)',
            }}
          />
        </Box>
      )}

      <Box sx={{ ...outlineCard, p: { xs: 2.5, md: 3 }, mb: 4 }}>
        <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
          {article.content_en}
        </Typography>
      </Box>

      {gallery.length > 0 && (
        <Box sx={{ pt: 2 }}>
          <Divider sx={{ mb: 3 }} />
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





