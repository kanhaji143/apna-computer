# RFP.md — Students Page — Coaching ERP (Phase 6)

| Field | Value |
|---|---|
| Module | Coaching ERP `/coaching/panel/` |
| Page | Students (`students.html`) |
| Prefix | `ch_students` (+ batch counts `ch_batches`, invoice hint `ch_invoices`) |
| Roles | Owner, Admin1, Admin2, Accountant (CRUD), Teacher (view + WhatsApp) |
| Rule flow | Requirement → Test cases → Finish → Evidence |

## 1. Overview

Students page coaching ka core directory hai — admission se lekar fee summary
tak. Yahan se naya student add hota hai, edit/delete hota hai, aur parent ko
WhatsApp fee reminder bhej sakte hain (sale-time SaaS value).

## 2. Functional Requirements

### 2.1 List & Stats
- FR-S1: Student table — Student (name + adm no), Batch, Phone (parent), Fee
  Status (paid/total), Due date, Status chip, Actions.
- FR-S2: 4 stat cards — Active, Fee Due Wale (unpaid count), New This Month
  (joinDate by month), Total Fee Value (sum feePaid).
- FR-S3: In-page search (name / adm / phone) — instant filter.

### 2.2 CRUD
- FR-S4: Add Student modal — name, batch (dropdown from ch_batches), phone,
  parentPhone, gender, dob, address, joinDate (default aaj), feeTotal,
  feePaid, feeMode (Monthly/Quarterly/Full), dueDate, status, remark.
- FR-S5: Adm no auto-generate (`CH26-1001+` series, editable nahi).
- FR-S6: Edit Student — same modal pre-filled.
- FR-S7: Delete — confirm modal ke baad remove + batch count update.
- FR-S8: Har add/update/delete par Firestore `ch_students` sync ho (aage
  syncStart isko le lega).

### 2.3 Validation
- FR-S9: Name + batch + feeTotal required; phone/parentPhone numeric 10-digit
  (chaho to blank); feePaid <= feeTotal.
- FR-S10: Invalid input par red inline message, modal band na ho.

### 2.4 WhatsApp Reminder
- FR-S11: Row action "Remind" — parentPhone (warna phone) pe wa.me link, msg
  me: student name, total fee, paid, pending amount, dueDate, shopName.

### 2.5 Role Behavior
- FR-S12: Accountant/Owner/Admins ko CRUD; Teacher ko view + Remind+details
  (Edit/Delete buttons hidden).
- FR-S13: Action buttons ke bina page crash na ho.

### 2.6 Batch Count Sync
- FR-S14: Add/delete/change batch par batches page ka `students` count
  real-time update (CH save + ch_batches sync).

## 3. Non-Functional

| Req | Detail |
|---|---|
| NFR-S1 | Mobile pe table horizontally scrollable |
| NFR-S2 | Large student list (500+) me bhi page fast (batch render 100 rows/scroll) |
| NFR-S3 | Hindi+English copy, chip-based visuals |
| NFR-S4 | White-label compatible (brand.js kisi cheez ko break na kare) |

## 4. Acceptance Criteria

| # | Criteria |
|---|---|
| AC-S1 | 24 seed students list me show + 4 stats sahi |
| AC-S2 | Add student → list + stat + batch count turant update; refresh pe bhi rahe ( FireStore ) |
| AC-S3 | Edit student → modal pree-filled, changes dikhen |
| AC-S4 | Delete → row removed + stat 25 weird nahi + batch count kam |
| AC-S5 | Remind link zo sahi payload generate kare |
| AC-S6 | Teacher role: Edit/Delete na dikhe, baki kaam cristaal |
| AC-S7 | Search: 'pri' type karne par only matching list |
| AC-S8 | 0 console errors, 0 quick flicker |
