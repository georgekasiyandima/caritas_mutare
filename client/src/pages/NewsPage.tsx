import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';

const NewsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: newsData, isLoading, error } = useQuery('news', async () => {
    const response = await fetch('/api/news');
    return response.json();
  });

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h6" color="error" textAlign="center">
          Error loading news articles
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 6 }}>
        {t('news.title')}
      </Typography>

      {newsData?.news && newsData.news.length > 0 ? (
        <Grid container spacing={4}>
          {newsData.news.map((article: any) => (
            <Grid item xs={12} md={6} lg={4} key={article.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => navigate(`/news/${article.id}`)}
              >
                {article.featured_image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={article.featured_image}
                    alt={article.title_en}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {article.title_en}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {article.excerpt_en}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(article.published_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">
                    {t('news.readMore')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary">
            {t('news.noArticles')}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default NewsPage;





