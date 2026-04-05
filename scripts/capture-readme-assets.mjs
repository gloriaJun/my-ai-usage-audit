import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('docs/assets/screenshots');
const flowDir = path.join(outDir, 'flow');
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(flowDir, { recursive: true });

const base = 'http://127.0.0.1:4173';

function pad(n) {
  return String(n).padStart(2, '0');
}

async function captureDesktop(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4200);
  await page.screenshot({ path: path.join(outDir, 'landing-desktop.png'), fullPage: true });

  await page.getByRole('button', { name: /START_AUDIT/i }).click();
  await page.waitForURL('**/quiz', { timeout: 10000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, 'quiz-desktop.png'), fullPage: true });

  let frame = 0;
  await page.screenshot({ path: path.join(flowDir, `${pad(frame++)}.png`) });

  for (let i = 0; i < 7; i++) {
    const option = page.locator('div.grid:visible button').nth(2);
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(flowDir, `${pad(frame++)}.png`) });
  }

  await page.waitForURL('**/result', { timeout: 15000 });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: path.join(outDir, 'result-desktop.png'), fullPage: true });
  await page.screenshot({ path: path.join(flowDir, `${pad(frame++)}.png`) });

  await context.close();
}

async function captureMobile(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4200);
  await page.screenshot({ path: path.join(outDir, 'landing-mobile.png'), fullPage: true });

  await context.close();
}

const browser = await chromium.launch({ headless: true });
try {
  await captureDesktop(browser);
  await captureMobile(browser);
  console.log('Captured README assets.');
} finally {
  await browser.close();
}
