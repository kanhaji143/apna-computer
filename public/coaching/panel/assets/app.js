/* ============================================================
   COACHING ERP — Shared App Logic (Step 1: shell + dashboard)
   Path: public/coaching/panel/assets/app.js
   Roles: Owner, Admin1, Admin2, Accountant, Teacher
   ============================================================ */

(function () {
    'use strict';

    const B = window.CH_BRAND || {};
    const FB = window.CH_FB || null;

    const NAV = [
        { id: 'dashboard',  label: 'Dashboard',       icon: 'fa-gauge-high',       href: 'index.html' },
        { id: 'students',   label: 'Students',        icon: 'fa-user-graduate',    href: 'students.html' },
        { id: 'batches',    label: 'Batches',         icon: 'fa-layer-group',      href: 'batches.html' },
        { id: 'courses',    label: 'Courses',         icon: 'fa-book-open',        href: 'courses.html' },
        { id: 'attendance', label: 'Attendance',      icon: 'fa-clipboard-check',  href: 'attendance.html' },
        { id: 'fees',       label: 'Fees & Invoices', icon: 'fa-file-invoice-dollar', href: 'fees.html' },
        { id: 'results',    label: 'Tests & Results', icon: 'fa-clipboard-list',   href: 'results.html' },
        { id: 'staff',      label: 'Staff & Payroll', icon: 'fa-chalkboard-user',  href: 'staff.html' },
        { id: 'settings',   label: 'Settings',        icon: 'fa-gear',             href: 'settings.html' }
    ];

    /* ---------- helpers ---------- */
    function $(id) { return document.getElementById(id); }
    function page() { return document.body.getAttribute('data-page'); }
    function esc(v) { return CH.esc(v); }
    function money(v) { return CH.money(v); }
    function fmtDate(iso) {
        if (!iso) return '—';
        const d = new Date(iso + 'T00:00:00');
        return isNaN(d) ? iso : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function toast(msg) {
        let t = $('toast');
        if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(t._t);
        t._t = setTimeout(function () { t.classList.remove('show'); }, 2600);
    }

    function modal(title, body, foot, wide) {
        $('modalHost').innerHTML =
            '<div class="modal-overlay active" onclick="App.closeModal()"></div>' +
            '<div class="modal-box active"' + (wide ? ' style="max-width:900px"' : '') + '>' +
                '<div class="modal-head"><h3>' + title + '</h3>' +
                '<button class="modal-x" onclick="App.closeModal()">&times;</button></div>' +
                '<div class="modal-body">' + body + '</div>' +
                '<div class="modal-foot">' + (foot || '<button class="btn btn-light" onclick="App.closeModal()">Close</button>') + '</div>' +
            '</div>';
    }
    function closeModal() { $('modalHost').innerHTML = ''; }

    /* ---------- firestore sync ---------- */
    function fbSet(key, obj) {
        if (FB && FB.MAP[key]) FB.set(FB.MAP[key], obj);
    }
    function fbDel(key, id) {
        if (FB && FB.MAP[key]) FB.del(FB.MAP[key], id);
    }
    /* pehli baar Firestore se laao; FB khali ho to seed push karo */
    function syncStart(done) {
        const s = CH.load();
        if (!FB) { saveAll(); done && done(); return; }
        const keys = Object.keys(FB.MAP);
        let left = keys.length;
        keys.forEach(function (key) {
            FB.pull(MAPOf(key), function (rows) {
                if (rows && rows.length) {
                    s[key] = rows;
                } else if (!s.fbSeeded[key]) {
                    const arr = Array.isArray(s[key]) ? s[key] : (s[key] ? [s[key]] : []);
                    arr.slice(0, 400).forEach(function (r) { fbSet(key, r); });
                    s.fbSeeded[key] = true;
                }
                if (--left === 0) { CH.save(s); done && done(); }
            });
        });
        function MAPOf(k) { return FB.MAP[k] ? k : k; }
        function saveAll() { CH.save(s); }
    }

    /* ---------- AUTH ---------- */
    function guard() {
        const u = CH.getUser();
        if (!u) { location.href = 'login.html'; return null; }
        const p = page();
        const allowed = CH.PAGES[p];
        if (p !== 'login' && allowed && u.role && allowed.indexOf(u.role) === -1) {
            location.href = 'index.html'; return null;
        }
        return u;
    }

    function logout() { CH.setUser(null); location.href = 'login.html'; }

    /* ---------- SHELL ---------- */
    function renderShell() {
        const u = guard();
        if (!u) return;
        const p = page();
        const s = CH.load();
        const sb = $('sidebar'), tb = $('topbar');
        if (sb) {
            const nav = NAV.filter(function (n) {
                const ok = CH.PAGES[n.id];
                return !ok || (u.role && ok.indexOf(u.role) > -1);
            });
            sb.innerHTML =
                '<div class="sidebar-brand"><i class="fas ' + esc(B.logoIcon || 'fa-graduation-cap') + '"></i>' +
                '<div class="bt">' + esc(B.name || 'Coaching ERP') + '<small>' + esc(s.config.shopName || '') + '</small></div></div>' +
                '<div class="sidebar-section">Main Menu</div>' +
                '<nav class="sidebar-nav">' + nav.map(function (n) {
                    return '<a href="' + n.href + '" class="' + (n.id === p ? 'active' : '') + '">' +
                        '<i class="fas ' + n.icon + '"></i><span>' + n.label + '</span></a>';
                }).join('') + '</nav>' +
                '<div class="sidebar-footer">' +
                    '<a href="settings.html"><i class="fas fa-gear"></i> Settings</a>' +
                    '<a href="#" onclick="App.logout();return false;"><i class="fas fa-right-from-bracket"></i> Logout</a>' +
                '</div>';
        }
        if (tb) {
            const cur = NAV.filter(function (n) { return n.id === p; })[0];
            tb.innerHTML =
                '<button class="hamburger" onclick="document.getElementById(\'sidebar\').classList.toggle(\'open\')"><i class="fas fa-bars"></i></button>' +
                '<h1>' + esc(cur ? cur.label : 'Dashboard') + '</h1><div class="spacer"></div>' +
                '<div class="topbar-user"><div class="avatar">' + esc(CH.initials(u.name)) + '</div>' +
                '<div class="um"><div class="un">' + esc(u.name) + '</div>' +
                '<div class="ur">' + esc(u.role) + '</div></div></div>';
        }
    }

    /* ============================================================
       DASHBOARD (HOME PAGE) — STEP 1
       ============================================================ */
    function dashboard() {
        const s = CH.load();
        const month = (s.config.month || '').slice(0, 7) || CH.today().slice(0, 7);

        const activeStudents = s.students.filter(function (x) { return x.status === 'Active'; });
        const running = s.batches.filter(function (x) { return x.status === 'Running'; });
        const collected = s.payments.filter(function (p) { return (p.date || '').slice(0, 7) === month; })
            .reduce(function (a, p) { return a + Number(p.amount || 0); }, 0);
        const pendingInvoices = s.invoices.filter(function (i) { return i.status !== 'Paid'; });
        const due = pendingInvoices.reduce(function (a, i) { return a + Number(i.total || 0); }, 0);
        const expTotal = s.expenses.filter(function (e) { return (e.date || '').slice(0, 7) === month; })
            .reduce(function (a, e) { return a + Number(e.amount || 0); }, 0);

        const st = $('dStats');
        if (st) {
            st.innerHTML =
                card('fa-user-graduate', 'teal', activeStudents.length, 'Active Students') +
                card('fa-layer-group', 'orange', running.length, 'Running Batches') +
                card('fa-indian-rupee-sign', 'green', money(collected), 'Collected (' + month + ')') +
                card('fa-hourglass-half', 'red', money(due), 'Pending Fees') +
                card('fa-receipt', 'blue', money(expTotal), 'Expenses (' + month + ')') +
                card('fa-chalkboard-user', 'purple', s.staff.length, 'Staff Members');

            function card(icon, col, val, label) {
                return '<div class="stat-card"><div class="stat-icon ' + col + '"><i class="fas ' + icon + '"></i></div>' +
                    '<div><div class="stat-value">' + esc(val) + '</div><div class="stat-label">' + label + '</div></div></div>';
            }
        }

        /* dues list (top 6) with WhatsApp reminder */
        const dv = $('dDues');
        if (dv) {
            const rows = pendingInvoices.slice(0, 6).map(function (i) {
                const st_ = s.students.filter(function (x) { return x.id === i.studentId; })[0] || {};
                const ph = st_.parentPhone || st_.phone || '';
                const msg = encodeURIComponent('Namaste, ' + i.student + ' ki fees Rs.' + i.total + ' due hai (invoice ' + i.no + '). Kripya jaldi payment karein. - ' + (s.config.shopName || 'Coaching'));
                return '<tr><td><b>' + esc(i.student) + '</b><div class="small muted">' + esc(i.adm || '') + '</div></td>' +
                    '<td>' + esc(i.batch || '') + '</td><td>' + esc(fmtDate(i.dueDate)) + '</td>' +
                    '<td><b class="t-red">' + money(i.total) + '</b></td>' +
                    '<td>' + (ph ? '<a class="btn btn-light btn-sm" target="_blank" href="https://wa.me/91' + esc(ph) + '?text=' + msg + '"><i class="fab fa-whatsapp" style="color:#25D366"></i> Remind</a>' : '—') + '</td></tr>';
            }).join('');
            dv.innerHTML = rows || '<tr><td colspan="5" class="muted">Koi pending fee nahi — good news!</td></tr>';
        }

        /* recent payments */
        const pv = $('dPayments');
        if (pv) {
            const rows = s.payments.slice().sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); }).slice(0, 6)
                .map(function (p) {
                    return '<tr><td>' + esc(fmtDate(p.date)) + '</td><td><b>' + esc(p.student) + '</b><div class="small muted">' + esc(p.adm || '') + '</div></td>' +
                        '<td>' + money(p.amount) + '</td><td><span class="chip">' + esc(p.mode) + '</span></td></tr>';
                }).join('');
            pv.innerHTML = rows || '<tr><td colspan="4" class="muted">Abhi koi payment nahi aayi</td></tr>';
        }

        /* batches overview */
        const bv = $('dBatches');
        if (bv) {
            bv.innerHTML = s.batches.map(function (b) {
                const cnt = s.students.filter(function (x) { return x.batchId === b.id && x.status === 'Active'; }).length;
                const pct = b.capacity ? Math.round(cnt * 100 / b.capacity) : 0;
                return '<tr><td><b>' + esc(b.name) + '</b><div class="small muted">' + esc(b.course) + '</div></td>' +
                    '<td>' + esc(b.time) + '</td><td>' + esc(b.teacher) + '</td>' +
                    '<td style="min-width:130px"><div class="bar"><div class="bar-fill" style="width:' + Math.min(pct, 100) + '%"></div></div>' +
                    '<div class="small muted">' + cnt + '/' + esc(b.capacity) + ' (' + pct + '%)</div></td>' +
                    '<td><span class="chip chip-green">' + esc(b.status) + '</span></td></tr>';
            }).join('');
        }

        /* aaj ki attendance */
        const av = $('dAtt');
        if (av) {
            const d = CH.today();
            const rows = s.batches.map(function (b) {
                const recs = s.attendance.filter(function (a) { return a.date === d && a.batchId === b.id; });
                const present = recs.filter(function (r) { return r.status === 'Present'; }).length;
                const total = recs.length;
                const pct = total ? Math.round(present * 100 / total) : null;
                return '<tr><td><b>' + esc(b.name) + '</b></td><td>' + (total ? present + '/' + total + ' (' + pct + '%)' : '<span class="muted">Mark nahi hua</span>') + '</td>' +
                    '<td>' + (total ? (pct >= 75 ? '<span class="chip chip-green">Good</span>' : '<span class="chip chip-red">Low</span>') : '<span class="chip chip-amber">Pending</span>') + '</td></tr>';
            }).join('');
            av.innerHTML = rows;
        }
    }

    /* ---------- public API ---------- */
    window.App = {
        renderShell: renderShell,
        dashboard: dashboard,
        toast: toast,
        openModal: modal,
        closeModal: closeModal,
        logout: logout,
        fmtDate: fmtDate,
        esc: esc, money: money,
        syncStart: syncStart,
        fbSet: fbSet, fbDel: fbDel,
        resetData: function () {
            modal('Reset Data',
                '<p>Data reset karne se demo data wapas aa jayega. Confirm?</p>',
                '<button class="btn btn-danger" onclick="App.doReset(1)">Yes, Reset</button> ' +
                '<button class="btn btn-light" onclick="App.closeModal()">Cancel</button>');
        },
        doReset: function () {
            localStorage.removeItem('ch_store_v1');
            CH.load();
            closeModal();
            toast('Data reset ho gaya');
            setTimeout(function () { location.reload(); }, 600);
        }
    };

    /* boot: shell render, sync, page renderer */
    document.addEventListener('DOMContentLoaded', function () {
        if (page() === 'login') return;
        if (!CH.getUser()) { location.href = 'login.html'; return; }
        renderShell();
        syncStart(function () {
            renderShell();
            if (page() === 'dashboard') App.dashboard();
            if (window.App.pageReady) window.App.pageReady();
        });
    });
})();
