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
                const msg = encodeURIComponent('Hello, ' + i.student + ' has a fee due of Rs.' + i.total + ' pending (invoice ' + i.no + '). Please pay soon. - ' + (s.config.shopName || 'Coaching'));
                return '<tr><td><b>' + esc(i.student) + '</b><div class="small muted">' + esc(i.adm || '') + '</div></td>' +
                    '<td>' + esc(i.batch || '') + '</td><td>' + esc(fmtDate(i.dueDate)) + '</td>' +
                    '<td><b class="t-red">' + money(i.total) + '</b></td>' +
                    '<td>' + (ph ? '<a class="btn btn-light btn-sm" target="_blank" href="https://wa.me/91' + esc(ph) + '?text=' + msg + '"><i class="fab fa-whatsapp" style="color:#25D366"></i> Remind</a>' : '—') + '</td></tr>';
            }).join('');
            dv.innerHTML = rows || '<tr><td colspan="5" class="muted">No pending fees — good news!</td></tr>';
        }

        /* recent payments */
        const pv = $('dPayments');
        if (pv) {
            const rows = s.payments.slice().sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); }).slice(0, 6)
                .map(function (p) {
                    return '<tr><td>' + esc(fmtDate(p.date)) + '</td><td><b>' + esc(p.student) + '</b><div class="small muted">' + esc(p.adm || '') + '</div></td>' +
                        '<td>' + money(p.amount) + '</td><td><span class="chip">' + esc(p.mode) + '</span></td></tr>';
                }).join('');
            pv.innerHTML = rows || '<tr><td colspan="4" class="muted">No payments received yet</td></tr>';
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
                return '<tr><td><b>' + esc(b.name) + '</b></td><td>' + (total ? present + '/' + total + ' (' + pct + '%)' : '<span class="muted">Not marked</span>') + '</td>' +
                    '<td>' + (total ? (pct >= 75 ? '<span class="chip chip-green">Good</span>' : '<span class="chip chip-red">Low</span>') : '<span class="chip chip-amber">Pending</span>') + '</td></tr>';
            }).join('');
            av.innerHTML = rows;
        }
    }

    /* ============================================================
       STUDENTS (STEP 2)
       ============================================================ */
    let STUDENT_Q = '';

    function feeChip(s) {
        const due = Number(s.feeTotal || 0) - Number(s.feePaid || 0);
        if (due <= 0) return '<span class="chip chip-green">Paid</span>';
        const pctPaid = s.feeTotal ? Math.round((s.feePaid || 0) * 100 / s.feeTotal) : 0;
        if (pctPaid === 0) return '<span class="chip chip-red">' + money(due) + ' baaki</span>';
        if (pctPaid >= 50) return '<span class="chip chip-amber">' + money(due) + ' baaki</span>';
        return '<span class="chip chip-red">' + money(due) + ' baaki</span>';
    }

    function canCRUD(user) {
        return user && ['Owner', 'Admin1', 'Admin2', 'Accountant'].indexOf(user.role) > -1;
    }

    function studentsRender() {
        const s = CH.load();
        const u = CH.getUser();

        const active = s.students.filter(function (x) { return x.status === 'Active'; });
        const dueStd = active.filter(function (x) { return Number(x.feeTotal || 0) - Number(x.feePaid || 0) > 0; });
        const m = CH.today().slice(0, 7);
        const newThisM = s.students.filter(function (x) { return (x.joinDate || 'x').slice(0, 7) === m; });
        const collectedByStd = s.students.reduce(function (a, x) { return a + Number(x.feePaid || 0); }, 0);

        const st = $('sStats');
        if (st) {
            function c(icon, col, val, label) {
                return '<div class="stat-card"><div class="stat-icon ' + col + '"><i class="fas ' + icon + '"></i></div>' +
                    '<div><div class="stat-value">' + esc(val) + '</div><div class="stat-label">' + label + '</div></div></div>';
            }
            st.innerHTML =
                c('fa-user-graduate', 'teal', active.length, 'Active Students') +
                c('fa-hourglass-half', 'red', dueStd.length, 'Fee Due Wale') +
                c('fa-user-plus', 'blue', newThisM.length, 'New This Month') +
                c('fa-indian-rupee-sign', 'green', money(collectedByStd), 'Fees Received');
        }

        const q = STUDENT_Q.trim().toLowerCase();
        const rows = s.students
            .filter(function (x) {
                if (!q) return true;
                return [x.name, x.adm, x.phone, x.parentPhone].some(function (v) {
                    return String(v || '').toLowerCase().indexOf(q) > -1;
                });
            })
            .map(function (x) {
                const b = s.batches.filter(function (bb) { return bb.id === x.batchId; })[0];
                const ph = x.parentPhone || x.phone || '';
                const due = Number(x.feeTotal || 0) - Number(x.feePaid || 0);
                const msg = encodeURIComponent('Hello, ' + x.name + ' (' + (x.adm || '') + ') — fee details:\nTotal: Rs.' + x.feeTotal + '\nPaid: Rs.' + x.feePaid + '\nPending: Rs.' + due + '\nDue date: ' + fmtDate(x.dueDate) + '\nPlease deposit the payment. - ' + (s.config.shopName || 'Coaching'));
                const actions = (canCRUD(u)
                    ? '<button class="btn btn-light btn-sm" title="Edit" onclick="App.editStudent(\'' + x.id + '\')"><i class="fas fa-pen"></i></button> ' +
                      '<button class="btn btn-light btn-sm" title="Delete" onclick="App.delStudent(\'' + x.id + '\')"><i class="fas fa-trash" style="color:var(--danger)"></i></button> '
                    : '');
                return '<tr>' +
                    '<td><b>' + esc(x.name) + '</b><div class="small muted">' + esc(x.adm || '') + '</div></td>' +
                    '<td>' + esc(b ? b.name : (x.batch || '—')) + '</td>' +
                    '<td>' + esc(ph || '—') + '</td>' +
                    '<td>' + feeChip(x) + '</td>' +
                    '<td>' + esc(fmtDate(x.dueDate)) + '</td>' +
                    '<td><span class="chip ' + (x.status === 'Active' ? 'chip-green' : '') + '">' + esc(x.status) + '</span></td>' +
                    '<td style="text-align:right;white-space:nowrap">' + actions +
                        (ph ? '<a class="btn btn-light btn-sm" target="_blank" href="https://wa.me/91' + esc(ph) + '?text=' + msg + '" title="WhatsApp Remind"><i class="fab fa-whatsapp" style="color:#25D366"></i></a>' : '') +
                    '</td></tr>';
            }).join('');
        const body = $('sBody');
        if (body) body.innerHTML = rows || '<tr><td colspan="7" class="muted">No students found (clear the search or add one)</td></tr>';
    }

    function recalcBatchCounts(s) {
        s.batches.forEach(function (b) {
            b.students = s.students.filter(function (x) { return x.batchId === b.id && x.status === 'Active'; }).length;
            fbSet('batches', b);
        });
    }

    function nextAdm(s) {
        let max = 1000;
        s.students.forEach(function (x) {
            const m = String(x.adm || '').match(/CH\d+-(\d+)/);
            if (m) max = Math.max(max, parseInt(m[1], 10));
        });
        return 'CH26-' + (max + 1);
    }

    function studentForm(s, stu) {
        const batchOpts = s.batches.map(function (b) {
            return '<option value="' + esc(b.id) + '"' + (stu && stu.batchId === b.id ? ' selected' : '') + '>' + esc(b.name) + ' — ' + esc(b.course) + '</option>';
        }).join('');
        return '<form id="stuForm">' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Name *</label><input id="fName" class="form-control" value="' + esc(stu ? stu.name : '') + '"></div>' +
                '<div class="form-group"><label>Admission No</label><input class="form-control" value="' + esc(stu ? stu.adm : nextAdm(s)) + '" disabled></div>' +
            '</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Batch *</label><select id="fBatch" class="form-control">' + batchOpts + '</select></div>' +
                '<div class="form-group"><label>Gender</label><select id="fGender" class="form-control">' +
                    ['Male', 'Female', 'Other'].map(function (g) { return '<option' + (stu && stu.gender === g ? ' selected' : '') + '>' + g + '</option>'; }).join('') + '</select></div>' +
            '</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Phone</label><input id="fPhone" class="form-control" value="' + esc(stu ? stu.phone : '') + '"></div>' +
                '<div class="form-group"><label>Parent Phone</label><input id="fPParent" class="form-control" value="' + esc(stu ? stu.parentPhone : '') + '"></div>' +
            '</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>DOB</label><input type="date" id="fDob" class="form-control" value="' + esc(stu ? stu.dob : '') + '"></div>' +
                '<div class="form-group"><label>Join Date</label><input type="date" id="fJoin" class="form-control" value="' + esc(stu ? stu.joinDate : CH.today()) + '"></div>' +
            '</div>' +
            '<div class="form-group"><label>Address</label><input id="fAddr" class="form-control" value="' + esc(stu ? stu.address : '') + '"></div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Total Fee *</label><input type="number" id="fFeeT" class="form-control" value="' + esc(stu ? stu.feeTotal : '') + '"></div>' +
                '<div class="form-group"><label>Fee Paid</label><input type="number" id="fFeeP" class="form-control" value="' + esc(stu ? stu.feePaid : 0) + '"></div>' +
            '</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Fee Mode</label><select id="fMode" class="form-control">' +
                    ['Monthly', 'Quarterly', 'Half-Yearly', 'Full'].map(function (o) { return '<option' + (stu && stu.feeMode === o ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></div>' +
                '<div class="form-group"><label>Next Due Date</label><input type="date" id="fDue" class="form-control" value="' + esc(stu ? stu.dueDate : '') + '"></div>' +
            '</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Status</label><select id="fStatus" class="form-control">' +
                    ['Active', 'Left', 'Hold'].map(function (o) { return '<option' + (stu && stu.status === o ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></div>' +
                '<div class="form-group"><label>Remark</label><input id="fRemark" class="form-control" value="' + esc(stu ? stu.remark : '') + '"></div>' +
            '</div>' +
            '<div id="stuErr" style="color:var(--danger);font-size:12.5px;margin:4px 0 8px"></div>' +
        '</form>';
    }

    function validateStudent(s, d) {
        const errs = [];
        if (!d.name) errs.push('Fill in the name');
        if (!d.batchId) errs.push('Batch chunein');
        if (d.feeTotal === '' || isNaN(Number(d.feeTotal))) errs.push('Enter a valid Total Fee');
        [d.phone, d.parentPhone].forEach(function (p) {
            if (p && !/^\d{10}$/.test(String(p))) errs.push('Phone 10 digit hona chahiye (' + p + ')');
        });
        if (d.feePaid !== '' && Number(d.feePaid) > Number(d.feeTotal || 0)) errs.push('Paid cannot exceed Total');
        return errs;
    }

    function addStudent() {
        const s = CH.load();
        modal('Add Student', studentForm(s, null),
            '<button class="btn btn-primary" onclick="App.saveStudent(null)"><i class="fas fa-check"></i> Save Student</button>');
    }

    function editStudent(id) {
        const s = CH.load();
        const stu = s.students.filter(function (x) { return x.id === id; })[0];
        if (!stu) return;
        modal('Edit Student — ' + esc(stu.name), studentForm(s, stu),
            '<button class="btn btn-primary" onclick="App.saveStudent(\'' + id + '\')"><i class="fas fa-check"></i> Update</button>');
    }

    function saveStudent(id) {
        const s = CH.load();
        const d = {
            name: $('fName').value.trim(),
            batchId: $('fBatch').value,
            gender: $('fGender').value,
            phone: $('fPhone').value.trim(),
            parentPhone: $('fPParent').value.trim(),
            dob: $('fDob').value,
            joinDate: $('fJoin').value || CH.today(),
            address: $('fAddr').value,
            feeTotal: $('fFeeT').value,
            feePaid: $('fFeeP').value || 0,
            feeMode: $('fMode').value,
            dueDate: $('fDue').value,
            status: $('fStatus').value,
            remark: $('fRemark').value
        };
        const errs = validateStudent(s, d);
        if (errs.length) { $('stuErr').textContent = errs.join(' • '); return; }
        const b = s.batches.filter(function (x) { return x.id === d.batchId; })[0];
        let stu;
        if (id) {
            stu = s.students.filter(function (x) { return x.id === id; })[0];
            Object.keys(d).forEach(function (k) { stu[k] = d[k]; });
            stu.batch = b ? b.name : '';
            stu.course = b ? b.course : '';
        } else {
            stu = Object.assign({ id: CH.nextId('STU', s.students), adm: nextAdm(s), batch: b ? b.name : '', course: b ? b.course : '', createdAt: Date.now() }, d);
            s.students.push(stu);
        }
        recalcBatchCounts(s);
        CH.save(s);
        fbSet('students', stu);
        closeModal();
        toast('Student save ho gaya — ' + stu.adm);
        studentsRender();
    }

    function delStudent(id) {
        const s = CH.load();
        const stu = s.students.filter(function (x) { return x.id === id; })[0];
        if (!stu) return;
        modal('Delete Student',
            '<p><b>' + esc(stu.name) + '</b> (' + esc(stu.adm) + ') ko delete karne se records list se hata denge. Confirm?</p>',
            '<button class="btn btn-danger" onclick="App.doDelete(\'' + id + '\')"><i class="fas fa-trash"></i> Delete</button> ' +
            '<button class="btn btn-light" onclick="App.closeModal()">Cancel</button>');
    }

    function doDelete(id) {
        const s = CH.load();
        s.students = s.students.filter(function (x) { return x.id !== id; });
        recalcBatchCounts(s);
        CH.save(s);
        fbDel('students', id);
        closeModal();
        toast('Student delete ho gaya');
        studentsRender();
    }

    function studentsSearch(q) { STUDENT_Q = q || ''; studentsRender(); }

    /* ---------- public API ---------- */
    window.App = {
        renderShell: renderShell,
        dashboard: dashboard,
        // students (step 2)
        addStudent: addStudent,
        editStudent: editStudent,
        saveStudent: saveStudent,
        delStudent: delStudent,
        doDelete: doDelete,
        studentsRender: studentsRender,
        search: studentsSearch,
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
            if (page() === 'students') App.studentsRender();
            if (window.App.pageReady) window.App.pageReady();
        });
    });
})();
