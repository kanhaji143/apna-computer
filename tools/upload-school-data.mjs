/* ============================================================
   SCHOOL DATA — JSON → Firestore transfer (zero-dependency)
   REST API + API key (rules: sc_* allow read/write)
   Run: node tools/upload-school-data.mjs
   ============================================================ */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const PROJECT = 'apna-computer-ltd';
const API_KEY = 'AIzaSyC_iVUneR8fu_haqWPm5UMc5eu8ATBX1Y';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const COMMIT_URL = `${BASE}:commit?key=${API_KEY}`;

const fx = k => k.replace(/\./g, '_'); // Firestore field names me dot → nested map, isliye sanitize
const readJSON = f => JSON.parse(readFileSync(resolve(ROOT, 'data/school', f), 'utf8'));

const rowId = (row, i, keys) => {
    for (const k of keys) {
        if (row[k] !== undefined && String(row[k]).trim() !== '') {
            return String(row[k]).trim().replace(/\//g, '_'); // doc ID me slash nahi chalta
        }
    }
    return 'ROW' + String(i + 1).padStart(4, '0');
};

// JS value → Firestore REST Value
function toValue(v, stringify) {
    if (v === null || v === undefined) return { nullValue: null };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(x => toValue(x, stringify)) } };
    if (typeof v === 'object') return { mapValue: { fields: toFields(v, stringify) } };
    if (typeof v === 'number') {
        return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    }
    return { stringValue: String(v) }; // string/boolean bhi string me (JSON me sab string tha)
}

function toFields(obj, stringify) {
    const fields = {};
    Object.keys(obj).forEach(k => {
        if (obj[k] === undefined) return;
        fields[fx(k)] = toValue(obj[k], stringify);
    });
    return fields;
}

async function commit(writes) {
    const res = await fetch(COMMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ writes })
    });
    if (!res.ok) {
        const t = await res.text();
        throw new Error('commit failed ' + res.status + ': ' + t.slice(0, 500));
    }
    return res.json();
}

async function pushCollection(coll, rows, idKeys, stringify = true) {
    if (!rows || !rows.length) { console.log('  ' + coll + ': khali, skip'); return; }
    let writes = [], pushed = 0;
    for (let i = 0; i < rows.length; i++) {
        const id = rowId(rows[i], i, idKeys);
        writes.push({
            update: {
                name: `projects/${PROJECT}/databases/(default)/documents/${coll}/${encodeURIComponent(id)}`,
                fields: toFields(rows[i], stringify)
            }
        });
        if (writes.length === 400) { await commit(writes); pushed += writes.length; writes = []; }
    }
    if (writes.length) { await commit(writes); pushed += writes.length; }
    console.log('  ' + coll + ': ' + pushed + ' docs ✓');
}

async function main() {
    const store = readJSON('crm-data.json');
    const feestruct = readJSON('fee-structure.json');

    console.log('Transfer start → ' + PROJECT);
    await pushCollection('sc_students', store.students, ['Admission No', 'Student ID/Sr Mo.']);
    await pushCollection('sc_fee_register', store.feeRegister, ['Admission No']);
    await pushCollection('sc_fee_transactions', store.feeTransactions, ['Transaction ID']);
    await pushCollection('sc_employees', store.employees, ['Employee ID']);
    await pushCollection('sc_transport', store.transport, ['Route Code']);
    await pushCollection('sc_previous_dues', store.previousDues, ['Admission No', 'Session']);
    await pushCollection('sc_expenses', store.expenses, ['Voucher No']);

    // config docs
    await commit([
        { update: { name: `projects/${PROJECT}/databases/(default)/documents/sc_config/meta`, fields: toFields(store.meta, true) } },
        { update: { name: `projects/${PROJECT}/databases/(default)/documents/sc_config/school`, fields: toFields(store.config, true) } },
        {
            update: {
                name: `projects/${PROJECT}/databases/(default)/documents/sc_config/fee_struct`,
                fields: toFields({
                    session: feestruct.session,
                    frequency: feestruct.frequency,
                    classes: feestruct.classes.map(c => ({ class: c.class, heads: c.heads }))
                }, false)
            }
        },
        {
            update: {
                name: `projects/${PROJECT}/databases/(default)/documents/sc_config/extra`,
                fields: toFields({
                    transferredAt: new Date().toISOString(),
                    counts: {
                        students: store.students.length,
                        feeRegister: store.feeRegister.length,
                        employees: store.employees.length,
                        transport: store.transport.length,
                        previousDues: store.previousDues.length,
                        expenses: store.expenses.length,
                        feeTransactions: store.feeTransactions.length
                    }
                }, true)
            }
        }
    ]);
    console.log('  sc_config: 4 docs ✓');

    console.log('\nDONE — pura school data Firestore me transfer ho gaya.');
}

main().catch(e => { console.error('FAIL:', e.message || e); process.exit(1); });
