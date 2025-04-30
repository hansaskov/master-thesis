import { test, expect } from '@playwright/test';

const base_path = 'https://preview.master-thesis.hjemmet.net'

const pages = [
  base_path,
  `${base_path}/newsfeed`,
  `${base_path}/systems`,
  `${base_path}/settings`,
  `${base_path}/support`,
  `${base_path}/systems/settings`,
  `${base_path}/systems/vp1`,
  `${base_path}/systems/vp1/monitoring`,
  `${base_path}/systems/vp1/pi`,
  `${base_path}/systems/vp1/service`,
  `${base_path}/systems/vp1/parts`,
  `${base_path}/systems/vp1/settings`

];

const imageFolder = './screenshots';

for (const path of pages) {
  test(`Screenshot - ${path}`, async ({ page, browserName, isMobile }) => {
    // Go to page
    await page.goto(path);
    await page.waitForTimeout(1000);

    // Create name to save
    const filtered_path = path.replace(base_path, '')
    const fileName = `${imageFolder}/${browserName}${isMobile ? "-mobile" : ""}${filtered_path}-page.png`
    
    // Take screenshot and save it to the path
    await page.screenshot({ path: fileName });
  });
}