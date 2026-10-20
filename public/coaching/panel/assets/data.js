/* ============================================================
   COACHING ERP — Shared Data Layer
   Path: public/coaching/panel/assets/data.js
   Storage: localStorage (key: ch_store_v1)
   Blueprint: 12-section Coaching ERP, collections ch_*
   ============================================================ */

(function () {
    'use strict';

    const STORE_KEY = 'ch_store_v1';
    const USER_KEY  = 'ch_user_v1';

    /* ---------- CONSTANTS ---------- */
    const ROLES = ['Owner', 'Admin1', 'Admin2', 'Accountant', 'Teacher'];
    const PAGES = {
        dashboard:  ['Owner', 'Admin1', 'Admin2', 'Accountant', 'Teacher'],
        students:   ['Owner', 'Admin1', 'Admin2', 'Accountant', 'Teacher'],
        batches:    ['Owner', 'Admin1', 'Admin2', 'Teacher'],
        courses:    ['Owner', 'Admin1', 'Admin2', 'Teacher'],
        attendance: ['Owner', 'Admin1', 'Admin2', 'Teacher'],
        fees:       ['Owner', 'Admin1', 'Admin2', 'Accountant'],
        results:    ['Owner', 'Admin1', 'Admin2', 'Teacher'],
        staff:      ['Owner', 'Admin1', 'Admin2', 'Accountant'],
        settings:   ['Owner', 'Admin1', 'Admin2']
    };

    function today() {
        return new Date().toISOString().slice(0, 10);
    }

    /* ---------- SEED COURSES + SUBJECTS ---------- */
    const SEED_COURSES = [
        { id: 'CRS001', name: 'JEE Preparation (2 Year)',  stream: 'Science',  months: 24, fee: 42000, subjects: ['Physics', 'Chemistry', 'Maths'],        status: 'Active' },
        { id: 'CRS002', name: 'NEET Preparation (2 Year)', stream: 'Science',  months: 24, fee: 45000, subjects: ['Physics', 'Chemistry', 'Biology'],      status: 'Active' },
        { id: 'CRS003', name: 'SSC / Bank Coaching (1 Yr)', stream: 'General', months: 12, fee: 18000, subjects: ['Maths', 'English', 'Reasoning', 'GK'],  status: 'Active' },
        { id: 'CRS004', name: 'Board Target (Class 10-12)', stream: 'Board',   months: 10, fee: 24000, subjects: ['Physics', 'Chemistry', 'Maths', 'Biology'], status: 'Active' }
    ];

    /* ---------- SEED TEACHERS ---------- */
    const SEED_TEACHERS = [
        { id: 'TCH001', name: 'Rajeev Tiwari',   subject: 'Physics',    phone: '9876110001', qualification: 'M.Sc Physics', exp: 9, salary: 28000, status: 'Active' },
        { id: 'TCH002', name: 'Sarita Verma',    subject: 'Chemistry',  phone: '9876110002', qualification: 'M.Sc Chemistry', exp: 7, salary: 26000, status: 'Active' },
        { id: 'TCH003', name: 'Anand Singh',     subject: 'Maths',      phone: '9876110003', qualification: 'M.Sc Maths', exp: 11, salary: 30000, status: 'Active' },
        { id: 'TCH004', name: 'Kavita Mishra',   subject: 'Biology',    phone: '9876110004', qualification: 'M.Sc Biology', exp: 6, salary: 25000, status: 'Active' },
        { id: 'TCH005', name: 'Deepak Yadav',    subject: 'English',    phone: '9876110005', qualification: 'M.A English', exp: 8, salary: 22000, status: 'Active' }
    ];

    /* ---------- SEED BATCHES ---------- */
    const SEED_BATCHES = [
        { id: 'BAT001', name: 'JEE-2027-A',     courseId: 'CRS001', course: 'JEE Preparation (2 Year)',  teacherId: 'TCH001', teacher: 'Rajeev Tiwari',   time: '7:00-10:00 AM',   days: 'Mon-Sat',   room: 'R-1', capacity: 40, students: 0, startDate: '2026-04-01', status: 'Running' },
        { id: 'BAT002', name: 'NEET-2027-A',    courseId: 'CRS002', course: 'NEET Preparation (2 Year)', teacherId: 'TCH004', teacher: 'Kavita Mishra',   time: '10:30-1:30 PM',   days: 'Mon-Sat',   room: 'R-2', capacity: 40, students: 0, startDate: '2026-04-05', status: 'Running' },
        { id: 'BAT003', name: 'SSC-Morning-A',  courseId: 'CRS003', course: 'SSC / Bank Coaching (1 Yr)', teacherId: 'TCH003', teacher: 'Anand Singh',    time: '6:00-9:00 AM',    days: 'Mon-Sat',   room: 'R-3', capacity: 50, students: 0, startDate: '2026-05-01', status: 'Running' },
        { id: 'BAT004', name: 'Board-XII-Eve',  courseId: 'CRS004', course: 'Board Target (Class 10-12)', teacherId: 'TCH002', teacher: 'Sarita Verma',   time: '4:00-7:00 PM',    days: 'Mon-Fri',   room: 'R-4', capacity: 35, students: 0, startDate: '2026-07-01', status: 'Running' }
    ];

    /* ---------- SEED STUDENTS ---------- */
    const FIRST = ['Aman', 'Priya', 'Rohan', 'Sneha', 'Vikas', 'Nisha', 'Amit', 'Pooja', 'Ravi', 'Kajal', 'Sourabh', 'Meena', 'Ankit', 'Ritu', 'Manish', 'Divya'];
    const LAST  = ['Yadav', 'Sharma', 'Verma', 'Singh', 'Gupta', 'Mishra', 'Rai', 'Kannoujiya'];
    const SEED_STUDENTS = [];
    let n = 0;
    SEED_BATCHES.forEach(function (b, bi) {
        for (let i = 0; i < 6; i++) {
            n++;
            const full = FIRST[(n - 1) % FIRST.length] + ' ' + LAST[(n - 1) % LAST.length];
            const adm = 'CH26-' + String(1000 + n);
            const totalFee = [42000, 45000, 18000, 24000][bi];
            const paid = [28000, 45000, 6000, 18000][i % 4];
            SEED_STUDENTS.push({
                id: 'STU' + String(n).padStart(3, '0'),
                name: full, adm: adm, batchId: b.id, batch: b.name, course: b.course,
                phone: '98765' + String(10000 + n), parentPhone: '91234' + String(10000 + n),
                gender: i % 2 ? 'Female' : 'Male', dob: '20' + (6 + (n % 8)) + '-0' + ((n % 8) + 1) + '-1' + (n % 9),
                address: 'Amethi, Gauriganj', joinDate: '2026-06-' + String((n % 27) + 1).padStart(2, '0'),
                feeTotal: totalFee, feePaid: paid, feeMode: 'Monthly', dueDate: '2026-11-05',
                status: 'Active', remark: ''
            });
        }
    });

    /* ---------- SEED TIMETABLE (batch-wise) ---------- */
    const SEED_TIMETABLE = [];
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(function (d, di) {
        SEED_BATCHES.forEach(function (b, bi) {
            const subj = b.course.indexOf('JEE') > -1 ? ['Physics', 'Maths', 'Chemistry'] :
                b.course.indexOf('NEET') > -1 ? ['Biology', 'Chemistry', 'Physics'] :
                b.course.indexOf('SSC') > -1 ? ['Maths', 'Reasoning', 'English'] : ['Physics', 'Chemistry'];
            SEED_TIMETABLE.push({ id: 'TT-' + d + '-' + b.id, day: d, batchId: b.id, batch: b.name, subject: subj[di % subj.length], teacher: b.teacher, time: b.time, room: b.room });
        });
    });

    /* ---------- SEED INVOICES (fee demand) + PAYMENTS ---------- */
    const SEED_INVOICES = [];
    const SEED_PAYMENTS = [];
    SEED_STUDENTS.forEach(function (s, i) {
        const inst = Math.round(s.feeTotal / 4);
        SEED_INVOICES.push({
            id: 'INV' + String(1000 + i), no: 'INV-2026-' + String(1000 + i),
            studentId: s.id, student: s.name, adm: s.adm, batch: s.batch,
            month: '2026-10', fee: inst, discount: 0, late: 0, total: inst,
            dueDate: '2026-10-05', status: (i % 4 === 0) ? 'Paid' : 'Pending', createdAt: i
        });
        if (i % 4 === 0) {
            SEED_PAYMENTS.push({
                id: 'PM100' + i, no: 'RCP-2026-' + String(1000 + i), invoiceId: 'INV' + String(1000 + i),
                studentId: s.id, student: s.name, adm: s.adm,
                date: '2026-10-0' + ((i % 9) + 1), amount: inst, mode: ['Cash', 'UPI', 'UPI', 'Bank'][i % 4],
                note: 'Invoice ' + s.adm + ' paid', createdAt: i
            });
        }
    });

    /* ---------- SEED ATTENDANCE (aaj + kal) ---------- */
    const SEED_ATTENDANCE = [];
    SEED_BATCHES.forEach(function (b) {
        const studs = SEED_STUDENTS.filter(s => s.batchId === b.id);
        ['2026-10-19', '2026-10-20'].forEach(function (d) {
            studs.forEach(function (s) {
                SEED_ATTENDANCE.push({ id: 'AT-' + d + '-' + s.id, date: d, batchId: b.id, batch: b.name, studentId: s.id, student: s.name, status: (d === '2026-10-19' && s.adm.endsWith('3')) ? 'Absent' : 'Present' });
            });
        });
    });

    /* ---------- SEED TESTS + RESULTS ---------- */
    const SEED_TESTS = [
        { id: 'TST001', name: 'JEE Weekly Test 4', batchId: 'BAT001', batch: 'JEE-2027-A', subject: 'Physics', date: '2026-10-12', maxMarks: 100, status: 'Completed' },
        { id: 'TST002', name: 'NEET Bio Test 3',   batchId: 'BAT002', batch: 'NEET-2027-A', subject: 'Biology', date: '2026-10-13', maxMarks: 100, status: 'Completed' },
        { id: 'TST003', name: 'SSC Mini Mock 5',   batchId: 'BAT003', batch: 'SSC-Morning-A', subject: 'Maths', date: '2026-10-15', maxMarks: 50, status: 'Completed' }
    ];
    const SEED_RESULTS = [];
    SEED_TESTS.forEach(function (t) {
        SEED_STUDENTS.filter(s => s.batchId === t.batchId).forEach(function (s, i) {
            SEED_RESULTS.push({ id: t.id + '-' + s.id, testId: t.id, test: t.name, batchId: t.batchId, studentId: s.id, student: s.name, adm: s.adm, marks: t.maxMarks - ((i * 3) % 17), maxMarks: t.maxMarks, grade: '', remark: '' });
        });
    });

    /* ---------- SEED STAFF ---------- */
    const SEED_STAFF = [
        { id: 'STF001', name: 'Rajeev Tiwari',  role: 'Teacher',    phone: '9876110001', salary: 28000, joinDate: '2024-04-01', status: 'Active' },
        { id: 'STF002', name: 'Sunita Devi',    role: 'Accountant', phone: '9876110022', salary: 12000, joinDate: '2024-06-15', status: 'Active' },
        { id: 'STF003', name: 'Anand Singh',    role: 'Teacher',    phone: '9876110003', salary: 30000, joinDate: '2023-08-10', status: 'Active' },
        { id: 'STF004', name: 'Kalpana Singh',  role: 'Admin1',     phone: '9876110044', salary: 15000, joinDate: '2025-06-01', status: 'Active' }
    ];

    /* ---------- SEED EXPENSES ---------- */
    const SEED_EXPENSES = [
        { id: 'EXP001', date: '2026-10-01', category: 'Rent',        description: 'Building rent October',  amount: 12000, mode: 'Cash', paidTo: 'Landlord' },
        { id: 'EXP002', date: '2026-10-02', category: 'Electricity', description: 'Meters bill',            amount: 3200,  mode: 'UPI',  paidTo: 'UPCL' },
        { id: 'EXP003', date: '2026-10-03', category: 'Stationery',  description: 'Answer sheets & files',  amount: 1800,  mode: 'Cash', paidTo: 'Local Shop' },
        { id: 'EXP004', date: '2026-10-05', category: 'Marketing',   description: 'Banner + pamphlets',     amount: 2500,  mode: 'UPI',  paidTo: 'Print House' }
    ];

    /* ---------- SEED CONFIG ---------- */
    const SEED_CONFIG = {
        id: 'app',
        shopName: 'Apna Coaching Classes',
        phone: '+918504985149',
        whatsapp: '918504985149',
        address: 'Amethi, Uttar Pradesh',
        month: '2026-10',
        reminderDays: 5
    };

    /* ---------- STORE ---------- */
    function blank() {
        return {
            version: 1,
            courses: SEED_COURSES.slice(), teachers: SEED_TEACHERS.slice(),
            batches: SEED_BATCHES.slice(), students: SEED_STUDENTS.slice(),
            timetable: SEED_TIMETABLE.slice(), invoices: SEED_INVOICES.slice(),
            payments: SEED_PAYMENTS.slice(), attendance: SEED_ATTENDANCE.slice(),
            tests: SEED_TESTS.slice(), results: SEED_RESULTS.slice(),
            staff: SEED_STAFF.slice(), expenses: SEED_EXPENSES.slice(),
            config: JSON.parse(JSON.stringify(SEED_CONFIG)), fbSeeded: {}
        };
    }

    function load() {
        try {
            const s = JSON.parse(localStorage.getItem(STORE_KEY));
            if (s && s.version) {
                blankKeys().forEach(function (k) { if (!s[k]) s[k] = k === 'config' ? SEED_CONFIG : []; });
                return s;
            }
        } catch (e) { /* corrupt -> fresh */ }
        const fresh = blank();
        save(fresh);
        return fresh;
    }

    function save(s) {
        try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) { console.warn('save failed', e); }
    }

    function blankKeys() {
        return ['courses', 'teachers', 'batches', 'students', 'timetable', 'invoices', 'payments', 'attendance', 'tests', 'results', 'staff', 'expenses', 'config', 'fbSeeded'];
    }

    function setUser(u) {
        if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
        else localStorage.removeItem(USER_KEY);
    }
    function getUser() {
        try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch (e) { return null; }
    }

    function esc(v) {
        return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function initials(n) {
        return String(n || 'U').trim().split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase();
    }

    function money(v) {
        return '₹' + Number(v || 0).toLocaleString('en-IN');
    }

    function nextId(prefix, arr, pad) {
        let max = 0;
        (arr || []).forEach(function (x) {
            const m = String(x.id).match(new RegExp('^' + prefix + '(\\d+)$'));
            if (m) max = Math.max(max, parseInt(m[1], 10));
        });
        return prefix + String(max + 1).padStart(pad || 3, '0');
    }

    window.CH = {
        ROLES: ROLES, PAGES: PAGES,
        load: load, save: save,
        setUser: setUser, getUser: getUser,
        esc: esc, initials: initials, money: money, nextId: nextId,
        today: today,
        PAY_MODES: ['Cash', 'UPI', 'Bank Transfer', 'Cheque'],
        EXP_CATS: ['Rent', 'Electricity', 'Salary', 'Stationery', 'Marketing', 'Transport', 'Repair', 'Other'],
        STATUS: { ok: 'Active', done: 'Completed', open: 'Pending', out: 'Absent' }
    };
})();
