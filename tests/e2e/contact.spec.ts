import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('the contact page lists the four ways to reach Blake, and no form', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Contact');
  const main = page.locator('main');
  await expect(main.getByRole('link', { name: 'blake@blakells.dev' })).toHaveAttribute('href', 'mailto:blake@blakells.dev');
  await expect(main.getByRole('link', { name: 'github.com/Blakells' })).toHaveAttribute('href', 'https://github.com/Blakells');
  await expect(main.getByRole('link', { name: '(843) 616-1069' })).toHaveAttribute('href', 'tel:+18436161069');
  await expect(main).toContainText('Florence, SC');
  await expect(page.locator('form')).toHaveCount(0);
});

test('a missing page answers 404 with a way back', async ({ page }) => {
  const response = await page.goto('/no-such-page/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Off track');
  await expect(page.getByRole('link', { name: 'Back to the start' })).toHaveAttribute('href', '/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
