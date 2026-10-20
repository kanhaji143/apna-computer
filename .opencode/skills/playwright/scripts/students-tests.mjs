#!/usr/bin/env node
/* Students Page test runner with SCREENSHOT evidence — Coaching ERP Phase 6.
   Screenshots: rfp/coaching-erp/students/evidence/*.png (next to run log)
   Also captures home dashboard screenshot for home-page evidence.
   Usage: node .opencode/skills/playwright/scripts/students-tests.mjs */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'https://apna-computer-ltd.web.app/coaching/panel/';
const EV_HOME = 'rfp/coaching-erp/home-page/evidence';
const EV_STU = 'rfp/coaching-erp/students/evidence';
mkdirSync(EV_STU, { recursive: true });

const results = [];
function rec(id, ok, note) {
  results.push({ id, ok, note });
  console.log((ok ? 'PASS' : 'FAIL') + '  ' + id + '  ' + note);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1366, height: 800 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e).slice(0, 120)));

/* ---------- Owner login ---------- */
await page.goto(BASE + 'login.html', { waitUntil: 'load' });
await page.waitForTimeout(2500);
await page.fill('#loginName', 'Kanha Owner');
await page.selectOption('#loginRole', 'Owner');
await page.dispatchEvent('#loginForm', 'submit');
await page.waitForTimeout(7000);
await page.goto(BASE + 'students.html', { waitUntil: 'load' });
await page.waitForTimeout(6000);

/* TC-ST-01 + TC-ST-02: list + stats */
const rows0 = await page.$$eval('#sBody tr', els => els.length);
const stats = await page.$$eval('#sStats .stat-card', els => els.map(e => e.textContent));
rec('TC-ST-01', rows0 === 24, 'list rows=' + rows0 + ' (seed 24)');
rec('TC-ST-02', stats.length === 4, 'stats=' + stats.map(s => s.replace(/\s+/g, ' ').trim().slice(0, 30)).join(' | '));
await page.screenshot({ path: EV_STU + '/01-students-list.png', fullPage: true });

/* TC-ST-07: wa.me link payload */
const wa = await page.$eval('#sBody a[href*="wa.me"]', a => a.getAttribute('href'));
decodeURI(wa).indexOf('fees') > -1 ? null : null;
const waOk = wa && wa.includes('wa.me/91') && wa.includes('text=');
rec('TC-ST-07', Boolean(waOk), 'wa link ok: ' + decodeURI(wa).slice(0, 80) + '...');

/* TC-ST-04: validation — empty submit inside Add modal */
await page.click('text=Add Student');
await page.waitForTimeout(900);
await page.click('text=Save Student');
await page.waitForTimeout(400);
const errTxt = await page.$eval('#stuErr', e => e.textContent);
rec('TC-ST-04', errTxt.trim().length > 3, 'validation msg: "' + errTxt.trim().slice(0, 60) + '"');
await page.screenshot({ path: EV_STU + '/02-add-validation.png' });

/* TC-ST-03: add flow (valid) */
await page.fill('#fName', 'Test Rahul Playwright');
await page.selectOption('#fBatch', 'BAT001');
await page.fill('#fPhone', '9876500111');
await page.fill('#fPParent', '9876500999');
await page.fill('#fFeeT', '12000');
await page.fill('#fFeeP', '5000');
await page.fill('#fDue', '2026-11-05');
await page.screenshot({ path: EV_STU + '/03-add-form-filled.png' });
await page.click('text=Save Student');
await page.waitForTimeout(1500);
const rows1 = await page.$$eval('#sBody tr', els => els.length);
const newVisible = await page.$$eval('#sBody tr', els => els.some(e => e.textContent.includes('Test Rahul')));
rec('TC-ST-03', rows1 === 25 && newVisible, 'after add rows=' + rows1 + ', new student visible=' + newVisible);

/* persistence: reload -> still 25 (Firestore-backed, TC-ST-11) */
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(6000);
const rowsAfterReload = await page.$$eval('#sBody tr', els => els.length);
const restored = await page.$$eval('#sBody tr', els => els.some(e => e.textContent.includes('Test Rahul')));
rec('TC-ST-11', rowsAfterReload === 25 && restored, 'reload pe rows=' + rowsAfterReload + ', Firestore restore=' + restored);
await page.screenshot({ path: EV_STU + '/04-students-after-add-reload.png' });

