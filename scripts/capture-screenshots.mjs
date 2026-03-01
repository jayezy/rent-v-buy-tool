/**
 * Captures screenshots for the README documentation.
 * Run: node scripts/capture-screenshots.mjs
 * Requires: npx playwright install chromium (first time only)
 * Expects: dev server running on http://localhost:5173
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:5173';
const OUT = 'docs/screenshots';

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

// --- 1. Landing Hero ---
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000); // let blob animations settle
await page.screenshot({ path: `${OUT}/01-landing-hero.png` });
console.log('✓ 01-landing-hero.png');

// --- 2. How It Works + Market Rates ---
await page.evaluate(() => window.scrollTo(0, 900));
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/02-landing-how-it-works.png` });
console.log('✓ 02-landing-how-it-works.png');

// --- 3. Features + Final CTA ---
await page.evaluate(() => window.scrollTo(0, 2200));
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/03-landing-features-cta.png` });
console.log('✓ 03-landing-features-cta.png');

// --- 4. Wizard Modal ---
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.click('button:has-text("Take the Survey")');
await page.waitForSelector('[role="dialog"]', { timeout: 3000 });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/04-wizard-modal.png` });
console.log('✓ 04-wizard-modal.png');

// --- 5 & 6. Results Dashboard (complete the wizard) ---
for (let step = 0; step < 10; step++) {
  const dialog = page.locator('[role="dialog"]');
  // Click the first non-close, non-back button in the dialog (option card or "Use this")
  const buttons = dialog.locator('button:not([aria-label])');
  const count = await buttons.count();
  if (count > 0) {
    // Skip "Use this" button if it's the only one — pick the first option card
    await buttons.first().click();
  }
  await page.waitForTimeout(400);
}

// Wait for results to render
await page.waitForSelector('h1:has-text("Your Results"), h2:has-text("Your Results")', { timeout: 10000 });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/05-results-top.png` });
console.log('✓ 05-results-top.png');

// --- 6. Scroll down to charts + assumptions ---
await page.evaluate(() => window.scrollTo(0, 600));
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/06-results-charts.png` });
console.log('✓ 06-results-charts.png');

await browser.close();
console.log('\nAll screenshots saved to docs/screenshots/');
