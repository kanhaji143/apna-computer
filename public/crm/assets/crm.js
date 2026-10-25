/* ============================================================
   SCHOOL CRM — Shared Script (Excel ERP data driven)
   Path: public/crm/assets/crm.js
   Data: public/crm/data/crm-data.json
   Edits are saved in localStorage (key: crm_store_v2)
   ============================================================ */

(function () {
    'use strict';

    const STORAGE_KEY = 'crm_user';
    const DATA_URL    = 'data/crm-data.json';
    const STRUCT_URL  = 'data/fee-structure.json';
    const STORE_KEY   = 'crm_store_v2';

    const NAV = [
        { id: 'dashboard',    label: 'Dashboard',     icon: 'fa-gauge-high',         href: 'index.html' },
        { id: 'students',     label: 'Students',      icon: 'fa-user-graduate',      href: 'students.html' },
        { id: 'attendance',   label: 'Attendance',    icon: 'fa-calendar-check',     href: 'attendance.html' },
        { id: 'exams',        label: 'Exams & Results', icon: 'fa-file-pen',         href: 'exams.html' },
        { id: 'idcard',       label: 'ID Cards',      icon: 'fa-id-card',            href: 'id-card.html' },
        { id: 'parentview',   label: 'Parent View',   icon: 'fa-users',              href: 'parent-view.html' },
        { id: 'employees',    label: 'Employees',     icon: 'fa-chalkboard-user',    href: 'employees.html' },
        { id: 'transport',    label: 'Transport',     icon: 'fa-bus',                href: 'transport.html' },
        { id: 'fees',         label: 'Fees',          icon: 'fa-indian-rupee-sign',  href: 'fees.html' },
        { id: 'feestructure', label: 'Fee Structure', icon: 'fa-table-list',         href: 'fee-structure.html' },
        { id: 'transactions', label: 'Fee Receipts',  icon: 'fa-money-check-dollar', href: 'transactions.html' },
        { id: 'dues',         label: 'Previous Dues', icon: 'fa-clock-rotate-left',  href: 'dues.html' },
        { id: 'expenses',     label: 'Expenses',      icon: 'fa-receipt',            href: 'expenses.html' },
        { id: 'reports',      label: 'Reports',       icon: 'fa-chart-line',         href: 'reports.html' },
        { id: 'settings',     label: 'Settings',      icon: 'fa-gear',               href: 'settings.html' }
    ];

    /* ---------- FIELD SCHEMAS (edit forms) ---------- */
    const SCHEMAS = {
        students: {
            title: 'Student', key: 'Admission No', prefix: 'ADM',
            fields: [
                { k: 'Admission No', l: 'Admission No', t: 'text', req: true },
                { k: 'Student Name', l: 'Student Name', t: 'text', req: true },
                { k: 'Father Name', l: "Father's Name", t: 'text' },
                { k: 'Mother Name', l: "Mother's Name", t: 'text' },
                { k: 'Gender', l: 'Gender', t: 'select', opts: ['Male', 'Female', 'Other'] },
                { k: 'DOB', l: 'Date of Birth', t: 'date' },
                { k: 'Class', l: 'Class', t: 'select', opts: ['PG', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'] },
                { k: 'Section', l: 'Section', t: 'select', opts: ['A', 'B', 'C', 'D', 'E'] },
                { k: 'Roll No', l: 'Roll No', t: 'text' },
                { k: 'Mobile', l: 'Mobile', t: 'text' },
                { k: 'Alt Mobile', l: 'Alt Mobile', t: 'text' },
                { k: 'Aadhaar No.', l: 'Aadhaar No.', t: 'text' },
                { k: 'Student Pen No.', l: 'Pen No.', t: 'text' },
                { k: 'Route', l: 'Route', t: 'select', opts: ['', 'Route 1', 'Route 2', 'Route 3', 'Route 4', 'Route 5', 'Route 6', 'Route 7', 'Route 8', 'Route 9', 'Route 10', 'Route 11', 'Route 12', 'Route 13', 'Route 14', 'Route 15'] },
                { k: 'Admission Date', l: 'Admission Date', t: 'date' },
                { k: 'Admission Type', l: 'Admission Type', t: 'select', opts: ['', 'New', 'Renewal'] },
                { k: 'Status', l: 'Status', t: 'select', opts: ['Active', 'Inactive', 'Passed', 'TC', 'Dropped'] },
                { k: 'Address', l: 'Address', t: 'textarea' },
                { k: 'Remarks', l: 'Remarks', t: 'textarea' }
            ]
        },
        employees: {
            title: 'Employee', key: 'Employee ID', prefix: 'EMP',
            fields: [
                { k: 'Employee ID', l: 'Employee ID', t: 'text', req: true },
                { k: 'Employee Name', l: 'Name', t: 'text', req: true },
                { k: 'Father Name', l: "Father's Name", t: 'text' },
                { k: 'Mobile No', l: 'Mobile', t: 'text' },
                { k: 'Joining Date', l: 'Joining Date', t: 'date' },
                { k: 'Designation', l: 'Designation', t: 'select', opts: ['Principal', 'Teacher', 'Accountant', 'Office Staff', 'Computer Operator', 'Bus Driver', 'Cleaner', 'Peon', 'Security Guard', 'Other'] },
                { k: 'Employment Type', l: 'Employment Type', t: 'select', opts: ['', 'Permanent', 'Contractual', 'Daily Wage', 'Part-Time', 'Guest Faculty', 'Intern'] },
                { k: 'Department', l: 'Department', t: 'select', opts: ['', 'Administration', 'Academics', 'Finance', 'IT and Administration', 'Transport', 'Support Staff', 'Security', 'Miscellaneous'] },
                { k: 'Status', l: 'Status', t: 'select', opts: ['Active', 'Inactive'] },
                { k: 'Remarks', l: 'Remarks', t: 'textarea' }
            ]
        },
        transport: {
            title: 'Route', key: 'Route Code', prefix: 'RT',
            fields: [
                { k: 'Route Code', l: 'Route Code', t: 'text', req: true },
                { k: 'Route Name', l: 'Route Name', t: 'text' },
                { k: 'Transport Fee', l: 'Transport Fee', t: 'number' },
                { k: 'Status', l: 'Status', t: 'select', opts: ['Active', 'Inactive'] }
            ]
        },
        expenses: {
            title: 'Expense', key: 'Voucher No', prefix: 'EXP',
            fields: [
                { k: 'Voucher No', l: 'Voucher No', t: 'text', req: true },
                { k: 'Date', l: 'Date', t: 'date' },
                { k: 'Expense Category', l: 'Category', t: 'select', opts: ['Electricity', 'Rent', 'Bus Fuel', 'Bus Repair', 'Stationery', 'Examination', 'PTM Expense', 'Sports', 'Maintenance', 'Internet', 'Cleaning', 'Housekeeping', 'Salary', 'Other'] },
                { k: 'Description', l: 'Description', t: 'text' },
                { k: 'Amount', l: 'Amount', t: 'number', req: true },
                { k: 'Payment Mode', l: 'Payment Mode', t: 'select', opts: ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card', 'NEFT', 'RTGS', 'IMPS'] },
                { k: 'Paid To', l: 'Paid To', t: 'text' },
                { k: 'Remarks', l: 'Remarks', t: 'textarea' }
            ]
        }
    };

    /* ---------- STATE ---------- */
    let store = null;      // { students, employees, transport, expenses, ... }
    let meta  = null;
    let config = null;
    let feeStruct = null;  // data/fee-structure.json (Lists sheet se)

    /* ---------- HELPERS ---------- */
    function initials(n) {
        return (n || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0] || ''; }).join('').toUpperCase();
    }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
        });
    }
    function num(v) { var n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return isNaN(n) ? 0 : n; }
    function money(n) { return '\u20B9' + num(n).toLocaleString('en-IN'); }

    // Excel serial date -> dd-Mon-yyyy
    function excelDate(v) {
        if (!v) return '';
        var s = String(v).trim();
        if (/^\d+(\.\d+)?$/.test(s)) {
            var n = parseFloat(s);
            if (n > 20000 && n < 60000) {
                var d = new Date(Date.UTC(1899, 11, 30) + n * 86400000);
                var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                return String(d.getUTCDate()).padStart(2, '0') + '-' + m[d.getUTCMonth()] + '-' + d.getUTCFullYear();
            }
        }
        return s;
    }

    function badgeClass(st) {
        var map = { Paid: 'green', Active: 'green', Present: 'green', Scheduled: 'blue', Pending: 'orange',
                    'On Leave': 'orange', Overdue: 'red', Absent: 'red', Inactive: 'grey', Planned: 'grey', TC: 'grey', Dropped: 'red', Passed: 'blue' };
        return map[st] || 'grey';
    }
    function badge(st) { return '<span class="badge ' + badgeClass(st) + '">' + esc(st) + '</span>'; }

    /* ---------- AUTH ---------- */
    function getUser() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return null; } }
    function setUser(u) { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); }
    function logout() { localStorage.removeItem(STORAGE_KEY); location.href = 'login.html'; }
    function requireAuth() { var u = getUser(); if (!u) { location.replace('login.html'); return null; } return u; }

    /* ---------- DATA ---------- */
    function loadStore() {
        var saved = null;
        try { saved = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { saved = null; }
        if (saved && saved.students) { return Promise.resolve(saved); }
        // Firestore pehle (sab devices pe same data), fail ho to empty store
        if (window.SFB && SFB.ready) {
            return SFB.loadStore().catch(function (e) {
                console.warn('[CRM] Firestore load failed:', e.message);
                return { students: [], employees: [], transport: [], previousDues: [],
                         expenses: [], feeRegister: [], feeTransactions: [] };
            });
        }
        return fetch(DATA_URL).then(function (r) { return r.json(); });
    }
    function loadStruct() {
        if (window.SFB && SFB.ready) {
            return SFB.loadStruct()
                .then(function (d) { feeStruct = d; return d; })
                .catch(function () { feeStruct = { session: '', frequency: {}, classes: [] }; return feeStruct; });
        }
        return fetch(STRUCT_URL).then(function (r) { return r.json(); })
            .then(function (d) { feeStruct = d; return d; })
            .catch(function () { feeStruct = { session: '', frequency: {}, classes: [] }; return feeStruct; });
    }
    function saveStore() {
        try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); }
        catch (e) { toast('Save failed: storage full'); }
    }
    function resetStore() {
        localStorage.removeItem(STORE_KEY);
        location.reload();
    }

    /* ---------- TOAST ---------- */
    function toast(msg) {
        var el = document.getElementById('crmToast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'crmToast';
            el.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#323232;color:#fff;padding:14px 20px;border-radius:8px;font-size:14px;z-index:9999;opacity:0;transform:translateY(20px);transition:all .25s;box-shadow:0 6px 20px rgba(0,0,0,.25);font-family:inherit;max-width:340px';
            document.body.appendChild(el);
        }
        el.textContent = msg;
        requestAnimationFrame(function () { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
        clearTimeout(el._t);
        el._t = setTimeout(function () { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; }, 2600);
    }

    function navForRole(role) {
        role = String(role || 'owner').toLowerCase();
        var all = NAV.slice();
        if (role === 'owner' || role === 'administrator' || role === 'admin') return all;
        if (role === 'cashier') {
            var allow = ['dashboard','students','idcard','parentview','fees','transactions','dues','expenses','reports'];
            return all.filter(function (n) { return allow.indexOf(n.id) > -1; });
        }
        if (role === 'teacher') {
            var allow = ['dashboard','students','attendance','exams','idcard'];
            return all.filter(function (n) { return allow.indexOf(n.id) > -1; });
        }
        return all;
    }

    /* ---------- SHELL ---------- */
    function renderShell() {
        var page = document.body.getAttribute('data-page');
        var sidebar = document.getElementById('sidebar');
        var topbar = document.getElementById('topbar');
        var user = getUser();
        var role = user ? (user.role || 'owner') : 'owner';
        var nav = navForRole(role);
        var cur = nav.filter(function (n) { return n.id === page; })[0];
        var title = cur ? cur.label : 'Dashboard';

        if (sidebar) {
            var links = nav.map(function (n) {
                return '<a href="' + n.href + '" class="' + (n.id === page ? 'active' : '') + '">' +
                       '<i class="fas ' + n.icon + '"></i><span>' + n.label + '</span></a>';
            }).join('');
            sidebar.innerHTML =
                '<div class="sidebar-brand"><i class="fas fa-school"></i>' +
                    '<div class="brand-text">Apna School<small>CRM Panel</small></div></div>' +
                '<div class="sidebar-section">Main Menu</div>' +
                '<nav class="sidebar-nav">' + links + '</nav>' +
                '<div class="sidebar-footer">' +
                    '<a href="#" onclick="CRM.reset(); return false;"><i class="fas fa-rotate-left"></i> Reset Data</a>' +
                    '<a href="../index.html"><i class="fas fa-store"></i> Go to Shop</a>' +
                    '<a href="#" onclick="CRM.logout(); return false;"><i class="fas fa-right-from-bracket"></i> Logout</a>' +
                '</div>';
        }
        if (topbar) {
            topbar.innerHTML =
                '<button class="hamburger" onclick="document.getElementById(\'sidebar\').classList.toggle(\'open\')"><i class="fas fa-bars"></i></button>' +
                '<h1>' + esc(title) + '</h1><div class="spacer"></div>' +
                '<div class="topbar-search"><i class="fas fa-search"></i>' +
                '<input type="text" id="globalSearch" placeholder="Search..." oninput="CRM.globalSearch(this.value)"></div>' +
                '<button class="topbar-icon" onclick="CRM.toast(\'Session: ' + esc(config ? config['Academic Session'] : '') + '\')"><i class="fas fa-bell"></i></button>' +
                '<div class="topbar-user"><div class="avatar">' + esc(initials(user ? user.name : 'Admin')) + '</div>' +
                '<div class="u-meta"><div class="u-name">' + esc(user ? user.name : 'Admin') + '</div>' +
                '<div class="u-role">' + esc(user ? user.role : 'Administrator') + '</div></div></div>';
        }
    }

    /* ---------- TABLE HELPERS ---------- */
    function paginate(rows, page, per) {
        var start = (page - 1) * per;
        return rows.slice(start, start + per);
    }
    function pager(total, page, per, fnName) {
        var pages = Math.max(1, Math.ceil(total / per));
        if (pages <= 1) return '';
        var html = '<div style="display:flex;gap:6px;align-items:center;justify-content:center;padding:16px;flex-wrap:wrap">';
        html += '<button class="btn btn-light btn-sm" onclick="' + fnName + '(' + Math.max(1, page - 1) + ')">&laquo; Prev</button>';
        html += '<span style="font-size:13px;color:#878787;padding:0 10px">Page ' + page + ' of ' + pages + ' &middot; ' + total + ' records</span>';
        html += '<button class="btn btn-light btn-sm" onclick="' + fnName + '(' + Math.min(pages, page + 1) + ')">Next &raquo;</button>';
        return html + '</div>';
    }

    /* ---------- RENDERERS ---------- */
    var stuPage = 1, STU_PER = 25, stuQuery = '';

    function renderStudents() {
        var tbody = document.getElementById('studentsBody');
        if (!tbody) return;
        var q = stuQuery.toLowerCase();
        var rows = store.students.filter(function (s) {
            if (!q) return true;
            return [
                s['Student Name'], s['Admission No'], s['Father Name'], s['Mother Name'],
                s['Class'], s['Section'], s['Roll No'], s['Mobile'], s['Alt Mobile'],
                s['Aadhaar No.'], s['Student Pen No.'], s['Route'], s['Address'], s['Remarks']
            ].join(' ').toLowerCase().indexOf(q) > -1;
        });
        var slice = paginate(rows, stuPage, STU_PER);
        tbody.innerHTML = slice.map(function (s) {
            var cls = esc(s['Class']) + (s['Section'] ? '-' + esc(s['Section']) : '');
            return '<tr>' +
                '<td><strong>' + esc(s['Admission No']) + '</strong></td>' +
                '<td><div class="cell-user"><div class="avatar">' + esc(initials(s['Student Name'])) + '</div>' +
                '<div><div class="cu-name">' + esc(s['Student Name']) + '</div>' +
                '<div class="cu-sub">Sr ' + esc(s['Student ID/Sr Mo.'] || s['Admission No']) + '</div></div></div></td>' +
                '<td>' + esc(s['Father Name']) + '</td>' +
                '<td>' + esc(s['Mother Name']) + '</td>' +
                '<td>' + esc(s['Gender']) + '</td>' +
                '<td>' + esc(excelDate(s['DOB'])) + '</td>' +
                '<td>' + cls + '</td>' +
                '<td>' + esc(s['Roll No']) + '</td>' +
                '<td>' + esc(s['Mobile']) + '</td>' +
                '<td>' + esc(s['Alt Mobile']) + '</td>' +
                '<td>' + esc(s['Aadhaar No.']) + '</td>' +
                '<td>' + esc(s['Student Pen No.']) + '</td>' +
                '<td>' + esc(excelDate(s['Admission Date'])) + '</td>' +
                '<td>' + (s['Admission Type'] ? badge(s['Admission Type']) : '-') + '</td>' +
                '<td>' + (s['Route'] ? esc(s['Route']) : '-') + '</td>' +
                '<td style="min-width:200px;max-width:260px;white-space:normal">' + esc(s['Address']) + '</td>' +
                '<td>' + badge(s['Status']) + '</td>' +
                '<td style="min-width:150px;max-width:220px;white-space:normal">' + esc(s['Remarks']) + '</td>' +
                '<td style="white-space:nowrap">' +
                    '<button class="btn btn-icon" onclick="CRM.edit(\'students\',\'' + esc(s['Admission No']) + '\')"><i class="fas fa-pen"></i></button> ' +
                    '<button class="btn btn-icon" onclick="CRM.del(\'students\',\'' + esc(s['Admission No']) + '\')"><i class="fas fa-trash"></i></button>' +
                '</td></tr>';
        }).join('') || '<tr><td colspan="19"><div class="empty"><i class="fas fa-user-graduate"></i>No students found</div></td></tr>';

        var pg = document.getElementById('studentsPager');
        if (pg) pg.innerHTML = pager(rows.length, stuPage, STU_PER, 'CRM.stuPage');
        var cnt = document.getElementById('studentsCount');
        if (cnt) cnt.textContent = rows.length + ' students';
    }

    var empPage = 1, EMP_PER = 25;
    function renderEmployees() {
        var tbody = document.getElementById('employeesBody');
        if (!tbody) return;
        var rows = store.employees;
        tbody.innerHTML = paginate(rows, empPage, EMP_PER).map(function (e) {
            return '<tr>' +
                '<td><div class="cell-user"><div class="avatar">' + esc(initials(e['Employee Name'])) + '</div>' +
                '<div><div class="cu-name">' + esc(e['Employee Name']) + '</div><div class="cu-sub">' + esc(e['Employee ID']) + '</div></div></div></td>' +
                '<td>' + esc(e['Designation']) + '</td>' +
                '<td>' + esc(e['Department']) + '</td>' +
                '<td>' + esc(e['Mobile No']) + '</td>' +
                '<td>' + badge(e['Status']) + '</td>' +
                '<td style="white-space:nowrap">' +
                    '<button class="btn btn-icon" onclick="CRM.edit(\'employees\',\'' + esc(e['Employee ID']) + '\')"><i class="fas fa-pen"></i></button> ' +
                    '<button class="btn btn-icon" onclick="CRM.del(\'employees\',\'' + esc(e['Employee ID']) + '\')"><i class="fas fa-trash"></i></button>' +
                '</td></tr>';
        }).join('') || '<tr><td colspan="6"><div class="empty"><i class="fas fa-chalkboard-user"></i>No employees</div></td></tr>';
        var pg = document.getElementById('employeesPager');
        if (pg) pg.innerHTML = pager(rows.length, empPage, EMP_PER, 'CRM.empPage');
    }

    function renderTransport() {
        var tbody = document.getElementById('transportBody');
        if (!tbody) return;
        tbody.innerHTML = store.transport.map(function (t) {
            return '<tr>' +
                '<td><strong>' + esc(t['Route Code']) + '</strong></td>' +
                '<td>' + esc(t['Route Name']) + '</td>' +
                '<td>' + (t['Transport Fee'] ? money(t['Transport Fee']) : '-') + '</td>' +
                '<td>' + (t['Status'] ? badge(t['Status']) : '-') + '</td>' +
                '<td style="white-space:nowrap">' +
                    '<button class="btn btn-icon" onclick="CRM.edit(\'transport\',\'' + esc(t['Route Code']) + '\')"><i class="fas fa-pen"></i></button> ' +
                    '<button class="btn btn-icon" onclick="CRM.del(\'transport\',\'' + esc(t['Route Code']) + '\')"><i class="fas fa-trash"></i></button>' +
                '</td></tr>';
        }).join('') || '<tr><td colspan="5"><div class="empty"><i class="fas fa-bus"></i>No routes</div></td></tr>';
    }

    function renderExpenses() {
        var tbody = document.getElementById('expensesBody');
        if (!tbody) return;
        tbody.innerHTML = store.expenses.map(function (e) {
            return '<tr>' +
                '<td>' + esc(e['Voucher No']) + '</td>' +
                '<td>' + esc(excelDate(e['Date'])) + '</td>' +
                '<td>' + esc(e['Expense Category']) + '</td>' +
                '<td>' + esc(e['Description']) + '</td>' +
                '<td><strong>' + money(e['Amount']) + '</strong></td>' +
                '<td>' + esc(e['Payment Mode']) + '</td>' +
                '<td style="white-space:nowrap">' +
                    '<button class="btn btn-icon" onclick="CRM.edit(\'expenses\',\'' + esc(e['Voucher No']) + '\')"><i class="fas fa-pen"></i></button> ' +
                    '<button class="btn btn-icon" onclick="CRM.del(\'expenses\',\'' + esc(e['Voucher No']) + '\')"><i class="fas fa-trash"></i></button>' +
                '</td></tr>';
        }).join('') || '<tr><td colspan="7"><div class="empty"><i class="fas fa-receipt"></i>No expenses</div></td></tr>';

        var tot = store.expenses.reduce(function (a, e) { return a + num(e['Amount']); }, 0);
        var el = document.getElementById('expTotal'); if (el) el.textContent = money(tot);
    }

    var feePage = 1, FEE_PER = 25, feeQuery = '';
    function renderFees() {
        var tbody = document.getElementById('feesBody');
        if (!tbody) return;
        var q = feeQuery.toLowerCase();
        var rows = store.feeRegister.filter(function (f) {
            if (!q) return true;
            return (f['Student Name'] + ' ' + f['Admission No'] + ' ' + f['Class'] + ' ' + f['Father Name'] + ' ' + f['Fee Status']).toLowerCase().indexOf(q) > -1;
        });
        tbody.innerHTML = paginate(rows, feePage, FEE_PER).map(function (f) {
            return '<tr>' +
                '<td>' + esc(f['Admission No']) + '</td>' +
                '<td><div class="cell-user"><div class="avatar">' + esc(initials(f['Student Name'])) + '</div>' +
                '<div><div class="cu-name">' + esc(f['Student Name']) + '</div><div class="cu-sub">' + esc(f['Father Name']) + '</div></div></div></td>' +
                '<td>' + esc(clsSec(f)) + '</td>' +
                '<td>' + money(f['Expected Fee']) + '</td>' +
                '<td style="color:#388e3c">' + money(f['Total Collection']) + '</td>' +
                '<td><strong style="color:#e53935">' + money(f['Outstanding']) + '</strong></td>' +
                '<td>' + badge(f['Fee Status']) + '</td>' +
                '<td style="white-space:nowrap">' +
                    '<button class="btn btn-icon" title="Student Ledger" onclick="CRM.openLedger(\'' + esc(f['Admission No']) + '\')"><i class="fas fa-eye"></i></button>' +
                '</td></tr>';
        }).join('') || '<tr><td colspan="8"><div class="empty"><i class="fas fa-indian-rupee-sign"></i>No records</div></td></tr>';
        var pg = document.getElementById('feesPager');
        if (pg) pg.innerHTML = pager(rows.length, feePage, FEE_PER, 'CRM.feePage');
        var cnt = document.getElementById('feesCount');
        if (cnt) cnt.textContent = rows.length + ' records';
    }

    function renderDashboard() {
        var stats = document.getElementById('dashStats');
        if (!stats) return;
        var sn = document.getElementById('schoolName');
        if (sn) sn.textContent = (meta && meta.school ? meta.school : '') + (meta && meta.mobile ? ' · ' + meta.mobile : '');
        var sb = document.getElementById('sessionBadge');
        if (sb) sb.textContent = 'Session ' + (config && config['Academic Session'] ? config['Academic Session'] : '—');
        var totalStudents = store.students.length;
        var activeStudents = store.students.filter(function (s) { return s['Status'] === 'Active'; }).length;
        var expected = store.feeRegister.reduce(function (a, f) { return a + num(f['Expected Fee']); }, 0);
        var collected = store.feeRegister.reduce(function (a, f) { return a + num(f['Total Collection']); }, 0);
        var outstanding = store.feeRegister.reduce(function (a, f) { return a + num(f['Outstanding']); }, 0);
        var expenseTotal = store.expenses.reduce(function (a, e) { return a + num(e['Amount']); }, 0);

        var cards = [
            { icon: 'fa-user-graduate', cls: 'blue',   value: totalStudents, label: 'Total Students' },
            { icon: 'fa-circle-check',  cls: 'green',  value: activeStudents, label: 'Active Students' },
            { icon: 'fa-chalkboard-user', cls: 'purple', value: store.employees.length, label: 'Employees' },
            { icon: 'fa-bus',           cls: 'orange', value: store.transport.length, label: 'Transport Routes' },
            { icon: 'fa-indian-rupee-sign', cls: 'green', value: money(collected), label: 'Fee Collected' },
            { icon: 'fa-hourglass-half', cls: 'red',   value: money(outstanding), label: 'Outstanding' },
            { icon: 'fa-receipt',       cls: 'orange', value: money(expenseTotal), label: 'Expenses' },
            { icon: 'fa-wallet',        cls: 'blue',   value: money(collected - expenseTotal), label: 'Net Position' }
        ];
        stats.innerHTML = cards.map(function (c) {
            return '<div class="stat-card"><div class="stat-icon ' + c.cls + '"><i class="fas ' + c.icon + '"></i></div>' +
                   '<div><div class="stat-value">' + c.value + '</div><div class="stat-label">' + c.label + '</div></div></div>';
        }).join('');

        var recent = document.getElementById('recentStudents');
        if (recent) {
            recent.innerHTML = store.students.slice(0, 6).map(function (s) {
                return '<tr><td><div class="cell-user"><div class="avatar">' + esc(initials(s['Student Name'])) + '</div>' +
                    '<div><div class="cu-name">' + esc(s['Student Name']) + '</div><div class="cu-sub">Adm ' + esc(s['Admission No']) + '</div></div></div></td>' +
                    '<td>' + esc(s['Class']) + (s['Section'] ? '-' + esc(s['Section']) : '') + '</td><td>' + badge(s['Status']) + '</td></tr>';
            }).join('');
        }
        var exp = document.getElementById('recentExpenses');
        if (exp) {
            exp.innerHTML = store.expenses.slice(0, 5).map(function (e) {
                return '<tr><td>' + esc(e['Expense Category']) + '</td><td>' + esc(excelDate(e['Date'])) +
                       '</td><td><strong>' + money(e['Amount']) + '</strong></td></tr>';
            }).join('') || '<tr><td colspan="3" style="color:#878787">No expenses</td></tr>';
        }
    }

    /* ---------- FEE HEAD-WISE COLLECTION (Reports) ---------- */
    function headMult(head) { return (head === 'Monthly Fee' || head === 'Transport Fee') ? 12 : 1; }

    function headCollectionData() {
        var heads = FEE_HEADS.slice();
        store.feeTransactions.forEach(function (t) {
            var h = t['Fee Head'];
            if (h && heads.indexOf(h) < 0) heads.push(h);
        });
        var rows = heads.map(function (h) {
            var mult = headMult(h);
            var expected = 0, collected = 0;
            store.feeRegister.forEach(function (f) { expected += num(f[h]) * mult; });
            store.feeTransactions.forEach(function (t) { if (t['Fee Head'] === h) collected += num(t['Net Amount']); });
            return {
                head: h, mult: mult, expected: expected, collected: collected,
                pending: expected - collected,
                pct: expected ? Math.round(collected / expected * 100) : 0,
                freq: (feeStruct && feeStruct.frequency && feeStruct.frequency[h]) || '\u2014'
            };
        });
        var oldDue = 0;
        store.feeRegister.forEach(function (f) { oldDue += num(f['Old Due']); });
        var tExp = rows.reduce(function (a, r) { return a + r.expected; }, 0);
        var tColl = rows.reduce(function (a, r) { return a + r.collected; }, 0);
        return { rows: rows, oldDue: oldDue, totalExpected: tExp, totalCollected: tColl,
                 totalPending: tExp - tColl, totalPayable: tExp + oldDue, grandPending: tExp - tColl + oldDue };
    }

    function renderReports() {
        var grid = document.getElementById('reportsGrid');
        if (!grid) return;
        var expected = store.feeRegister.reduce(function (a, f) { return a + num(f['Expected Fee']); }, 0);
        var collected = store.feeRegister.reduce(function (a, f) { return a + num(f['Total Collection']); }, 0);
        var outstanding = store.feeRegister.reduce(function (a, f) { return a + num(f['Outstanding']); }, 0);
        var pct = expected ? Math.round(collected / expected * 100) : 0;
        var active = store.students.filter(function (s) { return s['Status'] === 'Active'; }).length;
        var inactive = store.students.length - active;
        var paid = store.feeRegister.filter(function (f) { return f['Fee Status'] === 'Paid'; }).length;
        var partial = store.feeRegister.filter(function (f) { return f['Fee Status'] === 'Partial'; }).length;
        var dueS = store.feeRegister.filter(function (f) { return f['Fee Status'] !== 'Paid' && f['Fee Status'] !== 'Partial'; }).length;
        var txnCount = store.feeTransactions.length;
        var avg = txnCount ? Math.round(collected / txnCount) : 0;
        var MNAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var curMonth = MNAMES[new Date().getMonth()];
        var monthColl = store.feeTransactions.filter(function (t) { return monthKey(t['Fee Month']) === curMonth; })
            .reduce(function (a, t) { return a + num(t['Net Amount']); }, 0);
        var d = new Date();
        var todayStr = String(d.getDate()).padStart(2, '0') + '-' + MNAMES[d.getMonth()] + '-' + d.getFullYear();
        var todayColl = store.feeTransactions.filter(function (t) { return String(t['Payment Date']) === todayStr; })
            .reduce(function (a, t) { return a + num(t['Net Amount']); }, 0);

        var cards = [
            { icon: 'fa-user-graduate', cls: 'blue',   value: store.students.length, label: 'Total Students' },
            { icon: 'fa-circle-check',  cls: 'green',  value: active, label: 'Active Students' },
            { icon: 'fa-user-slash',    cls: 'red',    value: inactive, label: 'Inactive Students' },
            { icon: 'fa-file-invoice-dollar', cls: 'purple', value: money(expected), label: 'Expected Fee' },
            { icon: 'fa-sack-dollar',   cls: 'green',  value: money(collected), label: 'Actual Collection' },
            { icon: 'fa-hourglass-half', cls: 'red',   value: money(outstanding), label: 'Outstanding' },
            { icon: 'fa-percent',       cls: 'orange', value: pct + '%', label: 'Collection %' },
            { icon: 'fa-circle-check',  cls: 'green',  value: paid, label: 'Fully Paid Students' },
            { icon: 'fa-circle-half-stroke', cls: 'orange', value: partial, label: 'Partial Paid' },
            { icon: 'fa-triangle-exclamation', cls: 'red', value: dueS, label: 'Due Students' },
            { icon: 'fa-calendar-day',  cls: 'blue',   value: money(monthColl), label: curMonth + ' Collection' },
            { icon: 'fa-clock',         cls: 'purple', value: money(todayColl), label: "Today's Collection" },
            { icon: 'fa-receipt',       cls: 'blue',   value: txnCount, label: 'Total Transactions' },
            { icon: 'fa-chart-simple',  cls: 'orange', value: money(avg), label: 'Avg / Transaction' }
        ];
        grid.innerHTML = cards.map(function (c) {
            return '<div class="stat-card"><div class="stat-icon ' + c.cls + '"><i class="fas ' + c.icon + '"></i></div>' +
                   '<div><div class="stat-value">' + c.value + '</div><div class="stat-label">' + c.label + '</div></div></div>';
        }).join('');

        // monthly collection report
        var mt = document.getElementById('monthlyReport');
        if (mt) {
            var mrows = monthlyReportData();
            var maxC = Math.max.apply(null, mrows.map(function (r) { return r.collection; }).concat([1]));
            mt.innerHTML = mrows.map(function (r) {
                var w = Math.round(r.collection / maxC * 100);
                return '<tr><td><strong>' + esc(r.month) + '</strong></td>' +
                    '<td style="text-align:right"><strong>' + money(r.collection) + '</strong></td>' +
                    '<td>' + r.txns + '</td>' +
                    '<td>' + r.students + '</td>' +
                    '<td style="text-align:right">' + (r.avg ? money(r.avg) : '\u2014') + '</td>' +
                    '<td style="min-width:150px"><div style="height:9px;background:#eceff1;border-radius:6px;overflow:hidden"><div style="width:' + w + '%;height:100%;background:var(--primary);border-radius:6px"></div></div></td></tr>';
            }).join('');
        }

        // class-wise fee report
        var cf = document.getElementById('classFeeReport');
        if (cf) {
            var crows = classFeeReportData();
            cf.innerHTML = crows.map(function (r) {
                var col = r.pct >= 50 ? '#388e3c' : (r.pct > 0 ? '#f57c00' : '#e53935');
                return '<tr><td><strong>' + esc(r.cls) + '</strong></td>' +
                    '<td>' + r.students + '</td>' +
                    '<td>' + money(r.expected) + '</td>' +
                    '<td style="color:#388e3c"><strong>' + money(r.collected) + '</strong></td>' +
                    '<td style="color:#e53935">' + money(r.outstanding) + '</td>' +
                    '<td><div style="display:flex;align-items:center;gap:8px">' +
                        '<div style="flex:1;height:8px;background:#eceff1;border-radius:6px;overflow:hidden;min-width:60px"><div style="width:' + r.pct + '%;height:100%;background:' + col + '"></div></div>' +
                        '<span style="font-size:12px;font-weight:700;min-width:38px">' + r.pct + '%</span></div></td></tr>';
            }).join('');
        }

        // class-wise strength
        var byClass = {};
        store.students.forEach(function (s) { var c = s['Class'] || '—'; byClass[c] = (byClass[c] || 0) + 1; });
        var cw = document.getElementById('classWise');
        if (cw) {
            var keys = Object.keys(byClass).sort();
            var max = Math.max.apply(null, keys.map(function (k) { return byClass[k]; }).concat([1]));
            var colors = ['#2874f0', '#388e3c', '#f57c00', '#8e24aa', '#e53935', '#00acc1', '#795548', '#607d8b', '#c2185b', '#00897b'];
            cw.innerHTML = keys.map(function (k, i) {
                var p = Math.round(byClass[k] / max * 100);
                return '<div style="margin-bottom:14px">' +
                    '<div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600;margin-bottom:6px"><span>' + esc(k) + '</span><span>' + byClass[k] + ' students</span></div>' +
                    '<div style="height:9px;background:#eceff1;border-radius:6px;overflow:hidden"><div style="width:' + p + '%;height:100%;background:' + colors[i % colors.length] + ';border-radius:6px"></div></div></div>';
            }).join('');
        }
        // fee head-wise collection
        var hcb = document.getElementById('headCollection');
        if (hcb) {
            var hd = headCollectionData();
            hcb.innerHTML = hd.rows.map(function (r) {
                var col = r.pct >= 50 ? '#388e3c' : (r.pct > 0 ? '#f57c00' : '#e53935');
                return '<tr><td><strong>' + esc(r.head) + '</strong>' +
                    (r.mult > 1 ? ' <span style="font-size:11px;color:var(--muted)">\u00d7' + r.mult + '</span>' : '') + '</td>' +
                    '<td><span class="badge blue">' + esc(r.freq) + '</span></td>' +
                    '<td style="text-align:right">' + money(r.expected) + '</td>' +
                    '<td style="text-align:right;color:#388e3c"><strong>' + money(r.collected) + '</strong></td>' +
                    '<td style="text-align:right;color:#e53935">' + money(r.pending) + '</td>' +
                    '<td><div style="display:flex;align-items:center;gap:8px">' +
                        '<div style="flex:1;height:8px;background:#eceff1;border-radius:6px;overflow:hidden;min-width:50px"><div style="width:' + Math.min(100, r.pct) + '%;height:100%;background:' + col + '"></div></div>' +
                        '<span style="font-size:12px;font-weight:700;min-width:34px">' + r.pct + '%</span></div></td></tr>';
            }).join('');

            var ft = document.getElementById('headCollTotals');
            if (ft) {
                ft.innerHTML =
                    '<tr><td colspan="2" style="padding:12px 20px">Total (Fee Heads)</td>' +
                    '<td style="padding:12px 20px;text-align:right">' + money(hd.totalExpected) + '</td>' +
                    '<td style="padding:12px 20px;text-align:right;color:#388e3c">' + money(hd.totalCollected) + '</td>' +
                    '<td style="padding:12px 20px;text-align:right;color:#e53935">' + money(hd.totalPending) + '</td><td></td></tr>' +
                    '<tr><td colspan="2" style="padding:12px 20px">Old Due (Previous Session)</td>' +
                    '<td style="padding:12px 20px;text-align:right">' + money(hd.oldDue) + '</td>' +
                    '<td style="padding:12px 20px;text-align:right">\u2014</td>' +
                    '<td style="padding:12px 20px;text-align:right;color:#e53935">' + money(hd.oldDue) + '</td><td></td></tr>' +
                    '<tr style="border-top:2px solid var(--border)"><td colspan="2" style="padding:12px 20px">Total Payable</td>' +
                    '<td style="padding:12px 20px;text-align:right">' + money(hd.totalPayable) + '</td>' +
                    '<td style="padding:12px 20px;text-align:right;color:#388e3c">' + money(hd.totalCollected) + '</td>' +
                    '<td style="padding:12px 20px;text-align:right"><strong style="color:#e53935">' + money(hd.grandPending) + '</strong></td><td></td></tr>';
            }
            var nt = document.getElementById('headCollNote');
            if (nt) nt.textContent = 'Pending ' + money(hd.grandPending) + ' = Fee Register ke Outstanding se match';
        }
    }

    /* ---------- EDIT MODAL ---------- */
    function fieldInput(f, val) {
        var v = esc(val == null ? '' : val);
        if (f.t === 'select') {
            var opts = (f.opts || []).map(function (o) {
                return '<option value="' + esc(o) + '"' + (String(val) === String(o) ? ' selected' : '') + '>' + (o === '' ? '— Select —' : esc(o)) + '</option>';
            }).join('');
            return '<select class="form-control" data-k="' + esc(f.k) + '">' + opts + '</select>';
        }
        if (f.t === 'textarea') return '<textarea class="form-control" rows="2" data-k="' + esc(f.k) + '">' + v + '</textarea>';
        if (f.t === 'date') {
            var dv = '';
            var s = String(val == null ? '' : val).trim();
            if (/^\d+(\.\d+)?$/.test(s)) {
                var n = parseFloat(s);
                if (n > 20000 && n < 60000) {
                    dv = new Date(Date.UTC(1899, 11, 30) + n * 86400000).toISOString().slice(0, 10);
                }
            } else {
                var m = /^(\d{2})-([A-Za-z]{3})-(\d{4})$/.exec(s);
                if (m) {
                    var mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(m[2]);
                    if (mo > -1) dv = m[3] + '-' + String(mo + 1).padStart(2, '0') + '-' + m[1];
                } else if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
                    dv = s;
                }
            }
            return '<input type="date" class="form-control" data-k="' + esc(f.k) + '" value="' + esc(dv) + '">';
        }
        return '<input type="' + (f.t === 'number' ? 'number' : 'text') + '" class="form-control" data-k="' + esc(f.k) + '" value="' + v + '">';
    }

    function openForm(type, record) {
        var sc = SCHEMAS[type];
        var isNew = !record;
        var body = sc.fields.map(function (f) {
            return '<div class="form-group"><label>' + esc(f.l) + (f.req ? ' *' : '') + '</label>' + fieldInput(f, record ? record[f.k] : '') + '</div>';
        }).join('');

        var html =
            '<div class="modal-overlay active" id="formOverlay" onclick="CRM.closeForm()"></div>' +
            '<div class="modal-box active" id="formBox">' +
                '<div class="modal-head"><h3>' + (isNew ? 'Add ' : 'Edit ') + esc(sc.title) + '</h3>' +
                '<button class="modal-x" onclick="CRM.closeForm()">&times;</button></div>' +
                '<div class="modal-body">' + body + '</div>' +
                '<div class="modal-foot">' +
                    '<button class="btn btn-light" onclick="CRM.closeForm()">Cancel</button>' +
                    '<button class="btn btn-primary" onclick="CRM.save(\'' + type + '\',' + (isNew ? 'true' : 'false') + ')"><i class="fas fa-floppy-disk"></i> Save</button>' +
                '</div></div>';

        var host = document.getElementById('modalHost');
        host.innerHTML = html;
    }

    function closeForm() {
        var host = document.getElementById('modalHost');
        if (host) host.innerHTML = '';
    }

    function save(type, isNew) {
        var sc = SCHEMAS[type];
        var box = document.getElementById('formBox');
        var rec = {};
        var missing = [];
        sc.fields.forEach(function (f) {
            var el = box.querySelector('[data-k="' + f.k + '"]');
            var v = el ? el.value.trim() : '';
            if (f.req && !v) missing.push(f.l);
            if (f.t === 'date' && v) {
                var p = v.split('-');
                var mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                v = p[2] + '-' + mo[parseInt(p[1], 10) - 1] + '-' + p[0];
            }
            rec[f.k] = v;
        });
        if (missing.length) { toast('Required: ' + missing.join(', ')); return; }

        var list = store[type];
        var idx = list.findIndex(function (r) { return String(r[sc.key]) === String(rec[sc.key]); });
        if (isNew && idx > -1) { toast(sc.title + ' ID already exists'); return; }
        if (idx > -1) {
            rec = Object.assign({}, list[idx], rec); // extra fields preserve karo
            list[idx] = rec;
            toast('Updated');
        }
        else { list.push(rec); toast('Added'); }

        saveStore();
        closeForm();
        refresh();
    }

    function edit(type, key) {
        var sc = SCHEMAS[type];
        var rec = store[type].filter(function (r) { return String(r[sc.key]) === String(key); })[0];
        if (rec) openForm(type, rec);
    }

    function del(type, key) {
        var sc = SCHEMAS[type];
        var rec = store[type].filter(function (r) { return String(r[sc.key]) === String(key); })[0];
        if (!rec) return;
        if (!confirm('Delete ' + sc.title + ' "' + key + '" ?')) return;
        store[type] = store[type].filter(function (r) { return String(r[sc.key]) !== String(key); });
        saveStore();
        refresh();
        toast('Deleted');
    }

    function add(type) { openForm(type, null); }

    /* ---------- WHATSAPP FEE DUE ALERT ---------- */
    function feeDueList() {
        return store.feeRegister
            .filter(function (f) { return num(f['Outstanding']) > 0; })
            .sort(function (a, b) { return num(b['Outstanding']) - num(a['Outstanding']); });
    }

    function whatsappFeeDue() {
        const list = feeDueList();
        if (!list.length) { toast('All fees collected — no dues'); return; }
        const cfg = config || {};
        const total = list.reduce(function (a, f) { return a + num(f['Outstanding']); }, 0);
        const topN = num(cfg.dueAlertCount) || 10;
        const top = list.slice(0, topN).map(function (f, i) {
            return (i + 1) + '. ' + f['Student Name'] + ' (' + clsSec(f) + ') \u2014 ' + money(f['Outstanding']);
        }).join('\n');

        const msg = '*' + (cfg['School Name'] || (meta && meta.school) || 'School') + ' \u2014 FEE DUE ALERT*\n' +
            'Date: ' + new Date().toLocaleDateString('en-IN') + '\n\n' +
            top + '\n' +
            (list.length > topN ? '\n...aur ' + (list.length - topN) + ' students\n' : '') +
            '\n*Total Due: ' + money(total) + '*\n' +
            'Total ' + list.length + ' students ki fees baaki hai.\n' +
            'Please follow up. \uD83D\uDE4F';

        const num2 = String(cfg.whatsapp || '').replace(/\D/g, '');
        if (!num2) toast('Settings me WhatsApp number daalein (contact khud chunna padega)');
        window.open('https://wa.me/' + num2 + '?text=' + encodeURIComponent(msg), '_blank');
        toast('WhatsApp khul raha hai...');
    }

    function copyText(txt, okMsg) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(txt).then(function () { toast(okMsg); })
                .catch(function () { fallbackCopy(txt, okMsg); });
        } else { fallbackCopy(txt, okMsg); }
    }
    function fallbackCopy(txt, okMsg) {
        try {
            var ta = document.createElement('textarea');
            ta.value = txt;
            ta.style.position = 'fixed'; ta.style.top = '-1000px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            toast(okMsg);
        } catch (e) { toast('Copy fail \u2014 select the text manually'); }
    }

    function copyFeeDue() {
        const list = feeDueList();
        const topN = num((config || {}).dueAlertCount) || 10;
        const txt = list.slice(0, topN).map(function (f, i) {
            return (i + 1) + '. ' + f['Student Name'] + ' (' + clsSec(f) + ') \u2014 ' + money(f['Outstanding']);
        }).join('\n');
        if (!txt) { toast('No dues'); return; }
        copyText(txt, 'Due list copy ho gayi (' + Math.min(list.length, topN) + ' students)');
    }

    /* ---------- SETTINGS ---------- */
    function renderSettings() {
        const cfg = config || {};
        const el = function (id) { return document.getElementById(id); };
        if (el('cfgSchool')) el('cfgSchool').value = cfg['School Name'] || (meta && meta.school) || '';
        if (el('cfgOwner'))  el('cfgOwner').value  = cfg['Owner'] || '';
        if (el('cfgPhone'))  el('cfgPhone').value  = (meta && meta.mobile) || '';
        if (el('cfgWa'))     el('cfgWa').value     = cfg.whatsapp || '';
        if (el('cfgAddr'))   el('cfgAddr').value   = (meta && meta.address) || '';
        if (el('cfgSession')) el('cfgSession').value = cfg['Academic Session'] || '';
        if (el('cfgDue'))    el('cfgDue').value    = cfg.dueAlertCount || 10;

        const box = el('syncBox');
        if (box) {
            const dueN = feeDueList().length;
            const out = store.feeRegister.reduce(function (a, f) { return a + num(f['Outstanding']); }, 0);
            box.innerHTML =
                '<div style="font-size:13.5px;line-height:2">' +
                    '<div><strong>Total Students:</strong> ' + store.students.length + '</div>' +
                    '<div><strong>Fee Due Students:</strong> ' + dueN + '</div>' +
                    '<div><strong>Total Outstanding:</strong> ' + money(out) + '</div>' +
                    '<div><strong>Session:</strong> ' + esc(cfg['Academic Session'] || '—') + '</div>' +
                    '<div><strong>Data Source:</strong> Excel ERP (crm-data.json)</div>' +
                '</div>';
        }
    }

    function saveSchool() {
        const el = function (id) { return document.getElementById(id); };
        if (el('cfgSchool')) config['School Name'] = el('cfgSchool').value.trim();
        if (el('cfgOwner'))  config['Owner'] = el('cfgOwner').value.trim();
        if (el('cfgPhone') && meta) meta.mobile = el('cfgPhone').value.trim();
        if (el('cfgWa'))     config.whatsapp = el('cfgWa').value.trim();
        if (el('cfgAddr') && meta) meta.address = el('cfgAddr').value.trim();
        if (el('cfgSession')) config['Academic Session'] = el('cfgSession').value.trim();
        if (el('cfgDue'))    config.dueAlertCount = num(el('cfgDue').value) || 10;
        saveStore();
        toast('Settings saved');
        renderShell();
        renderSettings();
    }

    /* ---------- FEE HEADS / MONTHS ---------- */
    var FEE_HEADS = ['Admission Fee','Monthly Fee','Quarterly Exam Fee','Half-Yearly Exam Fee','Annual Exam Fee',
                     'Transport Fee','Computer Fee','Library Fee','Sports Fee','Activity Fee','Fine','Other'];
    var MONTHS = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
    var MONTHS_FULL = ['April','May','June','July','August','September','October','November','December','January','February','March'];
    var PAY_MODES = ['Cash','UPI','Cheque','Bank Transfer','Card','NEFT','RTGS','IMPS'];

    /* In Excel, an empty Section cell becomes "0" — clean it up */
    function normSection(v) {
        var s = String(v == null ? '' : v).trim();
        return (s === '0' || s === '-' || s === 'NA' || s === 'N/A') ? '' : s;
    }
    function clsSec(o) {
        if (!o) return '';
        var c = String(o['Class'] == null ? '' : o['Class']).trim();
        var s = normSection(o['Section']);
        return c + (s ? '-' + s : '');
    }

    function studentByAdm(adm) {
        for (var i = 0; i < store.students.length; i++) {
            if (String(store.students[i]['Admission No']) === String(adm)) return store.students[i];
        }
        return null;
    }
    function feeRowByAdm(adm) {
        for (var i = 0; i < store.feeRegister.length; i++) {
            if (String(store.feeRegister[i]['Admission No']) === String(adm)) return store.feeRegister[i];
        }
        return null;
    }
    function txnsByAdm(adm) {
        return store.feeTransactions.filter(function (t) { return String(t['Admission No']) === String(adm); });
    }
    function duesByAdm(adm) {
        return store.previousDues.filter(function (d) { return String(d['Admission No']) === String(adm); });
    }

    /* ---------- FEE TRANSACTIONS PAGE ---------- */
    var txnPage = 1, TXN_PER = 25, txnQuery = '';
    function renderTransactions() {
        var tbody = document.getElementById('txnBody');
        if (!tbody) return;
        var q = txnQuery.toLowerCase();
        var rows = store.feeTransactions.filter(function (t) {
            if (!q) return true;
            return (t['Receipt No'] + ' ' + t['Student Name'] + ' ' + t['Admission No'] + ' ' +
                    t['Fee Head'] + ' ' + t['Fee Month'] + ' ' + t['Class']).toLowerCase().indexOf(q) > -1;
        });
        tbody.innerHTML = paginate(rows, txnPage, TXN_PER).map(function (t) {
            var disc = num(t['Mgmt Disc.']) + num(t['Renewal Disc.']);
            return '<tr>' +
                '<td><strong>' + esc(t['Receipt No']) + '</strong></td>' +
                '<td>' + esc(excelDate(t['Payment Date'])) + '</td>' +
                '<td>' + esc(t['Admission No']) + '</td>' +
                '<td>' + esc(t['Student Name']) + '</td>' +
                '<td>' + esc(t['Class']) + (t['Section'] ? '-' + esc(t['Section']) : '') + '</td>' +
                '<td>' + esc(t['Fee Month']) + '</td>' +
                '<td>' + esc(t['Fee Head']) + '</td>' +
                '<td>' + money(t['Standard Fee']) + '</td>' +
                '<td>' + money(t['Amount Received']) + '</td>' +
                '<td>' + money(disc) + '</td>' +
                '<td><strong>' + money(t['Net Amount']) + '</strong></td>' +
                '<td>' + badge(t['Transaction Status']) + '</td>' +
                '<td style="white-space:nowrap">' +
                    '<button class="btn btn-icon" title="Receipt Print" onclick="CRM.printReceipt(\'' + esc(t['Receipt No']) + '\')"><i class="fas fa-print"></i></button> ' +
                    '<button class="btn btn-icon" title="Edit / Delete Receipt" onclick="CRM.openCollect(\'' + esc(t['Receipt No']) + '\')"><i class="fas fa-pen"></i></button> ' +
                    '<button class="btn btn-icon" title="Student Ledger" onclick="CRM.openLedger(\'' + esc(t['Admission No']) + '\')"><i class="fas fa-eye"></i></button>' +
                '</td></tr>';
        }).join('') || '<tr><td colspan="13"><div class="empty"><i class="fas fa-receipt"></i>No transactions</div></td></tr>';

        var pg = document.getElementById('txnPager');
        if (pg) pg.innerHTML = pager(rows.length, txnPage, TXN_PER, 'CRM.txnPage');
        var cnt = document.getElementById('txnCount');
        if (cnt) cnt.textContent = rows.length + ' receipts';

        var tot = document.getElementById('txnTotal');
        if (tot) tot.textContent = money(store.feeTransactions.reduce(function (a, t) { return a + num(t['Net Amount']); }, 0));
    }

    /* ---------- COLLECT FEE (receipt entry / edit / delete) ---------- */
    function nextReceiptNo() {
        var maxN = 0;
        store.feeTransactions.forEach(function (t) {
            var m = /(\d+)\s*$/.exec(String(t['Receipt No'] || ''));
            if (m) maxN = Math.max(maxN, parseInt(m[1], 10));
        });
        return 'RCP' + String(maxN + 1).padStart(6, '0');
    }
    function nextTxnId() {
        var maxN = 0;
        store.feeTransactions.forEach(function (t) { maxN = Math.max(maxN, num(t['Transaction ID'])); });
        return maxN + 1;
    }
    function todaySerial() {
        var d = new Date();
        return Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(1899, 11, 30)) / 86400000);
    }
    function studentLabel(s) {
        return s['Admission No'] + ' \u2014 ' + s['Student Name'] + ' (' + (s['Class'] || '') + ')';
    }
    function studentFromLabel(label) {
        var s = String(label || '').trim();
        if (!s) return null;
        var i;
        for (i = 0; i < store.students.length; i++) {
            if (studentLabel(store.students[i]) === s) return store.students[i];
        }
        var m = /^(\d+)/.exec(s);
        if (m) { var byAdm = studentByAdm(m[1]); if (byAdm) return byAdm; }
        for (i = 0; i < store.students.length; i++) {
            if (String(store.students[i]['Student Name']).toLowerCase() === s.toLowerCase()) return store.students[i];
        }
        return null;
    }
    /* Recompute Fee Register Collection / Outstanding / Status from transactions.
       Formula: Outstanding = Expected + Old Due - Collection  (Excel se verified) */
    function reapplyFeeStatus(adm) {
        var f = feeRowByAdm(adm);
        if (!f) return;
        var coll = 0;
        store.feeTransactions.forEach(function (t) {
            if (String(t['Admission No']) === String(adm)) coll += num(t['Net Amount']);
        });
        var oblig = num(f['Expected Fee']) + num(f['Old Due']);
        f['Total Collection'] = coll > 0 ? coll : '';
        f['Outstanding'] = Math.max(0, oblig - coll);
        f['Fee Status'] = coll <= 0 ? 'Unpaid' : (coll >= oblig ? 'Paid' : 'Partial');
        // month-wise (Apr..Mar) columns bhi transactions se sync rakho
        MONTHS.forEach(function (mo) {
            var sum = 0;
            store.feeTransactions.forEach(function (t) {
                if (String(t['Admission No']) === String(adm) && monthKey(t['Fee Month']) === mo) sum += num(t['Net Amount']);
            });
            f[mo] = sum > 0 ? sum : '';
        });
    }

    function cfVal(id) { var el = document.getElementById(id); return el ? el.value : ''; }
    function cfSet(id, v) { var el = document.getElementById(id); if (el) el.value = v; }

    /* Standard - Discount se Amount auto; Net = Amount Received */
    function cfCalc(refill) {
        var std = num(cfVal('cfStd'));
        var mgmt = num(cfVal('cfMgmt'));
        var renew = num(cfVal('cfRenew'));
        var auto = std - mgmt - renew;
        if (refill) cfSet('cfAmt', auto);
        var amt = num(cfVal('cfAmt'));
        var out = document.getElementById('cfNetOut');
        if (out) out.textContent = money(amt);
        var hint = document.getElementById('cfHint');
        if (hint) {
            hint.innerHTML = (Math.abs(auto - amt) < 0.5)
                ? 'Auto: Standard \u2212 Discount = ' + money(auto)
                : 'Manual amount \u2014 auto value ' + money(auto);
        }
    }
    /* Student chuna -> info + us head ka standard fee bharo */
    function cfPick() {
        var s = studentFromLabel(cfVal('cfStudent'));
        var info = document.getElementById('cfStudentInfo');
        if (!s) {
            if (info) info.innerHTML = '<span style="color:#e53935">Pick from the student list (\u2014 name or Adm No)</span>';
            return;
        }
        var f = feeRowByAdm(s['Admission No']) || {};
        if (info) {
            info.innerHTML = '<strong>' + esc(s['Student Name']) + '</strong> \u00b7 ' + esc(s['Class'] || '') +
                (s['Section'] ? '-' + esc(s['Section']) : '') + ' \u00b7 Adm ' + esc(s['Admission No']) +
                ' \u00b7 Outstanding <strong style="color:#e53935">' + money(f['Outstanding']) + '</strong>' +
                (num(f['Old Due']) ? ' \u00b7 Old Due ' + money(f['Old Due']) : '');
        }
        cfHeadChange();
    }
    function cfHeadChange() {
        var s = studentFromLabel(cfVal('cfStudent'));
        if (!s) return;
        var f = feeRowByAdm(s['Admission No']) || {};
        cfSet('cfStd', num(f[cfVal('cfHead')]));
        cfCalc(true);
    }

    function openCollect(receiptNo) {
        var ed = null;
        if (receiptNo) {
            ed = store.feeTransactions.filter(function (t) { return String(t['Receipt No']) === String(receiptNo); })[0];
            if (!ed) { toast('Receipt not found'); return; }
        }
        var students = store.students.slice().sort(function (a, b) { return num(a['Admission No']) - num(b['Admission No']); });
        var dl = students.map(function (s) { return '<option value="' + esc(studentLabel(s)) + '"></option>'; }).join('');
        var headOpts = FEE_HEADS.map(function (h) { return '<option value="' + esc(h) + '">' + esc(h) + '</option>'; }).join('');
        var monthOpts = MONTHS_FULL.map(function (mo) { return '<option value="' + esc(mo) + '">' + esc(mo) + '</option>'; }).join('');
        var modeOpts = PAY_MODES.map(function (mo) { return '<option value="' + esc(mo) + '">' + esc(mo) + '</option>'; }).join('');

        var stLabel = '';
        if (ed) {
            var s0 = studentByAdm(ed['Admission No']);
            stLabel = s0 ? studentLabel(s0)
                         : (ed['Admission No'] + ' \u2014 ' + ed['Student Name'] + ' (' + (ed['Class'] || '') + ')');
        }
        var recNo = ed ? ed['Receipt No'] : nextReceiptNo();

        var html =
            '<div class="modal-overlay active" onclick="CRM.closeForm()"></div>' +
            '<div class="modal-box wide active" id="formBox">' +
                '<div class="modal-head"><h3><i class="fas fa-hand-holding-dollar" style="color:var(--primary)"></i> ' +
                    (ed ? 'Receipt ' + esc(recNo) : 'Collect Fee') + '</h3>' +
                    '<button class="modal-x" onclick="CRM.closeForm()">&times;</button></div>' +
                '<div class="modal-body">' +
                    '<div class="form-group fg-full"><label>Student *</label>' +
                        '<input type="text" class="form-control" id="cfStudent" list="cfStudentList" autocomplete="off" ' +
                        'placeholder="Type Adm No or name..." value="' + esc(stLabel) + '" oninput="CRM.cfPick()">' +
                        '<datalist id="cfStudentList">' + dl + '</datalist>' +
                        '<div id="cfStudentInfo" class="cf-info"></div></div>' +
                    '<div class="form-group"><label>Fee Head *</label><select class="form-control" id="cfHead" onchange="CRM.cfHeadChange()">' + headOpts + '</select></div>' +
                    '<div class="form-group"><label>Fee Month</label><select class="form-control" id="cfMonth">' + monthOpts + '</select></div>' +
                    '<div class="form-group"><label>Standard Fee</label><input type="number" class="form-control" id="cfStd" value="0" oninput="CRM.cfCalc(true)"></div>' +
                    '<div class="form-group"><label>Mgmt. Discount</label><input type="number" class="form-control" id="cfMgmt" value="0" oninput="CRM.cfCalc(true)"></div>' +
                    '<div class="form-group"><label>Renewal Discount</label><input type="number" class="form-control" id="cfRenew" value="0" oninput="CRM.cfCalc(true)"></div>' +
                    '<div class="form-group"><label>Amount Received *</label><input type="number" class="form-control" id="cfAmt" value="0" oninput="CRM.cfCalc(false)"></div>' +
                    '<div class="form-group"><label>Payment Mode</label><select class="form-control" id="cfMode">' + modeOpts + '</select></div>' +
                    '<div class="form-group"><label>Reference No.</label><input type="text" class="form-control" id="cfRef" placeholder="UPI / Cheque no."></div>' +
                    '<div class="form-group fg-full"><label>Remarks</label><input type="text" class="form-control" id="cfRemarks"></div>' +
                    '<div class="form-group fg-full"><div class="cf-net">' +
                        '<span>Net Amount <em>(receipt me yehi chhapega)</em></span>' +
                        '<strong id="cfNetOut">' + money(0) + '</strong></div>' +
                        '<div id="cfHint" class="cf-hint"></div></div>' +
                '</div>' +
                '<div class="modal-foot">' +
                    (ed ? '<button class="btn btn-light btn-danger-txt" onclick="CRM.delReceipt(\'' + esc(recNo) + '\')"><i class="fas fa-trash"></i> Delete</button>' : '') +
                    '<button class="btn btn-light" onclick="CRM.closeForm()">Cancel</button>' +
                    '<button class="btn btn-primary" onclick="CRM.cfSave(' + (ed ? '\'' + esc(recNo) + '\'' : 'null') + ')">' +
                        '<i class="fas fa-floppy-disk"></i> ' + (ed ? 'Update' : 'Save &amp; Print') + '</button>' +
                '</div></div>';

        document.getElementById('modalHost').innerHTML = html;

        if (ed) {
            cfSet('cfHead', ed['Fee Head'] || FEE_HEADS[0]);
            cfSet('cfMonth', ed['Fee Month'] || MONTHS_FULL[0]);
            cfSet('cfStd', num(ed['Standard Fee']));
            cfSet('cfMgmt', num(ed['Mgmt Disc.']));
            cfSet('cfRenew', num(ed['Renewal Disc.']));
            cfSet('cfAmt', num(ed['Amount Received']));
            cfSet('cfMode', ed['Payment Mode'] || 'Cash');
            cfSet('cfRef', ed['Reference No.'] || '');
            cfSet('cfRemarks', ed['Remarks'] || '');
            cfPick();
            cfCalc(false);
        } else {
            cfSet('cfMonth', MONTHS_FULL[(new Date().getMonth() + 9) % 12]);  // session starts in April
            cfCalc(false);
        }
    }

    function cfSave(receiptNo) {
        var s = studentFromLabel(cfVal('cfStudent'));
        if (!s) { toast('Pick from the student list'); return; }
        var head = cfVal('cfHead');
        var amt = num(cfVal('cfAmt'));
        if (!head) { toast('Fee Head chuno'); return; }
        if (amt <= 0) { toast('Amount 0 se zyada hona chahiye'); return; }

        var ed = null;
        if (receiptNo) {
            ed = store.feeTransactions.filter(function (t) { return String(t['Receipt No']) === String(receiptNo); })[0] || null;
        }
        var recNo = ed ? ed['Receipt No'] : nextReceiptNo();
        var u = getUser() || {};
        var mgmt = num(cfVal('cfMgmt'));
        var renew = num(cfVal('cfRenew'));
        var month = cfVal('cfMonth');

        var rec = Object.assign({}, ed || {}, {
            'Transaction ID': ed ? ed['Transaction ID'] : nextTxnId(),
            'Receipt No': recNo,
            'Academic Session': (config && config['Academic Session']) || (ed && ed['Academic Session']) || '',
            'Admission No': s['Admission No'],
            'Student Name': s['Student Name'],
            'Class': s['Class'] || '',
            'Section': s['Section'] || '',
            'Payment Date': ed ? ed['Payment Date'] : todaySerial(),
            'Fee Month': month,
            'Fee Period': month,
            'Payment Against': (ed && ed['Payment Against']) || 'Current Fee',
            'Fee Head': head,
            'Standard Fee': num(cfVal('cfStd')),
            'Amount Received': amt,
            'Mgmt Disc.': mgmt || '',
            'Renewal Disc.': renew || '',
            'Net Amount': amt,
            'Transaction Status': 'Paid',
            'Collected By': u.name || '',
            'Payment Mode': cfVal('cfMode'),
            'Reference No.': cfVal('cfRef'),
            'Receipt Batch': ed ? (ed['Receipt Batch'] || recNo) : recNo,
            'Remarks': cfVal('cfRemarks')
        });

        var oldAdm = ed ? ed['Admission No'] : null;
        if (ed) {
            var idx = store.feeTransactions.indexOf(ed);
            if (idx > -1) store.feeTransactions[idx] = rec; else store.feeTransactions.push(rec);
        } else {
            store.feeTransactions.push(rec);
        }
        reapplyFeeStatus(s['Admission No']);
        if (oldAdm && String(oldAdm) !== String(s['Admission No'])) reapplyFeeStatus(oldAdm);

        saveStore();
        closeForm();
        refresh();
        toast(ed ? 'Receipt update ho gaya' : 'Receipt ' + recNo + ' ban gaya \u2014 ' + money(amt));
        printReceipt(recNo);
    }

    function delReceipt(receiptNo) {
        var t = store.feeTransactions.filter(function (x) { return String(x['Receipt No']) === String(receiptNo); })[0];
        if (!t) { toast('Receipt not found'); return; }
        if (!confirm('Delete receipt ' + receiptNo + '?\n\n' + t['Student Name'] + ' \u2014 ' + t['Fee Head'] + ' \u2014 ' + money(t['Net Amount']))) return;
        store.feeTransactions = store.feeTransactions.filter(function (x) { return String(x['Receipt No']) !== String(receiptNo); });
        reapplyFeeStatus(t['Admission No']);
        saveStore();
        closeForm();
        refresh();
        toast('Receipt delete ho gaya');
    }

    /* ---------- PREVIOUS DUES PAGE ---------- */
    function renderDues() {
        var tbody = document.getElementById('duesBody');
        if (!tbody) return;
        tbody.innerHTML = store.previousDues.map(function (d) {
            return '<tr>' +
                '<td><strong>' + esc(d['Admission No']) + '</strong></td>' +
                '<td>' + esc(d['Student Name']) + '</td>' +
                '<td>' + esc(d['Session']) + '</td>' +
                '<td>' + money(d['Opening Due']) + '</td>' +
                '<td>' + money(d['Current Year Due']) + '</td>' +
                '<td>' + money(d['Received']) + '</td>' +
                '<td><strong>' + money(d['Balance']) + '</strong></td>' +
                '<td>' + esc(excelDate(d['Last Payment Date'])) + '</td>' +
                '<td>' + esc(d['Remarks']) + '</td>' +
                '<td style="white-space:nowrap">' +
                    '<button class="btn btn-icon" title="Student Ledger" onclick="CRM.openLedger(\'' + esc(d['Admission No']) + '\')"><i class="fas fa-eye"></i></button>' +
                    '<a class="btn btn-icon" target="_blank" rel="noopener" title="WhatsApp reminder" href="' + (function () {
                        var st = studentByAdm(d['Admission No']) || {};
                        var mob = st['Mobile'] || '';
                        var msg = 'Hello, ' + (d['Student Name'] || '') + ' has previous dues of ' + money(d['Balance']) + ' pending. Please pay soon. — Apna School';
                        return mob ? 'https://wa.me/91' + String(mob).replace(/[^0-9]/g, '').replace(/^91/, '') + '?text=' + encodeURIComponent(msg) : '#';
                    })() + '"><i class="fab fa-whatsapp" style="color:#25D366"></i></a>' +
                '</td></tr>';
        }).join('') || '<tr><td colspan="10"><div class="empty"><i class="fas fa-clock-rotate-left"></i>No previous dues</div></td></tr>';

        var cnt = document.getElementById('duesCount');
        if (cnt) cnt.textContent = store.previousDues.length + ' records';
        var tot = document.getElementById('duesTotal');
        if (tot) tot.textContent = money(store.previousDues.reduce(function (a, d) { return a + num(d['Balance']); }, 0));
    }

    /* ---------- STUDENT LEDGER MODAL ---------- */
    function openLedger(adm) {
        var f = feeRowByAdm(adm);
        var st = studentByAdm(adm) || {};
        if (!f) { toast('No fee record found for this student'); return; }
        var txns = txnsByAdm(adm);
        var dues = duesByAdm(adm);

        var info =
            '<div class="lg-info">' +
                '<div><span class="k">Admission No</span><span class="v">' + esc(f['Admission No']) + '</span></div>' +
                '<div><span class="k">Student Name</span><span class="v">' + esc(f['Student Name']) + '</span></div>' +
                '<div><span class="k">Father Name</span><span class="v">' + esc(f['Father Name']) + '</span></div>' +
                '<div><span class="k">Class</span><span class="v">' + esc(clsSec(f)) + '</span></div>' +
                '<div><span class="k">Mobile</span><span class="v">' + esc(st['Mobile'] || '—') + '</span></div>' +
                '<div><span class="k">Route</span><span class="v">' + esc((f['Route'] && f['Route'] !== '0') ? f['Route'] : '—') + '</span></div>' +
                '<div><span class="k">Session</span><span class="v">' + esc((config && config['Academic Session']) || '—') + '</span></div>' +
                '<div><span class="k">Status</span><span class="v">' + badge(f['Fee Status']) + '</span></div>' +
            '</div>';

        var heads = FEE_HEADS.map(function (h) {
            return '<tr><td>' + esc(h) + '</td><td style="text-align:right">' + money(f[h]) + '</td></tr>';
        }).join('');

        var months = MONTHS.map(function (mo) {
            var paid = txns.filter(function (t) { return monthKey(t['Fee Month']) === mo; })
                           .reduce(function (a, t) { return a + num(t['Net Amount']); }, 0);
            if (!paid) paid = num(f[mo]);   // fallback: Excel register ka month column
            return '<tr><td>' + esc(mo) + '</td><td style="text-align:right">' + money(paid) + '</td></tr>';
        }).join('');

        var txnRows = txns.length ? txns.map(function (t) {
            var disc = num(t['Mgmt Disc.']) + num(t['Renewal Disc.']);
            return '<tr>' +
                '<td><strong>' + esc(t['Receipt No']) + '</strong></td>' +
                '<td>' + esc(excelDate(t['Payment Date'])) + '</td>' +
                '<td>' + esc(t['Fee Month']) + '</td>' +
                '<td>' + esc(t['Fee Head']) + '</td>' +
                '<td style="text-align:right">' + money(t['Amount Received']) + '</td>' +
                '<td style="text-align:right">' + money(disc) + '</td>' +
                '<td style="text-align:right"><strong>' + money(t['Net Amount']) + '</strong></td>' +
                '<td><button class="btn btn-icon" title="Receipt Print" onclick="CRM.printReceipt(\'' + esc(t['Receipt No']) + '\')"><i class="fas fa-print"></i></button></td>' +
            '</tr>';
        }).join('') : '<tr><td colspan="8" style="text-align:center;color:#888">No transactions</td></tr>';

        var dueRows = dues.length ? dues.map(function (d) {
            return '<tr><td>' + esc(d['Session']) + '</td><td style="text-align:right">' + money(d['Opening Due']) + '</td>' +
                   '<td style="text-align:right">' + money(d['Current Year Due']) + '</td>' +
                   '<td style="text-align:right">' + money(d['Received']) + '</td>' +
                   '<td style="text-align:right"><strong>' + money(d['Balance']) + '</strong></td></tr>';
        }).join('') : '<tr><td colspan="5" style="text-align:center;color:#888">No previous dues</td></tr>';

        var totals =
            '<div class="lg-totals">' +
                '<div><span class="k">Total Expected Fee</span><span class="v">' + money(f['Expected Fee']) + '</span></div>' +
                '<div><span class="k">Old Due</span><span class="v">' + money(f['Old Due']) + '</span></div>' +
                '<div><span class="k">Total Collection</span><span class="v" style="color:#388e3c">' + money(f['Total Collection']) + '</span></div>' +
                '<div><span class="k">Outstanding</span><span class="v" style="color:#e53935">' + money(f['Outstanding']) + '</span></div>' +
            '</div>';

        var html =
            '<div class="modal-overlay active" id="ledgerOverlay" onclick="CRM.closeLedger()"></div>' +
            '<div class="modal-box wide active" id="ledgerBox">' +
                '<div class="modal-head"><h3><i class="fas fa-file-invoice-dollar" style="color:var(--primary)"></i> Student Ledger — ' + esc(f['Student Name']) + '</h3>' +
                '<button class="modal-x" onclick="CRM.closeLedger()">&times;</button></div>' +
                '<div class="modal-body plain">' +
                    info +
                    '<div class="lg-grid">' +
                        '<div><div class="lg-h">Fee Heads (Standard)</div><table class="lg-t"><tbody>' + heads + '</tbody></table></div>' +
                        '<div><div class="lg-h">Month-wise Paid</div><table class="lg-t"><tbody>' + months + '</tbody></table></div>' +
                    '</div>' +
                    '<div class="lg-h">Receipts / Transactions</div>' +
                    '<div class="table-wrap"><table class="lg-t"><thead><tr><th>Receipt No</th><th>Date</th><th>Month</th><th>Fee Head</th><th style="text-align:right">Amount</th><th style="text-align:right">Discount</th><th style="text-align:right">Net</th><th></th></tr></thead><tbody>' + txnRows + '</tbody></table></div>' +
                    '<div class="lg-h">Previous Session Dues</div>' +
                    '<div class="table-wrap"><table class="lg-t"><thead><tr><th>Session</th><th style="text-align:right">Opening Due</th><th style="text-align:right">Current Yr Due</th><th style="text-align:right">Received</th><th style="text-align:right">Balance</th></tr></thead><tbody>' + dueRows + '</tbody></table></div>' +
                    totals +
                '</div>' +
                '<div class="modal-foot">' +
                    '<button class="btn btn-light" onclick="CRM.closeLedger()">Close</button>' +
                    '<button class="btn btn-primary" onclick="CRM.printLedger(\'' + esc(f['Admission No']) + '\')"><i class="fas fa-print"></i> Print Ledger</button>' +
                '</div></div>';

        document.getElementById('modalHost').innerHTML = html;
    }

    function closeLedger() {
        var host = document.getElementById('modalHost');
        if (host) host.innerHTML = '';
    }

    /* ---------- PRINT (new window) ---------- */
    function openPrintWindow(title, bodyHtml) {
        var w = window.open('', '_blank', 'width=850,height=950');
        if (!w) { toast('Popup blocked — allow popups in the browser'); return; }
        w.document.open();
        w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + esc(title) + '</title>' +
            '<style>' +
            '*{margin:0;padding:0;box-sizing:border-box}' +
            'body{font-family:Arial,Helvetica,sans-serif;color:#111;padding:22px;font-size:12.5px}' +
            '.r-head{text-align:center;border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:12px}' +
            '.r-head h1{font-size:19px;letter-spacing:.3px}' +
            '.r-head p{font-size:11.5px;color:#444;margin-top:3px}' +
            '.r-title{text-align:center;font-size:15px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:12px 0;background:#eee;padding:6px}' +
            'table.r-info{width:100%;border-collapse:collapse;margin-bottom:12px}' +
            'table.r-info td{padding:3px 6px;font-size:12px;vertical-align:top}' +
            'table.r-info td.k{color:#555;width:115px}' +
            'table.rt{width:100%;border-collapse:collapse;margin-bottom:12px}' +
            'table.rt th,table.rt td{border:1px solid #999;padding:6px 8px;font-size:12px;text-align:left}' +
            'table.rt th{background:#f0f0f0}' +
            '.rt-num{text-align:right}' +
            'table.r-tot{width:100%;border-collapse:collapse;margin-bottom:12px}' +
            'table.r-tot td{padding:5px 8px;font-size:12.5px;border-bottom:1px dashed #bbb}' +
            'table.r-tot td.n{text-align:right;font-weight:700}' +
            '.r-sign{display:flex;justify-content:space-between;margin-top:34px}' +
            '.r-sign div{border-top:1px solid #333;padding-top:5px;width:180px;text-align:center;font-size:11.5px}' +
            '.r-note{text-align:center;font-size:10.5px;color:#666;margin-top:20px}' +
            '.lg-sec{font-size:13px;font-weight:700;margin:14px 0 6px;border-bottom:1px solid #ccc;padding-bottom:4px}' +
            '@media print{body{padding:0}}' +
            '</style></head><body>' + bodyHtml +
            '<scr' + 'ipt>window.onload=function(){setTimeout(function(){window.print();},250);};</scr' + 'ipt>' +
            '</body></html>');
        w.document.close();
    }

    function receiptHTML(tx) {
        var st = studentByAdm(tx['Admission No']) || {};
        var m = meta || {};
        var disc = num(tx['Mgmt Disc.']) + num(tx['Renewal Disc.']);
        var body =
            '<div class="r-head"><h1>' + esc(m.school || 'School') + '</h1>' +
            '<p>' + esc(m.address || '') + '</p>' +
            '<p>Mobile: ' + esc(m.mobile || '') + '</p></div>' +
            '<div class="r-title">Fee Receipt</div>' +
            '<table class="r-info">' +
                '<tr><td class="k">Receipt No.</td><td><strong>' + esc(tx['Receipt No']) + '</strong></td>' +
                    '<td class="k">Session</td><td>' + esc(tx['Academic Session'] || (config && config['Academic Session']) || '') + '</td></tr>' +
                '<tr><td class="k">Admission No.</td><td>' + esc(tx['Admission No']) + '</td>' +
                    '<td class="k">Class</td><td>' + esc(tx['Class']) + (tx['Section'] ? '-' + esc(tx['Section']) : '') + '</td></tr>' +
                '<tr><td class="k">Student Name</td><td><strong>' + esc(tx['Student Name']) + '</strong></td>' +
                    '<td class="k">Roll No.</td><td>' + esc(st['Roll No'] || '\u2014') + '</td></tr>' +
                '<tr><td class="k">Father Name</td><td>' + esc(st['Father Name'] || '\u2014') + '</td>' +
                    '<td class="k">Mobile No.</td><td>' + esc(st['Mobile'] || '\u2014') + '</td></tr>' +
                '<tr><td class="k">Fee Month</td><td>' + esc(tx['Fee Month']) + '</td>' +
                    '<td class="k">Payment Mode</td><td>' + esc(tx['Payment Mode'] || 'Cash') + '</td></tr>' +
                '<tr><td class="k">Address</td><td colspan="3">' + esc(st['Address'] || '\u2014') + '</td></tr>' +
            '</table>' +
            '<table class="rt"><thead><tr><th style="width:50px">Sr. No.</th><th>Particular</th><th class="rt-num" style="width:140px">Amount</th></tr></thead>' +
            '<tbody><tr><td>1</td><td>' + esc(tx['Fee Head']) + '</td><td class="rt-num">' + money(tx['Standard Fee']) + '</td></tr></tbody></table>' +
            '<table class="r-tot">' +
                '<tr><td>Received Amount</td><td class="n">' + money(tx['Amount Received']) + '</td></tr>' +
                '<tr><td>Late Fee</td><td class="n">' + money(tx['Late Fee']) + '</td></tr>' +
                '<tr><td>Discount</td><td class="n">- ' + money(disc) + '</td></tr>' +
                '<tr><td><strong>Net Amount</strong></td><td class="n">' + money(tx['Net Amount']) + '</td></tr>' +
                '<tr><td><strong>Today\'s Total Collection</strong></td><td class="n">' + money(tx['Net Amount']) + '</td></tr>' +
            '</table>' +
            '<p style="font-size:12px;margin:10px 0">Received with thanks from <strong>Mr./Ms. ' + esc(tx['Student Name']) + '</strong>' +
                ' towards the fee for the month of <strong>' + esc(tx['Fee Month']) + '</strong>.</p>' +
            '<div class="r-sign"><div>Parent Signature</div><div>Cashier</div></div>' +
            '<p class="r-note">This is a computer generated receipt. No signature is required.</p>';
        return body;
    }

    function printReceipt(receiptNo) {
        var tx = store.feeTransactions.filter(function (t) { return String(t['Receipt No']) === String(receiptNo); })[0];
        if (!tx) { toast('Receipt not found'); return; }
        openPrintWindow('Receipt ' + receiptNo, receiptHTML(tx));
        toast('Receipt print ho raha hai...');
    }

    function ledgerHTML(adm) {
        var f = feeRowByAdm(adm), st = studentByAdm(adm) || {};
        if (!f) return '<p>Student ledger not found</p>';
        var txns = txnsByAdm(adm), dues = duesByAdm(adm);
        var m = meta || {};
        var headRows = FEE_HEADS.map(function (h) {
            return '<tr><td>' + esc(h) + '</td><td class="rt-num">' + money(f[h]) + '</td></tr>';
        }).join('');
        var monthRows = MONTHS.map(function (mo) {
            return '<tr><td>' + esc(mo) + '</td><td class="rt-num">' + money(f[mo]) + '</td></tr>';
        }).join('');
        var txnRows = txns.length ? txns.map(function (t) {
            return '<tr><td>' + esc(t['Receipt No']) + '</td><td>' + esc(excelDate(t['Payment Date'])) + '</td><td>' + esc(t['Fee Month']) +
                '</td><td>' + esc(t['Fee Head']) + '</td><td>' + esc(t['Payment Mode'] || '') + '</td><td class="rt-num">' + money(t['Amount Received']) +
                '</td><td class="rt-num">' + money(t['Net Amount']) + '</td></tr>';
        }).join('') : '<tr><td colspan="7" style="text-align:center">No transactions</td></tr>';
        var dueRows = dues.length ? dues.map(function (d) {
            return '<tr><td>' + esc(d['Session']) + '</td><td class="rt-num">' + money(d['Opening Due']) + '</td><td class="rt-num">' +
                money(d['Current Year Due']) + '</td><td class="rt-num">' + money(d['Received']) + '</td><td class="rt-num">' + money(d['Balance']) + '</td></tr>';
        }).join('') : '<tr><td colspan="5" style="text-align:center">No previous dues</td></tr>';

        return '<div class="r-head"><h1>' + esc(m.school || 'School') + '</h1>' +
            '<p>' + esc(m.address || '') + '</p><p>Mobile: ' + esc(m.mobile || '') + '</p></div>' +
            '<div class="r-title">Student Ledger</div>' +
            '<table class="r-info">' +
                '<tr><td class="k">Admission No.</td><td><strong>' + esc(f['Admission No']) + '</strong></td><td class="k">Class</td><td>' + esc(clsSec(f)) + '</td></tr>' +
                '<tr><td class="k">Student Name</td><td>' + esc(f['Student Name']) + '</td><td class="k">Roll No.</td><td>' + esc(st['Roll No'] || '\u2014') + '</td></tr>' +
                '<tr><td class="k">Father Name</td><td>' + esc(f['Father Name']) + '</td><td class="k">Mobile</td><td>' + esc(st['Mobile'] || '\u2014') + '</td></tr>' +
                '<tr><td class="k">Session</td><td>' + esc((config && config['Academic Session']) || '') + '</td><td class="k">Fee Status</td><td>' + esc(f['Fee Status']) + '</td></tr>' +
                '<tr><td class="k">Address</td><td colspan="3">' + esc(st['Address'] || '\u2014') + '</td></tr>' +
            '</table>' +
            '<div class="lg-sec">Fee Heads (Standard)</div>' +
            '<table class="rt"><tbody>' + headRows + '</tbody></table>' +
            '<div class="lg-sec">Month-wise Paid</div>' +
            '<table class="rt"><tbody>' + monthRows + '</tbody></table>' +
            '<div class="lg-sec">Receipts / Transactions</div>' +
            '<table class="rt"><thead><tr><th>Receipt No</th><th>Date</th><th>Month</th><th>Fee Head</th><th>Mode</th><th class="rt-num">Amount</th><th class="rt-num">Net</th></tr></thead><tbody>' + txnRows + '</tbody></table>' +
            '<div class="lg-sec">Previous Session Dues</div>' +
            '<table class="rt"><thead><tr><th>Session</th><th class="rt-num">Opening Due</th><th class="rt-num">Current Yr Due</th><th class="rt-num">Received</th><th class="rt-num">Balance</th></tr></thead><tbody>' + dueRows + '</tbody></table>' +
            '<table class="r-tot" style="margin-top:14px">' +
                '<tr><td>Total Expected Fee</td><td class="n">' + money(f['Expected Fee']) + '</td></tr>' +
                '<tr><td>Old Due</td><td class="n">' + money(f['Old Due']) + '</td></tr>' +
                '<tr><td>Total Collection</td><td class="n">' + money(f['Total Collection']) + '</td></tr>' +
                '<tr><td>Outstanding Due</td><td class="n">' + money(f['Outstanding']) + '</td></tr>' +
            '</table>' +
            '<p class="r-note">Computer generated student ledger \u2014 ' + esc(m.school || '') + '</p>';
    }

    function printLedger(adm) {
        var html = ledgerHTML(adm);
        var st = studentByAdm(adm) || {};
        openPrintWindow('Ledger ' + (st['Student Name'] || adm), html);
        toast('Ledger print ho raha hai...');
    }

    function feeStructureHTML() {
        if (!feeStruct || !feeStruct.classes) return '';
        var m = meta || {};
        var classes = feeStruct.classes;
        var body =
            '<div class="r-head"><h1>' + esc(m.school || 'School') + '</h1>' +
            '<p>' + esc(m.address || '') + '</p>' +
            '<p>Mobile: ' + esc(m.mobile || '') + '</p></div>' +
            '<div class="r-title">Fee Structure</div>' +
            '<table class="r-info"><tr><td class="k">Academic Session</td><td><strong>' + esc(feeStruct.session || '\u2014') + '</strong></td>' +
            '<td class="k">Total Classes</td><td>' + classes.length + '</td></tr></table>' +
            '<div class="lg-sec">Class-wise Fee Chart</div>' +
            '<table class="rt"><thead><tr><th>Class</th><th class="rt-num">Admission</th><th class="rt-num">Monthly</th>' +
            '<th class="rt-num">Half-Yearly</th><th class="rt-num">Annual</th><th class="rt-num">Computer</th>' +
            '<th class="rt-num">Session (Std)</th><th class="rt-num">Session (Final)</th></tr></thead><tbody>';

        classes.forEach(function (c) {
            var adm = fsHead(c.class, 'Admission Fee');
            var mon = fsHead(c.class, 'Monthly Fee');
            var hy  = fsHead(c.class, 'Half-Yearly Exam Fee');
            var ann = fsHead(c.class, 'Annual Exam Fee');
            var comp = fsHead(c.class, 'Computer Fee');
            body += '<tr><td><strong>' + esc(c.class) + '</strong></td>' +
                '<td class="rt-num">' + money(adm ? adm.final : 0) + '</td>' +
                '<td class="rt-num">' + money(mon ? mon.final : 0) + '</td>' +
                '<td class="rt-num">' + money(hy ? hy.final : 0) + '</td>' +
                '<td class="rt-num">' + money(ann ? ann.final : 0) + '</td>' +
                '<td class="rt-num">' + ((comp && num(comp.final)) ? money(comp.final) : '\u2014') + '</td>' +
                '<td class="rt-num">' + money(fsSessionTotal(c.class, false)) + '</td>' +
                '<td class="rt-num"><strong>' + money(fsSessionTotal(c.class, true)) + '</strong></td></tr>';
        });
        body += '</tbody></table>';

        var sel = fsGet(fsClass) || classes[0];
        if (sel) {
            body += '<div class="lg-sec">Class Detail \u2014 ' + esc(sel.class) + '</div>' +
                '<table class="rt"><thead><tr><th>Fee Head</th><th>Frequency</th><th class="rt-num">Standard</th>' +
                '<th class="rt-num">Discount</th><th class="rt-num">Final</th><th class="rt-num">Session Amount</th></tr></thead><tbody>';
            sel.heads.forEach(function (h) {
                body += '<tr><td>' + esc(h.head) + '</td><td>' + esc(h.frequency || '\u2014') + '</td>' +
                    '<td class="rt-num">' + money(h.standard) + '</td>' +
                    '<td class="rt-num">' + (num(h.discount) ? '- ' + money(h.discount) : '\u2014') + '</td>' +
                    '<td class="rt-num"><strong>' + money(h.final) + '</strong></td>' +
                    '<td class="rt-num">' + money(fsHeadSession(h)) + '</td></tr>';
            });
            body += '<tr><td colspan="2"><strong>Session Total</strong></td>' +
                '<td class="rt-num"><strong>' + money(fsSessionTotal(sel.class, false)) + '</strong></td>' +
                '<td></td><td class="rt-num"><strong>' + money(fsSessionTotal(sel.class, true)) + '</strong></td>' +
                '<td class="rt-num"><strong>' + money(fsSessionTotal(sel.class, true)) + '</strong></td></tr></tbody></table>';
        }

        body += '<table class="r-tot">' +
            '<tr><td>Session total me shamil</td><td class="n">Admission + Half-Yearly + Annual + (Monthly \u00d7 12)</td></tr>' +
            '<tr><td>Transport Fee</td><td class="n">Route ke hisaab se alag</td></tr>' +
            '</table>' +
            '<div class="r-sign"><div>Accountant</div><div>Principal</div></div>' +
            '<p class="r-note">Computer generated fee structure \u2014 ' + esc(m.school || '') + '</p>';
        return body;
    }

    function printFeeStructure() {
        if (!feeStruct || !feeStruct.classes || !feeStruct.classes.length) { toast('Could not load the fee structure'); return; }
        openPrintWindow('Fee Structure', feeStructureHTML());
        toast('Fee structure print ho raha hai...');
    }

    /* ---------- REPORT HELPERS ---------- */
    function monthKey(v) {
        var s = String(v == null ? '' : v).trim().toLowerCase();
        var map = { january:'Jan', february:'Feb', march:'Mar', april:'Apr', may:'May', june:'Jun',
                    july:'Jul', august:'Aug', september:'Sep', october:'Oct', november:'Nov', december:'Dec' };
        if (map[s]) return map[s];
        for (var i = 0; i < MONTHS.length; i++) { if (MONTHS[i].toLowerCase() === s) return MONTHS[i]; }
        return v;
    }

    function monthlyReportData() {
        return MONTHS.map(function (mo) {
            var list = store.feeTransactions.filter(function (t) { return monthKey(t['Fee Month']) === mo; });
            var coll = list.reduce(function (a, t) { return a + num(t['Net Amount']); }, 0);
            var students = {};
            list.forEach(function (t) { students[t['Admission No']] = 1; });
            var sc = Object.keys(students).length;
            return { month: mo, collection: coll, txns: list.length, students: sc, avg: list.length ? Math.round(coll / list.length) : 0 };
        });
    }

    function classFeeReportData() {
        var byClass = {};
        store.feeRegister.forEach(function (f) {
            var c = f['Class'] || '\u2014';
            if (!byClass[c]) byClass[c] = { students: 0, expected: 0, collected: 0, outstanding: 0 };
            byClass[c].students++;
            byClass[c].expected += num(f['Expected Fee']);
            byClass[c].collected += num(f['Total Collection']);
            byClass[c].outstanding += num(f['Outstanding']);
        });
        return Object.keys(byClass).sort().map(function (c) {
            var o = byClass[c];
            o.cls = c;
            o.pct = o.expected ? Math.round(o.collected / o.expected * 100) : 0;
            return o;
        });
    }

    /* ============================================================
       FEE STRUCTURE (Excel "Lists" sheet se)
       ============================================================ */
    var fsClass = null;

    function fsGet(cls) {
        if (!feeStruct || !feeStruct.classes) return null;
        var arr = feeStruct.classes.filter(function (c) { return c.class === cls; });
        return arr.length ? arr[0] : null;
    }
    function fsHead(cls, head) {
        var c = fsGet(cls);
        if (!c) return null;
        var arr = c.heads.filter(function (h) { return h.head === head; });
        return arr.length ? arr[0] : null;
    }
    function fsSessionTotal(cls, useFinal) {
        var c = fsGet(cls);
        if (!c) return 0;
        var t = 0;
        c.heads.forEach(function (h) {
            var v = useFinal ? num(h.final) : num(h.standard);
            if (h.head === 'Monthly Fee' || h.head === 'Transport Fee') v = v * 12;
            t += v;
        });
        return t;
    }
    function fsHeadSession(h) {
        var v = num(h.final);
        if (h.head === 'Monthly Fee' || h.head === 'Transport Fee') v = v * 12;
        return v;
    }

    function renderFeeStructure() {
        if (!feeStruct || !feeStruct.classes || !feeStruct.classes.length) return;
        var classes = feeStruct.classes;
        if (!fsClass) fsClass = classes[0].class;

        var st = document.getElementById('fsStats');
        if (st) {
            var heads = (classes[0].heads || []).length;
            var freqVals = {};
            Object.keys(feeStruct.frequency || {}).forEach(function (k) { freqVals[feeStruct.frequency[k]] = 1; });
            var cards = [
                { icon: 'fa-table-list', cls: 'blue',   value: classes.length, label: 'Classes' },
                { icon: 'fa-list',       cls: 'purple', value: heads, label: 'Fee Heads' },
                { icon: 'fa-calendar',   cls: 'green',  value: esc(feeStruct.session || '\u2014'), label: 'Academic Session' },
                { icon: 'fa-repeat',     cls: 'orange', value: Object.keys(freqVals).length, label: 'Frequency Types' }
            ];
            st.innerHTML = cards.map(function (c) {
                return '<div class="stat-card"><div class="stat-icon ' + c.cls + '"><i class="fas ' + c.icon + '"></i></div>' +
                       '<div><div class="stat-value">' + c.value + '</div><div class="stat-label">' + c.label + '</div></div></div>';
            }).join('');
        }

        var mx = document.getElementById('fsMatrix');
        if (mx) {
            mx.innerHTML = classes.map(function (c) {
                var adm = fsHead(c.class, 'Admission Fee');
                var mon = fsHead(c.class, 'Monthly Fee');
                var hy  = fsHead(c.class, 'Half-Yearly Exam Fee');
                var ann = fsHead(c.class, 'Annual Exam Fee');
                var comp = fsHead(c.class, 'Computer Fee');
                return '<tr><td><strong>' + esc(c.class) + '</strong></td>' +
                    '<td>' + money(adm ? adm.final : 0) + '</td>' +
                    '<td>' + money(mon ? mon.final : 0) + '</td>' +
                    '<td>' + money(hy ? hy.final : 0) + '</td>' +
                    '<td>' + money(ann ? ann.final : 0) + '</td>' +
                    '<td>' + ((comp && num(comp.final)) ? money(comp.final) : '\u2014') + '</td>' +
                    '<td>' + money(fsSessionTotal(c.class, false)) + '</td>' +
                    '<td><strong style="color:#388e3c">' + money(fsSessionTotal(c.class, true)) + '</strong></td></tr>';
            }).join('');
        }

        var pl = document.getElementById('fsPills');
        if (pl) {
            pl.innerHTML = classes.map(function (c) {
                return '<button class="fs-pill' + (c.class === fsClass ? ' active' : '') + '" onclick="CRM.fsPick(\'' + esc(c.class) + '\')">' + esc(c.class) + '</button>';
            }).join('');
        }

        var sel = fsGet(fsClass) || classes[0];
        var db = document.getElementById('fsDetailBody');
        if (db && sel) {
            db.innerHTML = sel.heads.map(function (h) {
                return '<tr><td><strong>' + esc(h.head) + '</strong></td>' +
                    '<td><span class="badge blue">' + esc(h.frequency || '\u2014') + '</span></td>' +
                    '<td style="text-align:right">' + money(h.standard) + '</td>' +
                    '<td style="text-align:right;color:#e53935">' + (num(h.discount) ? '- ' + money(h.discount) : '\u2014') + '</td>' +
                    '<td style="text-align:right"><strong>' + money(h.final) + '</strong></td>' +
                    '<td style="text-align:right;color:#5f6b7a">' + money(fsHeadSession(h)) + '</td></tr>';
            }).join('');
        }
        var dt = document.getElementById('fsDetailTotals');
        if (dt && sel) {
            dt.innerHTML = '<tr style="border-top:2px solid var(--border)">' +
                '<td colspan="2" style="padding:13px 20px">' + esc(sel.class) + ' \u2014 Session Total</td>' +
                '<td style="padding:13px 20px;text-align:right">' + money(fsSessionTotal(sel.class, false)) + '</td>' +
                '<td></td>' +
                '<td style="padding:13px 20px;text-align:right">' + money(fsSessionTotal(sel.class, true)) + '</td>' +
                '<td style="padding:13px 20px;text-align:right">' + money(fsSessionTotal(sel.class, true)) + '</td></tr>';
        }

        var fb = document.getElementById('fsFreqBody');
        if (fb) {
            var f = feeStruct.frequency || {};
            fb.innerHTML = Object.keys(f).map(function (k) {
                return '<tr><td><strong>' + esc(k) + '</strong></td><td><span class="badge blue">' + esc(f[k]) + '</span></td></tr>';
            }).join('');
        }

        var cf = document.getElementById('fsConfig');
        if (cf) {
            var cfg = config || {};
            var rows = [
                ['Academic Session', cfg['Academic Session'] || feeStruct.session || '\u2014'],
                ['Total Months', cfg['Total Months'] || '\u2014'],
                ['Admission Fee Month', cfg['Admission Fee Month'] || '\u2014'],
                ['Quarterly Exam Month', cfg['Quarterly Exam Month'] || '\u2014'],
                ['Half-Yearly Exam Month', cfg['Half-Yearly Exam Month'] || '\u2014'],
                ['Annual Exam Month', cfg['Annual Exam Month'] || '\u2014'],
                ['Transport Required', cfg['Transport Required'] || '\u2014'],
                ['Session Start', cfg['Session Start Date'] || '\u2014'],
                ['Session End', cfg['Session End Date'] || '\u2014']
            ];
            cf.innerHTML = '<div class="lg-info">' + rows.map(function (r) {
                return '<div><span class="k">' + esc(r[0]) + '</span><span class="v">' + esc(r[1]) + '</span></div>';
            }).join('') + '</div>';
        }
    }

    /* ---------- REFRESH ---------- */
    function refresh() {
        var page = document.body.getAttribute('data-page');
        if (page === 'dashboard') renderDashboard();
        if (page === 'students')  renderStudents();
        if (page === 'employees') renderEmployees();
        if (page === 'transport') renderTransport();
        if (page === 'fees')      renderFees();
        if (page === 'feestructure') renderFeeStructure();
        if (page === 'expenses')  renderExpenses();
        if (page === 'transactions') renderTransactions();
        if (page === 'dues')         renderDues();
        if (page === 'reports')      renderReports();
        if (page === 'settings')     renderSettings();
    }

    /* ---------- SEARCH ---------- */
    function globalSearch(v) {
        var page = document.body.getAttribute('data-page');
        if (page === 'students')     { stuQuery = v; stuPage = 1; renderStudents(); }
        if (page === 'fees')         { feeQuery = v; feePage = 1; renderFees(); }
        if (page === 'transactions') { txnQuery = v; txnPage = 1; renderTransactions(); }
    }

    /* ---------- LOGIN ---------- */
    function initLogin() {
        var form = document.getElementById('loginForm');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = document.getElementById('loginEmail').value.trim();
            var pass = document.getElementById('loginPassword').value;
            var role = (document.getElementById('loginRole') || {}).value || 'owner';
            if (!email || !pass) { toast('Enter email and password'); return; }
            var name = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
            setUser({ name: name, email: email, role: role });
            location.href = 'index.html';
        });
    }

    /* ---------- BOOT ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        var page = document.body.getAttribute('data-page');
        if (page === 'login') { initLogin(); return; }
        if (!requireAuth()) return;

        Promise.all([loadStore(), loadStruct()]).then(function (res) {
            var data = res[0];
            store = data;
            meta = data.meta || {};
            config = data.config || {};
            store.students = store.students || [];
            store.employees = store.employees || [];
            store.transport = store.transport || [];
            store.expenses = store.expenses || [];
            store.feeRegister = store.feeRegister || [];
            store.feeTransactions = store.feeTransactions || [];
            // Excel ka khaali Section ("0") saaf karo — warna "Class 6-0" dikhta hai
            store.students.forEach(function (s) { s['Section'] = normSection(s['Section']); });
            store.feeRegister.forEach(function (f) { f['Section'] = normSection(f['Section']); });
            renderShell();
            refresh();
        }).catch(function (err) {
            document.body.insertAdjacentHTML('afterbegin',
                '<div style="background:#ffebee;color:#c62828;padding:16px;font-family:sans-serif">Data load failed: ' + esc(err.message) + '</div>');
        });
    });

    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeForm(); });

    /* ---------- PUBLIC API ---------- */
    window.CRM = {
        logout: logout, toast: toast, user: getUser, money: money,
        edit: edit, del: del, add: add, save: save, closeForm: closeForm,
        reset: function () { if (confirm('Reset all data to original Excel values?')) resetStore(); },
        globalSearch: globalSearch,
        whatsappFeeDue: whatsappFeeDue, copyFeeDue: copyFeeDue, saveSchool: saveSchool,
        stuPage: function (p) { stuPage = p; renderStudents(); },
        empPage: function (p) { empPage = p; renderEmployees(); },
        feePage: function (p) { feePage = p; renderFees(); },
        txnPage: function (p) { txnPage = p; renderTransactions(); },
        globalSearchTxn: function (v) { txnQuery = v; txnPage = 1; renderTransactions(); },
        openLedger: openLedger, closeLedger: closeLedger,
        printReceipt: printReceipt, printLedger: printLedger,
        fsPick: function (c) { fsClass = c; renderFeeStructure(); },
        printFeeStructure: printFeeStructure,
        openCollect: openCollect, cfPick: cfPick, cfHeadChange: cfHeadChange, cfCalc: cfCalc,
        cfSave: cfSave, delReceipt: delReceipt, reapplyFeeStatus: reapplyFeeStatus,
        get store() { return store; }
    };
})();
