/* ============================================================
   APNA ONLINE CENTER — shared engine
   Auth (demo) · Firestore data layer · admin shell · utilities
   ============================================================ */

(function () {
    'use strict';

    var FIREBASE_CONFIG = {
        apiKey: 'AIzaSyC_iVUneR8fu_haqWPm5UMc5eu8ATBTX1Y',
        authDomain: 'apna-computer-ltd.firebaseapp.com',
        projectId: 'apna-computer-ltd',
        storageBucket: 'apna-computer-ltd.firebasestorage.app',
        messagingSenderId: '235081920000',
        appId: '1:235081920000:web:f7de02bf7680617a33f2e5'
    };

    var COLL = {
        customers: 'oc_customers',
        transactions: 'oc_transactions',
        expenses: 'oc_expenses',
        requests: 'oc_service_requests',
        enquiries: 'oc_ticket_enquiries',
        notices: 'oc_notices',
        config: 'oc_config'
    };

    var _db = null;
    var _config = null;
    var _ready = false;
    var _queue = [];
    var _user = null;

    /* ---------------- firebase ---------------- */
    function db() {
        if (_db) return _db;
        if (typeof firebase === 'undefined') throw new Error('Firebase SDK not loaded');
        if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
        _db = firebase.firestore();
        return _db;
    }

    /* ---------------- data layer ---------------- */
    function all(coll) {
        return db().collection(coll).get().then(function (snap) {
            var rows = [];
            snap.forEach(function (doc) {
                var d = doc.data() || {};
                d.id = doc.id;
                rows.push(d);
            });
            return rows;
        });
    }

    function add(coll, data) {
        var payload = Object.assign({}, data);
        if (!payload.createdAt) payload.createdAt = new Date().toISOString();
        return db().collection(coll).add(payload).then(function (ref) { return ref.id; });
    }

    function set(coll, id, data) {
        return db().collection(coll).doc(id).set(data, { merge: true });
    }

    function remove(coll, id) {
        return db().collection(coll).doc(id).delete();
    }

    function getDoc(coll, id) {
        return db().collection(coll).doc(id).get().then(function (d) {
            return d.exists ? Object.assign({ id: d.id }, d.data()) : null;
        });
    }

    /* ---------------- auth (demo, client-side) ---------------- */
    var USER_KEY = 'oc_user';

    function readUser() {
        try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch (e) { return null; }
    }

    function login(email, password, role) {
        var u = {
            email: (email || '').trim(),
            role: role || 'Admin',
            name: (email || 'Staff').split('@')[0],
            at: new Date().toISOString()
        };
        localStorage.setItem(USER_KEY, JSON.stringify(u));
        return u;
    }

    function logout() {
        localStorage.removeItem(USER_KEY);
        location.href = '/shop/login.html';
    }

    function requireAuth() {
        var u = readUser();
        if (!u) { location.href = '/shop/login.html?next=' + encodeURIComponent(location.pathname); return null; }
        return u;
    }

    /* ---------------- utilities ---------------- */
    function esc(v) {
        return String(v === null || v === undefined ? '' : v)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function num(v) {
        var n = parseFloat(v);
        return isNaN(n) ? 0 : n;
    }

    function money(v) {
        return '₹' + num(v).toLocaleString('en-IN', { maximumFractionDigits: 2 });
    }

    function todayISO() {
        var d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function fmtDate(v) {
        if (!v) return '—';
        var d = new Date(v);
        if (isNaN(d.getTime())) return esc(v);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function fmtDateTime(v) {
        if (!v) return '—';
        var d = new Date(v);
        if (isNaN(d.getTime())) return esc(v);
        return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function monthKey(v) {
        var d = new Date(v);
        if (isNaN(d.getTime())) return '';
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    }

    function toast(msg) {
        var el = document.getElementById('shopToast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'shopToast';
            el.className = 'toast';
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(el._t);
        el._t = setTimeout(function () { el.classList.remove('show'); }, 2600);
    }

    function openModal(id) {
        var el = document.getElementById(id);
        if (el) el.classList.add('open');
    }

    function closeModal(id) {
        var el = document.getElementById(id);
        if (el) el.classList.remove('open');
    }

    function waLink(mobile, text) {
        var m = String(mobile || '').replace(/[^0-9]/g, '');
        if (m.length === 10) m = '91' + m;
        return 'https://wa.me/' + m + (text ? '?text=' + encodeURIComponent(text) : '');
    }

    function csv(filename, rows) {
        var lines = rows.map(function (r) {
            return r.map(function (c) {
                var s = String(c === null || c === undefined ? '' : c);
                return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
            }).join(',');
        });
        var blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    }

    function qs(name) {
        return new URLSearchParams(location.search).get(name);
    }

    function uid(prefix) {
        var d = new Date();
        var ymd = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
        return prefix + '-' + ymd + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    }

    function sum(rows, key) {
        return rows.reduce(function (s, r) { return s + num(r[key]); }, 0);
    }

    function byDateDesc(key) {
        return function (a, b) { return String(b[key] || '').localeCompare(String(a[key] || '')); };
    }

    /* ---------------- admin shell ---------------- */
    var NAV = [
        { section: 'Main' },
        { page: 'dashboard', label: 'Dashboard', icon: 'fa-gauge-high', href: '/shop/admin/' },
        { page: 'customers', label: 'Customers', icon: 'fa-users', href: '/shop/admin/customers.html' },
        { page: 'transactions', label: 'Transactions', icon: 'fa-receipt', href: '/shop/admin/transactions.html' },
        { page: 'payments', label: 'Payments', icon: 'fa-indian-rupee-sign', href: '/shop/admin/payments.html' },
        { page: 'payments-pending', label: 'Pending Payments', icon: 'fa-clock', href: '/shop/admin/payments-pending.html', sub: true },
        { page: 'payments-history', label: 'Payment History', icon: 'fa-clock-rotate-left', href: '/shop/admin/payments-history.html', sub: true },
        { section: 'Management' },
        { page: 'expenses', label: 'Expenses', icon: 'fa-wallet', href: '/shop/admin/expenses.html' },
        { page: 'service-requests', label: 'Service Requests', icon: 'fa-inbox', href: '/shop/admin/service-requests.html' },
        { page: 'ticket-enquiries', label: 'Ticket Enquiries', icon: 'fa-bus', href: '/shop/admin/ticket-enquiries.html' },
        { section: 'Reports' },
        { page: 'daily-account', label: 'Daily Account', icon: 'fa-calendar-day', href: '/shop/admin/daily-account.html' },
        { page: 'monthly-report', label: 'Monthly Report', icon: 'fa-calendar-days', href: '/shop/admin/monthly-report.html' },
        { page: 'reports', label: 'Reports & Export', icon: 'fa-chart-line', href: '/shop/admin/reports.html' },
        { section: 'System' },
        { page: 'notices', label: 'Notices', icon: 'fa-bullhorn', href: '/shop/admin/notices.html' },
        { page: 'settings', label: 'Settings', icon: 'fa-gear', href: '/shop/admin/settings.html' }
    ];

    function renderShell(user, config) {
        var page = document.body.getAttribute('data-page');
        var title = document.body.getAttribute('data-title') || 'Dashboard';
        var sidebar = document.getElementById('sidebar');
        var topbar = document.getElementById('topbar');

        if (sidebar) {
            var items = NAV.map(function (n) {
                if (n.section) return '<div class="side-label">' + n.section + '</div>';
                return '<a href="' + n.href + '" class="' + (n.page === page ? 'active' : '') + (n.sub ? ' sub' : '') + '">' +
                    '<i class="fas ' + n.icon + '"></i><span>' + n.label + '</span></a>';
            }).join('');

            sidebar.innerHTML =
                '<div class="side-brand"><span class="logo">A</span>' +
                '<span><b>' + esc(config.shopName || 'Apna Online Center') + '</b><small>Shop + CRM</small></span></div>' +
                '<nav class="side-nav">' + items + '</nav>' +
                '<div class="side-foot">' +
                '<a href="/shop/" target="_blank"><i class="fas fa-globe"></i> View Website</a>' +
                '<a href="/"><i class="fas fa-layer-group"></i> Apna Hub</a>' +
                '<a href="#" class="logout" id="logoutBtn"><i class="fas fa-right-from-bracket"></i> Logout</a>' +
                '</div>';

            var lo = document.getElementById('logoutBtn');
            if (lo) lo.addEventListener('click', function (e) { e.preventDefault(); logout(); });
        }

        if (topbar) {
            topbar.innerHTML =
                '<button class="menu-btn" id="sideToggle" aria-label="Menu"><i class="fas fa-bars"></i></button>' +
                '<h1>' + esc(title) + '</h1><span class="spacer"></span>' +
                '<div class="user-chip"><span class="avatar">' + esc((user.name || 'A').charAt(0).toUpperCase()) + '</span>' +
                '<span><b style="color:var(--text)">' + esc(user.name || 'Admin') + '</b>' +
                '<small class="subtle" style="display:block">' + esc(user.role || 'Admin') + '</small></span></div>';

            var t = document.getElementById('sideToggle');
            if (t) t.addEventListener('click', function () {
                var s = document.getElementById('sidebar');
                if (s) s.classList.toggle('open');
            });
        }

        document.addEventListener('click', function (e) {
            var s = document.getElementById('sidebar');
            if (!s || !s.classList.contains('open')) return;
            if (s.contains(e.target) || (e.target.closest && e.target.closest('#sideToggle'))) return;
            s.classList.remove('open');
        });
    }

    /* ---------------- boot ---------------- */
    function loadConfig() {
        return getDoc(COLL.config, 'app').catch(function () { return null; }).then(function (c) {
            _config = Object.assign({
                shopName: 'Apna Online Center',
                owner: 'Apna Computer',
                phone: '+91 85049 85149',
                address: 'Amethi, Uttar Pradesh',
                hours: 'Mon – Sat · 9:00 AM – 7:00 PM',
                currency: '₹'
            }, c || {});
            return _config;
        });
    }

    function boot() {
        var page = document.body.getAttribute('data-page');
        var needsAuth = page && page !== 'login';

        if (needsAuth) {
            _user = requireAuth();
            if (!_user) return;
        }

        loadConfig().then(function (cfg) {
            if (needsAuth) renderShell(_user, cfg);
            _ready = true;
            var ctx = { user: _user, config: cfg, coll: COLL };
            _queue.forEach(function (fn) { try { fn(ctx); } catch (e) { console.error(e); } });
            _queue = [];
            document.dispatchEvent(new CustomEvent('shop-ready', { detail: ctx }));
        }).catch(function (e) {
            console.error('[Shop] init failed', e);
            toast('Data load nahi hua — internet check karein.');
        });
    }

    function ready(fn) {
        if (_ready) fn({ user: _user, config: _config, coll: COLL });
        else _queue.push(fn);
    }

    window.SHOP = {
        db: db, all: all, add: add, set: set, remove: remove, getDoc: getDoc,
        coll: COLL,
        auth: { user: readUser, login: login, logout: logout, require: requireAuth },
        ready: ready,
        ui: {
            esc: esc, money: money, num: num, todayISO: todayISO, fmtDate: fmtDate,
            fmtDateTime: fmtDateTime, monthKey: monthKey, toast: toast,
            openModal: openModal, closeModal: closeModal, waLink: waLink,
            csv: csv, qs: qs, uid: uid, sum: sum, byDateDesc: byDateDesc
        }
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
