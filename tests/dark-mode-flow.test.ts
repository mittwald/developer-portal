import { expect, test } from '@playwright/test';

test.describe('Dark mode regression - Flow theme sync', () => {
  test('theme switch updates Flow component rendering', async ({ page }) => {
    await page.goto('/docs/v2/reference/file/file-create-file');
    await page.waitForLoadState('networkidle');

    // This page should contain Flow components rendered from API reference blocks.
    const flowElements = page.locator('[class*="flow--"]');
    await expect(flowElements.first()).toBeVisible();

    const themeToggle = page
      .locator(
        'button[title*="dark and light mode"], button[aria-label*="color mode"], button[class*="colorModeToggle"], button[class*="toggleButton"]',
      )
      .first();

    await expect(themeToggle).toBeVisible();

    const before = await page.evaluate(() => {
      const theme = document.documentElement.getAttribute('data-theme') ?? '';
      const signatures = Array.from(
        document.querySelectorAll('[class*="flow--"]'),
      )
        .slice(0, 20)
        .map((element) => {
          const styles = window.getComputedStyle(element);

          return [
            styles.color,
            styles.backgroundColor,
            styles.borderTopColor,
            styles.outlineColor,
          ].join('|');
        });

      return { theme, signatures };
    });

    await themeToggle.click();

    await page.waitForFunction(
      (initialTheme) =>
        document.documentElement.getAttribute('data-theme') !== initialTheme,
      before.theme,
    );

    const after = await page.evaluate(() => {
      const theme = document.documentElement.getAttribute('data-theme') ?? '';
      const signatures = Array.from(
        document.querySelectorAll('[class*="flow--"]'),
      )
        .slice(0, 20)
        .map((element) => {
          const styles = window.getComputedStyle(element);

          return [
            styles.color,
            styles.backgroundColor,
            styles.borderTopColor,
            styles.outlineColor,
          ].join('|');
        });

      return { theme, signatures };
    });

    expect(after.theme).not.toEqual(before.theme);

    const anyFlowStyleChanged = after.signatures.some(
      (signature, index) => signature !== before.signatures[index],
    );

    expect(anyFlowStyleChanged).toBe(true);
  });
});