/* ============================================================
   CLOTHING CRM — Firebase (Firestore sync)
   Path: public/clothing/assets/firebase.js
   Sab devices pe sync. Firebase na ho to localStorage chalta hai.
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

    // local key  ->  firestore collection
    const MAP = {
        products:  'cl_products',
        suppliers: 'cl_suppliers',
        purchases: 'cl_purchases',
        sales:     'cl_sales',
        expenses:  'cl_expenses',
        staff:     'cl_staff',
        salary:    'cl_salary'
    };

    const FB = { ready: false, error: null, onChange: null, lastSync: 0 };
    let db = null;

    function init() {
        if (typeof firebase === 'undefined' || !firebase.initializeApp) {
            FB.error = 'Firebase SDK not loaded';
            console.warn('[FB]', FB.error);
            return;
        }
        try {
            if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            FB.ready = true;
            db.enablePersistence({ synchronizeTabs: true }).catch(function () {});
            console.log('[FB] ready — project:', firebaseConfig.projectId);
        } catch (e) {
            FB.error = e.message;
            console.warn('[FB] init failed:', e.message);
        }
    }

    function clean(o) {
        const out = {};
        Object.keys(o).forEach(function (k) { if (o[k] !== undefined) out[k] = o[k]; });
        return out;
    }

    function set(coll, obj) {
        if (!FB.ready || !obj || !obj.id) return;
        db.collection(coll).doc(String(obj.id)).set(clean(obj)).catch(function (e) {
            console.warn('[FB] set failed', coll, obj.id, e.message);
        });
    }

    function del(coll, id) {
        if (!FB.ready) return;
        db.collection(coll).doc(String(id)).delete().catch(function () {});
    }

    function start() {
        if (!FB.ready) return;
        const store = CL.load();

        Object.keys(MAP).forEach(function (key) {
            const coll = MAP[key];
            db.collection(coll).onSnapshot(function (snap) {
                if (snap.empty) {
                    // pehli baar: local data push karo
                    (store[key] || []).forEach(function (row) { set(coll, row); });
                    return;
                }
                const rows = [];
                snap.forEach(function (d) { rows.push(d.data()); });
                // newest first (time-based collections)
                if (['purchases', 'sales', 'expenses', 'salary'].indexOf(key) > -1) {
                    rows.sort(function (a, b) {
                        const da = a.date || '', db2 = b.date || '';
                        if (da !== db2) return db2.localeCompare(da);
                        return (b.createdAt || 0) - (a.createdAt || 0);
                    });
                }
                store[key] = rows;
                CL.saveLocalOnly();
                FB.lastSync = Date.now();
                if (typeof FB.onChange === 'function') FB.onChange(key, rows);
            }, function (err) {
                console.warn('[FB] listen failed', coll, err.message);
            });
        });

        // config
        db.collection('cl_config').doc('app').onSnapshot(function (d) {
            if (d.exists) {
                const c = d.data();
                Object.keys(c).forEach(function (k) { if (k !== 'id') store.config[k] = c[k]; });
                CL.saveLocalOnly();
                if (typeof FB.onChange === 'function') FB.onChange('config', store.config);
            } else {
                set('cl_config', Object.assign({ id: 'app' }, store.config));
            }
        }, function () {});
    }

    FB.init = init;
    FB.start = start;
    FB.set = set;
    FB.del = del;
    FB.config = firebaseConfig;
    FB.MAP = MAP;

    window.FB = FB;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { init(); if (FB.ready) start(); });
    } else {
        init();
        if (FB.ready) start();
    }
})();
