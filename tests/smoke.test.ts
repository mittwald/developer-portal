import { test, expect } from '@playwright/test';

test.describe('Basic smoke tests', () => {
  
  test('homepage loads successfully', async ({ page }) => {
    // Navigate to homepage
    await page. goto('/');
    
    // Check that page loaded
    await expect(page).toHaveTitle(/mittwald Developer Portal/);
    
    // Check main heading exists
    await expect(page.locator('h1')).toBeVisible();
  });

  test('API docs page loads', async ({ page }) => {
    await page. goto('/docs/v2/api/intro');
    
    // Check page loaded without errors
    expect(page. url()).toContain('/api/intro');
    
    // Main content should be visible
    await expect(page.locator('article')).toBeVisible();
  });

  test('no console errors on homepage', async ({ page }) => {
    // Collect console errors
    const errors:  string[] = [];
    page. on('console', msg => {
      if (msg.type() === 'error') {
        const errorText = msg.text();
        
        // Exclude known local development errors
        const isMatomo = errorText.includes('Error in setSecureCookie') && 
                         errorText.includes('You cannot use `Secure` on http');
        
        if (! isMatomo) {
          errors.push(errorText);
        }
      }
    });
    
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Assert no errors (excluding filtered ones)
    expect(errors).toEqual([]);
  });
});