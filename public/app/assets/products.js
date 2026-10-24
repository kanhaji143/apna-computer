/* ============================================================
   APNA COMPUTER — MOBILE APP CATALOGUE DATA
   Source of truth: README.md, index.html (live), hub.js NAV,
   FIRESTORE-COLLECTIONS.md. Every entry below verified in the
   Phase 1 audit. No invented products, features or prices.
   Statuses: "live" | "live-demo" | "soon"
   ============================================================ */

var PRODUCTS = [
  {
    id: 'hub',
    name: 'Multisoftware Hub',
    category: 'platform',
    status: 'live',
    icon: 'layers',
    tagline: 'Main platform — saare products, demos aur services ek jagah.',
    description: 'Unified product hub for Apna Computer: 9 business software solutions between website and CRM/ERP, mobile-first, with light/dark theme and enquiry integration.',
    features: [
      '9 business solutions on one platform',
      'Products, demos and services in one place',
      'Light / dark theme support',
      'Enquiry form wired to secure backend (create-only)'
    ],
    links: [
      { label: 'Open Full Hub', url: '/', primary: true }
    ],
    pricing: 'Free platform — module pricing on request'
  },
  {
    id: 'website-service',
    name: 'Website-Making Service',
    category: 'website',
    status: 'live',
    icon: 'code',
    tagline: 'Professional website kisi bhi shop ya business ke liye.',
    description: 'Website design service for shops and businesses — design, hosting aur maintenance include. Delivery timelines: Starter 3–7 din, Business 2–4 hafte, Custom quote ke saath.',
    features: [
      'Design + hosting + maintenance packages',
      'Starter, Business and Custom plans (quote on request)',
      'Delivery: 3–7 days (Starter) to 2–4 weeks (Business)',
      'Free consultation included'
    ],
    links: [
      { label: 'View Service Page', url: '/services.html', primary: true }
    ],
    pricing: 'Quote on request — no fixed price published'
  },
  {
    id: 'online-center',
    name: 'Online Center + CRM',
    category: 'retail',
    status: 'live-demo',
    icon: 'store',
    tagline: 'Digital service shop ke liye website + billing CRM.',
    description: 'Digital service shop solution — public website plus 14-page admin CRM: customers, transactions, expenses, notices, ticket enquiries, reports. Real-time Firestore sync with seeded demo data. Login demo chalata hai: koi bhi email/password kaafi hai.',
    features: [
      'Public website with service request + ticket enquiry forms (secure backend)',
      'Admin CRM: customers, transactions, expenses, service requests, notices',
      'Real-time Firestore listeners across devices',
      'Reports: monthly summary, pending payments, history'
    ],
    demoNote: 'Demo login: any email and password works (demo posture).',
    links: [
      { label: 'Open Demo (Website)', url: '/shop/', primary: true },
      { label: 'Admin CRM Demo', url: '/shop/admin/' },
      { label: 'Public Site', url: '/shop/index.html' }
    ],
    pricing: 'Setup + subscription — quote on request'
  },
  {
    id: 'school-erp',
    name: 'School ERP + CRM',
    category: 'education',
    status: 'live-demo',
    icon: 'school',
    tagline: 'Students, fees, dues, transport aur reports.',
    description: 'School management CRM: 460+ student records, collect fee with receipts, fee structure per class, dues list with WhatsApp alerts, ledger, reports, employees, expenses, transport. Owner/Admin aur Cashier roles. Firestore-backed (sc_* collections).',
    features: [
      'Students: 426 records with class, section, transport details',
      'Collect Fee / fee structure / dues / ledger / reports',
      'Attendance, exams & results modules',
      'Employees, expenses, transport, transactions'
    ],
    demoNote: 'Demo login panel: sign-in screen accepts demo credentials.',
    links: [
      { label: 'Open Demo', url: '/crm/', primary: true }
    ],
    pricing: 'Setup + subscription — quote on request'
  },
  {
    id: 'apnivo-fashion',
    name: 'Apnivo Fashion (Store + Seller CRM)',
    category: 'marketplace',
    status: 'live-demo',
    icon: 'shirt',
    tagline: 'Amazon-style store — Customer, Seller aur Admin logins.',
    description: 'Marketplace for garments: customer-facing store plus Apnivo Business seller panel. Products, orders, reviews, payouts flows backed by Firestore (cl_* collections) with localStorage offline fallback.',
    features: [
      'Customer store: browse, cart, orders, reviews',
      'Apnivo Business seller panel',
      'Product catalog: clothing categories, stock, pricing',
      'Local-first sync + real-time cloud listeners'
    ],
    links: [
      { label: 'Open Store Demo', url: '/clothing/store/', primary: true },
      { label: 'Apnivo Business Panel', url: '/clothing/panel/' }
    ],
    pricing: 'Seller plans — quote on request'
  },
  {
    id: 'blog',
    name: 'Blog (Tutorials)',
    category: 'content',
    status: 'live',
    icon: 'pen',
    tagline: 'Tutorials aur updates — secure Firebase Auth rule enforcement.',
    description: 'Content section with 22 pages: articles, categories, tags, search, legal pages. Public posts are protected by Firestore rules (published-only view counter, admin-only writes).',
    features: [
      'List, post, category and tag pages',
      'Search page',
      'Privacy policy, terms, disclaimer pages',
      'Public view counter (write-protected in rules)'
    ],
    links: [
      { label: 'Open Blog', url: '/blog/', primary: true }
    ],
    pricing: 'Free to read'
  },
  {
    id: 'courses-lms',
    name: 'Online Courses (LMS)',
    category: 'education',
    status: 'soon',
    icon: 'grad',
    tagline: 'Apne courses bechne ke liye platform.',
    description: 'Learning platform — lessons, quizzes, certificates aur payments. Development phase; not yet available. Enquiry only.',
    features: [],
    links: [],
    pricing: null
  },
  {
    id: 'coaching-erp',
    name: 'Coaching ERP',
    category: 'business',
    status: 'soon',
    icon: 'chalk',
    tagline: 'Admission, batches, tests aur payroll.',
    description: 'Coaching center ERP — admission, batches, attendance, fees, tests aur payroll with role-based logins. Hub marks this Coming soon; enquiry only.',
    features: [],
    links: [],
    pricing: null
  },
  {
    id: 'security-erp',
    name: 'Security Agency ERP',
    category: 'business',
    status: 'soon',
    icon: 'shield',
    tagline: 'Guards, verification aur payroll for security agencies.',
    description: 'Guard registration, documents, police verification, duty roster, attendance aur payroll. Coming soon; enquiry only.',
    features: [],
    links: [],
    pricing: null
  },
  {
    id: 'real-estate',
    name: 'Real Estate Portal',
    category: 'business',
    status: 'soon',
    icon: 'building',
    tagline: 'Buy, sell aur rent listings portal.',
    description: 'Property portal — Buyer, Owner, Agent aur Admin panels. Coming soon; enquiry only.',
    features: [],
    links: [],
    pricing: null
  }
];

var CATEGORIES = [
  { id: 'all',    label: 'All' },
  { id: 'live',   label: 'Live Demos' },
  { id: 'platform', label: 'Platform' },
  { id: 'website',  label: 'Website' },
  { id: 'education', label: 'Education' },
  { id: 'retail',   label: 'Retail' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'business', label: 'Business ERP' },
  { id: 'content',  label: 'Content' }
];

var STATUS_META = {
  'live':      { label: 'Live',        cls: 'live' },
  'live-demo': { label: 'Live Demo',   cls: 'demo' },
  'soon':      { label: 'Coming Soon', cls: 'soon' }
};
