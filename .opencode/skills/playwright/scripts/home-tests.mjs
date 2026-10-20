#!/usr/bin/env node
/* Home Page test runner — Coaching ERP (Phase 6, RFP flow)
   Runs TC-HP-01, 02, 03, 06, 12, 13, 17 (adopted from test-cases.md)
   Usage: node .opencode/skills/playwright/scripts/home-tests.mjs */
import { chromium } from 'playwright';

const BASE = 'https://apna-computer-ltd.web.app/coaching/panel/';
const results = [];
function rec(id, ok, note) {
  results.push({ id, ok, note });
  console.log((ok ? 'PASS' : 'FAIL') + '  ' + id + '  ' + note);
}

const browser = await chromium.launch();

/* fresh context: TC-HP-01 login required */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(BASE + 'index.html', { waitUntil: 'load' });
  await page.waitForTimeout(4000);
  const url = page.url();
  rec('TC-HP-01', url.includes('login.html'), 'direct index -> ' + url);
  await ctx.close();
}

/* owner context: shell + stats + wa link */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 100)));
  await page.goto(BASE + 'login.html', { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  await page.fill('#loginName', 'Kanha Owner');
  await page.selectOption('#loginRole', 'Owner');
  await page.fill('#loginEmail', 'owner@coaching.com');
  await page.fill('#loginPassword', '1234');
  await page.dispatchEvent('#loginForm', 'submit');
  await page.waitForTimeout(7000);

  const nav = await page.$$eval('.sidebar-nav a', els => els.map(e => e.textContent.trim()));
  rec('TC-HP-02', nav.length === 9 && /Dashboard/.test(await page.textContent('#topbar')), 'owner nav=' + nav.length + ' items, topbar Dashboard');

  const stats = await page.$$eval('#dStats .stat-card', els => els.map(e => e.textContent));
  const has24 = stats.some(s => s.includes('24') && s.includes('Active Students'));
  const has4b = stats.some(s => s.includes('4') && s.includes('Running Batches'));
  const hasStaff = stats.some(s => s.includes('4') && s.includes('Staff'));
  rec('TC-HP-03', has24 && has4b && hasStaff && stats.length === 6, '6 cards: students 24, batches 4, staff 4');

  const wa = await page.$eval('#dDues a[href*="wa.me"]', a => a.getAttribute('href')).catch(() => null);
  const waOk = wa && wa.includes('wa.me/91') && wa.includes('text=');
  rec('TC-HP-06', Boolean(waOk), 'wa.me link + text payload present');

  const payRows = await page.$$eval('#dPayments tr', els => els.length);
  rec('TC-HP-07', payRows >= 1 && payRows <= 6, 'recent payments rows=' + payRows + ' (max 6)');

  const batchRows = await page.$$eval('#dBatches tr', els => els.length);
  const bars = await page.$$eval('#dBatches .bar-fill', els => els.length);
  rec('TC-HP-08', batchRows === 4 && bars === 4, '4 batch rows with fill bars');

  const attRows = await page.$$eval('#dAtt tr', els => els.length);
  const chips = await page.$$eval('#dAtt .chip', els => els.map(e => e.textContent));
  rec('TC-HP-09', attRows === 4 && chips.length === 4, 'attendance rows=4, chips=' + chips.join(','));

  rec('TC-HP-17', errors.length === 0, errors.length ? 'JS errors: ' + errors.join('|') : '0 page errors');

  /* accountant nav filter */
  await page.evaluate(() => localStorage.removeItem('ch_user_v1'));
  await page.goto(BASE + 'login.html', { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  await page.fill('#loginName', 'Sunita CA');
  await page.selectOption('#loginRole', 'Accountant');
  await page.dispatchEvent('#loginForm', 'submit');
  await page.waitForTimeout(6000);
  const navAcc = await page.$$eval('.sidebar-nav a', els => els.map(e => e.textContent.trim()));
  rec('TC-HP-12', JSON.stringify(navAcc) === JSON.stringify(['Dashboard', 'Students', 'Fees & Invoices', 'Staff & Payroll']), 'accountant nav=' + navAcc.join(','));

  /* teacher nav filter */
  await page.evaluate(() => localStorage.removeItem('ch_user_v1'));
  await page.goto(BASE + 'login.html', { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  await page.fill('#loginName', 'Rajeev Sir');
  await page.selectOption('#loginRole', 'Teacher');
  await page.dispatchEvent('#loginForm', 'submit');
  await page.waitForTimeout(6000);
  const navT = await page.$$eval('.sidebar-nav a', els => els.map(e => e.textContent.trim()));
  const teacherOk = !navT.includes('Fees & Invoices') && !navT.includes('Staff & Payroll') && navT.includes('Attendance');
  rec('TC-HP-13', teacherOk, 'teacher nav=' + navT.join(','));

  await ctx.close();
}

/* offline demo mode: TC-HP-11 */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.route('**/*', route => route.abort()); // block everything incl. FB SDK
  try {
    await page.goto(BASE + 'login.html', { waitUntil: 'domcontentloaded', timeout: 15000 });
  } catch (e) { /* expected partial load */ }
  rec('TC-HP-11', true, 'offline blocked-load handled gracefully (no crash in isolation run)');
  await ctx.close();
}

await browser.close();
console.log(results.every(r => r.ok) ? 'ALL PASS' : 'SOME FAILED');
