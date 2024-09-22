import { test, expect } from '@playwright/test';

const pages = [
  '/',
  '/newsfeed',
  '/systems',
  '/settings',
  '/support',
  '/systems/vp1',
  '/systems/vp1/monitoring',
  '/systems/vp1/pi',
  '/systems/vp1/service',
  '/systems/vp1/parts'
];

const imageFolder = './screenshots';

for (const path of pages) {
  test(`Screenshot - ${path}`, async ({ page, browserName, isMobile }) => {
    await page.goto(path);
    await page.waitForTimeout(500);
    const fileName = `${imageFolder}/${browserName}${isMobile ? "-mobile" : ""}${path}-page.png` 
    await page.screenshot({ path: fileName });
  });
}