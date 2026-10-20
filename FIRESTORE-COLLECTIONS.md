# 📦 Apna Computer Ltd — Firestore Collections Reference

**Project ID:** `apna-computer-ltd` · **Live:** https://apna-computer-ltd.web.app
**Document:** Firestore collections aur unka purpose
**Last updated:** 19-10-2026

---

## 1. Overview — Kaun kya use karta hai

| App | Firestore use? | Data kahan hai |
|---|---|---|
| 🌐 Multisoftware Hub (`/`) | ❌ Nahi | Static HTML (koi database nahi) |
| 🏪 Online Center Website + CRM (`/shop/`) | ✅ **Haan** | Firestore (`oc_*` collections, 7) + `hub_leads` |
| 🏫 School CRM (`/crm/`) | ✅ **Haan** | Firestore (`sc_*` collections) + localStorage cache/edits (`crm_store_v2`) |
| 👕 Clothing CRM (`/clothing/`) | ✅ Haan | Firestore (8 collections) + localStorage fallback (`cl_store_v1`) |

> School CRM ka data **19-10-2026** ko JSON se Firestore me transfer kiya gaya.
> Original JSON files ab `data/school/` folder me hain (public web se bahar).

---

## 2. Collections ki List (29 total)

### 👕 Clothing CRM (`cl_`)

| # | Collection | Doc ID Example | Purpose |
|---|---|---|---|
| 1 | `cl_products` | `P001` | Product catalog — garments ka naam, price, stock |
| 2 | `cl_suppliers` | `SUP001` | Suppliers — textile vendors ka record + balance |
| 3 | `cl_purchases` | `PUR001` | Purchase bills (supplier se maal aaya) |
| 4 | `cl_sales` | `SAL001` | Sales bill (customer ko bikri) |
| 5 | `cl_expenses` | `EXP001` | Shop expenses — rent, bijli, packing, transport |
| 6 | `cl_staff` | `STF001` | Employee master — role, salary, join date |
| 7 | `cl_salary` | (khali) | Staff ko salary payments |
| 8 | `cl_config` | `app` (fixed) | Shop settings — single doc `app` |
| 9 | `cl_orders` | — | Marketplace customer orders (doc id: `ORD-{timestamp}`) |
| 10 | `cl_reviews` | — | Product reviews (rating + text + name) |

### 🏫 School CRM (`sc_`)

| # | Collection | Docs | Purpose |
|---|---|---|---|
| 9 | `sc_students` | 426 | Student master — admission, parent, class, route |
| 10 | `sc_fee_register` | 426 | Har student ka fee register (head-wise + months) |
| 11 | `sc_fee_transactions` | 4 | Fee receipts / collections |
| 12 | `sc_employees` | 3 | School staff |
| 13 | `sc_transport` | 15 | Transport routes + route fee |
| 14 | `sc_previous_dues` | 6 | Purane sessions ke dues |
| 15 | `sc_expenses` | 5 | School expenses |
| 16 | `sc_config` | 4 docs | `meta` (school info), `school` (session settings), `fee_struct` (fee structure), `extra` (transfer metadata) |

### 🏫 School ERP — Phase 3 additions (sc_)

| # | Collection | Purpose |
|---|---|---|
| 25 | `sc_attendance` | Daily student attendance (doc id: `{admissionNo}_{date}`) |
| 26 | `sc_exams` | Exam master (name, class, subject, date, maxMarks) |
| 27 | `sc_results` | Per-student marks per exam (doc id: `{examId}_{admissionNo}`) |

### 🏪 Online Center Website + CRM (`oc_`)

| # | Collection | Docs | Purpose |
|---|---|---|---|
| 17 | `oc_customers` | 8 | Customer master — naam, mobile, address, balance |
| 18 | `oc_transactions` | 12 | Har service ki entry — income/expense, mode, status |
| 19 | `oc_expenses` | 6 | Shop expenses — rent, bijli, internet, salary |
| 20 | `oc_service_requests` | 6 | Website se aaye service request (form → admin) |
| 21 | `oc_ticket_enquiries` | 2 | Ticket / travel enquiry (PNR, journey) |
<|constrain|> 22 | `oc_notices` | 3 | Website par dikhne wali notices / updates (optional `imageUrl` — base64 data URL from file browse) |
| 23 | `oc_config` | 1 doc (`app`) | Online Center settings — shop name, phone, WhatsApp, address |

### 🌐 Hub (`/`)

