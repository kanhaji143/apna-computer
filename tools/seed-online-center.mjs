/* ============================================================
   APNA ONLINE CENTER — demo data seed (zero-dependency)
   Collections: oc_* (project apna-computer-ltd)
   Run: node tools/seed-online-center.mjs
   ============================================================ */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT = 'apna-computer-ltd';
const API_KEY = 'AIzaSyC_iVUneR8fu_haqWPm5UMc5eu8ATBX1Y';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const COMMIT_URL = `${BASE}:commit?key=${API_KEY}`;

const fx = k => k.replace(/\./g, '_');

function toValue(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(toValue) } };
    if (typeof v === 'object') return { mapValue: { fields: toFields(v) } };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    if (typeof v === 'boolean') return { booleanValue: v };
    return { stringValue: String(v) };
}
function toFields(obj) {
    const f = {};
    Object.keys(obj).forEach(k => { if (obj[k] !== undefined) f[fx(k)] = toValue(obj[k]); });
    return f;
}
async function commit(writes) {
    const res = await fetch(COMMIT_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ writes })
    });
    if (!res.ok) throw new Error('commit ' + res.status + ': ' + (await res.text()).slice(0, 400));
    return res.json();
}

const now = Date.now();
const iso = d => new Date(d).toISOString();

const customers = [
    { id: 'CUST001', name: 'Rahul Sharma',  mobile: '9876500001', address: 'Main Market', notes: 'Regular customer', createdAt: iso(now - 86400000 * 30) },
    { id: 'CUST002', name: 'Priya Verma',   mobile: '9876500002', address: 'Civil Lines',  notes: '', createdAt: iso(now - 86400000 * 26) },
    { id: 'CUST003', name: 'Amit Kumar',    mobile: '9876500003', address: 'Station Road', notes: 'PAN card work', createdAt: iso(now - 86400000 * 22) },
    { id: 'CUST004', name: 'Neha Singh',    mobile: '9876500004', address: 'Gandhi Nagar', notes: '', createdAt: iso(now - 86400000 * 18) },
    { id: 'CUST005', name: 'Vikas Yadav',   mobile: '9876500005', address: 'Bus Stand',    notes: 'Ticket booking', createdAt: iso(now - 86400000 * 14) },
    { id: 'CUST006', name: 'Pooja Gupta',   mobile: '9876500006', address: 'College Road', notes: '', createdAt: iso(now - 86400000 * 10) },
    { id: 'CUST007', name: 'Suresh Patel',  mobile: '9876500007', address: 'Purani Bazar', notes: 'Bill payments', createdAt: iso(now - 86400000 * 7) },
    { id: 'CUST008', name: 'Anjali Mishra', mobile: '9876500008', address: 'Ram Nagar',    notes: '', createdAt: iso(now - 86400000 * 3) }
];

