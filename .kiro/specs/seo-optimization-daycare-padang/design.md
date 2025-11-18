# Design Document

## Overview

This document outlines the technical design for implementing comprehensive SEO optimization for the Al-Biruni Preschool & Daycare website. The solution addresses Google Search Console canonical URL issues and implements local SEO strategies to improve rankings for keywords like "daycare padang", "preschool padang", and "daycare sumatera barat".

The implementation leverages Laravel backend for dynamic sitemap generation and Inertia.js React frontend for meta tag management using the `@inertiajs/react` Head component.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Search Engine                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Laravel Application                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Route Layer                              │  │
│  │  - Home Route (/)                                     │  │
│  │  - News Routes (/berita, /berita/{slug})             │  │
│  │  - Sitemap Route (/sitemap.xml)                      │  │
│  │  - Robots Route (/robots.txt)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Controller Layer                            │  │
│  │  - HomeController (with SEO data)                    │  │
│  │  - NewsController (with SEO data)                    │  │
│  │  - SitemapController (XML generation)                │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Inertia Response                         │  │
│  │  - Page props with SEO metadata                      │  │
│  │  - Structured data                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  React Frontend (Inertia)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              SEO Component                            │  │
│  │  - <Head> component with meta tags                   │  │
│  │  - Canonical URL                                      │  │
│  │  - Open Graph tags                                    │  │
│  │  - Twitter Card tags                                  │  │
│  │  - Geo-location tags                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Structured Data Component                     │  │
│  │  - JSON-LD script tag                                │  │
│  │  - LocalBusiness schema                              │  │
│  │  - Article schema (for news)                         │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Page Components                            │  │
│  │  - Home.tsx (with SEO component)                     │  │
│  │  - News pages (with SEO component)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure

```
resources/js/
├── components/
│   └── seo/
│       ├── SEOHead.tsx          # Reusable SEO meta tags component
│       ├── StructuredData.tsx   # JSON-LD structured data component
│       └── types.ts             # TypeScript interfaces for SEO data
├── pages/
│   ├── Home.tsx                 # Homepage with SEO
│   └── berita/
│       ├── index.tsx            # News index with SEO
│       └── show.tsx             # News article with SEO
```

```
app/Http/Controllers/
├── SitemapController.php        # Dynamic sitemap generation
├── HomeController.php           # Homepage with SEO data (modify existing route)
└── NewsController.php           # News pages with SEO data (already exists)
```

## Components and Interfaces

### 1. SEO Head Component

**Purpose**: Reusable React component that renders all SEO-related meta tags using Inertia's Head component.

**Location**: `resources/js/components/seo/SEOHead.tsx`

**Props Interface**:
```typescript
interface SEOProps {
  title: string
  description: string
  canonical: string
  keywords?: string
  ogType?: 'website' | 'article'
  ogImage?: string
  ogImageAlt?: string
  articlePublishedTime?: string
  articleModifiedTime?: string
  noindex?: boolean
}
```

**Key Features**:
- Renders canonical link tag
- Renders meta description
- Renders Open Graph tags (og:title, og:description, og:url, og:type, og:image)
- Renders Twitter Card tags
- Renders geo-location tags (geo.region, geo.placename, geo.position, ICBM)
- Renders meta keywords
- Handles article-specific tags when ogType is 'article'

**Implementation Notes**:
- Uses Inertia's `<Head>` component from `@inertiajs/react`
- Geo-location coordinates for Padang: approximately -0.9471° latitude, 100.4172° longitude
- Default OG image should be Al-Biruni logo or representative image
- All URLs must use https://albiruni.sch.id/ with trailing slash

### 2. Structured Data Component

**Purpose**: Renders JSON-LD structured data for search engines.

**Location**: `resources/js/components/seo/StructuredData.tsx`

**Props Interface**:
```typescript
interface LocalBusinessData {
  name: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode?: string
    addressCountry: string
  }
  telephone: string
  geo: {
    latitude: number
    longitude: number
  }
}

interface StructuredDataProps {
  type: 'organization' | 'article'
  organizationData?: {
    name: string
    url: string
    logo: string
    description: string
    branches: LocalBusinessData[]
    priceRange?: string
    areaServed?: string
  }
  articleData?: {
    headline: string
    datePublished: string
    dateModified: string
    author: string
    image: string
    description: string
    url: string
  }
}
```

