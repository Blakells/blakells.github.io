import { expect, test } from '@playwright/test';

test.describe('about page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about/');
  });

  test('tells the story and what Blake is looking for', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('About');
    await expect(page.locator('main')).toContainText('understanding how a system works');
    await expect(page.locator('main')).toContainText('remote roles in the US');
  });

  test('covers racing and the data logger, without the brake-fade story', async ({ page }) => {
    await expect(page.locator('main')).toContainText('AiM Solo 2 DL');
    await expect(page.locator('main')).toContainText('Carolina Motorsports Park');
    await expect(page.locator('main')).not.toContainText(/brake/i);
  });

  test('mentions investing without any figures', async ({ page }) => {
    await expect(page.locator('main')).toContainText('Since 2017');
    await expect(page.locator('main')).not.toContainText(/\$\d|-figure/);
  });

  test('states the server as built and the degree as expected', async ({ page }) => {
    await expect(page.locator('main')).toContainText('Built a local inference server (4× RTX 6000 Pro)');
    await expect(page.locator('main')).toContainText("Bachelor's degree");
    await expect(page.locator('main')).toContainText('Expected March 2027');
  });
});
