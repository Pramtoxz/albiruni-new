/**
 * Structured Data Validation Script
 * 
 * This script helps validate the structured data implementation
 * by extracting JSON-LD from rendered pages and checking for required fields.
 * 
 * For full validation, use Google Rich Results Test:
 * https://search.google.com/test/rich-results
 */

import fs from 'fs';
import path from 'path';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateOrganizationSchema(schema) {
  const errors = [];
  const warnings = [];

  // Required fields for EducationalOrganization
  if (!schema['@type'] || schema['@type'] !== 'EducationalOrganization') {
    errors.push('Missing or incorrect @type (should be "EducationalOrganization")');
  }

  if (!schema.name) {
    errors.push('Missing required field: name');
  }

  if (!schema.url) {
    errors.push('Missing required field: url');
  }

  if (!schema.logo) {
    warnings.push('Missing recommended field: logo');
  }

  if (!schema.description) {
    warnings.push('Missing recommended field: description');
  }

  // Validate LocalBusiness branches
  if (!schema.location || !Array.isArray(schema.location)) {
    errors.push('Missing or invalid location array (LocalBusiness branches)');
  } else {
    schema.location.forEach((branch, index) => {
      if (branch['@type'] !== 'LocalBusiness') {
        errors.push(`Branch ${index + 1}: Incorrect @type (should be "LocalBusiness")`);
      }

      if (!branch.name) {
        errors.push(`Branch ${index + 1}: Missing name`);
      }

      if (!branch.address || branch.address['@type'] !== 'PostalAddress') {
        errors.push(`Branch ${index + 1}: Missing or invalid address`);
      } else {
        const addr = branch.address;
        if (!addr.streetAddress) errors.push(`Branch ${index + 1}: Missing streetAddress`);
        if (!addr.addressLocality) errors.push(`Branch ${index + 1}: Missing addressLocality`);
        if (!addr.addressRegion) errors.push(`Branch ${index + 1}: Missing addressRegion`);
        if (!addr.addressCountry) errors.push(`Branch ${index + 1}: Missing addressCountry`);
      }

      if (!branch.telephone) {
        warnings.push(`Branch ${index + 1}: Missing telephone`);
      }

      if (!branch.geo || branch.geo['@type'] !== 'GeoCoordinates') {
        errors.push(`Branch ${index + 1}: Missing or invalid geo coordinates`);
      } else {
        if (typeof branch.geo.latitude !== 'number') {
          errors.push(`Branch ${index + 1}: Invalid latitude`);
        }
        if (typeof branch.geo.longitude !== 'number') {
          errors.push(`Branch ${index + 1}: Invalid longitude`);
        }
      }
    });
  }

  return { errors, warnings };
}

function validateArticleSchema(schema) {
  const errors = [];
  const warnings = [];

  // Required fields for Article
  if (!schema['@type'] || schema['@type'] !== 'Article') {
    errors.push('Missing or incorrect @type (should be "Article")');
  }

  if (!schema.headline) {
    errors.push('Missing required field: headline');
  }

  if (!schema.datePublished) {
    errors.push('Missing required field: datePublished');
  } else {
    // Validate ISO 8601 format
    const date = new Date(schema.datePublished);
    if (isNaN(date.getTime())) {
      errors.push('Invalid datePublished format (should be ISO 8601)');
    }
  }

  if (!schema.dateModified) {
    warnings.push('Missing recommended field: dateModified');
  } else {
    const date = new Date(schema.dateModified);
    if (isNaN(date.getTime())) {
      warnings.push('Invalid dateModified format (should be ISO 8601)');
    }
  }

  if (!schema.author) {
    errors.push('Missing required field: author');
  } else if (!schema.author['@type'] || !schema.author.name) {
    errors.push('Invalid author structure (should have @type and name)');
  }

  if (!schema.image) {
    warnings.push('Missing recommended field: image');
  }

  if (!schema.publisher) {
    errors.push('Missing required field: publisher');
  } else {
    if (!schema.publisher['@type'] || schema.publisher['@type'] !== 'Organization') {
      errors.push('Invalid publisher @type (should be "Organization")');
    }
    if (!schema.publisher.name) {
      errors.push('Missing publisher name');
    }
    if (!schema.publisher.logo || !schema.publisher.logo.url) {
      errors.push('Missing publisher logo');
    }
  }

  return { errors, warnings };
}

