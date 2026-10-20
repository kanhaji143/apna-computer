#!/usr/bin/env node
/* Smoke check for apna-computer-ltd pages.
   Usage: node .opencode/skills/playwright/scripts/smoke.mjs [url ...]
   Default: checks hub + shop + clothing store + clothing panel login. */
import { chromium } from 'playwright';

const DEFAULTS = [
  'https://apna-computer-ltd.web.app/',
  'https://apna-computer-ltd.web.app/shop/',
  'https://apna-computer-ltd.web.app/clothing/store/',
  'https://apna-computer-ltd.web.app/clothing/panel/login.html',
  'https://apna-computer-ltd.web.app/crm/login.html'
];

const urls = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULTS;

const browser = await chromium.launch();
const page = await browser.newPage();
const rows = [];
for (const url of urls) {
  try {
    const res = await page.goto(url, { waitUntil: 'load', timeout: 20000 });
    await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
    const title = (await page.title()).slice(0, 70);
    rows.push({ url, status: res && res.status(), title, ok: Boolean(title && title.length > 3) });
  } catch (e) {
    rows.push({ url, status: 'ERR', title: String(e).slice(0, 70), ok: false });
  }
}
await browser.close();

for (const r of rows) {
  console.log((r.ok ? 'PASS' : 'FAIL') + '  ' + r.status + '  ' + r.url + '  "' + r.title + '"');
}
console.log(rows.every(r => r.ok) ? 'ALL PASS' : 'SOME FAILED');
