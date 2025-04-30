import { test, expect} from '@playwright/test';

test.describe.configure({ mode: 'serial' });

//let page: Page;

const base_path = 'http://localhost/api/test/e2e'
const drop_database_path = 'http://localhost/api/test/dropdb'

test.beforeAll(async ({ page }) => {
  await page.goto(`${drop_database_path}`)
});

// Must haves
test('f-1w: A login system for the service team and for customers', async({ page }) => {
  await page.goto(`${base_path}`);
});

test('f-2w: An administration page for authorizing user access.', async({ page }) => {
  await page.goto(`${base_path}`);
  await page.getByRole('link').nth(1).click();
  await page.locator('#bits-17').getByRole('button', { name: 'Superadmin' }).click();
  await page.getByRole('menuitem', { name: 'User' }).click();
  await page.locator('#bits-17').getByRole('button', { name: 'User' }).click();
  await page.getByRole('menuitem', { name: 'Superadmin' }).click();
});

test('f-3w: A layout allowing navigation between companies and production systems', async({ page }) => {
  await page.goto(`${base_path}`);
  await page.getByRole('link').nth(1).click();
  await page.getByRole('textbox', { name: 'Enter organization name' }).click();
  await page.getByRole('textbox', { name: 'Enter organization name' }).fill('TriVision');
  await page.getByRole('button', { name: 'Add Organization' }).click();
  await page.getByRole('textbox', { name: 'Enter organization name' }).click();
  await page.getByRole('textbox', { name: 'Enter organization name' }).fill('SKALA');
  await page.getByRole('button', { name: 'Add Organization' }).click();
  await page.getByRole('button', { name: 'Dashboard' }).click();
  await page.getByText('TriVision', { exact: true }).click();
  await page.getByRole('link', { name: 'check TriVision' }).click();
  await page.getByRole('link', { name: 'check SKALA' }).click();
});

