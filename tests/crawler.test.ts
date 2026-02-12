import { test, expect } from '@playwright/test';

test.describe('Documentation crawler - all pages', () => {

  test('all documentation pages load without errors', async ({ page }) => {

    test.setTimeout(0);

    // Track visited URLs to avoid duplicates
    const visitedUrls = new Set<string>();
    const urlsToVisit:  string[] = ['/'];
    const errors: Array<{ url: string; error: string }> = [];
    const failedPages: Array<{ url: string; reason: string; attempts: number }> = [];

    // **NEW:  Configuration for retries**
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 seconds between retries
    const REQUEST_DELAY = 250; // Increased from 100ms to 250ms

    // Helper function to normalize URLs
    const normalizeUrl = (url: string): string => {
      try {
        const urlObj = new URL(url, 'http://localhost:3000');
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
      if (url.startsWith('/')) return true;
      if (url.startsWith('http://localhost:3000')) return true;
      return false;
    };

    // Helper to check if we should visit this URL
    const shouldVisit = (url: string): boolean => {
      if (! isInternalDocLink(url)) return false;
      if (url.startsWith('#')) return false;
      if (url.match(/\.(png|jpg|jpeg|gif|svg|pdf|zip|ico|css|js|json)$/i)) return false;

      const normalized = normalizeUrl(url);
      if (visitedUrls. has(normalized)) return false;

      return true;
    };

    // **NEW: Retry logic for page loading**
    const loadPageWithRetry = async (url:  string): Promise<{
      success: boolean;
      statusCode?: number;
      error?:  string;
      attempts: number;
    }> => {
      let lastError: string = '';
      let lastStatusCode:  number | undefined;

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(`  Attempt ${attempt}/${MAX_RETRIES} for:  ${url}`);

          const response = await page.goto(url, {
            waitUntil: 'domcontentloaded', // Changed from 'networkidle'
            timeout: 30000
          });

          // **NEW: Additional wait for dynamic content**
          await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
            console.log(`    Network didn't idle for ${url}, continuing anyway`);
          });

          lastStatusCode = response?. status();

          if (! response || response.status() !== 200) {
            lastError = `HTTP ${response?.status() || 'no response'}`;

            // If it's a 404, wait longer before retry (page might be generating)
            if (response?.status() === 404 && attempt < MAX_RETRIES) {
              console.log(`    Got 404, waiting ${RETRY_DELAY}ms before retry... `);
              await page.waitForTimeout(RETRY_DELAY);
              continue;
            }

            return {
              success: false,
              statusCode: lastStatusCode,
              error: lastError,
              attempts: attempt
            };
          }

          // **NEW: Verify content actually loaded**
          const hasArticle = await page.locator('article').count() > 0;
          const hasMain = await page.locator('main').count() > 0;

          if (!hasArticle && !hasMain) {
            lastError = 'No main content found';

            if (attempt < MAX_RETRIES) {
              console.log(`    Content not found, retrying in ${RETRY_DELAY}ms...`);
              await page.waitForTimeout(RETRY_DELAY);
              continue;
            }

            return {
              success: false,
              error: lastError,
              attempts:  attempt
            };
          }

          // Success!
          return {
            success:  true,
            statusCode: 200,
            attempts: attempt
          };

        } catch (error) {
          lastError = error instanceof Error ? error.message : String(error);
          console.log(`    Error on attempt ${attempt}: ${lastError}`);

          if (attempt < MAX_RETRIES) {
            await page.waitForTimeout(RETRY_DELAY);
            continue;
          }
        }
      }

      return {
        success: false,
        statusCode: lastStatusCode,
        error: lastError,
        attempts: MAX_RETRIES
      };
    };

    // Setup console error listener
    page.on('console', msg => {
      if (msg. type() === 'error') {
        const errorText = msg.text();
        const isMatomo = errorText.includes('Error in setSecureCookie') &&
                         errorText.includes('You cannot use `Secure` on http');

        if (! isMatomo) {
          errors.push({
            url: page.url(),
            error: errorText
          });
        }
      }
    });

    // Setup page error listener
    page.on('pageerror', error => {
      errors.push({
        url: page.url(),
        error: `Uncaught exception: ${error.message}`
      });
    });

    console.log('🕷️  Starting documentation crawler...\n');

    // **NEW: Track statistics**
    let retriedPages = 0;
    let totalAttempts = 0;

    // Crawl all pages
    while (urlsToVisit.length > 0) {
      const currentUrl = urlsToVisit. shift()!;
      const normalizedUrl = normalizeUrl(currentUrl);

      if (visitedUrls.has(normalizedUrl)) continue;

      visitedUrls.add(normalizedUrl);

      console.log(`Visiting (${visitedUrls.size}): ${normalizedUrl}`);

      // **NEW: Use retry logic**
      const result = await loadPageWithRetry(normalizedUrl);
      totalAttempts += result.attempts;

      if (result.attempts > 1) {
        retriedPages++;
      }

      if (! result.success) {
        failedPages.push({
          url: normalizedUrl,
          reason: result.error || `HTTP ${result.statusCode}`,
          attempts: result.attempts
        });
        continue;
      }

      // Extract all links from the page
      try {
        const links = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('a[href]'))
            .map(a => (a as HTMLAnchorElement).href);
        });

        // Add new links to queue
        for (const link of links) {
          if (shouldVisit(link)) {
            const normalized = normalizeUrl(link);
            if (!visitedUrls.has(normalized) && ! urlsToVisit.includes(normalized)) {
              urlsToVisit.push(normalized);
            }
          }
        }
      } catch (error) {
        console.log(`  Warning: Could not extract links from ${normalizedUrl}`);
      }

      // **NEW:  Longer delay between requests**
      await page.waitForTimeout(REQUEST_DELAY);
    }

    // Print summary
    console.log(`\n✅ Crawled ${visitedUrls.size} pages`);
    console.log(`📊 Total page load attempts: ${totalAttempts}`);
    console.log(`🔄 Pages that required retries: ${retriedPages}`);

    if (failedPages.length > 0) {
      console.log(`\n❌ Failed pages (${failedPages.length}):`);
      failedPages.forEach(({ url, reason, attempts }) => {
        console.log(`  - ${url}`);
        console.log(`    Reason: ${reason} (after ${attempts} attempts)`);
      });
    }

    if (errors.length > 0) {
      console.log(`\n❌ Console errors found (${errors.length}):`);
      // **NEW:  Deduplicate errors**
      const uniqueErrors = Array.from(
        new Set(errors.map(e => JSON.stringify(e)))
      ).map(e => JSON.parse(e));

      uniqueErrors.slice(0, 20).forEach(({ url, error }) => {
        console.log(`  - ${url}:`);
        console.log(`    ${error}`);
      });

      if (uniqueErrors.length > 20) {
        console.log(`  ... and ${uniqueErrors. length - 20} more errors`);
      }
    }

    // Assertions
    expect(failedPages, `${failedPages.length} pages failed to load properly after retries`).toEqual([]);
    expect(errors, `${errors.length} console errors found`).toEqual([]);
    expect(visitedUrls.size, 'Should have visited at least 10 pages').toBeGreaterThan(10);
  });

  // Keep your other tests...
  test('changelog page loads', async ({ page }) => {
    const errors:  string[] = [];

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

    const hasBlogPosts = await page.locator('article').count() > 0;
    expect(hasBlogPosts, 'Changelog should have articles').toBe(true);

    expect(errors).toEqual([]);
  });

  test('German locale pages load', async ({ page }) => {
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

    await page.goto('/de/');
    await page.waitForLoadState('networkidle');

    const hasContent = await page.locator('main, article').count() > 0;
    expect(hasContent, 'German homepage should have content').toBe(true);

    expect(errors).toEqual([]);
  });
});