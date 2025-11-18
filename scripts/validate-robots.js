/**
 * Robots.txt Validation Script
 * Validates that robots.txt meets all SEO requirements
 */

import http from 'http';

const ROBOTS_URL = 'http://127.0.0.1:8000/robots.txt';

// Expected content patterns
const REQUIRED_PATTERNS = {
  userAgent: /User-agent:\s*\*/,
  allowRoot: /Allow:\s*\//,
  disallowDashboard: /Disallow:\s*\/dashboard/,
  disallowAdmin: /Disallow:\s*\/admin/,
  disallowGuru: /Disallow:\s*\/guru/,
  disallowOrangtua: /Disallow:\s*\/orangtua/,
  disallowLogin: /Disallow:\s*\/login/,
  disallowRegister: /Disallow:\s*\/register/,
  disallowApi: /Disallow:\s*\/api\//,
  disallowKehadiran: /Disallow:\s*\/kehadiran\//,
  sitemapReference: /Sitemap:\s*https:\/\/albiruni\.sch\.id\/sitemap\.xml/
};

function fetchRobotsTxt() {
  return new Promise((resolve, reject) => {
    http.get(ROBOTS_URL, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({ content: data, statusCode: res.statusCode, contentType: res.headers['content-type'] });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function validateRobotsTxt() {
  console.log('🤖 Validating robots.txt...\n');
  
  let allPassed = true;
  const results = [];
  
  try {
    const { content, statusCode, contentType } = await fetchRobotsTxt();
    
    // Check 1: Accessible at /robots.txt
    if (statusCode === 200) {
      console.log('✅ Requirement 7.1: robots.txt is accessible at /robots.txt');
      results.push({ requirement: '7.1', status: 'PASS', message: 'robots.txt accessible' });
    } else {
      console.log(`❌ Requirement 7.1: robots.txt returned status ${statusCode}`);
      results.push({ requirement: '7.1', status: 'FAIL', message: `Status code: ${statusCode}` });
      allPassed = false;
    }
    
    // Check 2: Content-Type is text/plain
    if (contentType && contentType.includes('text/plain')) {
      console.log('✅ Content-Type is text/plain');
    } else {
      console.log(`⚠️  Content-Type is ${contentType} (expected text/plain)`);
    }
    
    console.log('\n📄 robots.txt Content:');
    console.log('─'.repeat(60));
    console.log(content);
    console.log('─'.repeat(60));
    console.log('');
    
    // Check 3: Allow public pages (Requirement 7.2)
    if (REQUIRED_PATTERNS.userAgent.test(content) && REQUIRED_PATTERNS.allowRoot.test(content)) {
      console.log('✅ Requirement 7.2: Allows all search engine bots to crawl public pages');
      results.push({ requirement: '7.2', status: 'PASS', message: 'Public pages allowed' });
    } else {
      console.log('❌ Requirement 7.2: Missing User-agent or Allow directive');
      results.push({ requirement: '7.2', status: 'FAIL', message: 'Missing User-agent or Allow directive' });
      allPassed = false;
    }
    
    // Check 4: Disallow sensitive routes (Requirement 7.3)
    const sensitiveRoutes = [
      { name: 'dashboard', pattern: REQUIRED_PATTERNS.disallowDashboard },
      { name: 'admin', pattern: REQUIRED_PATTERNS.disallowAdmin },
      { name: 'guru', pattern: REQUIRED_PATTERNS.disallowGuru },
      { name: 'orangtua', pattern: REQUIRED_PATTERNS.disallowOrangtua },
      { name: 'login', pattern: REQUIRED_PATTERNS.disallowLogin },
      { name: 'register', pattern: REQUIRED_PATTERNS.disallowRegister }
    ];
    
    let allSensitiveRoutesDisallowed = true;
    sensitiveRoutes.forEach(route => {
      if (route.pattern.test(content)) {
        console.log(`✅ Disallows /${route.name}`);
      } else {
        console.log(`❌ Missing Disallow for /${route.name}`);
        allSensitiveRoutesDisallowed = false;
      }
    });
    
    if (allSensitiveRoutesDisallowed) {
      console.log('✅ Requirement 7.3: All admin, dashboard, and auth pages are disallowed');
      results.push({ requirement: '7.3', status: 'PASS', message: 'Sensitive routes disallowed' });
    } else {
      console.log('❌ Requirement 7.3: Some sensitive routes are not disallowed');
      results.push({ requirement: '7.3', status: 'FAIL', message: 'Missing some sensitive routes' });
      allPassed = false;
    }
    
    // Check 5: Disallow API endpoints (Requirement 7.5)
    if (REQUIRED_PATTERNS.disallowApi.test(content)) {
      console.log('✅ Requirement 7.5: API endpoints are disallowed');
      results.push({ requirement: '7.5 (API)', status: 'PASS', message: 'API endpoints disallowed' });
    } else {
      console.log('❌ Requirement 7.5: API endpoints are not disallowed');
      results.push({ requirement: '7.5 (API)', status: 'FAIL', message: 'API endpoints not disallowed' });
      allPassed = false;
    }
    
    // Check 6: Disallow private routes (kehadiran)
    if (REQUIRED_PATTERNS.disallowKehadiran.test(content)) {
      console.log('✅ Requirement 7.5: Private routes (/kehadiran) are disallowed');
      results.push({ requirement: '7.5 (Private)', status: 'PASS', message: 'Private routes disallowed' });
    } else {
      console.log('❌ Requirement 7.5: Private routes (/kehadiran) are not disallowed');
      results.push({ requirement: '7.5 (Private)', status: 'FAIL', message: 'Private routes not disallowed' });
      allPassed = false;
    }
    
    // Check 7: Sitemap reference (Requirement 7.4)
    if (REQUIRED_PATTERNS.sitemapReference.test(content)) {
      console.log('✅ Requirement 7.4: Sitemap reference is included');
      results.push({ requirement: '7.4', status: 'PASS', message: 'Sitemap reference included' });
    } else {
      console.log('❌ Requirement 7.4: Sitemap reference is missing or incorrect');
      results.push({ requirement: '7.4', status: 'FAIL', message: 'Sitemap reference missing' });
      allPassed = false;
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 VALIDATION SUMMARY');
    console.log('='.repeat(60));
    
    const passCount = results.filter(r => r.status === 'PASS').length;
    const failCount = results.filter(r => r.status === 'FAIL').length;
    
    console.log(`Total Checks: ${results.length}`);
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log('');
    
    if (allPassed) {
      console.log('🎉 All robots.txt requirements are met!');
      console.log('');
      console.log('Requirements validated:');
      console.log('  ✅ 7.1: robots.txt file accessible');
      console.log('  ✅ 7.2: Public pages allowed for crawling');
      console.log('  ✅ 7.3: Admin and auth pages disallowed');
      console.log('  ✅ 7.4: Sitemap reference included');
      console.log('  ✅ 7.5: API and private routes disallowed');
      return true;
    } else {
      console.log('⚠️  Some requirements are not met. Please review the failures above.');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error fetching robots.txt:', error.message);
    console.error('Make sure the Laravel development server is running on port 8000');
    return false;
  }
}

// Run validation
validateRobotsTxt().then(success => {
  process.exit(success ? 0 : 1);
});