const transactions = [
    { id: 'TXN001', transactionId: 'TXN-261014-A10001', receiptNumber: 'RCP-100001', customerName: 'Rahul Sharma',  mobile: '9876500001', service: 'Aadhaar Services',  totalAmount: 100, amountReceived: 100, paymentMethod: 'cash', paymentStatus: 'paid',    transactionDate: '2026-10-14', notes: '' },
    { id: 'TXN002', transactionId: 'TXN-261014-A10002', receiptNumber: 'RCP-100002', customerName: 'Priya Verma',   mobile: '9876500002', service: 'Photo Print',       totalAmount: 60,  amountReceived: 60,  paymentMethod: 'upi',  paymentStatus: 'paid',    transactionDate: '2026-10-14', notes: '' },
    { id: 'TXN003', transactionId: 'TXN-261015-A10003', receiptNumber: 'RCP-100003', customerName: 'Amit Kumar',    mobile: '9876500003', service: 'PAN Card',          totalAmount: 250, amountReceived: 150, paymentMethod: 'upi',  paymentStatus: 'partial', transactionDate: '2026-10-15', notes: 'Baaki 100 baad me' },
    { id: 'TXN004', transactionId: 'TXN-261015-A10004', receiptNumber: 'RCP-100004', customerName: 'Neha Singh',    mobile: '9876500004', service: 'Money Transfer',    totalAmount: 500, amountReceived: 500, paymentMethod: 'cash', paymentStatus: 'paid',    transactionDate: '2026-10-15', notes: '' },
    { id: 'TXN005', transactionId: 'TXN-261016-A10005', receiptNumber: 'RCP-100005', customerName: 'Vikas Yadav',   mobile: '9876500005', service: 'Ticket Booking',    totalAmount: 1200, amountReceived: 0,  paymentMethod: 'upi',  paymentStatus: 'pending', transactionDate: '2026-10-16', notes: 'Payment pending' },
    { id: 'TXN006', transactionId: 'TXN-261016-A10006', receiptNumber: 'RCP-100006', customerName: 'Pooja Gupta',   mobile: '9876500006', service: 'Online Form',       totalAmount: 80,  amountReceived: 80,  paymentMethod: 'cash', paymentStatus: 'paid',    transactionDate: '2026-10-16', notes: '' },
    { id: 'TXN007', transactionId: 'TXN-261017-A10007', receiptNumber: 'RCP-100007', customerName: 'Suresh Patel',  mobile: '9876500007', service: 'Bill Payment',      totalAmount: 450, amountReceived: 450, paymentMethod: 'upi',  paymentStatus: 'paid',    transactionDate: '2026-10-17', notes: '' },
    { id: 'TXN008', transactionId: 'TXN-261017-A10008', receiptNumber: 'RCP-100008', customerName: 'Anjali Mishra', mobile: '9876500008', service: 'Lamination',        totalAmount: 40,  amountReceived: 40,  paymentMethod: 'cash', paymentStatus: 'paid',    transactionDate: '2026-10-17', notes: '' },
    { id: 'TXN009', transactionId: 'TXN-261018-A10009', receiptNumber: 'RCP-100009', customerName: 'Rahul Sharma',  mobile: '9876500001', service: 'Voter ID',          totalAmount: 150, amountReceived: 0,  paymentMethod: 'cash', paymentStatus: 'pending', transactionDate: '2026-10-18', notes: '' },
    { id: 'TXN010', transactionId: 'TXN-261018-A10010', receiptNumber: 'RCP-100010', customerName: 'Priya Verma',   mobile: '9876500002', service: 'Photo Print',       totalAmount: 120, amountReceived: 120, paymentMethod: 'upi',  paymentStatus: 'paid',    transactionDate: '2026-10-18', notes: '' },
    { id: 'TXN011', transactionId: 'TXN-261019-A10011', receiptNumber: 'RCP-100011', customerName: 'Amit Kumar',    mobile: '9876500003', service: 'PAN Card',          totalAmount: 100, amountReceived: 100, paymentMethod: 'cash', paymentStatus: 'paid',    transactionDate: '2026-10-19', notes: 'Balance cleared' },
    { id: 'TXN012', transactionId: 'TXN-261019-A10012', receiptNumber: 'RCP-100012', customerName: 'Neha Singh',    mobile: '9876500004', service: 'Aadhaar Services',  totalAmount: 100, amountReceived: 100, paymentMethod: 'upi',  paymentStatus: 'paid',    transactionDate: '2026-10-19', notes: '' }
];

const expenses = [
    { id: 'EXP001', title: 'Shop Rent',       category: 'rent',        amount: 5000, expenseDate: '2026-10-01', paymentMethod: 'cash', notes: 'October rent' },
    { id: 'EXP002', title: 'Electricity Bill', category: 'electricity', amount: 1200, expenseDate: '2026-10-03', paymentMethod: 'upi',  notes: '' },
    { id: 'EXP003', title: 'Internet Recharge', category: 'internet',   amount: 700,  expenseDate: '2026-10-05', paymentMethod: 'upi',  notes: '' },
    { id: 'EXP004', title: 'Stationery',       category: 'stationery', amount: 350,  expenseDate: '2026-10-08', paymentMethod: 'cash', notes: 'Paper, ink' },
    { id: 'EXP005', title: 'Printing Paper',   category: 'stationery', amount: 800,  expenseDate: '2026-10-12', paymentMethod: 'cash', notes: '' },
    { id: 'EXP006', title: 'Local Travel',     category: 'travel',     amount: 200,  expenseDate: '2026-10-15', paymentMethod: 'cash', notes: '' }
];

