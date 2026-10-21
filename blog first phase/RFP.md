# RFP — Apna Computer Blog Module

Version: 1.0
Date: 2026-10-21
Status: Draft for approval
Source blueprint: `APNA COMPUTER — COMPLETE BLOGGING WEBSITE BLUEPRINT`

---

## 1. Purpose

Hindi/Hinglish me technology, AI aur computer tutorials publish karne ke liye ek
blogging module. Goal: organic search traffic laana, aur future me Google AdSense
se monetize karna.

Tagline: **Simplifying Technology for Everyone**

---

## 2. Reality check — blueprint vs existing stack

Blueprint do options deta hai (Section 14):

| Option | Blueprint me | Aapke setup me |
|---|---|---|
| A — WordPress | ✅ Recommended for fast launch | ❌ Nahi — aap Firebase Hosting use karte ho, WordPress PHP chalata hai |
| B — Next.js + TypeScript + PostgreSQL | ✅ Custom app | ❌ Nahi — Next.js server chahiye, Firebase Hosting sirf static files serve karta hai |

**Aapka actual stack (verified):**

- **Firebase Hosting** — static HTML/CSS/JS serve karta hai
- **Firestore** — database (client SDK se direct access)
- **Firebase Storage** — images
- **No server** — koi backend, koi PHP, koi Node server nahi
- **Auth** — demo client-side localStorage auth (shop/CRM me jo hai wahi)

**Isliye ye RFP Option C define karti hai: Static + Firestore (aapke stack ke hisaab se
adapted).** WordPress/Next.js ke liye alag project chahiye hoga — ye scope me nahi hai.

### Blueprint ki jo cheezein is stack par nahi ho sakti

| Blueprint requirement | Kyun nahi | Substitute |
|---|---|---|
| `password_hash` server-side | Server hi nahi hai | Firebase Auth (production) ya demo localStorage (abhi) |
| Server-side validation | Server hi nahi hai | Firestore rules + client validation |
| CSRF protection | Server nahi hai | Firebase ID token (production) |
| Rate limiting server-side | Server nahi hai | Firestore rules + client-side debounce |
| XML sitemap auto-generate | Server nahi hai | Static `sitemap.xml` build script se |
| Scheduled publishing (cron) | Server nahi hai | `publishedAt` future date + client check |
| `ads.txt` | ✅ Ye ho sakta hai | Static file |
| AdSense code integration | ✅ Ye ho sakta hai | Admin-configurable script inject |

---

## 3. Scope

### In scope (Phase 1 — MVP)

**Public website:**
1. Blog homepage — hero, latest articles, categories, popular
2. Article listing page — pagination / load more
3. Single article page — breadcrumb, TOC, content, related, prev/next, share
4. Category page — category ke articles
5. Search page — title/content search
6. About, Contact, Privacy Policy, Disclaimer, Terms — static pages

**Admin panel:**
1. Login
2. Dashboard — counts (total/published/draft/scheduled)
3. Post management — create, edit, delete, draft, publish, unpublish, preview, filter
4. Content editor — rich text (Quill), no HTML likhna padega
5. Media library — image upload, alt text, caption
6. Category management — CRUD
7. Tag management — CRUD, duplicate prevention
8. SEO management — seo title, meta description, slug, canonical, index/noindex
9. Ad slot management — enable/disable per placement
10. Website settings — name, tagline, logo, social links

**Technical:**
- Firestore collections: `bl_posts`, `bl_categories`, `bl_tags`, `bl_media`, `bl_config`
- Firestore rules update
- Structured data (JSON-LD Article + BreadcrumbList)
- Meta tags, Open Graph, Twitter cards
- Mobile responsive
- Hub nav me "Blog" add karna

### Out of scope (Phase 2+)

- WordPress migration
- Next.js/PostgreSQL version
- Newsletter email automation (SMTP/email service chahiye)
- Multi-author accounts with roles
- Article version history
- AI-assisted drafting
- Reading-time indicator (baad me)
- Search analytics dashboard
- Real view counts (fabricated counts dikhana mana hai — blueprint Section 3)

---

## 4. Data model (Firestore)

