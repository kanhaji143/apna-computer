# Blog — Header Upgrade (Phase 2)

Created: 2026-10-21
Live URL: https://apna-computer-ltd.web.app/blog/

## What changed
News-style header for the blog module only (hub + dashboards untouched):
- Top bar (dark, slim): live auto-updating date + continuously scrolling
  "BREAKING" ticker (CSS animation, pauses on hover)
- Masthead: logo + site name + tagline + search box
- Dark navbar strip: sticky, with active-link accent underline
- Mobile: burger menu collapses the dark navbar
- Ticker content: config.breakingText (admin-editable, items split by |),
  falls back to latest published post titles, then a welcome message
- Admin Settings page gained a "Breaking news ticker" field

## Files changed
- public/blog/assets/layout.js   (renderHeader rewritten)
- public/blog/assets/blog.css    (new header CSS + responsive)
- public/blog/assets/blog.js     (breakingText added to SITE_DEFAULT)
- public/blog/admin/settings.html (breakingText field + save/fill wiring)

## Deploy
- Deployed 2026-10-21 (4 files changed) — see evidence/deploy.log
- Live verified: https://apna-computer-ltd.web.app/blog/

## Decisions
- Applied only to blog (not hub/dashboards) — see chat rationale
- Ticker uses CSS transform animation (no JS marquee) for smooth 60fps scroll
- Date refreshes every 60s so it stays correct if tab stays open past midnight
