import React from 'react';
import { Container, Typography, Box, CircularProgress, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

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
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !data?.article) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h6" color="error" textAlign="center">
          Article not found
        </Typography>
      </Container>
    );
  }

  const { article } = data;
  const gallery: GalleryItem[] = Array.isArray(article.gallery) ? article.gallery : [];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        {article.title_en}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
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

      {article.featured_image && (
        <Box sx={{ mb: 3 }}>
          <Box
            component="img"
            src={article.featured_image}
            alt={article.title_en}
            sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
          />
        </Box>
      )}

      <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', mb: 4 }}>
        {article.content_en}
      </Typography>

      {gallery.length > 0 && (
        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
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
                    borderRadius: 1,
                    display: 'block',
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
  );
};

export default NewsDetailPage;





