---
name: Playwright Browser Check
description: Use when the user wants to check a website, test pages, take screenshots, or do any browser automation from the terminal. Covers playwright CLI usage and a ready smoke-test script for this project.
---

## Playwright Browser Check

Use this skill whenever browser automation or site verification is needed from
the terminal (when the built-in browser tools are not enough or are unavailable).

## Environment

- Playwright is installed as a devDependency of this project (`C:\Users\user\apna-computer-ltd`).
- Run all commands from the project root so `npx` resolves the local install.
- Chromium is already downloaded to `%LOCALAPPDATA%\ms-playwright`.
- Live site: `https://apna-computer-ltd.web.app` (Firebase Hosting, SPA rewrite
  means unknown paths return the hub homepage with HTTP 200 — always verify by
  page `title` or URL, never by status code alone).

## Workflow

1. Ask what to check (which pages, what behavior) if not stated.
2. For a quick interactive look, launch the CLI:
   `npx playwright open https://apna-computer-ltd.web.app`
3. For scripted checks, run the smoke script:
   `node .opencode/skills/playwright/scripts/smoke.mjs`
   Pass a space-separated URL list as arguments; it prints one status line
   per URL (title + keyword match).
4. For assertions flows, write a `_test.mjs` using `@playwright/test` style or
   `import { chromium } from 'playwright'` and place it in `scripts/`.
5. Report results as a short table: page, title seen, pass/fail, anything broken.

## CLI facts

- `npx playwright --version` — show version.
- `npx playwright open <url>` — open a browser headed, REPL-ish exploration.
- `npx playwright screenshot <url> <file.png>` — one screenshot. Add
  `--wait-for-timeout 4000` to let JS apps settle.
- `npx playwright pdf <url> <file.pdf>` — print a page to PDF (Chromium only).
- `npx playwright codegen <url>` — record actions to generate test code.
- `npx playwright install chromium` — (re)install the browser if launch fails.

## Notes

- Pages are JS-heavy (Firestore loads data client-side), so wait for the
  network to settle before asserting content.
- Never modify the Maurya reference site (https://maurya-online-center.vercel.app);
  read-only observation.
- Demo logins are client-side localStorage — store logins persist via UI state,
  not server vetting; do not treat them as real auth.
