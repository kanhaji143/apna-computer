# RFP.md — Home Page (Dashboard) — Coaching ERP (Phase 6)

| Field | Value |
|---|---|
| Module | Coaching ERP `/coaching/panel/` |
| Page | Home Page — Dashboard (`index.html`) |
| Prefix | `ch_*` (Firestore) |
| Roles | Owner, Admin1, Admin2, Accountant, Teacher |
| Status | Requirement in progress |

## 1. Overview

Dashboard Coaching ERP ka pehla page hai. Login ke turant baad yahan land hota
hai. Page business ka poora overview deta hai — students, batches, fee
collection, pending dues, expenses aur aaj ki attendance.

## 2. Functional Requirements

### 2.1 Access & Role Rules
- FR-01: Login kiye bina page nahi khulega — redirect `login.html`.
- FR-02: Role ke hisab se dashboard sabko dikhega (5 roles) — lekin aage ke
  pages role-filtered honge (Owner/Admin1/Admin2 full, Accountant = finance
  only, Teacher = academics only).
- FR-03: Sidebar me sirf woh pages dikhen jo current role ki allow-list me hain.
- FR-04: Topbar me current page ka title + user chip (name, role) dikhe.

### 2.2 Stat Cards (6)
- FR-05: Active Students (count, `ch_students` where status=Active)
- FR-06: Running Batches (count, `ch_batches` where status=Running)
- FR-07: Collected fees for current month (`ch_payments` sum by month)
- FR-08: Pending Fees (unpaid `ch_invoices` ka total)
- FR-09: This month Expenses (`ch_expenses` sum by month)
- FR-10: Staff Members (count, `ch_staff`)

### 2.3 Fee Dues List with WhatsApp Reminder
- FR-11: Top pending invoices ki list (student, batch, due date, amount).
- FR-12: Har row me "Remind" button — parent ka phone (`parentPhone`, warna
  `phone`) pe `wa.me` link, auto message with student name, amount, invoice no.
- FR-13: Number 91-prefix ke sath clean format me jaye.

### 2.4 Recent Payments
- FR-14: Latest 6 payments (date, student, amount, mode) — date desc.

### 2.5 Batches Overview
- FR-15: Har batch — name, course, time, teacher, fill % (active students vs
  capacity) with progress bar, status chip.

### 2.6 Aaj ki Attendance
- FR-16: Aaj ki date ke liye per batch — present/total (%), agar attendance
  mark nahi hua to "Pending" chip; >=75% "Good", warna "Low".

### 2.7 Data & Sync
- FR-17: Data pehli baar Firestore (`ch_*`) se load ho; FB khali ho to demo
  seed khud prastut ho jayega (pehli baar).
- FR-18: Firebase na ho to sirf localStorage chalna hi kaafi hai (demo mode).

## 3. Non-Functional Requirements

| Req | Detail |
|---|---|
| NFR-01 | Mobile responsive (sidebar toggle hamburger) |
| NFR-02 | White-label — name/icon `brand.js` se aayega |
| NFR-03 | Hindi+English mix copy (Hinglish) |
| NFR-04 | Page load < 3s par standard broadband |
| NFR-05 | Koi sensitive data UI/docs me nahi |

## 4. Acceptance Criteria

| # | Criteria |
|---|---|
| AC-01 | Bina login direct URL kholne par login page par redirect... |
| AC-02 | Sab 6 stat cards sahi values dikhayen (seed data ke hisab se recheck) |
| AC-03 | Dues row ka Remind button sahi wa.me link + message payload dekhe |
| AC-04 | Role 'Accountant' se sidebar pages me sirf fee-related pages dikhe |
| AC-05 | Dashboard no console error, 0 data load hone me delay nahi |

## 5. Out of Scope (is step me)

- Students/Batches pages ka full CRUD (next step)
- Payment record karna dashboard se (fees page me hoga)
- Student portal (Phase 6b)