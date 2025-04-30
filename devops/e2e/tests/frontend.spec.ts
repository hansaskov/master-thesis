import { test, expect} from '@playwright/test';

test.describe.configure({ mode: 'serial' });

//let page: Page;

const base_path = 'http://localhost/api/test/e2e'
const create_reading = 'http://localhost/api/test/e2e/reading'

// Must haves
test('f-1w: A login system for the service team and for customers', async({ page }) => {
  await page.goto(`${base_path}`);
});

test('f-2w: An administration page for authorizing user access.', async({ page }) => {
  await page.goto(`${base_path}`);
  //await page.getByRole('link').nth(1).click(); THIS IS BUGGY AS FUCK ONLY WORKS SOMETIMES
  await page.goto('http://localhost/superadmin');
  await page.locator('#bits-17').getByRole('button', { name: 'Superadmin' }).click();
  await page.getByRole('menuitem', { name: 'User' }).click();
  await page.locator('#bits-17').getByRole('button', { name: 'User' }).click();
  await page.getByRole('menuitem', { name: 'Superadmin' }).click();
});

// TODO: THERE IS AN ISSUE WITH CLICKING THE DROPDOWN TO SELECT BETWEEN ORGS ONLY IN THE TEST BUT NOT IN THE ACTUAL APPLICATION
// test('f-3w: A layout allowing navigation between companies and production systems', async({ page }) => {
//   await page.goto(`${base_path}`);
//   await page.goto('http://localhost/superadmin');
//   await page.getByRole('textbox', { name: 'Enter organization name' }).click();
//   await page.getByRole('textbox', { name: 'Enter organization name' }).fill('TriVision');
//   await page.getByRole('button', { name: 'Add Organization' }).click();
//   await page.getByRole('textbox', { name: 'Enter organization name' }).click();
//   await page.getByRole('textbox', { name: 'Enter organization name' }).fill('SKALA');
//   await page.getByRole('button', { name: 'Add Organization' }).click();
//   await page.getByRole('button', { name: 'Dashboard' }).click();
//   await page.getByText('TriVision', { exact: true }).click();
//   await page.getByRole('link', { name: 'check TriVision' }).click();
//   await page.getByRole('link', { name: 'check SKALA' }).click();
// });

test('f-4w: A monitoring page for viewing current and historical metrics ', async({ page }) => {
  await page.goto(`${base_path}`);
  await page.goto('http://localhost/superadmin');
  await page.getByRole('textbox', { name: 'Enter organization name' }).click();
  await page.getByRole('textbox', { name: 'Enter organization name' }).fill('Test Organisation');
  await page.getByRole('button', { name: 'Add Organization' }).click();
  await page.getByRole('button', { name: 'Dashboard' }).click();
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('textbox', { name: 'Enter system name' }).click();
  await page.getByRole('textbox', { name: 'Enter system name' }).fill('Test Vision System');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('button', { name: 'Dashboard' }).click();
  await page.getByRole('cell', { name: 'Test Vision System' }).click();
  await page.getByRole('button', { name: 'Monitor Real-time system' }).click();
  await page.getByRole('button', { name: 'seconds' }).click();
  await page.getByRole('option', { name: '30 seconds' }).click();
  await page.getByRole('button', { name: 'seconds' }).click();
  await page.getByRole('option', { name: 'minutes' }).click();
  await page.getByRole('button', { name: '5 minutes' }).click();
  await page.getByRole('option', { name: 'hour' }).click();
  await page.getByRole('button', { name: 'Last 10 minutes' }).click();
  await page.getByRole('option', { name: 'Last 1 minute' }).click();
  await page.getByRole('button', { name: 'Last 1 minute' }).click();
  await page.getByRole('option', { name: 'Last hour' }).click();
  await page.getByRole('button', { name: 'Last hour' }).click();
  await page.getByRole('option', { name: 'Last 8 hours' }).click();
  await page.getByRole('button', { name: 'Last 8 hours' }).click();
  await page.getByRole('option', { name: 'Last 24 hours' }).click();
  await page.getByRole('button', { name: 'Last 24 hours' }).click();
  await page.getByRole('option', { name: 'Last 2 days' }).click();
  await page.getByRole('button', { name: 'Last 2 days' }).click();
  await page.getByRole('option', { name: 'Last 7 days' }).click();
  await page.getByRole('button', { name: 'Last 7 days' }).click();
  await page.getByRole('option', { name: 'Last 30 days' }).click();
});

test('F-5w: A page for viewing and ordering spare parts for the specific production system', async({ page }) => {
  await page.goto(`${base_path}`);
  await page.getByRole('link', { name: 'Superadmin' }).click();
  await page.getByRole('textbox', { name: 'Enter organization name' }).click();
  await page.getByRole('textbox', { name: 'Enter organization name' }).fill('Test org');
  await page.getByRole('button', { name: 'Add Organization' }).click();
  await page.getByRole('button', { name: 'VisioPointer' }).click();
  await page.getByRole('button', { name: 'edit' }).click();
  await page.locator('#bits-55').click();
  await page.getByRole('button', { name: 'save' }).click();
  await page.getByRole('button', { name: 'Dashboard' }).click();
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('textbox', { name: 'Enter system name' }).click();
  await page.getByRole('textbox', { name: 'Enter system name' }).fill('Test vision system');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('button', { name: 'Dashboard' }).click();
  await page.getByRole('cell', { name: 'Test vision system' }).click();
  await page.getByRole('button', { name: 'Spare Parts Inventory and' }).click();
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('link', { name: 'Order Now' }).click();
});

