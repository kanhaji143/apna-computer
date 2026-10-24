const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const EV = (n) => path.join(__dirname, '..', 'evidence', n);

test('TC-01 Home page loads (FR-1)', async ({ page }) => {
  const resp = await page.goto('/');
  expect(resp.status()).toBe(200);
  await expect(page).toHaveTitle(/Apna/i);
  await page.screenshot({ path: EV('TC01-home.png') });
});

test('TC-02 Hero + CTAs visible (FR-2)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('One Platform', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('Explore Solutions').first()).toBeVisible();
  await expect(page.getByText('Talk to Us').first()).toBeVisible();
  await page.screenshot({ path: EV('TC02-hero.png') });
});

test('TC-03 Products grid populated (FR-3)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Our Products', { exact: false }).first()).toBeVisible();
  const cards = await page.locator('.module-icon').count();
  expect(cards).toBeGreaterThanOrEqual(6);
  await page.screenshot({ path: EV('TC03-modules.png'), fullPage: true });
});

test('TC-04 Status badges Live & Coming soon (FR-4)', async ({ page }) => {
  await page.goto('/');
  const live = await page.getByText('Live', { exact: true }).count();
  const soon = await page.getByText('Coming soon', { exact: true }).count();
  expect(live).toBeGreaterThanOrEqual(3);
  expect(soon).toBeGreaterThanOrEqual(1);
  await page.screenshot({ path: EV('TC04-badges.png') });
});

test('TC-05 Store link works (FR-5)', async ({ page }) => {
  await page.goto('/');
  const link = page.locator('a[href="/clothing/store/"]').first();
  await expect(link).toHaveCount(1);
  const target = await page.request.get('/clothing/store/');
  expect(target.status()).toBe(200);
  await page.screenshot({ path: EV('TC05-store-link.png') });
});

test('TC-06 No JS runtime errors (FR-7)', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('/');
  await page.waitForTimeout(1500);
  await expect(page.locator('body')).toBeVisible();
  fs.writeFileSync(EV('TC06-console.log'), errors.join('\n') || 'no page errors');
  expect(errors).toEqual([]);
});

test('TC-07 Mobile responsive 390px (FR-6)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await page.screenshot({ path: EV('TC07-mobile.png'), fullPage: false });
});