**Key Features**:
- Renders JSON-LD script tag
- Supports EducationalOrganization with multiple LocalBusiness branches
- Supports Article schema for news pages
- Includes all required Schema.org properties

**Implementation Notes**:
- Organization type: "EducationalOrganization"
- Two branches: Ulak Karang and Marapalam
- Coordinates need to be obtained for each branch (can use Google Maps)
- Price range: "$$" (moderate pricing)
- Area served: "Padang, Sumatera Barat, Indonesia"

### 3. Sitemap Controller

**Purpose**: Generates dynamic XML sitemap including all published news articles.

**Location**: `app/Http/Controllers/SitemapController.php`

**Methods**:
- `index()`: Returns XML response with sitemap content

**Sitemap Structure**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://albiruni.sch.id/</loc>
        <lastmod>YYYY-MM-DD</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://albiruni.sch.id/berita/</loc>
        <lastmod>YYYY-MM-DD</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <!-- Dynamic news articles -->
    <url>
        <loc>https://albiruni.sch.id/berita/{slug}</loc>
        <lastmod>YYYY-MM-DD</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
</urlset>
```

**Implementation Notes**:
- Query News model where `is_published = true`
- Use `updated_at` for lastmod dates
- Return response with `Content-Type: application/xml`
- Cache sitemap for 1 hour to reduce database queries

### 4. Robots.txt Route

**Purpose**: Provides robots.txt file with crawling instructions.

**Location**: Route in `routes/web.php` returning text response

**Content**:
```
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /guru
Disallow: /orangtua
Disallow: /login
Disallow: /register
Disallow: /api/
Disallow: /kehadiran/

Sitemap: https://albiruni.sch.id/sitemap.xml
```

**Implementation Notes**:
- Return as plain text response with `Content-Type: text/plain`
- Allow public pages (homepage, news)
- Disallow authenticated areas and API endpoints

## Data Models

### SEO Data Structure (passed via Inertia props)

```typescript
// Homepage SEO data
interface HomePageProps {
  latestNews?: News
  otherNews?: News[]
  seo: {
    title: string
    description: string
    canonical: string
    keywords: string
    ogImage: string
  }
  structuredData: {
    organization: OrganizationData
  }
}

