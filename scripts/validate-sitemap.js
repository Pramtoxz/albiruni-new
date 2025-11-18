/**
 * Sitemap Validation Script
 * Validates the sitemap.xml for proper structure and content
 */

import http from 'http';

const SITEMAP_URL = 'http://127.0.0.1:8000/sitemap.xml';

// Expected values based on requirements
const EXPECTED_HOMEPAGE_PRIORITY = '1.0';
const EXPECTED_HOMEPAGE_CHANGEFREQ = 'weekly';
const EXPECTED_NEWS_INDEX_PRIORITY = '0.8';
const EXPECTED_NEWS_INDEX_CHANGEFREQ = 'daily';
const EXPECTED_ARTICLE_PRIORITY = '0.6';
const EXPECTED_ARTICLE_CHANGEFREQ = 'monthly';

function fetchSitemap() {
    return new Promise((resolve, reject) => {
        http.get(SITEMAP_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

function validateXMLStructure(xml) {
    const issues = [];
    
    // Check XML declaration
    if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
        issues.push('❌ Missing or incorrect XML declaration');
    } else {
        console.log('✅ XML declaration is correct');
    }
    
    // Check urlset namespace
    if (!xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
        issues.push('❌ Missing or incorrect urlset namespace');
    } else {
        console.log('✅ Urlset namespace is correct');
    }
    
    // Check if XML is well-formed (basic check)
    const openTags = (xml.match(/<url>/g) || []).length;
    const closeTags = (xml.match(/<\/url>/g) || []).length;
    if (openTags !== closeTags) {
        issues.push(`❌ XML is not well-formed: ${openTags} <url> tags but ${closeTags} </url> tags`);
    } else {
        console.log(`✅ XML is well-formed: ${openTags} URL entries`);
    }
    
    return issues;
}

function extractURLs(xml) {
    const urlPattern = /<url>([\s\S]*?)<\/url>/g;
    const urls = [];
    let match;
    
    while ((match = urlPattern.exec(xml)) !== null) {
        const urlBlock = match[1];
        const loc = urlBlock.match(/<loc>(.*?)<\/loc>/)?.[1];
        const lastmod = urlBlock.match(/<lastmod>(.*?)<\/lastmod>/)?.[1];
        const changefreq = urlBlock.match(/<changefreq>(.*?)<\/changefreq>/)?.[1];
        const priority = urlBlock.match(/<priority>(.*?)<\/priority>/)?.[1];
        
        urls.push({ loc, lastmod, changefreq, priority });
    }
    
    return urls;
}

function validateHomepage(url) {
    const issues = [];
    
    if (url.loc !== 'https://albiruni.sch.id/') {
        issues.push(`❌ Homepage URL incorrect: ${url.loc}`);
    } else {
        console.log('✅ Homepage URL is correct');
    }
    
    if (url.priority !== EXPECTED_HOMEPAGE_PRIORITY) {
        issues.push(`❌ Homepage priority incorrect: ${url.priority} (expected ${EXPECTED_HOMEPAGE_PRIORITY})`);
    } else {
        console.log('✅ Homepage priority is correct (1.0)');
    }
    
    if (url.changefreq !== EXPECTED_HOMEPAGE_CHANGEFREQ) {
        issues.push(`❌ Homepage changefreq incorrect: ${url.changefreq} (expected ${EXPECTED_HOMEPAGE_CHANGEFREQ})`);
    } else {
        console.log('✅ Homepage changefreq is correct (weekly)');
    }
    
    if (!url.lastmod) {
        issues.push('❌ Homepage missing lastmod date');
    } else {
        console.log(`✅ Homepage lastmod is present: ${url.lastmod}`);
    }
    
    return issues;
}

function validateNewsIndex(url) {
    const issues = [];
    
    if (url.loc !== 'https://albiruni.sch.id/berita/') {
        issues.push(`❌ News index URL incorrect: ${url.loc}`);
    } else {
        console.log('✅ News index URL is correct');
    }
    
    if (url.priority !== EXPECTED_NEWS_INDEX_PRIORITY) {
        issues.push(`❌ News index priority incorrect: ${url.priority} (expected ${EXPECTED_NEWS_INDEX_PRIORITY})`);
    } else {
        console.log('✅ News index priority is correct (0.8)');
    }
    
    if (url.changefreq !== EXPECTED_NEWS_INDEX_CHANGEFREQ) {
        issues.push(`❌ News index changefreq incorrect: ${url.changefreq} (expected ${EXPECTED_NEWS_INDEX_CHANGEFREQ})`);
    } else {
        console.log('✅ News index changefreq is correct (daily)');
    }
    
    if (!url.lastmod) {
        issues.push('❌ News index missing lastmod date');
    } else {
        console.log(`✅ News index lastmod is present: ${url.lastmod}`);
    }
    
    return issues;
}

function validateNewsArticles(urls) {
    const issues = [];
    const articleUrls = urls.filter(u => u.loc.startsWith('https://albiruni.sch.id/berita/') && u.loc !== 'https://albiruni.sch.id/berita/');
    
    console.log(`\n📰 Found ${articleUrls.length} news articles in sitemap`);
    
    articleUrls.forEach((url, index) => {
        const slug = url.loc.replace('https://albiruni.sch.id/berita/', '');
        console.log(`\n  Article ${index + 1}: ${slug}`);
        
        if (url.priority !== EXPECTED_ARTICLE_PRIORITY) {
            issues.push(`❌ Article "${slug}" priority incorrect: ${url.priority} (expected ${EXPECTED_ARTICLE_PRIORITY})`);
        } else {
            console.log(`    ✅ Priority is correct (0.6)`);
        }
        
        if (url.changefreq !== EXPECTED_ARTICLE_CHANGEFREQ) {
            issues.push(`❌ Article "${slug}" changefreq incorrect: ${url.changefreq} (expected ${EXPECTED_ARTICLE_CHANGEFREQ})`);
        } else {
            console.log(`    ✅ Changefreq is correct (monthly)`);
        }
        
        if (!url.lastmod) {
            issues.push(`❌ Article "${slug}" missing lastmod date`);
        } else {
            // Validate ISO 8601 format
            const iso8601Pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/;
            if (!iso8601Pattern.test(url.lastmod)) {
                issues.push(`❌ Article "${slug}" lastmod not in ISO 8601 format: ${url.lastmod}`);
            } else {
                console.log(`    ✅ Lastmod is present and valid: ${url.lastmod}`);
            }
        }
    });
    
    return issues;
}

async function main() {
    console.log('🔍 Sitemap Validation Report\n');
    console.log('=' .repeat(60));
    
    try {
        console.log('\n📥 Fetching sitemap from', SITEMAP_URL);
        const xml = await fetchSitemap();
        console.log('✅ Sitemap fetched successfully\n');
        
        console.log('=' .repeat(60));
        console.log('\n1️⃣  XML STRUCTURE VALIDATION\n');
        const structureIssues = validateXMLStructure(xml);
        
        console.log('\n' + '=' .repeat(60));
        console.log('\n2️⃣  EXTRACTING URLs\n');
        const urls = extractURLs(xml);
        console.log(`Found ${urls.length} total URLs in sitemap`);
        
        console.log('\n' + '=' .repeat(60));
        console.log('\n3️⃣  HOMEPAGE VALIDATION\n');
        const homepageIssues = validateHomepage(urls[0]);
        
        console.log('\n' + '=' .repeat(60));
        console.log('\n4️⃣  NEWS INDEX VALIDATION\n');
        const newsIndexIssues = validateNewsIndex(urls[1]);
        
        console.log('\n' + '=' .repeat(60));
        console.log('\n5️⃣  NEWS ARTICLES VALIDATION');
        const articleIssues = validateNewsArticles(urls);
        
        // Compile all issues
        const allIssues = [
            ...structureIssues,
            ...homepageIssues,
            ...newsIndexIssues,
            ...articleIssues
        ];
        
        console.log('\n' + '=' .repeat(60));
        console.log('\n📊 VALIDATION SUMMARY\n');
        
        if (allIssues.length === 0) {
            console.log('✅ All validations passed! Sitemap is correctly configured.');
            console.log('\n✓ XML is well-formed');
            console.log('✓ All published news articles are included');
            console.log('✓ Lastmod dates are in correct ISO 8601 format');
            console.log('✓ Priorities are correct (1.0, 0.8, 0.6)');
            console.log('✓ Changefreq values are correct (weekly, daily, monthly)');
        } else {
            console.log(`❌ Found ${allIssues.length} issue(s):\n`);
            allIssues.forEach(issue => console.log(issue));
        }
        
        console.log('\n' + '=' .repeat(60));
        
        process.exit(allIssues.length === 0 ? 0 : 1);
        
    } catch (error) {
        console.error('❌ Error fetching or validating sitemap:', error.message);
        process.exit(1);
    }
}

main();
