# Blog — Phase 1 (Apna Computer Blog Module)

Created: 2026-10-21
Module path in repo: public/blog/
Live URL: https://apna-computer-ltd.web.app/blog/

## Contents

- RFP.md            — requirements + decisions (Section 11 resolved)
- TestCases.md       — 203 test cases; 41 pass, 162 pending (live browser tests)
- evidence/          — baseline-run.log, phase1-validation.log (80/80),
                       phase1-rewrites.log (57/57), deploy.log, emulator*.log
- tests/             — blog-validate.js, blog-rewrite-test.js
- firebase.json      — hosting rewrites (clean URLs) snapshot
- firestore.rules    — bl_* auth-gated rules snapshot

## Decisions (RFP Section 11)
1. Clean URLs via Firebase Hosting rewrite (/blog/read/**)
2. English content
3. Author: Krishna Ji
4. Comments -> Phase 2
5. Newsletter -> GDPR double opt-in (Phase 1 UI + list; email sending Phase 2)
6. Firebase Auth -> real login (Phase 1)

## Manual steps remaining
- Firebase Console -> Authentication -> enable Email/Password
- Authentication -> Users -> Add admin user
- Phase 2: comments, newsletter email service, search index, sitemap generator
