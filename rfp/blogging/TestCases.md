---

## Section G — Phase 1: Build & Infrastructure Validation (automated)

Run date: 2026-10-21 · Tooling: `test/blog-validate.js` + `test/blog-rewrite-test.js` · Emulator: Firebase Hosting 15.34.0

### G1. Static validation (`test/blog-validate.js`) — 80/80 PASS

| ID | Test | Result |
|---|---|---|
| G-01 | `firebase.json` parses as valid JSON | ✅ Pass |
| G-02 | Rewrites array has 7 rules, catch-all `**` is LAST | ✅ Pass |
| G-03 | All 6 blog rewrites present (read/category/tag × trailing slash) | ✅ Pass |
| G-04 | Every rewrite destination file exists on disk | ✅ Pass |
| G-05 | `firestore.rules` braces/parens balanced | ✅ Pass |
| G-06 | All 7 `bl_*` collections declared | ✅ Pass |
| G-07 | Default deny fallback retained | ✅ Pass |
| G-08 | `isAdmin()` + `canReadPublicPost()` helpers defined | ✅ Pass |
| G-09 | No blog collection has open public write | ✅ Pass |
| G-10 | posts: create/delete require admin | ✅ Pass |
| G-11 | subscribers: consent enforced on create; list hidden from public | ✅ Pass |
| G-12 | messages: inbox hidden from public | ✅ Pass |
| G-13 | Public update limited to view-count increment by 1 | ✅ Pass |
| G-14 | Scheduling enforced via `publishAt` Timestamp | ✅ Pass |
| G-15 | Pre-existing modules (cl/sc/oc/ch) left untouched (demo rules intact) | ✅ Pass |
| G-16 | `hub_leads` still create-only public | ✅ Pass |
| G-17 | `blog.js`, `layout.js`, `admin.js` parse (node --check) | ✅ Pass |
| G-18 | All 22 inline `<script>` blocks parse (22 files) | ✅ Pass |
| G-19 | All 112 static `/blog/` references resolve | ✅ Pass |
| G-20 | Clean-URL rewrite targets exist & read `?slug=` / path slug | ✅ Pass |
| G-21 | All 8 public pages have title, description, robots, lang, viewport | ✅ Pass |
| G-22 | Templates start `noindex` (JS unlocks after slug resolves) | ✅ Pass |

### G2. Hosting rewrite runtime (`test/blog-rewrite-test.js`) — 57/57 PASS

| ID | Test | Result |
|---|---|---|
| G-23 | `GET /blog/read/<slug>/` → 200, served by post template | ✅ Pass |
| G-24 | Post template has share buttons, author box, related grid, newsletter form | ✅ Pass |
| G-25 | `GET /blog/read/<slug>` (no trailing slash) → 200 | ✅ Pass |
| G-26 | `GET /blog/category/<slug>/` → 200, served by category template | ✅ Pass |
| G-27 | `GET /blog/tag/<slug>/` → 200, served by tag template | ✅ Pass |
| G-28 | All 8 static public pages → 200 with expected content | ✅ Pass |
| G-29 | All 11 admin pages → 200, NOT swallowed by rewrite | ✅ Pass |
| G-30 | Login page is auth page (Firebase Auth), not post template | ✅ Pass |
| G-31 | Admin login uses Firebase Auth, not localStorage | ✅ Pass |
| G-32 | All 5 admin assets → 200 | ✅ Pass |
| G-33 | `/robots.txt` → 200, points at sitemap, blocks `/blog/admin/`, allows AdSense crawlers | ✅ Pass |
| G-34 | `/sitemap.xml` → 200, valid XML, lists blog home + privacy policy | ✅ Pass |
| G-35 | Unknown deep path falls back to hub index (catch-all intact) | ✅ Pass |
| G-36 | `firebase.json` sets no-cache for html/js/css/json | ✅ Pass |

### G3. Notes / known limitations

- **Cache-Control headers** are configured in `firebase.json` but the Hosting emulator does not emit them; they are applied in production deploy. Verified via config check (G-36).
- **Firestore rules** could not be executed in the emulator because no Java runtime is installed in this environment. Rules were validated structurally (balanced delimiters, all collections, helper functions, no open public writes). Runtime rule tests are deferred to a post-deploy smoke test.
- **Firebase Auth** requires one manual step in the Firebase Console: Authentication → Sign-in method → enable Email/Password, then Authentication → Users → Add user (the admin email + password). Until this is done, `/blog/admin/login.html` will reject every login with `auth/operation-not-allowed`. Documented in `RFP.md` Section 11 → Decision 6.
- **Newsletter** stores subscribers as `pending` (double opt-in). Actual confirmation email requires connecting an email service (Brevo/Mailchimp/SendGrid) — UI + consent + subscriber list are complete; sending is deferred to Phase 2.
- **Comments** deferred to Phase 2 (spam + AdSense risk).
- **Sitemap regeneration**: static `sitemap.xml` ships with fixed pages. The dashboard "Download sitemap" utility (added in Phase 2) will generate the full XML including published posts.

### Updated summary

| Section | Total | Pass | Fail | Pending |
|---|---|---|---|---|
| A — Baseline | 5 | 5 | 0 | 0 |
| B — Public | 51 | 0 | 0 | 51 |
| C — Admin | 88 | 0 | 0 | 88 |
| D — SEO/Tech | 12 | 0 | 0 | 12 |
| E — Hub | 4 | 0 | 0 | 4 |
| F — Responsive | 21 | 0 | 0 | 21 |
| G — Phase 1 infra | 36 | 36 | 0 | 0 |
| **Total** | **203** | **41** | **0** | **162** |

Phase 1 (build + infrastructure) complete. Section B–F (live browser tests) will run after deploy.
Evidence: `evidence/phase1-validation.log`, `evidence/phase1-rewrites.log`, `evidence/baseline-run.log`, `evidence/emulator2.log`.
