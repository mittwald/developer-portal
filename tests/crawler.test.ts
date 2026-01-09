import { test, expect } from '@playwright/test';

test.describe('Documentation crawler - all pages', () => {
  
  test('all documentation pages load without errors', async ({ page }) => {

    test.setTimeout(300000 * 2); // 10 minutes in milliseconds

    // Track visited URLs to avoid duplicates
    const visitedUrls = new Set<string>();
    const urlsToVisit:  string[] = ['/'];
    const errors: Array<{ url: string; error: string }> = [];
    const failedPages: Array<{ url:  string; reason: string }> = [];
    
    // Helper function to normalize URLs
    const normalizeUrl = (url: string): string => {
      try {
        const urlObj = new URL(url, 'http://localhost:3000');
        // Remove hash and ensure trailing slash
        let path = urlObj.pathname;
        if (! path.endsWith('/')) path += '/';
        return path;
      } catch {
        return url;
      }
    };
    
    // Helper to check if URL is internal doc link
    const isInternalDocLink = (url: string): boolean => {
      if (!url) return false;
      
      // Relative links are internal
      if (url.startsWith('/')) return true;
      
      // Check if it's our domain
      if (url.startsWith('http://localhost:3000')) return true;
      
      return false;
    };
    
    // Helper to check if we should visit this URL
    const shouldVisit = (url: string): boolean => {
      // Skip external links
      if (! isInternalDocLink(url)) return false;
      
      // Skip anchors only
      if (url.startsWith('#')) return false;
      
      // Skip assets
      if (url.match(/\.(png|jpg|jpeg|gif|svg|pdf|zip|ico|css|js)$/i)) return false;
      
      // Skip already visited
      const normalized = normalizeUrl(url);
      if (visitedUrls. has(normalized)) return false;
      
      return true;
    };
    
    // Setup console error listener
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        
        // Exclude known local development errors
        const isMatomo = errorText. includes('Error in setSecureCookie') && 
                         errorText.includes('You cannot use `Secure` on http');
        
        if (! isMatomo) {
          errors.push({
            url: page.url(),
            error: errorText
          });
        }
      }
    });
    
    // Setup page error listener (uncaught exceptions)
    page.on('pageerror', error => {
      errors.push({
        url: page.url(),
        error: `Uncaught exception: ${error.message}`
      });
    });
    
    console.log('🕷️  Starting documentation crawler...\n');
    
    // Crawl all pages
    while (urlsToVisit.length > 0) {
      const currentUrl = urlsToVisit. shift()!;
      const normalizedUrl = normalizeUrl(currentUrl);
      
      // Skip if already visited
      if (visitedUrls.has(normalizedUrl)) continue;
      
      visitedUrls.add(normalizedUrl);
      
      try {
        console.log(`Visiting: ${normalizedUrl}`);
        
        // Navigate to page
        const response = await page.goto(normalizedUrl, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        
        // Check response status
        if (! response || response.status() !== 200) {
          failedPages.push({
            url: normalizedUrl,
            reason: `HTTP ${response?.status() || 'no response'}`
          });
          continue;
        }
        
        // Check that main content exists
        const hasArticle = await page.locator('article').count() > 0;
        const hasMain = await page.locator('main').count() > 0;
        
        if (!hasArticle && !hasMain) {
          failedPages.push({
            url: normalizedUrl,
            reason: 'No main content found (no <article> or <main> element)'
          });
        }
        
        // Extract all links from the page
        const links = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a[href]'))
            .map(a => (a as HTMLAnchorElement).href);
        });
        
        // Add new links to queue
        for (const link of links) {
          if (shouldVisit(link)) {
            const normalized = normalizeUrl(link);
            if (!visitedUrls.has(normalized) && !urlsToVisit.includes(normalized)) {
              urlsToVisit.push(normalized);
            }
          }
        }
        
        // Small delay to avoid overwhelming the server
        await page.waitForTimeout(100);
        
      } catch (error) {
        failedPages.push({
          url: normalizedUrl,
          reason: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    // Print summary
    console.log(`\n✅ Crawled ${visitedUrls.size} pages`);
    
    if (failedPages.length > 0) {
      console.log(`\n❌ Failed pages (${failedPages.length}):`);
      failedPages.forEach(({ url, reason }) => {
        console.log(`  - ${url}:  ${reason}`);
      });
    }
    
    if (errors.length > 0) {
      console.log(`\n❌ Console errors found (${errors.length}):`);
      errors.forEach(({ url, error }) => {
        console.log(`  - ${url}:`);
        console.log(`    ${error}`);
      });
    }
    
    // Assertions
    expect(failedPages, `${failedPages.length} pages failed to load properly`).toEqual([]);
    expect(errors, `${errors.length} console errors found`).toEqual([]);
    expect(visitedUrls.size, 'Should have visited at least 10 pages').toBeGreaterThan(10);
  });
  
  test('changelog page loads', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        const isMatomo = errorText.includes('Error in setSecureCookie');
        if (!isMatomo) {
          errors.push(errorText);
        }
      }
    });
    
    await page.goto('/changelog/');
    await page.waitForLoadState('networkidle');
    
    // Check changelog content exists
    const hasBlogPosts = await page.locator('article, .blog-post').count() > 0;
    expect(hasBlogPosts, 'Changelog should have blog posts').toBe(true);
    
    expect(errors).toEqual([]);
  });
  
  test('German locale pages load', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        const isMatomo = errorText. includes('Error in setSecureCookie');
        if (!isMatomo) {
          errors.push(errorText);
        }
      }
    });
    
    // Test a German page
    await page.goto('/de/');
    await page.waitForLoadState('networkidle');
    
    // Check main content exists
    const hasContent = await page.locator('main, article').count() > 0;
    expect(hasContent, 'German homepage should have content').toBe(true);
    
    expect(errors).toEqual([]);
  });
});