Blueprint Section 8 ka relational model Firestore me is tarah map hota hai:

| Blueprint table | Firestore collection | Notes |
|---|---|---|
| `posts` | `bl_posts` | `category` field (single) — `post_categories` junction ki jagah. Agar multi-category chahiye to array use hoga |
| `categories` | `bl_categories` | |
| `tags` | `bl_tags` | `bl_posts.tags` me array of names |
| `media` | `bl_media` | Firebase Storage URL ke saath |
| `site_settings` | `bl_config` | key-value, single doc me |
| `ad_slots` | `bl_config` → `adSlots` object | alag collection ki zaroorat nahi |
| `users` | `bl_config` → `admin` object | Single owner. Production me Firebase Auth |
| `redirects` | `bl_redirects` | Phase 2 |
| `post_categories`, `post_tags` | junction nahi | Firestore array field |

### Collection: `bl_posts`

```
id            (doc id)
title         string      — required
slug          string      — required, unique, URL-safe
excerpt       string      — short description
content       string      — HTML (Quill output)
featuredImage string      — Storage URL (optional)
featuredAlt   string      — image alt text
category      string      — category name
tags          array       — string[]
author        string      — default "Apna Computer"
status        string      — 'draft' | 'published' | 'scheduled'
isFeatured    boolean     — hero me dikhana hai
seoTitle      string
metaDescription string
canonicalUrl  string
noindex       boolean
ogTitle       string
ogDescription string
ogImage       string
views         number      — real counter, incremented on read
publishedAt   string      — ISO date
createdAt     string      — ISO
updatedAt     string      — ISO
```

### Collection: `bl_categories`

```
id, name, slug, description, createdAt
```

### Collection: `bl_tags`

```
id, name, slug
```

### Collection: `bl_media`

```
id, url, name, altText, caption, type, size, createdAt
```

### Collection: `bl_config` (single doc: `site`)

```
siteName, tagline, logoUrl, faviconUrl,
about, contactEmail, contactPhone, address,
social: { facebook, twitter, youtube, instagram, telegram },
ads: { header: {enabled, code}, home: {enabled, code},
       inArticle: {enabled, code}, sidebar: {enabled, code},
       footer: {enabled, code} },
defaultSeo: { title, description, image },
analyticsId
```

---

## 5. SEO requirements

- Clean URLs — `/blog/post.html?slug=xxx` (static hosting constraint)
- Unique `<title>` per page
- Meta description per article
- Canonical URL
- Open Graph + Twitter Card tags
- JSON-LD structured data:
  - `Article` — title, datePublished, dateModified, author, image
  - `BreadcrumbList` — Home > Category > Article
  - `WebSite` + `SearchAction` (sitelinks searchbox)
- XML sitemap — `/sitemap.xml` (build script se)
- Robots.txt — `/robots.txt`
- Breadcrumb navigation (visible + structured data)
- Descriptive image `alt` text
- Heading hierarchy — article content me H2/H3
- Mobile responsive
- Drafts par `noindex` meta tag
- Admin pages par `noindex`
- Custom 404 page

**Constraint:** Firebase Hosting me dynamic sitemap nahi ban sakta. Solution: admin
panel me "Generate sitemap" button jo static `sitemap.xml` file download kare, aur
usse `public/sitemap.xml` me paste karna ho.

---

## 6. AdSense readiness

- 5 ad slots: header, homepage, in-article, sidebar, footer
- Har slot admin se enable/disable
- Ad code admin panel se configured (script/ins tag)
- Responsive containers
- Content obstruct nahi karna
- Accidental click design nahi
- `ads.txt` support
- Privacy/cookie disclosure

**Note:** AdSense approval guaranteed nahi hai. Google ki policy aur review par
depend karta hai.

---

## 7. Design system

- Modern, clean, professional, educational, technology-focused
- Light theme default
- Dark mode — **Phase 2** (blueprint Section 11 ke hisaab se "future update")
- Consistent typography
- Readable article layout — max-width ~720px
- Spacious, minimal animations

---

## 8. Security