| # | Collection | Docs | Purpose |
|---|---|---|---|
| 24 | `hub_leads` | — | Contact page ka enquiry — sirf **create** public, read/update/delete nahi |

**Naming convention:** `cl_` = **C**lothing CRM, `sc_` = **S**chool **C**RM, `oc_` = **O**nline **C**enter. Doc ID app khud generate karta hai (auto-ID nahi), isliye ID local aur cloud me same rehte hain — sync conflict safe.
**School doc IDs:** Admission No (`sc_students`, `sc_fee_register`), Transaction ID, Employee ID, Route Code, Voucher No, AdmissionNo_Session.
**Online Center doc IDs:** `oc_config/app` fixed; baaki sab `U.uid('MOC'/'TXN'...)` pattern se bante hain.

---

## 2a. School CRM — Collection Details

### 9️⃣ `sc_students` — Student Master (426 docs)
Doc ID = **Admission No** (e.g. `1`, `426`)

Fields (as stored, keys me `.` → `_`):
`Admission No`, `Admission Date`, `Student Name`, `Father Name`, `Mother Name`, `Gender`, `DOB`, `Mobile`, `Alt Mobile`, `Aadhaar No_`, `Student Pen No_`, `Student ID/Sr Mo_`, `Address`, `Class`, `Section`, `Roll No`, `Route`, `Status`, `Remarks`, `Admission Type`

### 🔟 `sc_fee_register` — Fee Register (426 docs)
Doc ID = **Admission No**

Fields: `Admission No`, `Student Name`, `Father Name`, `Class`, `Section`, `Status`, `Route`, `Admission Fee`, `Monthly Fee`, `Quarterly Exam Fee`, `Half-Yearly Exam Fee`, `Annual Exam Fee`, `Transport Fee`, `Computer Fee`, `Library Fee`, `Sports Fee`, `Activity Fee`, `Fine`, `Other`, month columns `Apr`–`Mar`, `Expected Fee`, `Old Due`, `Total Collection`, `Outstanding`, `Fee Status`

### 1️⃣1️⃣ `sc_fee_transactions` — Fee Receipts (4 docs)
Doc ID = **Transaction ID**

Fields: `Receipt No`, `Academic Session`, `Admission No`, `Student Name`, `Class`, `Section`, `Payment Date`, `Fee Month`, `Fee Period`, `Payment Against`, `Previous Due Session`, `Fee Head`, `Standard Fee`, `Amount Received`, `Late Fee`, `Mgmt Disc_`, `Renewal Disc_`, `Net Amount`, `Transaction Status`, `Collected By`, `Payment Mode`, `Reference No_`, `Receipt Batch`, `Remarks`

### 1️⃣2️⃣ `sc_employees` (3 docs) — Doc ID = Employee ID
`Employee ID`, `Employee Name`, `Father Name`, `Mobile No`, `Joining Date`, `Designation`, `Employment Type`, `Department`, `Status`, `Remarks`

### 1️⃣3️⃣ `sc_transport` (15 docs) — Doc ID = Route Code
`Route Code`, `Route Name`, `Transport Fee`, `Status`

### 1️⃣4️⃣ `sc_previous_dues` (6 docs) — Doc ID = Admission No (+ session)
`Admission No`, `Student Name`, `Session`, `Opening Due`, `Current Year Due`, `Received`, `Balance`, `Last Payment Date`, `Remarks`

### 1️⃣5️⃣ `sc_expenses` (5 docs) — Doc ID = Voucher No
`Date`, `Voucher No`, `Expense Category`, `Description`, `Amount`, `Payment Mode`, `Paid To`, `Remarks`

### 1️⃣6️⃣ `sc_config` (4 docs)
| Doc | Content |
|---|---|
| `meta` | school name, address, mobile, software version |
| `school` | Academic Session, fee month settings, session start/end dates, currency |
| `fee_struct` | `session`, `frequency{}` (13 heads), `classes[15]` — har class ke heads (standard/discount/final/frequency) |
| `extra` | `transferredAt` + record counts (verified 885 docs + 4 config) |

> **Note:** Firestore field names me dot (`.`) allowed nahi hota, isliye upload ke waqt `.` → `_` kiya gaya (`Aadhaar No.` → `Aadhaar No_`). Website loader (`public/crm/assets/school-fb.js`) padhte waqt `_` → `.` wapas convert karta hai.

---

## 3. Collection Details + Fields

### 1️⃣ `cl_products` — Product Catalog
Used by: `clothing/products.html`, Reports