/* TC-ST-05: edit the new student */
const idOf = await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('ch_store_v1'));
  const x = s.students.find(v => v.name.includes('Test Rahul'));
  return x ? x.id : null;
});
await page.evaluate(id => App.editStudent(id), idOf);
await page.waitForTimeout(700);
await page.fill('#fName', 'Test Rahul (Edited)');
await page.click('text=Update');
await page.waitForTimeout(1200);
const edited = await page.$$eval('#sBody tr', els => els.some(e => e.textContent.includes('(Edited)')));
rec('TC-ST-05', edited, 'edit reflected in list');
await page.screenshot({ path: EV_STU + '/05-edited-row.png' });

/* TC-ST-10: batch count sync — BAT001 count should be 6+1=7 */
const batCount = await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('ch_store_v1'));
  const b = s.batches.find(x => x.id === 'BAT001');
  const live = s.students.filter(v => v.batchId === 'BAT001' && v.status === 'Active').length;
  return { stored: b.students, live };
});
rec('TC-ST-10', batCount.stored === batCount.live, 'BAT001 count stored=' + batCount.stored + ' live=' + batCount.live);

/* TC-ST-06: delete the test student */
await page.evaluate(id => App.delStudent(id), idOf);
await page.waitForTimeout(700);
await page.click('button.btn-danger');
await page.waitForTimeout(1500);
const rows2 = await page.$$eval('#sBody tr', els => els.length);
rec('TC-ST-06', rows2 === 24, 'after delete rows=' + rows2 + ' (26 se wapas)');
await page.screenshot({ path: EV_STU + '/06-after-delete.png' });

/* TC-ST-09: search */
await page.fill('#sSearch', 'pri');
await page.waitForTimeout(600);
const rowsSearch = await page.$$eval('#sBody tr', els => els.length);
const allMatch = await page.$$eval('#sBody tr', els => els.every(e => e.textContent.toLowerCase().includes('pri')));
rec('TC-ST-09', allMatch && rowsSearch > 0 && rowsSearch < 24, 'search "pri" -> rows=' + rowsSearch + ', all match=' + allMatch);
await page.screenshot({ path: EV_STU + '/07-search-filter.png' });

/* TC-ST-08: teacher view — no edit/delete buttons */
const ctx2 = await browser.newContext();
const page2 = await ctx2.newPage();
await page2.goto(BASE + 'login.html', { waitUntil: 'load' });
await page2.waitForTimeout(2500);
await page2.fill('#loginName', 'Rajeev Sir');
await page2.selectOption('#loginRole', 'Teacher');
await page2.dispatchEvent('#loginForm', 'submit');
await page2.waitForTimeout(6000);
await page2.goto(BASE + 'students.html', { waitUntil: 'load' });
await page2.waitForTimeout(6000);
const editBtns = await page2.$$eval('#sBody button[title="Edit"]', els => els.length).catch(() => 0);
const delBtns = await page2.$$eval('#sBody button[title="Delete"]', els => els.length).catch(() => 0);
rec('TC-ST-08', editBtns === 0 && delBtns === 0, 'teacher: editBtns=' + editBtns + ', delBtns=' + delBtns + ' (dono hidden)');
await page2.screenshot({ path: EV_STU + '/08-teacher-view.png', fullPage: true });
await ctx2.close();

/* bonus: home dashboard screenshot for home-page evidence */
await page.goto(BASE + 'index.html', { waitUntil: 'load' });
await page.waitForTimeout(6000);
await page.screenshot({ path: EV_HOME + '/09-dashboard-visual.png', fullPage: true });

/* TC-ST-12: console errors */
rec('TC-ST-12', errors.length === 0, errors.length ? 'errors: ' + errors.join('|') : '0 page errors');

await browser.close();
console.log(results.every(r => r.ok) ? 'ALL PASS' : 'SOME FAILED');
