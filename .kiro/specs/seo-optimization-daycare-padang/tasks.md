# Implementation Plan

- [x] 1. Create SEO component infrastructure





  - Create TypeScript interfaces for SEO data types
  - Create reusable SEOHead component with all meta tags (canonical, OG, Twitter, geo-location)
  - Create StructuredData component for JSON-LD markup
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 2. Implement homepage SEO optimization





  - [x] 2.1 Update Home.tsx to include SEOHead component with optimized title and meta description


    - Add SEOHead component with title "Daycare & Preschool Padang - Al-Biruni Sumatera Barat"
    - Add meta description mentioning "daycare padang" and both branch locations
    - Add canonical URL https://albiruni.sch.id/
    - Add keywords meta tag with local keywords
    - _Requirements: 1.1, 1.2, 2.1, 2.5, 8.1, 8.4, 8.5_
  
  - [x] 2.2 Add StructuredData component to Home.tsx with organization schema


    - Include EducationalOrganization schema
    - Include both LocalBusiness schemas for Ulak Karang and Marapalam branches
    - Add complete NAP information for each branch
    - Add geo-coordinates for each location
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 2.3 Update hero section content to include "Padang" mention


    - Modify hero-section.tsx to include location in main text
    - Ensure natural keyword integration without stuffing
    - _Requirements: 5.1, 5.2, 5.4_
  
  - [x] 2.4 Update about section content to mention local area


    - Add sentence about serving Padang and Sumatera Barat
    - Mention both branch locations naturally
    - _Requirements: 5.3, 5.4_

- [x] 3. Implement news pages SEO optimization





  - [x] 3.1 Update news index page (berita/index.tsx) with SEO component


    - Add SEOHead component with appropriate title and description
    - Add canonical URL for news index page
    - _Requirements: 1.3, 8.2, 8.3_
  


  - [x] 3.2 Update news article page (berita/show.tsx) with SEO component

    - Add SEOHead component with article-specific meta tags
    - Use news title, excerpt, and image for meta tags
    - Add article:published_time and article:modified_time OG tags
    - Add canonical URL using article slug

    - _Requirements: 1.3, 9.1, 9.2, 9.3, 9.4_
  
  - [x] 3.3 Add Article structured data to news article page

    - Create Article schema with headline, datePublished, dateModified, author, image
    - Use news model data for all schema properties
    - _Requirements: 9.1_
  
  - [x] 3.4 Optimize news article images with alt text


    - Ensure news images have descriptive alt text
    - Include relevant keywords where natural
    - _Requirements: 9.5_

- [x] 4. Create dynamic sitemap functionality





  - [x] 4.1 Create SitemapController with index method


    - Query all published news articles from database
    - Generate XML sitemap structure
    - Include homepage with priority 1.0
    - Include news index with priority 0.8
    - Include all news articles with priority 0.6
    - Use proper lastmod dates from database
    - Return XML response with correct content type
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
  

  - [x] 4.2 Add sitemap route to web.php

    - Create GET route for /sitemap.xml
    - Point route to SitemapController@index
    - _Requirements: 6.1_
  
  - [x] 4.3 Implement sitemap caching for performance

    - Cache sitemap XML for 1 hour
    - Use Laravel cache with key 'sitemap_xml'
    - _Requirements: 6.2_

- [x] 5. Create robots.txt functionality




  - [x] 5.1 Add robots.txt route to web.php


    - Create GET route for /robots.txt
    - Return plain text response with robots directives
    - Allow public pages (/, /berita)
    - Disallow admin, dashboard, auth, and API routes
    - Include sitemap reference
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 6. Update existing controllers to pass SEO data





  - [x] 6.1 Modify home route in web.php to include SEO props


    - Add seo array to Inertia props with title, description, canonical, keywords, ogImage
    - Add structuredData array with organization data
    - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 6.2 Modify NewsController to include SEO props for index page


    - Add seo array to Inertia props for news index
    - _Requirements: 8.2_
  
  - [x] 6.3 Modify NewsController to include SEO props for article pages


    - Add seo array with article-specific data
    - Add structuredData array with article schema data
    - Use news model fields (title, excerpt, image_url, slug, published_at, updated_at)
    - _Requirements: 8.2, 8.3, 9.1, 9.2, 9.3, 9.4_

- [x] 7. Validation and testing





  - [x] 7.1 Validate canonical URLs in page source


    - Check homepage source for correct canonical tag
    - Check news pages source for correct canonical tags
    - Verify all URLs use https:// and trailing slashes
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  

  - [x] 7.2 Validate meta tags completeness






    - Verify all required meta tags are present (description, OG, Twitter, geo)
    - Check for duplicate meta tags
    - Verify meta descriptions are within 150-160 characters
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_

  
  - [x] 7.3 Validate structured data with Google Rich Results Test




    - Test homepage URL in Google Rich Results Test
    - Verify EducationalOrganization and LocalBusiness schemas pass validation
    - Test news article URL in Google Rich Results Test
    - Verify Article schema passes validation

    - _Requirements: 4.6, 10.2_
  
  - [x] 7.4 Validate sitemap functionality





    - Access /sitemap.xml and verify XML is well-formed
    - Verify all published news articles are included
    - Verify lastmod dates are correct

    - Verify priorities and changefreq values are correct
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
  
  - [x] 7.5 Validate robots.txt




    - Access /robots.txt and verify content is correct

    - Verify sitemap reference is included
    - Verify sensitive routes are disallowed
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 7.6 Run Lighthouse SEO audit

    - Run Lighthouse audit on homepage
    - Verify SEO score is 90 or above
    - Address any critical issues found
    - _Requirements: 10.4_
  
  - [x] 7.7 Validate with Google Search Console


    - Submit sitemap to Google Search Console
    - Request indexing for homepage
    - Monitor for canonical URL warnings
    - Verify "Duplicate, Google chose different canonical than user" issue is resolved
    - _Requirements: 10.5_

- [x] 8. Update sitemap.xml file



  - [x] 8.1 Replace static public/sitemap.xml with redirect or remove it


    - Remove or update the existing static sitemap.xml file
    - Ensure /sitemap.xml route serves the dynamic sitemap
    - _Requirements: 6.1_

- [x] 9. Documentation and handoff





  - [x] 9.1 Document SEO component usage


    - Add comments to SEOHead component explaining props
    - Add comments to StructuredData component explaining props
    - _Requirements: All_
  
  - [x] 9.2 Create SEO maintenance checklist


    - Document how to update business information in structured data
    - Document how to verify SEO is working after content updates
    - Document Google Search Console monitoring process
    - _Requirements: All_
