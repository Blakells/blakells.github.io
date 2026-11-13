import { expect, test } from '@playwright/test';

const SECTIONS = ['Summary', 'Skills', 'Experience', 'Technical Projects', 'Leadership & Athletics', 'Education & Licenses'];

test.describe('resume page', () => {
  test('shows every section and links the PDF', async ({ page }) => {
    await page.goto('/resume/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Blake Bailey');
    for (const name of SECTIONS) await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Download the PDF' })).toHaveAttribute('href', '/blake-bailey-resume.pdf');
    await expect(page.locator('main')).toContainText('blake@blakells.dev');
    await expect(page.locator('main')).toContainText('linkedin.com/in/blakells');
  });

  test('prints without the site header, footer or download link', async ({ page }) => {
    await page.goto('/resume/');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.site-header')).toBeHidden();
    await expect(page.locator('.site-footer')).toBeHidden();
    await expect(page.getByRole('link', { name: 'Download the PDF' })).toBeHidden();
  });

  test('serves the PDF', async ({ request }) => {
    const response = await request.get('/blake-bailey-resume.pdf');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('application/pdf');
  });
});