// News article SEO data
interface NewsPageProps {
  news: News
  seo: {
    title: string
    description: string
    canonical: string
    keywords: string
    ogImage: string
    articlePublishedTime: string
    articleModifiedTime: string
  }
  structuredData: {
    article: ArticleData
  }
}
```

### Existing News Model

The existing `News` model already has the required fields:
- `title`: For article headline
- `excerpt`: For meta description
- `content`: Article body
- `image_url`: For og:image
- `slug`: For canonical URL
- `published_at`: For article:published_time
- `updated_at`: For article:modified_time
- `is_published`: For filtering in sitemap

No database migrations required.

## Error Handling

### Sitemap Generation Errors

**Scenario**: Database connection fails or News model query errors

**Handling**:
- Log error to Laravel log
- Return minimal sitemap with homepage only
- Set appropriate HTTP status code (200 with minimal content, not 500)

### Missing SEO Data

**Scenario**: SEO props not provided to page component

**Handling**:
- Use default fallback values
- Default title: "Al-Biruni Preschool & Daycare Padang"
- Default description: Generic description about the daycare
- Always include canonical URL even if other data is missing

### Invalid Structured Data

**Scenario**: Missing required fields for Schema.org markup

**Handling**:
- Validate data before rendering JSON-LD
- Skip structured data rendering if critical fields are missing
- Log warning for debugging

## Testing Strategy

### Unit Tests

**Not required for this implementation** - Focus on manual testing and validation tools.

### Manual Testing Checklist

1. **Canonical URL Validation**
   - View page source on homepage
   - Verify `<link rel="canonical" href="https://albiruni.sch.id/" />` exists
   - Verify canonical on news pages uses correct slug

2. **Meta Tags Validation**
   - View page source
   - Verify all meta tags are present (description, OG tags, Twitter tags, geo tags)
   - Verify no duplicate meta tags

3. **Structured Data Validation**
   - Use Google Rich Results Test: https://search.google.com/test/rich-results
   - Paste homepage URL
   - Verify EducationalOrganization and LocalBusiness schemas are valid
   - Paste news article URL
   - Verify Article schema is valid

4. **Sitemap Validation**
   - Access https://albiruni.sch.id/sitemap.xml
   - Verify XML is well-formed
   - Verify all published news articles are included
   - Verify lastmod dates are correct
   - Use XML Sitemap Validator tool

5. **Robots.txt Validation**
   - Access https://albiruni.sch.id/robots.txt
   - Verify content is correct
   - Verify sitemap reference is included

6. **Google Search Console Validation**
   - Submit sitemap to Google Search Console
   - Request indexing for homepage
   - Wait 24-48 hours
   - Check "Pages" report for canonical URL issues
   - Verify "Duplicate, Google chose different canonical than user" is resolved

7. **SEO Tools Validation**
   - Run Lighthouse SEO audit (target score: 90+)
   - Run Google Mobile-Friendly Test
   - Check meta tags with browser extensions (e.g., SEO Meta in 1 Click)

### Integration Testing

**Not required** - Manual validation with Google tools is sufficient.

## Performance Considerations

### Sitemap Caching

- Cache sitemap XML for 1 hour using Laravel cache
- Cache key: `sitemap_xml`
- Invalidate cache when news articles are published/updated
- Reduces database queries for frequent sitemap requests

### Structured Data Size

- JSON-LD adds ~2-3KB to page size
- Minimal impact on page load time
- No optimization needed

### Meta Tags Overhead

- Meta tags add ~1-2KB to HTML head
- Negligible performance impact
- No optimization needed

## Security Considerations

### XSS Prevention

- All SEO data passed through Inertia props is automatically escaped
- React's JSX escapes content by default
- JSON-LD content must be properly escaped (use `dangerouslySetInnerHTML` with sanitized JSON)

### robots.txt Security

- Ensure sensitive routes are properly disallowed
- Do not rely solely on robots.txt for security (use authentication middleware)
- robots.txt is a guideline, not a security measure

## Deployment Considerations

### Environment Variables

No new environment variables required. All configuration uses existing Laravel config.

### Post-Deployment Steps

1. Submit sitemap to Google Search Console
2. Request re-indexing of homepage
3. Monitor Google Search Console for 7 days
4. Verify canonical URL issues are resolved
5. Check rankings for target keywords after 2-4 weeks

### Rollback Plan

If SEO changes cause issues:
1. Remove SEO components from pages (revert to simple title tags)
2. Keep sitemap and robots.txt (no harm in keeping them)
3. Monitor Google Search Console for recovery

## SEO Content Strategy

### Homepage Optimization

**Current title**: "AL-Biruni"
**Optimized title**: "Daycare & Preschool Padang - Al-Biruni Sumatera Barat"

**Meta description** (155 characters):
"Daycare dan preschool terbaik di Padang. Al-Biruni melayani anak usia 1-6 tahun dengan 2 cabang di Ulak Karang dan Marapalam, Sumatera Barat."

**Keywords**:
"daycare padang, preschool padang, day care padang, tk padang, daycare sumatera barat, preschool sumatera barat, daycare ulak karang, daycare marapalam, baby class padang, kindergarten padang"

### Content Updates

**Hero Section** - Add location mention:
Current: "Al-Biruni Preschool & Daycare menyediakan layanan..."
Optimized: "Al-Biruni Preschool & Daycare Padang menyediakan layanan..."

**About Section** - Add location context:
Add sentence: "Dengan 2 cabang di Padang (Ulak Karang dan Marapalam), kami melayani keluarga di seluruh Sumatera Barat."

### News Article Optimization

**Title format**: "{Article Title} - Al-Biruni Daycare Padang"
**Meta description**: Use excerpt (first 160 characters)
**Keywords**: Include "daycare padang" or "preschool padang" in article keywords

## Maintenance and Monitoring

### Ongoing Monitoring

- Check Google Search Console weekly for indexing issues
- Monitor keyword rankings monthly using Google Search Console Performance report
- Review sitemap monthly to ensure all pages are included
- Update structured data if business information changes (address, phone, hours)

### Content Updates

- When adding new pages, ensure SEO component is included
- When updating business information, update structured data
- When publishing news, verify it appears in sitemap within 24 hours

### SEO Audits

- Run Lighthouse SEO audit quarterly
- Review and update meta descriptions quarterly
- Check for broken canonical URLs quarterly
- Validate structured data quarterly with Google Rich Results Test
