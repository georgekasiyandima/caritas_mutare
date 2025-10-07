import React from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

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

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        {article.title_en}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Published on {new Date(article.published_at).toLocaleDateString()}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <img 
          src={article.featured_image} 
          alt={article.title_en}
          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
        />
      </Box>

      <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
        {article.content_en}
      </Typography>
    </Container>
  );
};

export default NewsDetailPage;





