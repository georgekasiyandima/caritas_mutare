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
    const response = await fetch('/api/news?limit=6&page=1');
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
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: 600, textAlign: 'center', mb: 4, color: 'text.primary' }}
      >
        {t('news.title')}
      </Typography>

      {newsData?.news && newsData.news.length > 0 ? (
        <Grid container spacing={3}>
          {newsData.news.map((article: any) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                  '&:hover': {
                    boxShadow: 2,
                    borderColor: 'action.hover',
                  },
                }}
                onClick={() => navigate(`/news/${article.id}`)}
              >
                {article.featured_image && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={article.featured_image}
                    alt={article.title_en}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, py: 2.5, px: 2.5 }}>
                  <Typography variant="subtitle1" component="h3" fontWeight={600} gutterBottom sx={{ lineHeight: 1.35 }}>
                    {article.title_en}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.excerpt_en}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(article.published_at).toLocaleDateString()}
                    </Typography>
                    {article.read_time_minutes != null && (
                      <>
                        <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>·</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {article.read_time_minutes} min read
                        </Typography>
                      </>
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ px: 2.5, pb: 2, pt: 0 }}>
                  <Button size="small" sx={{ textTransform: 'none', fontWeight: 600 }} onClick={(e) => { e.stopPropagation(); navigate(`/news/${article.id}`); }}>
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