| Field | Type | Example |
|---|---|---|
| `id` | string | `P001` |
| `name` | string | Denim Jeans (Slim Fit) |
| `category` | string | Jeans / Shirt / Saree / Kurti / Jacket... |
| `size` | string | `32`, `M`, `Free` |
| `color` | string | Blue |
| `purchase` | number | 450 (khareed daam) |
| `sale` | number | 899 (bikri daam) |
| `stock` | number | 24 |
| `supplier` | string | `SUP001` (→ cl_suppliers) |
| `reorder` | number | 5 (low-stock alert level) |
| `icon` | string | `fa-shirt` (FontAwesome) |

### 2️⃣ `cl_suppliers` — Vendor Records
Used by: `clothing/suppliers.html`

| Field | Type | Example |
|---|---|---|
| `id` | string | `SUP001` |
| `name` | string | Sharma Textiles |
| `phone` | string | 9876543210 |
| `city` | string | Delhi |
| `gst` | string | GST number (khali ho sakta hai) |
| `opening` | number | Opening balance |
| `paid` | number | Ab tak paid amount |
| `status` | string | Active |
| `notes` | string | Jeans & Trouser specialist |

### 3️⃣ `cl_purchases` — Purchase Bills
Used by: `clothing/purchases.html`

| Field | Type | Example |
|---|---|---|
| `id` | string | `PUR001` |
| `date` | string | 2026-09-20 |
| `supplierId` / `supplierName` | string | `SUP001` / Sharma Textiles |
| `invoice` | string | ST-2291 |
| `mode` | string | Cash / UPI / Bank Transfer |
| `total` | number | 36900 |
| `paid` | number | 20000 |
| `balance` | number | 16900 |
| `notes` | string | Baaki next week |
| `createdAt` | number | timestamp (sort ke liye) |
| `items[]` | array | `{productId, name, qty, price, total}` |

### 4️⃣ `cl_sales` — Sales Bills
Used by: `clothing/sales.html`, Reports

| Field | Type | Example |
|---|---|---|
| `id` | string | `SAL001` |
| `date` | string | 2026-10-05 |
| `customer` | string | Walk-in / Rahul Sharma |
| `phone` | string | (khali ho sakta hai) |
| `mode` | string | Cash / UPI / Credit |
| `status` | string | Paid / Due |
| `discount` | number | 100 |
| `staffId` / `staffName` | string | `STF002` / Sunita Devi |
| `notes` | string | Diwali shopping |
| `createdAt` | number | timestamp |
| `items[]` | array | bill items (product, qty, price) |

### 5️⃣ `cl_expenses` — Shop Expenses
Used by: `clothing/expenses.html`

| Field | Type | Example |
|---|---|---|
| `id` | string | `EXP001` |
| `date` | string | 2026-10-01 |
| `category` | string | Rent / Electricity / Packing / Transport |
| `description` | string | Shop rent October |
| `amount` | number | 8000 |
| `mode` | string | Cash / UPI |
| `paidTo` | string | Landlord / UPCL |
| `staff` | string | (optional) |

### 6️⃣ `cl_staff` — Employee Master
Used by: `clothing/staff.html`

| Field | Type | Example |
|---|---|---|
| `id` | string | `STF001` |
| `name` | string | Ramesh Kumar |
| `role` | string | Manager / Salesman / Tailor |
| `phone` | string | 9876500011 |
| `salary` | number | 15000 (monthly) |
| `joinDate` | string | 2024-04-01 |
| `status` | string | Active |
| `address` | string | Amethi |

### 7️⃣ `cl_salary` — Salary Payments *(seed me khali — abhi tak koi salary entry nahi)*
Used by: staff salary module. Sale/purchase/expenses ki tarah date-based records (date + staff + amount + mode). Newest-first sort hota hai.

### 8️⃣ `cl_config` — App Settings (single document)
Doc ID **hamesha `app`**. Used by: `clothing/settings.html`

| Field | Example |
|---|---|
| `shopName` | Apna Clothing Store |
| `owner` | Krishna Kumar |
| `phone` | 9876543210 |
| `address` | Amethi, Uttar Pradesh |
| `currency` | ₹ |
| `lowStockAlert` | 5 |

---

## 4. Firestore Security Rules (current state)

Rules ki current halat (source: `firestore.rules`):

