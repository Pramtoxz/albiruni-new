/**
 * TypeScript interfaces for SEO data types
 */

import { OrganizationData } from ".";

/**
 * Props for SEOHead component
 * 
 * @property {string} title - Page title (50-60 characters recommended)
 * @property {string} description - Meta description (150-160 characters recommended)
 * @property {string} canonical - Full canonical URL
 * @property {string} [keywords] - Optional comma-separated keywords
 * @property {'website' | 'article'} [ogType] - Open Graph type
 * @property {string} [ogImage] - Full URL to OG image (1200x630px recommended)
 * @property {string} [ogImageAlt] - Alt text for OG image
 * @property {string} [articlePublishedTime] - ISO 8601 date for article publication
 * @property {string} [articleModifiedTime] - ISO 8601 date for article modification
 * @property {boolean} [noindex] - Prevent search engine indexing
 */
export interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  ogImageAlt?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  noindex?: boolean;
}

/**
 * Data structure for a local business branch
 * 
 * @property {string} name - Branch name (e.g., "Al-Biruni Preschool Cabang Utama")
 * @property {object} address - Physical address of the branch
 * @property {string} telephone - Phone number with country code (e.g., "+62-751-123456")
 * @property {object} geo - Geographic coordinates for map display
 */
export interface LocalBusinessData {
  name: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  telephone: string;
  geo: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Data structure for organization structured data
 * 
 * @property {string} name - Organization name
 * @property {string} url - Website URL
 * @property {string} logo - Full URL to logo image
 * @property {string} description - Brief description of the organization
 * @property {LocalBusinessData[]} branches - Array of business locations
 * @property {string} [priceRange] - Price range indicator (e.g., '


/**
 * Data structure for article structured data
 * 
 * @property {string} headline - Article title/headline
 * @property {string} datePublished - ISO 8601 publication date
 * @property {string} dateModified - ISO 8601 last modified date
 * @property {string} author - Author name or organization
 * @property {string} image - Full URL to article featured image
 * @property {string} description - Article summary/excerpt
 * @property {string} url - Full canonical URL of the article
 */
export interface ArticleData {
  headline: string;
  datePublished: string;
  dateModified: string;
  author: string;
  image: string;
  description: string;
  url: string;
}

/**
 * Props for StructuredData component
 * 
 * @property {'organization' | 'article'} type - Type of structured data to render
 * @property {OrganizationData} [organizationData] - Required when type='organization'
 * @property {ArticleData} [articleData] - Required when type='article'
 */
export interface StructuredDataProps {
  type: 'organization' | 'article';
  organizationData?: OrganizationData;
  articleData?: ArticleData;
}
