import { test, expect } from '@playwright/test';

test('check-settings', async ({ page }) => {
  await page.goto('https://master-thesis.hjemmet.net/');
  await page.getByRole('link', { name: 'Login with Microsoft' }).click();
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('heading', { name: 'Settings', exact: true }).click();
  await page.goto('https://master-thesis.hjemmet.net/systems');
  await page.getByRole('cell', { name: 'Production Line 1' }).nth(1).click();
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.getByRole('main')).toContainText('Settings for the an individual vision system');
});