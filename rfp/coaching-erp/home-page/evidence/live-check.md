# live-check.md — Home Page evidence (manual browser runs, 20 Oct 2026)

## Live dashboard values (Owner login)

- URL: `/coaching/panel/index.html` — title: `Dashboard · Coaching ERP`
- Welcome: "Welcome — Kanha Owner", date chip present
- Stat cards: 24 Active Students / 4 Running Batches / ₹47,250 Collected (2026-10) / ₹1,46,250 Pending Fees / ₹19,500 Expenses (2026-10) / 4 Staff Members
- Dues: 6 rows, Remind button → `https://wa.me/9191234xxxxx?text=Namaste%2C%20<Priya%20Sharma>%20ki%20fees%20Rs.10500%20due%20hai%20(inv...)`
- Recent Payments: 6 rows (date desc, ₹ Indian format, mode chip)
- Batches: 4 rows + fill bars + 'Running' chips
- Aaj ki Attendance: 4 rows naye chips (Good) — seed me aaj (2026-10-20) ka attendance tha
- Console: 0 errors

## Math cross-check (TC-HP-04, 05)

- Payments seed (i%4==0 → 6 invoices paid): 10500+10500+11250+4500+4500+6000 = **47,250** ✅
- Total invoices: 193,500; Pending = 193,500 − 47,250 = **1,46,250** ✅
- Expenses seed: 12,000+3,200+1,800+2,500 = **19,500** ✅

## Firestore counts after seed push (TC-HP-10)

ch_students 24, ch_batches 4, ch_invoices 24, ch_payments 6,
ch_attendance 48 (2 din × 24), ch_results 18, ch_timetable 24 ✅
(di REST qili se counts ki jaanch ki gayi; har naye browser sessions me dekha)

## Bugs found & fixed during testing

1. `data.js` me octal literal `06` — strict mode SyntaxError → fixed (6 + n%8)
2. `ch_*` Firestore rules missing (default deny) → 16 rules add karke deploy kiya
3. `SEED_CONFIG` me `id` missing tha → `id:'app'` add kiya (config doc push hota hai)
