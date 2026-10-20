# 🏫 Apna Computer — School CRM + Clothing CRM + Education Marketplace

**Live site:** https://apna-computer-ltd.web.app

One Firebase project hosting three things:

| App | URL Path | What it does |
|---|---|---|
| 🌐 Apna Multisoftware Hub | `/` | Education marketplace landing page (courses, categories, products) |
| 🏫 Apna School CRM | `/crm/` | Complete school management — students, fees, dues, reports |
| 👕 Apna Clothing CRM | `/clothing/` | Garment shop management — sales, purchases, stock, staff |

---

## 🏫 School CRM features

- **Students** — 426 student records with class, section, transport, admission details
- **Collect Fee** — fee collection with receipts, edit & delete support
- **Fee Structure** — per-class fee heads & amounts (`fee-structure.json`)
- **Dues** — defaulters list with WhatsApp due alerts
- **Ledger** — month-wise student payment ledger
- **Reports** — Fee Head-wise Collection, daily/monthly summaries
- **Employees, Expenses, Transport, Transactions** — full back-office
- **Login-protected** — every CRM page requires sign-in

## 👕 Clothing CRM features

- Sales, Purchases, Products, Suppliers, Staff, Expenses, Reports, Settings

## 🛠 Tech stack

- **Frontend:** Vanilla HTML / CSS / JavaScript (no build step, no framework)
- **Backend:** Firebase (Hosting + Firestore)
- **Data:** `crm-data.json` (students & transactions), `fee-structure.json` (class-wise fees)

## 📁 Project structure

```
public/
├── index.html          # ✅ NEW Hub (products, samples, CTA)
├── services.html       # ✅ Website-making service
├── pricing.html        # ✅ Plans + module-wise quote
├── about.html          # ✅ Company
├── contact.html        # ✅ Enquiry form → Firestore hub_leads
├── assets/
│   ├── css/hub.css     # shared design system
│   └── js/hub.js       # shared header/footer/menu
├── crm/                # School CRM (12 pages + assets)
└── clothing/           # Clothing CRM (9 pages + assets)

data/                   # JSON originals (web par deploy nahi hote — private)
└── school/
    ├── crm-data.json
    └── fee-structure.json

tools/
└── upload-school-data.mjs   # JSON → Firestore transfer (REST API, zero-dep)

archive/
└── index-v1-marketplace.html  # purana landing page (backup)
```

> School CRM data ab **Firestore** (`sc_*` collections) me hai — 885 docs + 4 config docs.
> Details: `FIRESTORE-COLLECTIONS.md` · Master plan: `..\apna-blueprint\COMPLETE-BLUEPRINT.md`

## 🚀 Deploy

```bash
firebase login
firebase deploy --only hosting
```

## 🔒 Privacy note

Student data (`crm-data.json`) is kept in this **private** repository on purpose —
it contains real parent contact numbers and must never be made public.

---

*Owner: kanhadigimkt · kanhadigimkt@gmail.com*
