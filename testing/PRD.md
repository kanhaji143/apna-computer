# PRD — Apna Computer Multisoftware Hub (Home Page)

**Source:** Whiteboard flow — `Home page → Requirement → Test Cases → Finish → Evidence`
**Scope:** `public/index.html` (Hub landing page) served at `http://localhost:8000/`

## 1. Purpose
Ek hi landing page par saare business software modules dikhana (school, shop, coaching,
security, real estate…) — har module ka demo link, status badge aur contact CTA ke saath.

## 2. Functional Requirements (FR)

| ID | Requirement |
|----|-------------|
| FR-1 | Page `/` par HTTP 200 ke saath load ho, title mein "Apna" ho |
| FR-2 | Hero section dikhe: tagline "One Platform" + CTAs "Explore Solutions" aur "Talk to Us" |
| FR-3 | "Our Products" grid mein kam se kam 6 module cards hon (icon + title + description) |
| FR-4 | Har module card par status badge ho — "Live" (≥3) aur "Coming soon" (≥1) dono types dikhen |
| FR-5 | Clothing Marketplace card mein kaam karta hua link `/clothing/store/` ho |
| FR-6 | Mobile viewport (390px) par page bina horizontal overflow ke render ho |
| FR-7 | Page par koi JavaScript runtime error (uncaught pageerror) na ho |

## 3. Non-functional Requirements (NFR)

| ID | Requirement |
|----|-------------|
| NFR-1 | Static assets (CSS/JS/images) localhost se < 5s mein load hon |
| NFR-2 | Page mobile-first hai (Bootstrap grid), koi fixed-width layout nahi |
| NFR-3 | Test evidence (screenshots) har test case ke liye `testing/evidence/` mein save ho |

## 4. Deliverables (whiteboard box)

```
PRD.md (ye file)  +  TestCases.md  →  Evidence (screenshots + RESULTS.md)
```

## 5. Out of scope
Firestore data correctness, Firebase deploy process, CRM internal pages (alag PRD).
