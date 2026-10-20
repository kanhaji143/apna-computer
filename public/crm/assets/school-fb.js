/* ============================================================
   SCHOOL CRM — Firestore loader (apna-computer-ltd)
   Path: public/crm/assets/school-fb.js

   Data Firestore se load hota hai taaki sabhi devices pe same ho.
   Collections: sc_students, sc_fee_register, sc_fee_transactions,
   sc_employees, sc_transport, sc_previous_dues, sc_expenses,
   sc_config (meta / school / fee_struct / extra)

   Note: Firestore field names me dot allowed nahi, isliye upload ke
   waqt '.' → '_' kiya gaya tha. Yahan '_' → '.' wapas kar rahe hain.
   ============================================================ */

(function () {
    'use strict';

    const firebaseConfig = {
        apiKey: "AIzaSyC_iVUneR8fu_haqWPm5UMc5eu8ATBX1Y",
        authDomain: "apna-computer-ltd.firebaseapp.com",
        projectId: "apna-computer-ltd",
        storageBucket: "apna-computer-ltd.firebasestorage.app",
        messagingSenderId: "235081920000",
        appId: "1:235081920000:web:f7de02bf7680617a33f2e5"
    };

    // store key  ->  firestore collection
    const MAP = {
        students:        'sc_students',
        feeRegister:     'sc_fee_register',
        feeTransactions: 'sc_fee_transactions',
        employees:       'sc_employees',
        transport:       'sc_transport',
        previousDues:    'sc_previous_dues',
        expenses:        'sc_expenses'
    };

    const SFB = { ready: false, error: null, lastSync: 0 };
    let db = null;

    /* '_' → '.' wapas (upload me '.' → '_' kiya tha) */
    function restore(o) {
        if (Array.isArray(o)) return o.map(restore);
        if (o && typeof o === 'object') {
            const out = {};
            Object.keys(o).forEach(k => { out[k.replace(/_/g, '.')] = restore(o[k]); });
            return out;
        }
        return o;
    }

    function init() {
        if (typeof firebase === 'undefined' || !firebase.initializeApp) {
            SFB.error = 'Firebase SDK not loaded';
            console.warn('[SFB]', SFB.error);
            return;
        }
        try {
            if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            SFB.ready = true;
            db.enablePersistence({ synchronizeTabs: true }).catch(function () {});
            console.log('[SFB] ready — project:', firebaseConfig.projectId);
        } catch (e) {
            SFB.error = e.message;
            console.warn('[SFB] init failed:', e.message);
        }
    }

    /* Poora school store (crm-data.json jaisa shape) */
    function loadStore() {
        if (!SFB.ready) return Promise.reject(new Error(SFB.error || 'Firestore not ready'));

        const keys = Object.keys(MAP);
        return Promise.all(keys.map(function (k) {
            return db.collection(MAP[k]).get().then(function (snap) {
                const rows = [];
                snap.forEach(function (d) { rows.push(restore(d.data())); });
                return [k, rows];
            });
        })).then(function (pairs) {
            const store = {};
            pairs.forEach(function (p) { store[p[0]] = p[1]; });
            return Promise.all([
                db.collection('sc_config').doc('meta').get(),
                db.collection('sc_config').doc('school').get()
            ]).then(function (cfg) {
                if (cfg[0].exists) store.meta = restore(cfg[0].data());
                if (cfg[1].exists) store.config = restore(cfg[1].data());
                SFB.lastSync = Date.now();
                return store;
            });
        });
    }

    /* Fee structure (fee-structure.json jaisa shape) */
    function loadStruct() {
        if (!SFB.ready) return Promise.reject(new Error(SFB.error || 'Firestore not ready'));
        return db.collection('sc_config').doc('fee_struct').get().then(function (d) {
            if (!d.exists) throw new Error('fee_struct document missing');
            const v = d.data();
            SFB.lastSync = Date.now();
            return {
                session: v.session || '',
                frequency: restore(v.frequency || {}),
                classes: (v.classes || []).map(function (c) {
                    return { class: c.class, heads: restore(c.heads || []) };
                })
            };
        });
    }

    SFB.init = init;
    SFB.loadStore = loadStore;
    SFB.loadStruct = loadStruct;
    SFB.config = firebaseConfig;
    SFB.MAP = MAP;

    window.SFB = SFB;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
