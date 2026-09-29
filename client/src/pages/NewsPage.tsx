import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Stack,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import HeroBanner from '../components/HeroBanner';
import StoryCard from '../components/StoryCard';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/LoadingSpinner';
import BackToTopButton from '../components/BackToTopButton';
import {
  SECTION_BG_ALT,
  pageRoot,
  outlineCard,
  sectionVerticalPadding,
} from '../lib/sitePageLayout';
import { apiGet } from '../lib/api';

const newsSectionSx: SxProps<Theme> = [
  sectionVerticalPadding,
  { bgcolor: SECTION_BG_ALT, minHeight: 360 },
] as SxProps<Theme>;

const quietCardSx: SxProps<Theme> = [
  outlineCard,
  { p: { xs: 3, md: 4 }, maxWidth: 560, mx: 'auto', textAlign: 'center' },
] as SxProps<Theme>;

const quietCardLooseSx: SxProps<Theme> = [
  outlineCard,
  { p: { xs: 3, md: 4.5 }, maxWidth: 560, mx: 'auto', textAlign: 'center' },
] as SxProps<Theme>;

const quietTitleSx: SxProps<Theme> = {
  fontFamily: '"Merriweather", Georgia, serif',
  fontWeight: 700,
  fontSize: '1.35rem',
  mb: 1.5,
};

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

  const { data: newsData, isLoading, error } = useQuery('news', () =>
    apiGet<{ news?: NewsArticle[] }>('/api/news', { limit: 24, page: 1 })
  );

  const heroImageSource = {
    src: '/images/general/community-gathering-1.png',
    alt: 'Caritas Mutare community engagement in the Diocese of Mutare',
    objectPosition: 'center 35%',
  };

  const articles = (newsData?.news ?? []) as NewsArticle[];
  const hasError = Boolean(error) && !isLoading;
  const hasArticles = !isLoading && !hasError && articles.length > 0;
  const isEmpty = !isLoading && !hasError && articles.length === 0;

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
        subtitle={t('news.hero.subtitle', 'Stories from the field, the Diocese, and our programmes.')}
      />

      <Box sx={newsSectionSx}>
        <Container maxWidth="lg">
          {isLoading && <LoadingSpinner />}

          {hasError && (
            <Box sx={quietCardSx}>
              <Typography variant="h2" sx={quietTitleSx}>
                {t('news.errorTitle', 'Stories are not available just now')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
                {t('news.error', 'We couldn’t load the news right now. Please try again later.')}
              </Typography>
              <Button variant="outlined" onClick={() => navigate('/contact')} sx={{ textTransform: 'none', fontWeight: 700 }}>
                {t('nav.contact')}
              </Button>
            </Box>
          )}

          {hasArticles && (
            <Grid container spacing={3}>
              {articles.map((article) => {
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

          {isEmpty && (
            <Box sx={quietCardLooseSx}>
              <Typography variant="h2" sx={quietTitleSx}>
                {t('news.emptyTitle', 'No stories published yet')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
                {t(
                  'news.emptyBody',
                  'New stories from our programmes will appear here soon. In the meantime, explore our programmes or get in touch with the office.'
                )}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
                <Button
                  variant="contained"
                  onClick={() => navigate('/programs')}
                  sx={{ textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
                >
                  {t('nav.programs')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/contact')}
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                >
                  {t('nav.contact')}
                </Button>
              </Stack>
            </Box>
          )}
        </Container>
      </Box>
      <BackToTopButton />
    </Box>
  );
};

export default NewsPage;