function printValidationResults(type, results) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`Validation Results: ${type}`, 'cyan');
  log('='.repeat(60), 'cyan');

  if (results.errors.length === 0 && results.warnings.length === 0) {
    log('✓ All checks passed!', 'green');
  } else {
    if (results.errors.length > 0) {
      log(`\n❌ Errors (${results.errors.length}):`, 'red');
      results.errors.forEach((error, i) => {
        log(`  ${i + 1}. ${error}`, 'red');
      });
    }

    if (results.warnings.length > 0) {
      log(`\n⚠ Warnings (${results.warnings.length}):`, 'yellow');
      results.warnings.forEach((warning, i) => {
        log(`  ${i + 1}. ${warning}`, 'yellow');
      });
    }
  }
}

// Example schemas for validation
const exampleOrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Al-Biruni Preschool & Daycare',
  url: 'https://albiruni.sch.id/',
  logo: 'https://albiruni.sch.id/logo.svg',
  description: 'Daycare dan preschool terbaik di Padang untuk anak usia 1-6 tahun',
  priceRange: '$',
  areaServed: 'Padang, Sumatera Barat, Indonesia',
  location: [
    {
      '@type': 'LocalBusiness',
      name: 'Al-Biruni Preschool & Daycare - Ulak Karang',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. S. Parman No. 5',
        addressLocality: 'Padang',
        addressRegion: 'Sumatera Barat',
        postalCode: '25000',
        addressCountry: 'ID',
      },
      telephone: '+62-751-7051234',
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -0.9471,
        longitude: 100.4172,
      },
    },
    {
      '@type': 'LocalBusiness',
      name: 'Al-Biruni Preschool & Daycare - Marapalam',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Marapalam Raya',
        addressLocality: 'Padang',
        addressRegion: 'Sumatera Barat',
        postalCode: '25000',
        addressCountry: 'ID',
      },
      telephone: '+62-751-7051235',
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -0.9500,
        longitude: 100.4200,
      },
    },
  ],
};

const exampleArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Example News Article Title',
  datePublished: '2024-01-15T10:00:00Z',
  dateModified: '2024-01-15T10:00:00Z',
  author: {
    '@type': 'Organization',
    name: 'Al-Biruni Preschool & Daycare',
  },
  image: 'https://albiruni.sch.id/assets/images/news/example.jpg',
  description: 'Example article description',
  url: 'https://albiruni.sch.id/berita/example-slug',
  publisher: {
    '@type': 'Organization',
    name: 'Al-Biruni Preschool & Daycare',
    logo: {
      '@type': 'ImageObject',
      url: 'https://albiruni.sch.id/logo.svg',
    },
  },
};

// Run validations
log('\n🔍 Structured Data Validation Tool', 'blue');
log('This tool validates the structure of JSON-LD schemas\n', 'blue');

// Validate Organization Schema
const orgResults = validateOrganizationSchema(exampleOrganizationSchema);
printValidationResults('EducationalOrganization Schema', orgResults);

// Validate Article Schema
const articleResults = validateArticleSchema(exampleArticleSchema);
printValidationResults('Article Schema', articleResults);

// Instructions for Google Rich Results Test
log('\n' + '='.repeat(60), 'cyan');
log('Next Steps: Google Rich Results Test', 'cyan');
log('='.repeat(60), 'cyan');
log('\n📋 To complete validation, test your live URLs:', 'yellow');
log('\n1. Homepage (Organization Schema):', 'white');
log('   URL: https://albiruni.sch.id/', 'cyan');
log('   Test: https://search.google.com/test/rich-results', 'cyan');
log('   Expected: EducationalOrganization + 2 LocalBusiness entities', 'white');

log('\n2. News Article (Article Schema):', 'white');
log('   URL: https://albiruni.sch.id/berita/[any-published-article-slug]', 'cyan');
log('   Test: https://search.google.com/test/rich-results', 'cyan');
log('   Expected: Article schema with all required fields', 'white');

log('\n📝 Validation Checklist:', 'yellow');
log('   □ Homepage passes Rich Results Test', 'white');
log('   □ EducationalOrganization schema detected', 'white');
log('   □ Both LocalBusiness branches detected', 'white');
log('   □ No errors in organization schema', 'white');
log('   □ News article passes Rich Results Test', 'white');
log('   □ Article schema detected', 'white');
log('   □ No errors in article schema', 'white');
log('   □ All required fields present', 'white');

log('\n💡 Tips:', 'yellow');
log('   - Make sure your site is accessible (not localhost)', 'white');
log('   - Use a published news article for testing', 'white');
log('   - Check for any warnings in addition to errors', 'white');
log('   - Verify geo-coordinates are accurate', 'white');

log('\n' + '='.repeat(60) + '\n', 'cyan');
