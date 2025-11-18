import { Head } from '@inertiajs/react';
import { SEOProps } from './types';

/**
 * SEOHead Component
 * 
 * Reusable component that renders all SEO-related meta tags including:
 * - Canonical URL
 * - Meta description
 * - Open Graph tags
 * - Twitter Card tags
 * - Geo-location tags
 * - Keywords
 * - Article-specific tags (when ogType is 'article')
 * 
 * @param {string} title - Page title that appears in browser tab and search results (50-60 characters recommended)
 * @param {string} description - Meta description for search results (150-160 characters recommended)
 * @param {string} canonical - Full canonical URL of the page (e.g., 'https://albiruni.sch.id/berita/slug')
 * @param {string} [keywords] - Optional comma-separated keywords for the page
 * @param {string} [ogType='website'] - Open Graph type: 'website' for general pages, 'article' for news/blog posts
 * @param {string} [ogImage='/logo.svg'] - Full URL to Open Graph image (1200x630px recommended)
 * @param {string} [ogImageAlt='Al-Biruni Preschool & Daycare Padang'] - Alt text for Open Graph image
 * @param {string} [articlePublishedTime] - ISO 8601 date string for article publication (required when ogType='article')
 * @param {string} [articleModifiedTime] - ISO 8601 date string for article last modification (optional for articles)
 * @param {boolean} [noindex=false] - Set to true to prevent search engines from indexing this page
 * 
 * @example
 * // Basic usage for a general page
 * <SEOHead
 *   title="Tentang Kami - Al-Biruni Preschool & Daycare"
 *   description="Al-Biruni adalah preschool dan daycare terbaik di Padang dengan kurikulum berkualitas."
 *   canonical="https://albiruni.sch.id/tentang"
 *   keywords="preschool padang, daycare padang, pendidikan anak"
 * />
 * 
 * @example
 * // Usage for an article/news page
 * <SEOHead
 *   title="Judul Berita - Al-Biruni"
 *   description="Ringkasan berita dalam 150-160 karakter"
 *   canonical="https://albiruni.sch.id/berita/slug-berita"
 *   ogType="article"
 *   ogImage="https://albiruni.sch.id/storage/news-image.jpg"
 *   articlePublishedTime="2024-01-15T10:00:00+07:00"
 *   articleModifiedTime="2024-01-16T14:30:00+07:00"
 * />
 */
export default function SEOHead({
  title,
  description,
  canonical,
  keywords,
  ogType = 'website',
  ogImage = '/logo.svg',
  ogImageAlt = 'Al-Biruni Preschool & Daycare Padang',
  articlePublishedTime,
  articleModifiedTime,
  noindex = false,
}: SEOProps) {
  // Geo-location coordinates for Padang, Sumatera Barat
  const padangLat = -0.9471;
  const padangLon = 100.4172;
  const geoPosition = `${padangLat};${padangLon}`;
  const icbmCoords = `${padangLat}, ${padangLon}`;

  return (
    <Head>
      {/* Page Title */}
      <title>{title}</title>

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Meta Description */}
      <meta name="description" content={description} />

      {/* Keywords */}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Viewport (for mobile responsiveness) */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content="Al-Biruni Preschool & Daycare" />
      <meta property="og:locale" content="id_ID" />

      {/* Article-specific Open Graph tags */}
      {ogType === 'article' && articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {ogType === 'article' && articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* Geo-location Tags for Local SEO */}
      <meta name="geo.region" content="ID-SB" />
      <meta name="geo.placename" content="Padang" />
      <meta name="geo.position" content={geoPosition} />
      <meta name="ICBM" content={icbmCoords} />
    </Head>
  );
}
