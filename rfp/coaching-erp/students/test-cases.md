# TestCases.md — Students Page — Coaching ERP (Phase 6)

Requirement source: [requirements.md](./requirements.md)
Evidence folder: [evidence/](./evidence/)

| ID | Req | Title | Steps | Expected | Status | Evidence |
|---|---|---|---|---|---|---|
| TC-ST-01 | FR-S1,AC-S1 | Seed list render | Owner login → students page | Table me 24 seed students, columns sahi | PASS | run1.log + 01-students-list.png |
| TC-ST-02 | FR-S2,AC-S1 | 4 stat cards | Stats check | Active=24, Fee Due=11, New This Month=0, Fees Received=₹6,80,000 | PASS | run1.log + 01-students-list.png |
| TC-ST-03 | FR-S4,FR-S5,AC-S2 | Add student | Add modal → valid full form submit | rows 24→25, adm auto, reload pe persist | PASS | run1.log + 03-add-form-filled.png + 04-students-after-add-reload.png |
| TC-ST-04 | FR-S9,FR-S10 | Validation | Form khali submit karo / wrong nos | "Name bharein • Total Fee sahi bharein" inline error, modal band nahi | PASS | run1.log + 02-add-validation.png |
| TC-ST-05 | FR-S6,AC-S3 | Edit student | Modal prefill → name '(Edited)' save | List me change turant dikha | PASS | run1.log + 05-edited-row.png |
| TC-ST-06 | FR-S7,AC-S4 | Delete student | Confirm modal → delete | rows 25→24, batch count recalc | PASS | run1.log + 06-after-delete.png |
| TC-ST-07 | FR-S11,AC-S5 | WhatsApp link | Remind button inspect | wa.me/91 + payload (name CH26-1001, fees, totals) | PASS | run1.log |
| TC-ST-08 | FR-S12,AC-S6 | Teacher view | Teacher login → students | Edit/Delete buttons 0 (hidden), Remind + table dikhe | PASS | run1.log + 08-teacher-view.png |
| TC-ST-09 | FR-S3,AC-S7 | Search | 'pri' search | 2 rows only, all match | PASS | run1.log + 07-search-filter.png |
| TC-ST-10 | FR-S14 | Batch count sync | BAT001 add ke baad check | stored=7 == live=7 | PASS | run1.log |
| TC-ST-11 | FR-S8 | Firestore sync | Reload fresh state |-Nov Firestore restore=true | PASS | run1.log + 04-students-after-add-reload.png |
| TC-ST-12 | NFR-S3 | Console clean | Page errors dekhe | 0 errors | PASS | run1.log |

## Automation notes

- TC-ST-01, 02, 09, 12 → playwright script (sugar-checkable)
- TC-ST-03/05/06 → UI flow test via browser tool + REST refresh check
- TC-ST-08 → new context me Teacher login
- TC-ST-11 → fresh context + network idle wait
