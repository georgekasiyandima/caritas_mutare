import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import HeroBanner from '../components/HeroBanner';
import StoryCard from '../components/StoryCard';
import SEO from '../components/SEO';
import {
  SECTION_BG_ALT,
  pageRoot,
} from '../lib/sitePageLayout';

interface NewsArticle {
  id: number | string;
  title_en: string;
  excerpt_en?: string;
  featured_image?: string;
  published_at: string;
  read_time_minutes?: number;
  category?: string;
}

const NewsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: newsData, isLoading, error } = useQuery('news', async () => {
    const response = await fetch('/api/news?limit=24&page=1');
    return response.json();
  });

  // Dedicated hero for the News page. A community-gathering shot reads more
  // like an "updates from the field" story than the previous close-up.
  const heroImageSource = {
    src: '/images/general/community-gathering-1.png',
    alt: 'Caritas Mutare community engagement in the Diocese of Mutare',
    objectPosition: 'center 35%',
  };

  return (
    <Box sx={pageRoot}>
      <SEO
        title={t('news.seo.title', 'News & stories from the field')}
        description={t(
          'news.seo.description',
          'Updates, reflections and reports from Caritas Mutare programmes across the Diocese of Mutare.'
        )}
        image={heroImageSource.src}
        canonicalPath="/news"
      />

      <HeroBanner
        image={heroImageSource.src}
        imageAlt={heroImageSource.alt}
        imagePosition={heroImageSource.objectPosition}
        size="standard"
        overlay={0.55}
        eyebrow={t('news.hero.eyebrow', 'Stories & updates')}
        title={t('news.title')}
        subtitle={t('news.hero.subtitle', 'Stories from the field, the diocese, and our programmes.')}
      />

      <Box sx={{ bgcolor: SECTION_BG_ALT, py: { xs: 5, md: 7 }, minHeight: 400 }}>
        <Container maxWidth="lg">
          {isLoading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {error && !isLoading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="error">
                {t('news.error', 'We couldn’t load the news right now. Please try again later.')}
              </Typography>
            </Box>
          )}

          {!isLoading && !error && newsData?.news && newsData.news.length > 0 && (
            <Grid container spacing={3}>
              {(newsData.news as NewsArticle[]).map((article) => {
                const dateStr = new Date(article.published_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
                const meta =
                  article.read_time_minutes != null
                    ? `${dateStr} · ${article.read_time_minutes} ${t('news.minRead', 'min read')}`
                    : dateStr;
                return (
                  <Grid item xs={12} sm={6} md={4} key={article.id}>
                    <StoryCard
                      image={article.featured_image}
                      imageAlt={article.title_en}
                      category={article.category ?? t('home.news.category', 'News')}
                      title={article.title_en}
                      description={article.excerpt_en}
                      meta={meta}
                      cta={t('news.readMore')}
                      onClick={() => navigate(`/news/${article.id}`)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}

          {!isLoading && !error && (!newsData?.news || newsData.news.length === 0) && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
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