const serviceRequests = [
    { id: 'SR001', requestId: 'MOC-261012-A1B2C3', customerName: 'Rahul Sharma',  mobile: '9876500001', serviceName: 'Aadhaar Services',  message: 'Address update karna hai', status: 'new',        adminNotes: '', createdAt: iso(now - 86400000 * 7) },
    { id: 'SR002', requestId: 'MOC-261013-D4E5F6', customerName: 'Priya Verma',   mobile: '9876500002', serviceName: 'Money Transfer',    message: 'Bank transfer karna hai', status: 'in_progress', adminNotes: 'Details li ja rahi hain', createdAt: iso(now - 86400000 * 6) },
    { id: 'SR003', requestId: 'MOC-261014-G7H8I9', customerName: 'Amit Kumar',    mobile: '9876500003', serviceName: 'PAN Card',          message: 'New PAN apply', status: 'completed', adminNotes: '', createdAt: iso(now - 86400000 * 5) },
    { id: 'SR004', requestId: 'MOC-261015-J1K2L3', customerName: 'Neha Singh',    mobile: '9876500004', serviceName: 'Online Form',       message: 'Scholarship form', status: 'pending_documents', adminNotes: 'Aadhaar copy pending', createdAt: iso(now - 86400000 * 4) },
    { id: 'SR005', requestId: 'MOC-261016-M4N5O6', customerName: 'Vikas Yadav',   mobile: '9876500005', serviceName: 'Ticket Booking',    message: 'Delhi ticket 25 Oct', status: 'in_progress', adminNotes: '', createdAt: iso(now - 86400000 * 3) },
    { id: 'SR006', requestId: 'MOC-261018-P7Q8R9', customerName: 'Anjali Mishra', mobile: '9876500008', serviceName: 'Other',             message: 'General enquiry', status: 'rejected', adminNotes: 'Service available nahi', createdAt: iso(now - 86400000 * 1) }
];

const enquiries = [
    { id: 'TE001', enquiryId: 'TKE-261015-S1T2U3', customerName: 'Vikas Yadav',  mobile: '9876500005', journeyFrom: 'Amethi', journeyTo: 'Delhi', journeyDate: '2026-10-25', passengers: 2, status: 'in_progress', message: 'Sleeper bus', createdAt: iso(now - 86400000 * 4) },
    { id: 'TE002', enquiryId: 'TKE-261018-V4W5X6', customerName: 'Pooja Gupta',  mobile: '9876500006', journeyFrom: 'Lucknow', journeyTo: 'Mumbai', journeyDate: '2026-11-02', passengers: 1, status: 'new', message: 'Flight options', createdAt: iso(now - 86400000 * 1) }
];

const notices = [
    { id: 'NOT001', title: '🎉 Welcome to Apna Online Center', body: 'Aadhaar, PAN, forms, ticket booking aur 15+ digital services — sab ab ek hi jagah. Aaiye, apna kaam karwayein!', isActive: true, createdAt: iso(now - 86400000 * 10) },
    { id: 'NOT002', title: '📋 Aadhaar Update Camp', body: 'Is hafte Aadhaar address update par special discount — sirf ₹30 me. Jaldi aaiye, offer limited time ke liye!', isActive: true, createdAt: iso(now - 86400000 * 3) },
    { id: 'NOT003', title: '🪔 Festival Timings', body: 'Diwali ke dino me shop 10 AM se 6 PM tak khuli rahegi. Sabhi ko Shubh Diwali! 🎆', isActive: true, createdAt: iso(now - 86400000 * 1) }
];

const config = {
    shopName: 'Apna Online Center',
    owner: 'Apna Computer',
    phone: '+91 85049 85149',
    address: 'Amethi, Uttar Pradesh',
    hours: 'Mon – Sat · 9:00 AM – 7:00 PM',
    currency: '₹'
};

async function push(coll, rows) {
    const writes = rows.map(r => ({
        update: {
            name: `projects/${PROJECT}/databases/(default)/documents/${coll}/${r.id}`,
            fields: toFields(r)
        }
    }));
    for (let i = 0; i < writes.length; i += 400) await commit(writes.slice(i, i + 400));
    console.log('  ' + coll + ': ' + rows.length + ' docs');
}

async function main() {
    console.log('Seeding Apna Online Center → ' + PROJECT);
    await push('oc_customers', customers);
    await push('oc_transactions', transactions);
    await push('oc_expenses', expenses);
    await push('oc_service_requests', serviceRequests);
    await push('oc_ticket_enquiries', enquiries);
    await push('oc_notices', notices);
    await commit([{ update: {
        name: `projects/${PROJECT}/databases/(default)/documents/oc_config/app`,
        fields: toFields(config)
    } }]);
    console.log('  oc_config/app: 1 doc');
    console.log('DONE');
}

main().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
