import { test, expect } from '@playwright/test';

test.describe('Documentation crawler - single URL', () => {

  test('specific documentation page load without errors', async ({ page }) => {
    // Retrieve URL to test from environment variable or set a default example
    const urlToTest = process.env.TEST_URL;

    if (!urlToTest) {
      throw new Error('No URL provided! Set the URL using the TEST_URL environment variable.');
    }

    const errors: Array<{ url: string; error: string }> = [];

    // Setup console error listener
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        // Ignore specific non-critical errors
        const isMatomo = errorText.includes('Error in setSecureCookie') &&
                         errorText.includes('You cannot use `Secure` on http');

        if (!isMatomo) {
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

    console.log(`🕷️ Visiting ${urlToTest}`);

    // Visit the URL
    const response = await page.goto(urlToTest, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Check response status
    expect(response).not.toBeNull(); // Ensure we got any response
    expect(response?.status()).toBe(200); // HTTP 200

    // Wait for network to stabilize, ensuring dynamic content is loaded
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Verify content is displayed
    const hasArticle = await page.locator('article').count() > 0;
    const hasMain = await page.locator('main').count() > 0;

    expect(hasArticle || hasMain, 'Page should have main or article content').toBe(true);

    // Assert no console or page errors
    if (errors.length > 0) {
      console.log(`\n❌ Errors found on ${urlToTest}:`);
      errors.forEach(({ url, error }) => {
        console.log(`  - ${url}:`);
        console.log(`    ${error}`);
      });
    }

    expect(errors, `${errors.length} console or page errors found`).toEqual([]);
  });
});