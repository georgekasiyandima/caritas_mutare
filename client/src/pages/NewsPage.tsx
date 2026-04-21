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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  SECTION_BG_ALT,
  pageRoot,
  pageHero,
  pageOverline,
  pageH1,
  pageLead,
} from '../lib/sitePageLayout';

const NewsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data: newsData, isLoading, error } = useQuery('news', async () => {
    const response = await fetch('/api/news?limit=6&page=1');
    return response.json();
  });

  if (isLoading) {
    return (
      <Box sx={pageRoot}>
        <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={pageRoot}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h6" color="error" textAlign="center">
            Error loading news articles
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={pageRoot}>
      <Box sx={pageHero}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto' }}>
            <Typography variant="overline" sx={{ ...pageOverline, display: 'block', mb: 1 }}>
              Updates
            </Typography>
            <Typography variant={isMobile ? 'h3' : 'h2'} component="h1" sx={{ ...pageH1, mb: 2 }}>
              {t('news.title')}
            </Typography>
            <Typography variant="body1" sx={{ ...pageLead, mx: 'auto' }}>
              Stories from the field, the diocese, and our programmes.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: SECTION_BG_ALT, py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
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
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                    transform: 'translateY(-2px)',
                    borderColor: 'info.light',
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
                  <Button size="small" sx={{ textTransform: 'none', fontWeight: 600, color: 'info.main' }} onClick={(e) => { e.stopPropagation(); navigate(`/news/${article.id}`); }}>
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
      </Box>
    </Box>
  );
};

export default NewsPage;