- HTTPS (Firebase Hosting automatic)
- Admin access restricted
- Firestore rules — public read (blog), admin write
- Image upload — type/size validation
- XSS — Quill sanitize output
- No credentials in frontend code

**Critical note:** Aapke existing modules me sab kuch `allow read, write: if true`
hai (demo mode). Blog public hai to read open theek hai, **lekin write kisi ko bhi
kar sakte hain** — matlab koi bhi visitor post delete/create kar sakta hai.
Production se pehle Firebase Auth lagana zaroori hai. Ye RFP isko Phase 2 me rakhti hai,
par **risk acknowledge** karti hai.

---

## 9. Acceptance criteria

Blueprint Section 17 ke hisaab se:

| # | Criterion | Phase 1 me |
|---|---|---|
| 1 | Public pages mobile + desktop par kaam karein | ✅ |
| 2 | Admin bina code ke article create/edit/preview/publish kar sake | ✅ |
| 3 | Published articles ki stable unique URL ho | ✅ |
| 4 | Categories, search, pagination kaam karein | ✅ |
| 5 | SEO fields admin panel se manage hon | ✅ |
| 6 | Drafts aur admin pages publicly index na hon | ✅ |
| 7 | Featured images aur media uploads secure hon | ⚠️ Partial (Firebase Auth Phase 2) |
| 8 | Ad placements admin control kare | ✅ |
| 9 | Privacy, disclaimer, contact pages available hon | ✅ |
| 10 | Security, backup, recovery tested | ⚠️ Firebase console se |
| 11 | Koi critical broken link ya publishing error na rahe | ✅ |
| 12 | Search Console submission ke liye ready ho | ✅ |

---

## 10. Delivery phases

| Phase | Kaam | Status |
|---|---|---|
| 1 | Planning + UI design + brand styling | ✅ (this document) |
| 2 | Core website — header, homepage, listing, article, category, search, footer, policy pages | ⏳ Next |
| 3 | Admin panel — login, dashboard, editor, media, categories, tags, draft/publish | ⏳ |
| 4 | SEO + monetization — metadata, sitemap, structured data, ad slots | ⏳ |
| 5 | Testing — responsive, links, security, performance, workflow | ⏳ |
| 6 | Launch — domain, HTTPS, Search Console, articles publish | ⏳ |
| 7 | Firebase Auth (production security) | ⏳ Recommended |

---

## 11. Decisions needed from owner — RESOLVED (2026-10-21)

| # | Question | Owner answer | Implementation |
|---|---|---|---|
| 1 | URL format | "alag folder bano" → clean URLs | Firebase Hosting rewrites: `/blog/read/**` → `templates/post.html` (slug parsed from path). No per-post folders needed. |
| 2 | Language | English | All UI + content in English. |
| 3 | Author name | Krishna Ji | Default author in config + editor. |
| 4 | Comments | "you decide" → **Phase 2** | Deferred (spam + AdSense risk). |
| 5 | Newsletter | "international standard" | GDPR-style double opt-in, unchecked consent, privacy link, unsubscribe; subscriber list in `bl_subscribers`. Email sending deferred to Phase 2 (needs Brevo/Mailchimp/SendGrid). |
| 6 | Firebase Auth | "Haan, abhi lagao" | Real Firebase Auth (email/password). Firestore `bl_*` writes gated on `request.auth != null`. |

---

## 12. Risks (post-decision status)

| Risk | Impact | Mitigation | Status |
|---|---|---|---|
| Firestore rules open write | Koi bhi data delete kar sakta hai | Firebase Auth on all `bl_*` writes; view-count-only public increment | ✅ Mitigated (Phase 1) |
| Client-side search | Bahut articles par slow | Client-side filter (Phase 1); search index (Phase 2) | ⚠️ Phase 2 |
| No server | Sitemap, scheduled publish limited | Build script + client-side date check + `publishAt` Timestamp rule | ⚠️ Partial |
| Demo auth | Admin panel kisi bhi browser me khul jayega | Firebase Auth (real login) | ✅ Mitigated (Phase 1) |
| Firestore read costs | Har page load par reads | Pagination, cached config | ⚠️ Ongoing |
