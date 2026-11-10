import { expect, test } from '@playwright/test';

test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('introduces Blake with the hero copy and two actions', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Blake Bailey');
    await expect(page.getByText('Automation & AI agent engineer', { exact: true })).toBeVisible();
    await expect(page.getByText('I build AI agents that do real work safely, and the tests that prove it.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'View Preflight' })).toHaveAttribute('href', '/work/preflight/');
    await expect(page.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/contact/');
  });

  test('features Preflight then Lantern Hollow, with the test-count stat', async ({ page }) => {
    const titles = page.locator('#featured article h3');
    await expect(titles).toHaveText(['Preflight', 'Lantern Hollow']);
    await expect(page.locator('#featured article').first()).toContainText(/\d+ tests · CI on Linux \+ macOS/);
    await expect(page.locator('#featured').getByRole('link', { name: 'Play Lantern Hollow' })).toHaveAttribute('href', '/lantern-hollow/');
  });

  test('lists the seven earlier projects and links to them', async ({ page }) => {
    await expect(page.locator('#earlier-strip li')).toHaveCount(7);
    await expect(page.getByRole('link', { name: 'All earlier work' })).toHaveAttribute('href', '/work/#earlier');
  });

  test('states the inference server as built', async ({ page }) => {
    await expect(page.getByText('Built a local inference server (4× RTX 6000 Pro)')).toBeVisible();
  });

  test('shows the latest posts', async ({ page }) => {
    await expect(page.locator('.posts li')).toHaveCount(2);
  });

  test('ends with the domain email', async ({ page }) => {
    await expect(page.locator('#contact').getByRole('link', { name: 'blake@blakells.dev' })).toHaveAttribute('href', 'mailto:blake@blakells.dev');
  });
});