```javascript
// Clothing CRM + School CRM + Online Center — abhi DEMO: public read/write (koi auth nahi)
match /cl_products/{id}  { allow read, write: if true; }
... (saare cl_* collections if true)
match /sc_students/{id}  { allow read, write: if true; }
... (saare sc_* collections if true)
match /oc_customers/{id} { allow read, write: if true; }
... (saare oc_* collections if true)

// Hub enquiry — sirf naya lead bhejna allowed
match /hub_leads/{id} { allow create: if true; allow read, update, delete: if false; }

// default: deny
match /{document=**} { allow read, write: if false; }
```

⚠️ **Zaroori:** sab `cl_*`, `sc_*` aur `oc_*` collections **koi bhi padh/likh sakta hai** — login ke bina (login abhi browser ke localStorage me hai, Firebase Auth nahi). School data me parent mobile numbers hain, isliye **production se pehle Firebase Auth + role-based rules judana zaroori hai** (Phase 0). `hub_leads` safe hai — sirf create, public read nahi.

---

## 5. Sync Kaam Kaise Karta Hai (technical)

### Clothing CRM — `public/clothing/assets/firebase.js`
1. **Local-first:** data pehle localStorage (`cl_store_v1`) me save hota hai, phir Firestore ko push hota hai (`FB.set`).
2. **Real-time listener:** har collection pe `onSnapshot` chalta hai — koi bhi device change kare toh baaki turant update.
3. **Doc ID strategy:** `doc(String(obj.id))` — ID app banata hai (P001, SAL005...) — isse local↔cloud pe same record map hota hai.
4. **Fresh-install me:** Firestore collection khali ho toh local seed data cloud pe upload hota hai.
5. **Time-based collections** (`purchases`, `sales`, `expenses`, `salary`) `date` + `createdAt` se newest-first sort hote hain.
6. **Fallback:** Firebase load na ho toh app 100% localStorage pe chalti hai, sync bad me ho jaata hai.

### School CRM — `public/crm/assets/school-fb.js`
1. Har page load pe 7 `sc_*` collections + `sc_config` se data aa jata hai (ek baar `get()`, realtime listener nahi).
2. Pehle localStorage (`crm_store_v2`) check hota hai — agar user ne edits kiye hain to wahi dikhte hain, warna Firestore fresh data.
3. Edits/add/delete **sirf localStorage me** save hote hain (Firestore me write-back abhi nahi hota).
4. `fee_struct` config se session, 13 fee heads aur 15 classes load hoti hain.
5. Field names `_` → `.` restore hote hain (dot sanitization ka reverse).

### Online Center Website + CRM — `public/shop/assets/shop.js`
1. Public website (`/shop/index.html`) se service request, ticket enquiry aur tool — sab seedha Firestore me (`S.add`).
2. Admin CRM (`/shop/admin/`) har page pe `onSnapshot` realtime listener lagata hai — data badalte hi table update.
3. Login demo hai: koi bhi email/password chalta hai; user `localStorage.oc_user` me (email + role Admin/Cashier) save hota hai.
4. Saare inserts app-generated doc IDs (`U.uid('TXN')` etc.) use karte hain — local aur cloud same.
5. Data seed script: `node tools/seed-online-center.mjs` (idempotent, deterministic IDs).
6. Firestore load fail ho toh page khaali state dikhata hai (Clothing/School jaisa localStorage fallback abhi nahi).

---

## 6. Data Folder Structure (JSON originals)

```
apna-computer-ltd/
├── data/                        # ← web par deploy NAHI hota (private)
│   └── school/
│       ├── crm-data.json        # 426 students + fees + employees + transport...
│       └── fee-structure.json   # 15 classes x 13 fee heads
├── tools/
│   ├── upload-school-data.mjs   # JSON → Firestore transfer script (REST API)
│   └── seed-online-center.mjs   # oc_* demo data seeder (deterministic IDs)
└── public/
    ├── shop/                    # Online Center website + CRM
    │   ├── index.html           # public website (tools, services, forms)
    │   ├── login.html           # demo staff login
    │   ├── assets/shop.js       # Firestore data layer + admin shell
    │   └── admin/               # 14 CRM pages (dashboard, customers, ...)
    ├── crm/assets/school-fb.js  # Firestore loader (sc_* collections)
    └── crm/assets/crm.js        # CRM app logic
```

**Transfer dobara chalane ke liye:** `node tools/upload-school-data.mjs` (idempotent — same doc IDs pe overwrite karta hai).

---

*Owner: kanhadigimkt · kanhadigimkt@gmail.com*
