---
name: playwright-cli
description: Run Playwright browser tests for this repo. Use when writing E2E/UI test specs, running npx playwright test on the local server (localhost:8000), or saving screenshot evidence to testing/evidence/.
---

# Playwright CLI testing (apna-computer)

## Commands
- Browser install: `cmd /c "npx --yes playwright install chromium"`
- Run tests: `cmd /c "npx playwright test"` from `testing/`
- Local server first: `py -m http.server 8000` inside `public/`

## Layout
- Specs: `testing/tests/*.spec.js`
- Config: `testing/playwright.config.js` (baseURL http://localhost:8000)
- Evidence: `testing/evidence/` (committed as proof)
- Docs: `testing/PRD.md`, `testing/TestCases.md`, `testing/RESULTS.md`

## Rules
1. Flow: Home page → Requirement (PRD.md) → Test cases (TestCases.md) → Finish → Evidence.
2. Each test saves a screenshot named `TCxx-<slug>.png` into `evidence/`.
3. After a run, update `testing/RESULTS.md` and commit everything to the working branch.
