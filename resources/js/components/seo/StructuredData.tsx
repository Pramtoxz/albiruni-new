import { StructuredDataProps } from './types';

/**
 * StructuredData Component
 * 
 * Renders JSON-LD structured data for search engines to improve rich snippets and local SEO.
 * Supports:
 * - EducationalOrganization with multiple LocalBusiness branches
 * - Article schema for news pages
 * 
 * @param {string} type - Type of structured data: 'organization' or 'article'
 * @param {OrganizationData} [organizationData] - Required when type='organization'. Contains business information including:
 *   - name: Organization name
 *   - url: Website URL
 *   - logo: Full URL to logo image
 *   - description: Brief description of the organization
 *   - branches: Array of LocalBusiness objects with address, phone, and geo coordinates
 *   - priceRange: Optional price range (e.g., '$$')
 *   - areaServed: Optional service area (defaults to 'Padang, Sumatera Barat, Indonesia')
 * @param {ArticleData} [articleData] - Required when type='article'. Contains article information including:
 *   - headline: Article title
 *   - datePublished: ISO 8601 publication date
 *   - dateModified: ISO 8601 last modified date
 *   - author: Author name
 *   - image: Full URL to featured image
 *   - description: Article summary
 *   - url: Full canonical URL
 * 
 * @example
 * // Organization structured data for homepage
 * <StructuredData
 *   type="organization"
 *   organizationData={{
 *     name: "Al-Biruni Preschool & Daycare",
 *     url: "https://albiruni.sch.id",
 *     logo: "https://albiruni.sch.id/logo.svg",
 *     description: "Preschool dan daycare terbaik di Padang",
 *     branches: [
 *       {
 *         name: "Al-Biruni Cabang Utama",
 *         address: {
 *           streetAddress: "Jl. Contoh No. 123",
 *           addressLocality: "Padang",
 *           addressRegion: "Sumatera Barat",
 *           postalCode: "25000",
 *           addressCountry: "ID"
 *         },
 *         telephone: "+62-751-123456",
 *         geo: { latitude: -0.9471, longitude: 100.4172 }
 *       }
 *     ]
 *   }}
 * />
 * 
 * @example
 * // Article structured data for news page
 * <StructuredData
 *   type="article"
 *   articleData={{
 *     headline: "Judul Berita",
 *     datePublished: "2024-01-15T10:00:00+07:00",
 *     dateModified: "2024-01-16T14:30:00+07:00",
 *     author: "Al-Biruni Preschool & Daycare",
 *     image: "https://albiruni.sch.id/storage/news-image.jpg",
 *     description: "Ringkasan berita",
 *     url: "https://albiruni.sch.id/berita/slug-berita"
 *   }}
 * />
 */
export default function StructuredData({
  type,
  organizationData,
  articleData,
}: StructuredDataProps) {
  let structuredData: any = null;

  if (type === 'organization' && organizationData) {
    // Create EducationalOrganization schema with LocalBusiness branches
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: organizationData.name,
      url: organizationData.url,
      logo: organizationData.logo,
      description: organizationData.description,
      priceRange: organizationData.priceRange || '$$',
      areaServed: organizationData.areaServed || 'Padang, Sumatera Barat, Indonesia',
      // Add branches as separate LocalBusiness entities
      location: organizationData.branches.map((branch) => ({
        '@type': 'LocalBusiness',
        name: branch.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: branch.address.streetAddress,
          addressLocality: branch.address.addressLocality,
          addressRegion: branch.address.addressRegion,
          postalCode: branch.address.postalCode,
          addressCountry: branch.address.addressCountry,
        },
        telephone: branch.telephone,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: branch.geo.latitude,
          longitude: branch.geo.longitude,
        },
      })),
    };
  } else if (type === 'article' && articleData) {
    // Create Article schema for news pages
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: articleData.headline,
      datePublished: articleData.datePublished,
      dateModified: articleData.dateModified,
      author: {
        '@type': 'Organization',
        name: articleData.author,
      },
      image: articleData.image,
      description: articleData.description,
      url: articleData.url,
      publisher: {
        '@type': 'Organization',
        name: 'Al-Biruni Preschool & Daycare',
        logo: {
          '@type': 'ImageObject',
          url: 'https://albiruni.sch.id/logo.svg',
        },
      },
    };
  }

  if (!structuredData) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
