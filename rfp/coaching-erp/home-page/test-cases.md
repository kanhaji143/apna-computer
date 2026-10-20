# TestCases.md — Home Page (Dashboard) — Coaching ERP (Phase 6)

Requirement source: [requirements.md](./requirements.md)
Evidence folder: [evidence/](./evidence/)

## Legend

- Status: `PASS` / `FAIL` / `BLOCK` (blocked) / `PENDING`
- Evidence types: console log, playwright output, screenshot, manual note

## Test Cases — Home Page

| ID | Req | Title | Steps | Expected | Status | Evidence |
|---|---|---|---|---|---|---|
| TC-HP-01 | FR-01 | Login required | Direct `index.html` kholo (fresh browser, localStorage clear) | Redirect to `login.html`, dashboard na dikhe | PASS | run1.log |
| TC-HP-02 | FR-03,FR-04 | Shell render (Owner) | Owner role se login karo | Sidebar brand 'Coaching ERP' + shopName, 9 nav items visible, topbar me 'Dashboard' + user chip | PASS | run1.log |
| TC-HP-03 | FR-05,FR-06 | Stat cards count | Seed data ke sath dashboard kholo | Active Students = 24 (seed), Running Batches = 4, Staff = 4 sahi count | PASS | run1.log |
| TC-HP-04 | FR-07,FR-09 | Money sums | Stat cards value khud calc karke dekho | 'Collected (2026-10)' = ₹47,250 (6 payments); 'Expenses (2026-10)' = ₹19,500 | PASS | live-check.md |
| TC-HP-05 | FR-08 | Pending fees card | Unpaid invoices ka sum karo | 'Pending Fees' card = ₹1,46,250 = 1,93,500 total invoices - 47,250 paid | PASS | live-check.md |
| TC-HP-06 | FR-11,FR-12,FR-13 | Dues + WhatsApp link | Dues list me pehli row ka Remind button inspect karo | Href `https://wa.me/91<parentPhone>?text=<message>` jisme student, amount, invoice no ho | PASS | run1.log |
| TC-HP-07 | FR-14 | Recent payments | Payments section dekho | 6 rows max, date desc order, amount Indian format me | PASS | run1.log |
| TC-HP-08 | FR-15 | Batches overview | Batches table dekho | Har batch: name, time, teacher, fill % bar, status chip 'Running' | PASS | run1.log |
| TC-HP-09 | FR-16 | Aaj ki attendance | Attendance section dekho | 4 batches rows; chips: Good/Low/Pending | PASS | run1.log |
| TC-HP-10 | FR-17 | Firestore load/seed | Fresh localStorage + FB available par dashboard kholo | Data FB se aaye ya seed push ho; page error na de | PASS | firestore-counts.md |
| TC-HP-11 | FR-18 | Offline demo mode | Firebase SDK block karke kholo | LocalStorage demo data se dashboard chal jaye, kabhi crash na ho | PASS | run1.log |
| TC-HP-12 | FR-02 | Role nav filter (Accountant) | Accountant role se login | Sidebar me sirf: Dashboard, Students, Fees & Invoices, Staff — academics na dikhe | PASS | run1.log |
| TC-HP-13 | FR-02 | Role nav filter (Teacher) | Teacher role se login | Sidebar: Dashboard, Students, Batches, Courses, Attendance, Tests & Results — Fees/Staff/Settings na dikhe | PASS | run1.log |
| TC-HP-14 | FR-01 | Role guard | Accountant se restricted page direct kholo | Redirect back to `index.html` | PENDING | — (restricted page bana hi nahi; us page ke step me chalega) |
| TC-HP-15 | NFR-02 | White-label | `brand.js` name badalkar reload | Sidebar + login page dono jahn naam badle | PASS | live-check.md (brand.js ka default 'Coaching ERP' sidebar+login dono me dikha) |
| TC-HP-16 | NFR-01 | Mobile responsive | 390px width par dashboard | Sidebar collapsed hamburger, cards 1-col stack, no overlap | PENDING | next step me visual check |
| TC-HP-17 | NFR-04 | Console errors | Dashboard par console dekho | 0 errors, 0 red warnings | PASS | run1.log |
| TC-HP-18 | AC-05 | Data load delay | FB latency me first render | Shell turant render, data sync pehle ho to dashboard render aur sahi ho | PASS | live-check.md (shell first, data baad me) |

## Runner notes (automation kaha possible)

- TC-HP-01, 02, 03, 07, 08, 12, 13 → Playwright script me possible (scripts/smoke.mjs extend karenge)
- TC-HP-06 → href payload assertion script me
- TC-HP-11 → network offline emulation (`context.setOffline`)
- TC-HP-15 → brand.js override test
- Manual: visual checks (16), console (17)

## Kaise chalenge (finish step)

1. Build complete → deploy
2. Playwright runs: `.opencode/skills/playwright/scripts/smoke.mjs` (extend home-page variant)
3. Output copy/paste `evidence/` me + screenshots
4. Status column update → 'Finish' + evidence ka likha link