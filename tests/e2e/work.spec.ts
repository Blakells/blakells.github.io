import { expect, test } from '@playwright/test';

test.describe('work index', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/work/');
  });

  test('shows both featured projects linking to their pages', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Work');
    const links = page.locator('#featured article h3 a');
    await expect(links).toHaveText(['Preflight', 'Lantern Hollow']);
    await expect(links.first()).toHaveAttribute('href', '/work/preflight/');
    await expect(links.last()).toHaveAttribute('href', '/work/lantern-hollow-game/');
  });

  test('lists seven earlier projects, with demos only for the two that still run', async ({ page }) => {
    await expect(page.locator('#earlier li.row')).toHaveCount(7);
    const demos = page.getByRole('link', { name: /^Live demo of/ });
    await expect(demos).toHaveCount(2);
    const hrefs = await demos.evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    for (const href of hrefs) expect(href).toMatch(/^https:\/\/[a-z0-9-]+\.netlify\.app\/$/);
  });
});

test.describe('Preflight case study', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/work/preflight/');
  });

  test('has the eight-stage pipeline, all nine safety layers and the known gap', async ({ page }) => {
    await expect(page.locator('.pipeline li')).toHaveCount(8);
    await expect(page.locator('.layers tbody tr')).toHaveCount(9);
    // Astro's Markdown turns straight apostrophes into curly ones, so match either.
    await expect(page.getByText(/the guard does not see a page['’]s own script posting the form with/)).toBeVisible();
  });

  test('shows the guard screenshot with a description', async ({ page }) => {
    await expect(page.getByRole('img', { name: /PREFLIGHT DRY RUN: final Submit blocked/ })).toBeVisible();
  });

  test('credits the upstream project and attributes the live applications honestly', async ({ page }) => {
    const note = page.getByRole('note', { name: 'Honest note' });
    await expect(note).toContainText('ApplyPilot 0.3.0 by Pickle-Pixel');
    await expect(note).toContainText('private predecessor system');
  });

  test('states the test count from site.yaml and links the repository', async ({ page }) => {
    await expect(page.getByText(/The suite has \d+ tests/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'github.com/Blakells/preflight' })).toHaveAttribute('href', 'https://github.com/Blakells/preflight');
  });
});

test.describe('Lantern Hollow page', () => {
  test('links to the game and shows both screenshots', async ({ page }) => {
    await page.goto('/work/lantern-hollow-game/');
    await expect(page.getByRole('link', { name: 'Play Lantern Hollow' })).toHaveAttribute('href', '/lantern-hollow/');
    await expect(page.locator('img[src^="/images/lantern-hollow/"]')).toHaveCount(2);
  });
});
