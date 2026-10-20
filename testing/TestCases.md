# Test Cases — Apna Computer Hub Home Page

**Base URL:** `http://localhost:8000` · **Spec:** `tests/home.spec.js` · **PRD:** `PRD.md`

| TC | PRD Ref | Title | Steps | Expected Result | Evidence |
|----|---------|-------|-------|-----------------|----------|
| TC-01 | FR-1 | Home page loads | GET `/`, check status + title | Status 200, title contains "Apna" | `TC01-home.png` |
| TC-02 | FR-2 | Hero + CTAs visible | Scroll top, read hero text & buttons | "One Platform" text; "Explore Solutions" & "Talk to Us" buttons visible | `TC02-hero.png` |
| TC-03 | FR-3 | Products grid populated | Count module cards in "Our Products" | ≥ 6 module cards with icon | `TC03-modules.png` |
| TC-04 | FR-4 | Status badges | Count "Live" & "Coming soon" badges | Live ≥ 3, Coming soon ≥ 1 | `TC04-badges.png` |
| TC-05 | FR-5 | Store link works | Find `a[href="/clothing/store/"]`, fetch target | Link exists; `/clothing/store/` responds 200 | `TC05-store-link.png` |
| TC-06 | FR-7 | No JS runtime errors | Navigate, capture pageerror/console | 0 uncaught errors; log saved | `TC06-console.log` |
| TC-07 | FR-6 | Mobile responsive | Viewport 390×844, load page | No horizontal scroll (scrollWidth ≤ 391) | `TC07-mobile.png` |

## Finish → Evidence

Run: `cmd /c "npx playwright test"` (from `testing/`) → results in `RESULTS.md`,
screenshots/logs in `evidence/`. Sab kuch working branch par commit hota hai.
