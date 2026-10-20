/* ============================================================
   COACHING ERP — Firebase (Firestore sync)
   Path: public/coaching/panel/assets/firebase.js
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
        students:   'ch_students',
        batches:    'ch_batches',
        courses:    'ch_courses',
        subjects:   'ch_subjects',
        teachers:   'ch_teachers',
        timetable:  'ch_timetable',
        attendance: 'ch_attendance',
        invoices:   'ch_invoices',
        payments:   'ch_payments',
        staff:      'ch_staff',
        salary:     'ch_payroll',
        expenses:   'ch_expenses',
        tests:      'ch_tests',
        results:    'ch_results',
        config:     'ch_config'
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
        db.collection(coll).doc(String(id)).delete().catch(function (e) {
            console.warn('[FB] delete failed', coll, id, e.message);
        });
    }

    function docFromDb(coll, d) {
        const out = d.data(); out.id = d.id;
        return out;
    }

    function pullAll(coll, key, cb) {
        if (!FB.ready || !MAP[key]) { if (cb) cb(null); return; }
        db.collection(MAP[key]).get().then(function (snap) {
            const arr = snap.docs.map(function (d) { return docFromDb(MAP[key], d); });
            if (cb) cb(arr.length ? arr : null);
        }).catch(function () { if (cb) cb(null); });
    }

    function pull(key, cb) {
        pullAll(null, key, cb);
    }

    function watch(key, cb) {
        if (!FB.ready || !MAP[key]) return;
        db.collection(MAP[key]).onSnapshot(function (snap) {
            if (cb) cb(snap.size, snap.docs[0] ? MAP[key] : null);
        });
    }

    init();

    window.CH_FB = { MAP: MAP, set: set, del: del, pull: pull, watch: watch };
})();