// TODO: SERVICE AGREEMENTS NOT IMPLEMENTED YET
// test('F-6W: A page for choosing the service agreement for each individual vision system.', async({ page }) => {
//   await page.goto(`${base_path}`);
//   await page.getByRole('link', { name: 'Superadmin' }).click();
//   await page.getByRole('textbox', { name: 'Enter organization name' }).click();
//   await page.getByRole('textbox', { name: 'Enter organization name' }).fill('Test org');
//   await page.getByRole('button', { name: 'Add Organization' }).click();
//   await page.getByRole('button', { name: 'Dashboard' }).click();
//   await page.getByRole('button', { name: 'Settings' }).click();
//   await page.getByRole('textbox', { name: 'Enter system name' }).click();
//   await page.getByRole('textbox', { name: 'Enter system name' }).fill('Test system');
//   await page.getByRole('button', { name: 'Create' }).click();
//   await page.getByRole('button', { name: 'Dashboard' }).click();
//   await page.getByRole('cell', { name: 'Test system' }).click();
//   await page.getByRole('link', { name: 'Service Agreements Manage and' }).click();
// });

// TODO: F-7W A settings page for the individual user

test('F-8W: A settings page for organizations and Vision systems ', async({ page }) => {
  await page.goto(`${base_path}`);
  await page.getByRole('link', { name: 'Superadmin' }).click();
  await page.getByRole('textbox', { name: 'Enter organization name' }).click();
  await page.getByRole('textbox', { name: 'Enter organization name' }).fill('Test org');
  await page.getByRole('button', { name: 'Add Organization' }).click();
  await page.getByRole('button', { name: 'Dashboard' }).click();
  await page.getByRole('button', { name: 'Settings' }).click();
  // await page.getByRole('textbox', { name: 'Invite New User' }).click(); //MAIL TEST
  // await page.getByRole('textbox', { name: 'Invite New User' }).fill('testmail@mail.dk');
  // await page.getByRole('button', { name: 'Invite & Onboard' }).click();
  await page.getByRole('textbox', { name: 'Organization Name' }).click();
  await page.getByRole('textbox', { name: 'Organization Name' }).fill('Test org new name');
  await page.getByRole('button', { name: 'Update' }).click();
  await page.getByRole('textbox', { name: 'Enter system name' }).click();
  await page.getByRole('textbox', { name: 'Enter system name' }).fill('Test vision system');
  await page.getByRole('button', { name: 'VisioPointer' }).click();
  await page.getByRole('option', { name: 'VisioOne' }).click();
  await page.getByRole('button', { name: 'Create' }).click();
});

test('F-1S and F-2S: A workflow for enrolling new production systems. Manage secret keys of production systems.', async({ page }) => {
  await page.goto(`${base_path}`);
  await page.getByRole('link', { name: 'Superadmin' }).click();
  await page.getByRole('textbox', { name: 'Enter organization name' }).click();
  await page.getByRole('textbox', { name: 'Enter organization name' }).fill('Test org');
  await page.getByRole('button', { name: 'Add Organization' }).click();
  await page.getByRole('button', { name: 'Dashboard' }).click();
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('textbox', { name: 'Enter system name' }).click();
  await page.getByRole('textbox', { name: 'Enter system name' }).fill('Test system');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('button', { name: 'Dashboard' }).click();
  await page.getByRole('cell', { name: 'Test system' }).click();
  await page.getByRole('button', { name: 'System Settings Alter' }).click();
  await page.getByRole('button', { name: 'VisioPointer' }).click();
  await page.getByRole('button', { name: 'VisioPointer' }).click();
  await page.getByRole('textbox', { name: 'Enter system name' }).click();
  await page.getByRole('textbox', { name: 'Enter system name' }).fill('Test system 2');
  await page.getByRole('button', { name: 'VisioPointer' }).click();
  await page.getByRole('option', { name: '360 Inspector' }).click();
  await page.locator('form').getByRole('button', { name: 'Update' }).click();
  await page.getByRole('button', { name: '+ Create API Key' }).click();
  await page.getByRole('textbox', { name: 'Your API key name' }).fill('key');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
});

test('F-3S: Configurable threshold values for detemining the health of a vision system.', async({ page }) => {
  await page.goto(`${create_reading}`);
  // await page.getByRole('cell', { name: 'VisioPointer' }).click();
  // await page.getByRole('button', { name: 'System Settings Alter' }).click();
  // await page.getByRole('cell', { name: 'Add' }).click();
  // await page.getByRole('button', { name: 'Add' }).click();
  // await page.locator('#bits-11').click();
  // await page.getByRole('spinbutton').click();
  // await page.getByRole('spinbutton').fill('75');
  // await page.getByRole('button', { name: 'Update' }).nth(1).click();
  // await page.locator('div').filter({ hasText: 'Settings + Create API Key Edit VisioPointer Change the settings for your system' }).nth(3).click();
  await page.getByRole('cell', { name: 'VisioPointer' }).click();
  await page.getByRole('button', { name: 'System Settings Alter' }).click();
  await page.getByRole('button', { name: 'Add' }).click();
  await page.locator('#bits-11').click();
  await page.getByRole('spinbutton').dblclick();
  await page.getByRole('spinbutton').fill('75');
  await page.getByRole('button', { name: 'Update' }).nth(1).click();
});
