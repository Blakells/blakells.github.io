import { expect, test } from '@playwright/test';

const POSTS = [
  { slug: 'enforcing-dry-runs-in-the-browser', title: "Enforcing an AI agent's dry run inside the browser" },
  { slug: 'testing-an-agent-that-must-never-submit', title: 'Testing an agent that must never submit' },
];

test('the writing index lists both posts', async ({ page }) => {
  await page.goto('/writing/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Writing');
  for (const post of POSTS) {
    await expect(page.getByRole('link', { name: post.title })).toHaveAttribute('href', `/writing/${post.slug}/`);
  }
});

for (const post of POSTS) {
  test(`the post "${post.title}" renders with its date`, async ({ page }) => {
    await page.goto(`/writing/${post.slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title);
    await expect(page.locator('time[datetime]')).toHaveCount(1);
    await expect(page.locator('main h2').first()).toBeVisible();
  });
}

test('the RSS feed lists both posts with absolute links', async ({ request }) => {
  const response = await request.get('/rss.xml');
  expect(response.ok()).toBe(true);
  const xml = await response.text();
  expect(xml.match(/<item>/g)).toHaveLength(2);
  for (const post of POSTS) expect(xml).toContain(`<link>https://blakells.dev/writing/${post.slug}/</link>`);
});
