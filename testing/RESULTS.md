# RESULTS — Test Run

**Date:** 2026-10-20 · **Branch:** `frontend` · **Runner:** Playwright (`@playwright/test` v1.64.x, Chromium 156)
**Base URL:** `http://localhost:8000` (apna-computer hub)

## Summary: 7/7 PASSED ✅ (1.3m)

| TC | Title | Result | Evidence |
|----|-------|--------|----------|
| TC-01 | Home page loads (FR-1) | ✅ PASS | `TC01-home.png` |
| TC-02 | Hero + CTAs visible (FR-2) | ✅ PASS | `TC02-hero.png` |
| TC-03 | Products grid populated (FR-3) | ✅ PASS | `TC03-modules.png` (full page) |
| TC-04 | Status badges Live & Coming soon (FR-4) | ✅ PASS | `TC04-badges.png` |
| TC-05 | Store link works (FR-5) | ✅ PASS | `TC05-store-link.png` |
| TC-06 | No JS runtime errors (FR-7) | ✅ PASS | `TC06-console.log` (no page errors) |
| TC-07 | Mobile responsive 390px (FR-6) | ✅ PASS | `TC07-mobile.png` |

## How to re-run

```bash
# server chalu karo
py -m http.server 8000          # (apna-computer/public ke andar)

# tests chalao
cd testing && cmd /c "npx playwright test"
```

## Finish ✅
Flow complete: **Home page → Requirement (PRD.md) → Test Cases (TestCases.md) → Finish (RESULTS.md) → Evidence (`evidence/`)**
