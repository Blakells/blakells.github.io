import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { PAGES } from './pages';

for (const path of PAGES) {
  test.describe(`page ${path}`, () => {
    test('has a title, a description, a canonical URL and one h1', async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(/Blake Bailey/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{20,}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://blakells.dev${path}`);
      await expect(page.locator('h1')).toHaveCount(1);
    });

    test('has no accessibility violations', async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      const violations = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      expect(violations).toEqual([]);
    });

    test('does not scroll sideways on a 320px screen', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test('offers a skip link as the first keyboard stop', async ({ page }) => {
      await page.goto(path);
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toHaveText('Skip to content');
    });
  });
}

test('the speed trace stays still for people who turn motion down', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const animation = await page.locator('svg.trace').first().evaluate((el) => getComputedStyle(el).animationName);
  expect(animation).toBe('none');
});
