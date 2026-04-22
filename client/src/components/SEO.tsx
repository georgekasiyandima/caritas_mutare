import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  canonicalPath?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
}

const SITE_NAME = 'Caritas Mutare';
const DEFAULT_DESCRIPTION =
  'Caritas Mutare is the development and humanitarian arm of the Catholic Diocese of Mutare, Zimbabwe — serving communities with dignity, solidarity and practical support.';
const DEFAULT_IMAGE = '/images/logo/caritas-mutare-new-logo.png';

function absoluteUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (typeof window === 'undefined') return path;
  const origin = window.location.origin;
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  canonicalPath,
  type = 'website',
  publishedAt,
}) => {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — Caritas Zimbabwe Roman Catholic Diocese of Mutare`;
  const canonical = absoluteUrl(canonicalPath);
  const ogImage = absoluteUrl(image);

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};

export default SEO;
