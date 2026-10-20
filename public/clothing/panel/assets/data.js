/* ============================================================
   CLOTHING CRM — Shared Data Layer
   Path: public/clothing/assets/data.js
   Storage: localStorage (key: cl_store_v1)
   ============================================================ */

(function () {
    'use strict';

    const STORE_KEY = 'cl_store_v1';
    const USER_KEY  = 'cl_user_v1';

    /* ---------- CATEGORIES ---------- */
    const CATEGORIES = ['Jeans', 'Shirt', 'T-Shirt', 'Kurta', 'Saree', 'Kurti', 'Top', 'Trouser', 'Jacket', 'Other'];
    const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', 'Free'];
    const EXPENSE_CATS = ['Rent', 'Electricity', 'Salary', 'Transport', 'Packing', 'Tea/Snacks', 'Marketing', 'Repair', 'Stationery', 'Other'];
    const PAY_MODES = ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Credit'];
    const ROLES = ['Manager', 'Salesman', 'Tailor', 'Helper', 'Accountant', 'Security', 'Other'];

    /* ---------- SEED SUPPLIERS (Wholesellers) ---------- */
    const SEED_SUPPLIERS = [
        { id: 'SUP001', name: 'Sharma Textiles',      phone: '9876543210', city: 'Delhi',    gst: '07ABCDE1234F1Z5', opening: 0,     paid: 20000, status: 'Active', notes: 'Jeans & Trouser specialist' },
        { id: 'SUP002', name: 'Gupta Garments',       phone: '9825011223', city: 'Ludhiana', gst: '03FGHIJ5678K1Z2', opening: 0,     paid: 23600, status: 'Active', notes: 'Shirts & T-Shirts' },
        { id: 'SUP003', name: 'Banaras Saree House',  phone: '9988766554', city: 'Varanasi', gst: '09KLMNO9012P1Z8', opening: 0,     paid: 15000, status: 'Active', notes: 'Saree & Suit' },
        { id: 'SUP004', name: 'Jaipur Kurti Bazaar',  phone: '9004533221', city: 'Jaipur',   gst: '08PQRST3456U1Z1', opening: 0,     paid: 0, status: 'Active', notes: 'Kurti & Top' },
        { id: 'SUP005', name: 'Surat Fabric Mart',    phone: '9765412098', city: 'Surat',    gst: '24UVWXY7890Z1Z9', opening: 0,     paid: 0, status: 'Active', notes: 'Fabric & Bulk' },
        { id: 'SUP006', name: 'Amethi Local Supplier',phone: '9345678901', city: 'Amethi',   gst: '',                opening: 5000,  paid: 0, status: 'Active', notes: 'Local — credit pe deta hai' }
    ];

    /* ---------- SEED PRODUCTS ---------- */
    const SEED_PRODUCTS = [
        { id: 'P001', name: 'Denim Jeans (Slim Fit)',   category: 'Jeans',   size: '32',  color: 'Blue',   purchase: 450, sale: 899,  stock: 24, supplier: 'SUP001', reorder: 5,  icon: 'fa-user-tie' },
        { id: 'P002', name: 'Denim Jeans (Regular)',    category: 'Jeans',   size: '34',  color: 'Black',  purchase: 480, sale: 999,  stock: 18, supplier: 'SUP001', reorder: 5,  icon: 'fa-user-tie' },
        { id: 'P003', name: 'Formal Shirt (Cotton)',    category: 'Shirt',   size: 'M',   color: 'White',  purchase: 320, sale: 699,  stock: 30, supplier: 'SUP002', reorder: 8,  icon: 'fa-shirt' },
        { id: 'P004', name: 'Casual Check Shirt',       category: 'Shirt',   size: 'L',   color: 'Red',    purchase: 350, sale: 749,  stock: 22, supplier: 'SUP002', reorder: 6,  icon: 'fa-shirt' },
        { id: 'P005', name: 'Round Neck T-Shirt',       category: 'T-Shirt', size: 'M',   color: 'Navy',   purchase: 180, sale: 449,  stock: 45, supplier: 'SUP002', reorder: 10, icon: 'fa-tshirt' },
        { id: 'P006', name: 'Polo T-Shirt',             category: 'T-Shirt', size: 'L',   color: 'Green',  purchase: 250, sale: 599,  stock: 28, supplier: 'SUP002', reorder: 8,  icon: 'fa-tshirt' },
        { id: 'P007', name: 'Cotton Kurta (Men)',       category: 'Kurta',   size: 'XL',  color: 'Cream',  purchase: 400, sale: 899,  stock: 15, supplier: 'SUP006', reorder: 5,  icon: 'fa-user-tie' },
        { id: 'P008', name: 'Banarasi Silk Saree',      category: 'Saree',   size: 'Free',color: 'Maroon', purchase: 1800,sale: 3499, stock: 8,  supplier: 'SUP003', reorder: 3,  icon: 'fa-fan' },
        { id: 'P009', name: 'Cotton Printed Saree',     category: 'Saree',   size: 'Free',color: 'Blue',   purchase: 650, sale: 1499, stock: 12, supplier: 'SUP003', reorder: 4,  icon: 'fa-fan' },
        { id: 'P010', name: 'Designer Kurti',           category: 'Kurti',   size: 'M',   color: 'Pink',   purchase: 550, sale: 1199, stock: 20, supplier: 'SUP004', reorder: 6,  icon: 'fa-person-dress' },
        { id: 'P011', name: 'Cotton Straight Kurti',    category: 'Kurti',   size: 'L',   color: 'Yellow', purchase: 380, sale: 849,  stock: 26, supplier: 'SUP004', reorder: 8,  icon: 'fa-person-dress' },
        { id: 'P012', name: 'Anarkali Kurti',           category: 'Kurti',   size: 'XL',  color: 'Green',  purchase: 700, sale: 1599, stock: 9,  supplier: 'SUP004', reorder: 4,  icon: 'fa-person-dress' },
        { id: 'P013', name: 'Western Top',              category: 'Top',     size: 'S',   color: 'White',  purchase: 300, sale: 699,  stock: 18, supplier: 'SUP005', reorder: 6,  icon: 'fa-person-dress' },
        { id: 'P014', name: 'Crop Top',                 category: 'Top',     size: 'M',   color: 'Black',  purchase: 280, sale: 649,  stock: 14, supplier: 'SUP005', reorder: 5,  icon: 'fa-person-dress' },
        { id: 'P015', name: 'Cotton Trouser',           category: 'Trouser', size: '32',  color: 'Grey',   purchase: 420, sale: 899,  stock: 16, supplier: 'SUP001', reorder: 5,  icon: 'fa-user-tie' },
        { id: 'P016', name: 'Formal Trouser',           category: 'Trouser', size: '34',  color: 'Black',  purchase: 520, sale: 1099, stock: 11, supplier: 'SUP001', reorder: 4,  icon: 'fa-user-tie' },
        { id: 'P017', name: 'Winter Jacket',            category: 'Jacket',  size: 'L',   color: 'Navy',   purchase: 1200,sale: 2499, stock: 6,  supplier: 'SUP005', reorder: 3,  icon: 'fa-mitten' },
        { id: 'P018', name: 'Denim Jacket',             category: 'Jacket',  size: 'M',   color: 'Blue',   purchase: 950, sale: 1999, stock: 4,  supplier: 'SUP005', reorder: 4,  icon: 'fa-mitten' },
        { id: 'P019', name: 'Kids T-Shirt (Pack 3)',    category: 'T-Shirt', size: 'S',   color: 'Mixed',  purchase: 300, sale: 699,  stock: 32, supplier: 'SUP002', reorder: 10, icon: 'fa-child' },
        { id: 'P020', name: 'School Uniform Set',       category: 'Other',   size: 'M',   color: 'Blue',   purchase: 550, sale: 1099, stock: 20, supplier: 'SUP006', reorder: 8,  icon: 'fa-child' }
    ];

    /* ---------- SEED STAFF ---------- */
    const SEED_STAFF = [
        { id: 'STF001', name: 'Ramesh Kumar',  role: 'Manager',  phone: '9876500011', salary: 15000, joinDate: '2024-04-01', status: 'Active', address: 'Amethi' },
        { id: 'STF002', name: 'Sunita Devi',   role: 'Salesman', phone: '9876500022', salary: 9000,  joinDate: '2025-01-15', status: 'Active', address: 'Amethi' },
        { id: 'STF003', name: 'Mohd Irfan',    role: 'Tailor',   phone: '9876500033', salary: 12000, joinDate: '2024-08-10', status: 'Active', address: 'Amethi' },
        { id: 'STF004', name: 'Pooja Sharma',  role: 'Salesman', phone: '9876500044', salary: 8500,  joinDate: '2025-06-01', status: 'Active', address: 'Gauriganj' }
    ];

    /* ---------- SEED EXPENSES ---------- */
    const SEED_EXPENSES = [
        { id: 'EXP001', date: '2026-10-01', category: 'Rent',        description: 'Shop rent October',  amount: 8000,  mode: 'Cash', paidTo: 'Landlord',    staff: '' },
        { id: 'EXP002', date: '2026-10-02', category: 'Electricity', description: 'Electricity bill',   amount: 2200,  mode: 'UPI',  paidTo: 'UPCL',        staff: '' },
        { id: 'EXP003', date: '2026-10-03', category: 'Packing',     description: 'Packing bags',       amount: 650,   mode: 'Cash', paidTo: 'Local Shop',  staff: '' },
        { id: 'EXP004', date: '2026-10-05', category: 'Transport',   description: 'Goods transport',    amount: 1500,  mode: 'Cash', paidTo: 'Tempo',       staff: '' }
    ];

    /* ---------- SEED PURCHASES ---------- */
    const SEED_PURCHASES = [
        { id: 'PUR001', date: '2026-09-20', supplierId: 'SUP001', supplierName: 'Sharma Textiles', invoice: 'ST-2291', mode: 'Bank Transfer', total: 36900, paid: 20000, balance: 16900, notes: '', createdAt: 1,
          items: [
              { productId: 'P001', name: 'Denim Jeans (Slim Fit)', qty: 50, price: 450, total: 22500 },
              { productId: 'P002', name: 'Denim Jeans (Regular)', qty: 30, price: 480, total: 14400 }
          ] },
        { id: 'PUR002', date: '2026-09-25', supplierId: 'SUP002', supplierName: 'Gupta Garments', invoice: 'GG-8817', mode: 'UPI', total: 23600, paid: 23600, balance: 0, notes: 'Full payment', createdAt: 2,
          items: [
              { productId: 'P003', name: 'Formal Shirt (Cotton)', qty: 40, price: 320, total: 12800 },
              { productId: 'P005', name: 'Round Neck T-Shirt', qty: 60, price: 180, total: 10800 }
          ] },
        { id: 'PUR003', date: '2026-10-01', supplierId: 'SUP003', supplierName: 'Banaras Saree House', invoice: 'BSH-441', mode: 'Cash', total: 27000, paid: 15000, balance: 12000, notes: 'Baaki next week', createdAt: 3,
          items: [
              { productId: 'P008', name: 'Banarasi Silk Saree', qty: 15, price: 1800, total: 27000 }
          ] }
    ];

    /* ---------- SEED SALES ---------- */
    const SEED_SALES = [
        { id: 'SAL001', date: '2026-10-05', customer: 'Walk-in', phone: '', mode: 'Cash', status: 'Paid', discount: 0, staffId: 'STF002', staffName: 'Sunita Devi', notes: '', createdAt: 5,
          gross: 3145, total: 3145, cost: 1440, profit: 1705, margin: 54,
          items: [
              { productId: 'P001', name: 'Denim Jeans (Slim Fit)', qty: 2, price: 899, cost: 450, total: 1798, costTotal: 900, profit: 898 },
              { productId: 'P005', name: 'Round Neck T-Shirt', qty: 3, price: 449, cost: 180, total: 1347, costTotal: 540, profit: 807 }
          ] },
        { id: 'SAL002', date: '2026-10-06', customer: 'Rahul Sharma', phone: '9876511111', mode: 'UPI', status: 'Paid', discount: 0, staffId: 'STF002', staffName: 'Sunita Devi', notes: '', createdAt: 6,
          gross: 699, total: 699, cost: 320, profit: 379, margin: 54,
          items: [
              { productId: 'P003', name: 'Formal Shirt (Cotton)', qty: 1, price: 699, cost: 320, total: 699, costTotal: 320, profit: 379 }
          ] },
        { id: 'SAL003', date: '2026-10-07', customer: 'Sunita Yadav', phone: '9876522222', mode: 'Cash', status: 'Paid', discount: 100, staffId: 'STF001', staffName: 'Ramesh Kumar', notes: 'Diwali shopping', createdAt: 7,
          gross: 3499, total: 3399, cost: 1800, profit: 1599, margin: 47,
          items: [
              { productId: 'P008', name: 'Banarasi Silk Saree', qty: 1, price: 3499, cost: 1800, total: 3499, costTotal: 1800, profit: 1699 }
          ] },
        { id: 'SAL004', date: '2026-10-08', customer: 'Walk-in', phone: '', mode: 'Cash', status: 'Paid', discount: 0, staffId: 'STF002', staffName: 'Sunita Devi', notes: '', createdAt: 8,
          gross: 2398, total: 2398, cost: 1100, profit: 1298, margin: 54,
          items: [
              { productId: 'P010', name: 'Designer Kurti', qty: 2, price: 1199, cost: 550, total: 2398, costTotal: 1100, profit: 1298 }
          ] },
        { id: 'SAL005', date: '2026-10-09', customer: 'Amit Verma', phone: '9876533333', mode: 'Credit', status: 'Due', discount: 0, staffId: 'STF001', staffName: 'Ramesh Kumar', notes: 'Payment baad me', createdAt: 9,
          gross: 1898, total: 1898, cost: 930, profit: 968, margin: 51,
          items: [
              { productId: 'P001', name: 'Denim Jeans (Slim Fit)', qty: 1, price: 899, cost: 450, total: 899, costTotal: 450, profit: 449 },
              { productId: 'P002', name: 'Denim Jeans (Regular)', qty: 1, price: 999, cost: 480, total: 999, costTotal: 480, profit: 519 }
          ] },
        { id: 'SAL006', date: '2026-10-10', customer: 'Walk-in', phone: '', mode: 'Cash', status: 'Paid', discount: 0, staffId: 'STF002', staffName: 'Sunita Devi', notes: '', createdAt: 10,
          gross: 2247, total: 2247, cost: 1050, profit: 1197, margin: 53,
          items: [ { productId: 'P004', name: 'Casual Check Shirt', qty: 3, price: 749, cost: 350, total: 2247, costTotal: 1050, profit: 1197 } ] },
        { id: 'SAL007', date: '2026-10-11', customer: 'Neha Singh', phone: '9876544444', mode: 'UPI', status: 'Paid', discount: 100, staffId: 'STF004', staffName: 'Pooja Sharma', notes: '', createdAt: 11,
          gross: 3396, total: 3296, cost: 1520, profit: 1776, margin: 54,
          items: [ { productId: 'P011', name: 'Cotton Straight Kurti', qty: 4, price: 849, cost: 380, total: 3396, costTotal: 1520, profit: 1876 } ] },
        { id: 'SAL008', date: '2026-10-12', customer: 'Walk-in', phone: '', mode: 'Cash', status: 'Paid', discount: 0, staffId: 'STF002', staffName: 'Sunita Devi', notes: '', createdAt: 12,
          gross: 2995, total: 2995, cost: 1250, profit: 1745, margin: 58,
          items: [ { productId: 'P006', name: 'Polo T-Shirt', qty: 5, price: 599, cost: 250, total: 2995, costTotal: 1250, profit: 1745 } ] },
        { id: 'SAL009', date: '2026-10-13', customer: 'Ravi Gupta', phone: '9876555555', mode: 'UPI', status: 'Paid', discount: 0, staffId: 'STF001', staffName: 'Ramesh Kumar', notes: '', createdAt: 13,
          gross: 2198, total: 2198, cost: 1040, profit: 1158, margin: 53,
          items: [ { productId: 'P016', name: 'Formal Trouser', qty: 2, price: 1099, cost: 520, total: 2198, costTotal: 1040, profit: 1158 } ] },
        { id: 'SAL010', date: '2026-10-14', customer: 'Walk-in', phone: '', mode: 'Cash', status: 'Paid', discount: 0, staffId: 'STF004', staffName: 'Pooja Sharma', notes: 'Eid shopping', createdAt: 14,
          gross: 2697, total: 2697, cost: 1200, profit: 1497, margin: 56,
          items: [ { productId: 'P007', name: 'Cotton Kurta (Men)', qty: 3, price: 899, cost: 400, total: 2697, costTotal: 1200, profit: 1497 } ] }
    ];

    /* ---------- STORE ---------- */
    let store = null;

    function seed() {
        return {
            products:  JSON.parse(JSON.stringify(SEED_PRODUCTS)),
            suppliers: JSON.parse(JSON.stringify(SEED_SUPPLIERS)),
            purchases: JSON.parse(JSON.stringify(SEED_PURCHASES)),
            sales:     JSON.parse(JSON.stringify(SEED_SALES)),
            expenses:  JSON.parse(JSON.stringify(SEED_EXPENSES)),
            staff:     JSON.parse(JSON.stringify(SEED_STAFF)),
            salary:    [],
            config: {
                shopName: 'Apna Clothing Store',
                owner: 'Krishna Kumar',
                phone: '9876543210',
                address: 'Amethi, Uttar Pradesh',
                currency: '₹',
                lowStockAlert: 5
            }
        };
    }

    function load() {
        if (store) return store;
        try {
            const raw = localStorage.getItem(STORE_KEY);
            store = raw ? JSON.parse(raw) : seed();
        } catch (e) { store = seed(); }
        ['products', 'suppliers', 'purchases', 'sales', 'expenses', 'staff', 'salary'].forEach(function (k) {
            if (!store[k]) store[k] = [];
        });
        if (!store.products.length) store.products = JSON.parse(JSON.stringify(SEED_PRODUCTS));
        if (!store.suppliers.length) store.suppliers = JSON.parse(JSON.stringify(SEED_SUPPLIERS));
        if (!store.staff.length) store.staff = JSON.parse(JSON.stringify(SEED_STAFF));
        if (!store.config) store.config = seed().config;
        return store;
    }

    function saveLocalOnly() {
        try { localStorage.setItem(STORE_KEY, JSON.stringify(load())); } catch (e) { /* full */ }
    }

    /* Firestore sync */
    function collFor(key) {
        if (!window.FB || !FB.MAP) return null;
        return FB.MAP[key] || null;
    }
    function syncPush(key, obj) {
        if (!window.FB || !FB.ready) return;
        const c = collFor(key);
        if (c) { try { FB.set(c, obj); } catch (e) {} }
    }
    function syncDel(key, id) {
        if (!window.FB || !FB.ready) return;
        const c = collFor(key);
        if (c) { try { FB.del(c, id); } catch (e) {} }
    }
    function syncConfig() {
        if (!window.FB || !FB.ready) return;
        try { FB.set('cl_config', Object.assign({ id: 'app' }, load().config)); } catch (e) {}
    }

    function save() { saveLocalOnly(); }

    function reset() {
        localStorage.removeItem(STORE_KEY);
        store = null;
        load(); save();
    }

    /* ---------- HELPERS ---------- */
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
        });
    }
    function num(v) { const n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return isNaN(n) ? 0 : n; }
    function money(n) { return '₹' + num(n).toLocaleString('en-IN', { maximumFractionDigits: 2 }); }
    function uid(p) { return (p || 'ID') + Date.now().toString(36).toUpperCase().slice(-5) + Math.floor(Math.random() * 900 + 100); }
    function today() { return new Date().toISOString().slice(0, 10); }
    function initials(n) { return (n || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0] || ''; }).join('').toUpperCase(); }
    function product(id) { return load().products.filter(function (p) { return p.id === id; })[0]; }
    function supplier(id) { return load().suppliers.filter(function (s) { return s.id === id; })[0]; }
    function staff(id) { return load().staff.filter(function (s) { return s.id === id; })[0]; }

    /* ---------- STOCK ---------- */
    function adjustStock(productId, delta) {
        const p = product(productId);
        if (!p) return;
        p.stock = num(p.stock) + num(delta);
        save();
    }

    /* ---------- PURCHASE (Stock IN) ---------- */
    function createPurchase(data) {
        const s = load();
        const items = (data.items || []).map(function (it) {
            const p = product(it.productId);
            return {
                productId: it.productId,
                name: p ? p.name : it.name,
                qty: num(it.qty),
                price: num(it.price),
                total: num(it.qty) * num(it.price)
            };
        });
        const total = items.reduce(function (a, i) { return a + i.total; }, 0);
        const paid = num(data.paid);
        const rec = {
            id: uid('PUR'),
            date: data.date || today(),
            supplierId: data.supplierId,
            supplierName: (supplier(data.supplierId) || {}).name || '',
            items: items,
            total: total,
            paid: paid,
            balance: total - paid,
            mode: data.mode || 'Cash',
            invoice: data.invoice || '',
            notes: data.notes || '',
            createdAt: Date.now()
        };
        // stock badhao
        items.forEach(function (i) { adjustStock(i.productId, i.qty); });
        // supplier payment
        const sup = supplier(data.supplierId);
        if (sup) sup.paid = num(sup.paid) + paid;

        s.purchases.unshift(rec);
        save();
        syncPush('purchases', rec);
        if (sup) syncPush('suppliers', sup);
        items.forEach(function (i) { syncPush('products', product(i.productId)); });
        return rec;
    }

    /* ---------- SALE (Stock OUT + Profit) ---------- */
    function createSale(data) {
        const s = load();
        const items = (data.items || []).map(function (it) {
            const p = product(it.productId);
            const cost = num(it.cost != null ? it.cost : (p ? p.purchase : 0));
            const qty = num(it.qty);
            const price = num(it.price);
            return {
                productId: it.productId,
                name: p ? p.name : it.name,
                qty: qty,
                price: price,
                cost: cost,
                total: qty * price,
                costTotal: qty * cost,
                profit: (price - cost) * qty
            };
        });
        const total = items.reduce(function (a, i) { return a + i.total; }, 0);
        const costTotal = items.reduce(function (a, i) { return a + i.costTotal; }, 0);
        const discount = num(data.discount);
        const netTotal = total - discount;
        const profit = netTotal - costTotal;

        const rec = {
            id: uid('SAL'),
            date: data.date || today(),
            customer: data.customer || 'Walk-in',
            phone: data.phone || '',
            items: items,
            gross: total,
            discount: discount,
            total: netTotal,
            cost: costTotal,
            profit: profit,
            margin: netTotal ? Math.round(profit / netTotal * 100) : 0,
            mode: data.mode || 'Cash',
            status: data.status || 'Paid',
            staffId: data.staffId || '',
            staffName: (staff(data.staffId) || {}).name || '',
            notes: data.notes || '',
            createdAt: Date.now()
        };
        // stock ghatao
        items.forEach(function (i) { adjustStock(i.productId, -i.qty); });
        s.sales.unshift(rec);
        save();
        syncPush('sales', rec);
        items.forEach(function (i) { syncPush('products', product(i.productId)); });
        return rec;
    }

    function returnSale(saleId) {
        const s = load();
        const sale = s.sales.filter(function (x) { return x.id === saleId; })[0];
        if (!sale) return null;
        sale.items.forEach(function (i) { adjustStock(i.productId, i.qty); });
        sale.status = 'Returned';
        sale.profit = 0;
        save();
        return sale;
    }

    /* ---------- EXPENSE ---------- */
    function createExpense(data) {
        const s = load();
        const rec = {
            id: uid('EXP'),
            date: data.date || today(),
            category: data.category || 'Other',
            description: data.description || '',
            amount: num(data.amount),
            mode: data.mode || 'Cash',
            paidTo: data.paidTo || '',
            staffId: data.staffId || '',
            createdAt: Date.now()
        };
        s.expenses.unshift(rec);
        save();
        syncPush('expenses', rec);
        return rec;
    }

    /* ---------- SALARY ---------- */
    function paySalary(staffId, month, amount) {
        const s = load();
        const st = staff(staffId);
        const rec = {
            id: uid('SLR'),
            staffId: staffId,
            staffName: st ? st.name : '',
            month: month,
            amount: num(amount),
            date: today(),
            createdAt: Date.now()
        };
        s.salary.unshift(rec);
        save();
        syncPush('salary', rec);
        return rec;
    }

    /* ---------- STATS / P&L ---------- */
    function stats() {
        const s = load();

        const grossSale = s.sales.filter(function (x) { return x.status !== 'Returned'; })
            .reduce(function (a, x) { return a + num(x.total); }, 0);
        const cogs = s.sales.filter(function (x) { return x.status !== 'Returned'; })
            .reduce(function (a, x) { return a + num(x.cost); }, 0);
        const grossProfit = s.sales.filter(function (x) { return x.status !== 'Returned'; })
            .reduce(function (a, x) { return a + num(x.profit); }, 0);

        const expenseTotal = s.expenses.reduce(function (a, x) { return a + num(x.amount); }, 0);
        const salaryTotal = s.salary.reduce(function (a, x) { return a + num(x.amount); }, 0);
        const totalExpense = expenseTotal + salaryTotal;
        const netProfit = grossProfit - totalExpense;

        const purchaseTotal = s.purchases.reduce(function (a, x) { return a + num(x.total); }, 0);
        const purchasePaid = s.purchases.reduce(function (a, x) { return a + num(x.paid); }, 0);
        const purchaseDue = purchaseTotal - purchasePaid;

        const stockValue = s.products.reduce(function (a, p) { return a + num(p.stock) * num(p.purchase); }, 0);
        const stockSaleValue = s.products.reduce(function (a, p) { return a + num(p.stock) * num(p.sale); }, 0);
        const stockQty = s.products.reduce(function (a, p) { return a + num(p.stock); }, 0);

        const lowStock = s.products.filter(function (p) { return num(p.stock) <= num(p.reorder || 5); });
        const outStock = s.products.filter(function (p) { return num(p.stock) <= 0; });

        const cashIn = s.sales.filter(function (x) { return x.status === 'Paid'; })
            .reduce(function (a, x) { return a + num(x.total); }, 0);
        const saleDue = s.sales.filter(function (x) { return x.status === 'Due'; })
            .reduce(function (a, x) { return a + num(x.total); }, 0);

        return {
            products: s.products.length,
            suppliers: s.suppliers.length,
            staff: s.staff.length,
            stockQty: stockQty,
            stockValue: stockValue,
            stockSaleValue: stockSaleValue,
            stockPotentialProfit: stockSaleValue - stockValue,
            grossSale: grossSale,
            cogs: cogs,
            grossProfit: grossProfit,
            expenseTotal: expenseTotal,
            salaryTotal: salaryTotal,
            totalExpense: totalExpense,
            netProfit: netProfit,
            purchaseTotal: purchaseTotal,
            purchasePaid: purchasePaid,
            purchaseDue: purchaseDue,
            cashIn: cashIn,
            saleDue: saleDue,
            lowStock: lowStock.length,
            outStock: outStock.length,
            lowStockList: lowStock,
            salesCount: s.sales.length,
            purchasesCount: s.purchases.length
        };
    }

    /* ---------- SUPPLIER BALANCE ---------- */
    function supplierBalance(id) {
        const s = load();
        const sup = supplier(id);
        if (!sup) return { opening: 0, purchased: 0, paid: 0, balance: 0 };
        const purchased = s.purchases.filter(function (p) { return p.supplierId === id; })
            .reduce(function (a, p) { return a + num(p.total); }, 0);
        const paid = num(sup.paid);
        const opening = num(sup.opening);
        return { opening: opening, purchased: purchased, paid: paid, balance: opening + purchased - paid };
    }

    /* ---------- AUTH ---------- */
    function getUser() { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch (e) { return null; } }
    function setUser(u) { localStorage.setItem(USER_KEY, JSON.stringify(u)); }
    function logout() { localStorage.removeItem(USER_KEY); location.href = 'login.html'; }
    function requireAuth() { const u = getUser(); if (!u) { location.replace('login.html'); return null; } return u; }

    /* ---------- PUBLIC ---------- */
    window.CL = {
        CATEGORIES: CATEGORIES, SIZES: SIZES, EXPENSE_CATS: EXPENSE_CATS,
        PAY_MODES: PAY_MODES, ROLES: ROLES,
        load: load, save: save, reset: reset,
        saveLocalOnly: saveLocalOnly, syncPush: syncPush, syncDel: syncDel, syncConfig: syncConfig,
        esc: esc, num: num, money: money, uid: uid, today: today, initials: initials,
        product: product, supplier: supplier, staff: staff, adjustStock: adjustStock,
        createPurchase: createPurchase, createSale: createSale, returnSale: returnSale,
        createExpense: createExpense, paySalary: paySalary,
        stats: stats, supplierBalance: supplierBalance,
        getUser: getUser, setUser: setUser, logout: logout, requireAuth: requireAuth
    };
})();
