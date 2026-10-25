/* ============================================================
   APNIVO BUSINESS — Shared App Logic
   Path: public/clothing/panel/assets/app.js
   ============================================================ */

(function () {
    'use strict';

    var B = window.CL_BRAND || {};   // white-label brand config (brand.js)

    const NAV = [
        { id: 'dashboard', label: 'Dashboard',  icon: 'fa-gauge-high',        href: 'index.html' },
        { id: 'products',  label: 'Products',   icon: 'fa-shirt',             href: 'products.html' },
        { id: 'purchases', label: 'Purchases',  icon: 'fa-cart-flatbed',      href: 'purchases.html' },
        { id: 'sales',     label: 'Sales',      icon: 'fa-cash-register',     href: 'sales.html' },
        { id: 'suppliers', label: 'Wholesellers', icon: 'fa-truck-field',     href: 'suppliers.html' },
        { id: 'expenses',  label: 'Expenses',   icon: 'fa-receipt',           href: 'expenses.html' },
        { id: 'staff',     label: 'Staff',      icon: 'fa-users',             href: 'staff.html' },
        { id: 'reports',   label: 'Profit / Loss', icon: 'fa-chart-line',     href: 'reports.html' },
        { id: 'orders',    label: 'Marketplace Orders', icon: 'fa-bag-shopping', href: 'orders.html' },
        { id: 'settings',  label: 'Settings',   icon: 'fa-gear',             href: 'settings.html' }
    ];

    function $(id) { return document.getElementById(id); }
    function page() { return document.body.getAttribute('data-page'); }

    function toast(msg) {
        let t = $('toast');
        if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(t._t);
        t._t = setTimeout(function () { t.classList.remove('show'); }, 2600);
    }

    /* ---------- SHELL ---------- */
    function renderShell() {
        const p = page();
        const sb = $('sidebar'), tb = $('topbar');
        const u = CL.getUser();
        const cur = NAV.filter(function (n) { return n.id === p; })[0];

        if (sb) {
            const s = CL.load();
            const counts = {
                products: s.products.length, purchases: s.purchases.length,
                sales: s.sales.length, suppliers: s.suppliers.length,
                expenses: s.expenses.length, staff: s.staff.length
            };
            sb.innerHTML =
                '<div class="sidebar-brand"><i class="fas ' + (B.logoIcon || 'fa-shirt') + '"></i>' +
                '<div class="bt">' + CL.esc(B.name || 'Apnivo Business') + '<small>' + CL.esc(s.config.shopName || '') + '</small></div></div>' +
                '<div class="sidebar-section">Main Menu</div>' +
                '<nav class="sidebar-nav">' + NAV.map(function (n) {
                    return '<a href="' + n.href + '" class="' + (n.id === p ? 'active' : '') + '">' +
                        '<i class="fas ' + n.icon + '"></i><span>' + n.label + '</span>' +
                        (counts[n.id] != null ? '<span class="cnt">' + counts[n.id] + '</span>' : '') + '</a>';
                }).join('') + '</nav>' +
                '<div class="sidebar-footer">' +
                    '<a href="#" onclick="App.resetData();return false;"><i class="fas fa-rotate-left"></i> Reset Data</a>' +
                    '<a href="../store/index.html"><i class="fas fa-store"></i> Go to Shop</a>' +
                    '<a href="#" onclick="CL.logout();return false;"><i class="fas fa-right-from-bracket"></i> Logout</a>' +
                '</div>';
        }

        if (tb) {
            tb.innerHTML =
                '<button class="hamburger" onclick="document.getElementById(\'sidebar\').classList.toggle(\'open\')"><i class="fas fa-bars"></i></button>' +
                '<h1>' + CL.esc(cur ? cur.label : 'Dashboard') + '</h1><div class="spacer"></div>' +
                '<div class="topbar-search"><i class="fas fa-search"></i>' +
                '<input type="text" id="gSearch" placeholder="Search..." oninput="App.search(this.value)"></div>' +
                '<div class="topbar-user"><div class="avatar">' + CL.esc(CL.initials(u ? u.name : 'Admin')) + '</div>' +
                '<div class="um"><div class="un">' + CL.esc(u ? u.name : 'Admin') + '</div>' +
                '<div class="ur">' + CL.esc(u ? u.role : 'Owner') + '</div></div></div>';
        }
    }

    /* ---------- MODAL ---------- */
    function openModal(title, body, foot, wide) {
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

    /* ============================================================
       DASHBOARD
       ============================================================ */
    function renderDashboard() {
        const s = CL.load();
        const st = CL.stats();

        const cards = [
            { i: 'fa-shirt', c: 'purple', v: st.products, l: 'Products' },
            { i: 'fa-boxes-stacked', c: 'blue', v: st.stockQty, l: 'Total Stock (pcs)' },
            { i: 'fa-warehouse', c: 'orange', v: CL.money(st.stockValue), l: 'Stock Value (cost)' },
            { i: 'fa-cash-register', c: 'green', v: CL.money(st.grossSale), l: 'Total Sales' },
            { i: 'fa-arrow-trend-up', c: 'green', v: CL.money(st.grossProfit), l: 'Gross Profit' },
            { i: 'fa-receipt', c: 'red', v: CL.money(st.totalExpense), l: 'Total Expenses' },
            { i: 'fa-sack-dollar', c: st.netProfit >= 0 ? 'green' : 'red', v: CL.money(st.netProfit), l: 'Net Profit / Loss' },
            { i: 'fa-hand-holding-dollar', c: 'orange', v: CL.money(st.purchaseDue), l: 'Supplier Payable' }
        ];

        $('dashStats').innerHTML = cards.map(function (c) {
            return '<div class="stat-card"><div class="stat-icon ' + c.c + '"><i class="fas ' + c.i + '"></i></div>' +
                   '<div><div class="stat-value' + (c.l.indexOf('Profit') > -1 ? (CL.num(c.v.replace(/[^0-9.\-]/g, '')) >= 0 ? ' pos' : ' neg') : '') + '">' + c.v + '</div>' +
                   '<div class="stat-label">' + c.l + '</div></div></div>';
        }).join('');

        // low stock
        const low = $('lowStock');
        if (low) {
            low.innerHTML = st.lowStockList.length ? st.lowStockList.slice(0, 8).map(function (p) {
                return '<tr><td><strong>' + CL.esc(p.name) + '</strong><div style="font-size:11px;color:var(--muted)">' + CL.esc(p.category) + ' · ' + CL.esc(p.size) + '</div></td>' +
                    '<td>' + CL.esc((CL.supplier(p.supplier) || {}).name || '—') + '</td>' +
                    '<td>' + (CL.num(p.stock) <= 0 ? '<span class="badge red">Out</span>' : '<span class="badge orange">' + p.stock + ' left</span>') + '</td>' +
                    '<td class="num">' + CL.money(p.purchase) + '</td></tr>';
            }).join('') : '<tr><td colspan="4"><div class="empty"><i class="fas fa-circle-check"></i>Sab stock theek hai</div></td></tr>';
        }

        // recent sales
        const rs = $('recentSales');
        if (rs) {
            rs.innerHTML = s.sales.length ? s.sales.slice(0, 6).map(function (x) {
                return '<tr><td><strong>' + x.id + '</strong><div style="font-size:11px;color:var(--muted)">' + CL.esc(x.date) + '</div></td>' +
                    '<td>' + CL.esc(x.customer) + '</td>' +
                    '<td class="num">' + CL.money(x.total) + '</td>' +
                    '<td class="num" style="color:' + (x.profit >= 0 ? 'var(--success)' : 'var(--danger)') + ';font-weight:700">' + CL.money(x.profit) + '</td></tr>';
            }).join('') : '<tr><td colspan="4"><div class="empty"><i class="fas fa-cash-register"></i>No sales yet</div></td></tr>';
        }

        // shop settings
        const cfg = s.config || {};
        if ($('cfgName'))  $('cfgName').value  = cfg.shopName || '';
        if ($('cfgOwner')) $('cfgOwner').value = cfg.owner || '';
        if ($('cfgPhone')) $('cfgPhone').value = cfg.phone || '';
        if ($('cfgWa'))    $('cfgWa').value    = cfg.whatsapp || '';
        if ($('cfgAddr'))  $('cfgAddr').value  = cfg.address || '';
        if ($('cfgLow'))   $('cfgLow').value   = cfg.lowStockAlert || 5;
    }

    function saveShop() {
        const s = CL.load();
        s.config.shopName = $('cfgName').value.trim();
        s.config.owner = $('cfgOwner').value.trim();
        s.config.phone = $('cfgPhone').value.trim();
        s.config.whatsapp = $('cfgWa').value.trim();
        s.config.address = $('cfgAddr').value.trim();
        s.config.lowStockAlert = CL.num($('cfgLow').value) || 5;
        CL.save();
        CL.syncConfig();
        toast('Shop settings saved');
        renderShell();
        render();
    }

    /* ============================================================
       PRODUCTS
       ============================================================ */
    let prodQ = '';
    function renderProducts() {
        const s = CL.load();
        const q = prodQ.toLowerCase();
        const list = s.products.filter(function (p) {
            if (!q) return true;
            return (p.name + ' ' + p.category + ' ' + p.size + ' ' + p.color + ' ' + p.id).toLowerCase().indexOf(q) > -1;
        });
        const st = CL.stats();
        if ($('pTotal')) $('pTotal').textContent = s.products.length;
        if ($('pStockVal')) $('pStockVal').textContent = CL.money(st.stockValue);

        $('productsBody').innerHTML = list.length ? list.map(function (p) {
            const low = CL.num(p.stock) <= CL.num(p.reorder || 5);
            const margin = p.sale ? Math.round((p.sale - p.purchase) / p.sale * 100) : 0;
            return '<tr>' +
                '<td><div class="cell-user"><div class="avatar" style="background:var(--primary-light);color:var(--primary)"><i class="fas ' + (p.icon || 'fa-shirt') + '"></i></div>' +
                '<div><div class="cn">' + CL.esc(p.name) + '</div><div class="cs">' + CL.esc(p.id) + ' · ' + CL.esc(p.category) + '</div></div></div></td>' +
                '<td>' + CL.esc(p.size) + ' / ' + CL.esc(p.color) + '</td>' +
                '<td>' + CL.esc((CL.supplier(p.supplier) || {}).name || '—') + '</td>' +
                '<td class="num">' + CL.money(p.purchase) + '</td>' +
                '<td class="num">' + CL.money(p.sale) + '</td>' +
                '<td class="num" style="color:var(--success);font-weight:700">' + margin + '%</td>' +
                '<td>' + (CL.num(p.stock) <= 0 ? '<span class="badge red">Out</span>' : low ? '<span class="badge orange">' + p.stock + '</span>' : '<span class="badge green">' + p.stock + '</span>') + '</td>' +
                '<td class="num">' + CL.money(CL.num(p.stock) * CL.num(p.purchase)) + '</td>' +
                '<td style="white-space:nowrap">' +
                    '<button class="btn btn-icon" onclick="App.printBarcode(\'' + p.id + '\')" title="Print Barcode"><i class="fas fa-barcode"></i></button> ' +
                    '<button class="btn btn-icon" onclick="App.editProduct(\'' + p.id + '\')"><i class="fas fa-pen"></i></button> ' +
                    '<button class="btn btn-icon" onclick="App.delProduct(\'' + p.id + '\')"><i class="fas fa-trash"></i></button>' +
                '</td></tr>';
        }).join('') : '<tr><td colspan="9"><div class="empty"><i class="fas fa-shirt"></i>No products found</div></td></tr>';
    }

    function productForm(p) {
        p = p || {};
        const catOpts = CL.CATEGORIES.map(function (c) { return '<option' + (p.category === c ? ' selected' : '') + '>' + c + '</option>'; }).join('');
        const sizeOpts = CL.SIZES.map(function (c) { return '<option' + (p.size === c ? ' selected' : '') + '>' + c + '</option>'; }).join('');
        const supOpts = CL.load().suppliers.map(function (x) { return '<option value="' + x.id + '"' + (p.supplier === x.id ? ' selected' : '') + '>' + CL.esc(x.name) + '</option>'; }).join('');

        openModal((p.id ? 'Edit' : 'Add') + ' Product',
            '<div class="form-row">' +
                '<div class="form-group"><label>Product ID *</label><input class="form-control" id="fId" value="' + CL.esc(p.id || '') + '"' + (p.id ? ' readonly' : '') + '></div>' +
                '<div class="form-group"><label>Category</label><select class="form-control" id="fCat">' + catOpts + '</select></div>' +
            '</div>' +
            '<div class="form-group"><label>Product Name *</label><input class="form-control" id="fName" value="' + CL.esc(p.name || '') + '"></div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Size</label><select class="form-control" id="fSize">' + sizeOpts + '</select></div>' +
                '<div class="form-group"><label>Color</label><input class="form-control" id="fColor" value="' + CL.esc(p.color || '') + '"></div>' +
            '</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Purchase Price (₹) *</label><input type="number" class="form-control" id="fPur" value="' + (p.purchase || '') + '"></div>' +
                '<div class="form-group"><label>Sale Price (₹) *</label><input type="number" class="form-control" id="fSale" value="' + (p.sale || '') + '"></div>' +
            '</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Stock (pcs)</label><input type="number" class="form-control" id="fStock" value="' + (p.stock != null ? p.stock : 0) + '"></div>' +
                '<div class="form-group"><label>Reorder Level</label><input type="number" class="form-control" id="fRe" value="' + (p.reorder != null ? p.reorder : 5) + '"></div>' +
            '</div>' +
            '<div class="form-group"><label>Wholeseller</label><select class="form-control" id="fSup">' + supOpts + '</select></div>',
            '<button class="btn btn-light" onclick="App.closeModal()">Cancel</button>' +
            '<button class="btn btn-primary" onclick="App.saveProduct(' + (p.id ? 'true' : 'false') + ')"><i class="fas fa-floppy-disk"></i> Save</button>');
    }

    function saveProduct(isEdit) {
        const s = CL.load();
        const id = $('fId').value.trim().toUpperCase();
        const name = $('fName').value.trim();
        const pur = CL.num($('fPur').value), sale = CL.num($('fSale').value);
        if (!id || !name || !pur || !sale) { toast('ID, Name, Purchase aur Sale price zaroori hai'); return; }

        const rec = {
            id: id, name: name, category: $('fCat').value, size: $('fSize').value,
            color: $('fColor').value.trim(), purchase: pur, sale: sale,
            stock: CL.num($('fStock').value), reorder: CL.num($('fRe').value),
            supplier: $('fSup').value, icon: 'fa-shirt'
        };
        const i = s.products.map(function (x) { return x.id; }).indexOf(id);
        if (isEdit && i > -1) { s.products[i] = rec; toast('Product updated'); }
        else { if (i > -1) { toast('Product ID already exists'); return; } s.products.push(rec); toast('Product added'); }
        CL.save(); CL.syncPush('products', rec); closeModal(); render();
    }

    function editProduct(id) { const p = CL.product(id); if (p) productForm(p); }
    function delProduct(id) {
        if (!confirm('Delete product ' + id + '?')) return;
        const s = CL.load();
        s.products = s.products.filter(function (p) { return p.id !== id; });
        CL.save(); CL.syncDel('products', id); render(); toast('Product deleted');
    }

    /* ============================================================
       SUPPLIERS (Wholesellers)
       ============================================================ */
    function renderSuppliers() {
        const s = CL.load();
        $('suppliersBody').innerHTML = s.suppliers.length ? s.suppliers.map(function (x) {
            const b = CL.supplierBalance(x.id);
            const purchased = CL.load().purchases.filter(function (p) { return p.supplierId === x.id; }).length;
            return '<tr>' +
                '<td><div class="cell-user"><div class="avatar" style="background:var(--primary-light);color:var(--primary)">' + CL.esc(CL.initials(x.name)) + '</div>' +
                '<div><div class="cn">' + CL.esc(x.name) + '</div><div class="cs">' + CL.esc(x.id) + ' · ' + CL.esc(x.city || '') + '</div></div></div></td>' +
                '<td>' + CL.esc(x.phone || '—') + '</td>' +
                '<td>' + CL.esc(x.gst || '—') + '</td>' +
                '<td class="num">' + purchased + '</td>' +
                '<td class="num">' + CL.money(b.purchased) + '</td>' +
                '<td class="num">' + CL.money(b.paid) + '</td>' +
                '<td class="num" style="font-weight:700;color:' + (b.balance > 0 ? 'var(--danger)' : 'var(--success)') + '">' + CL.money(b.balance) + '</td>' +
                '<td>' + (x.status === 'Active' ? '<span class="badge green">Active</span>' : '<span class="badge grey">' + CL.esc(x.status) + '</span>') + '</td>' +
                '<td style="white-space:nowrap">' +
                    '<button class="btn btn-icon" onclick="App.paySupplier(\'' + x.id + '\')" title="Payment"><i class="fas fa-indian-rupee-sign"></i></button> ' +
                    '<button class="btn btn-icon" onclick="App.editSupplier(\'' + x.id + '\')"><i class="fas fa-pen"></i></button> ' +
                    '<button class="btn btn-icon" onclick="App.delSupplier(\'' + x.id + '\')"><i class="fas fa-trash"></i></button>' +
                '</td></tr>';
        }).join('') : '<tr><td colspan="9"><div class="empty"><i class="fas fa-truck-field"></i>No wholesalers</div></td></tr>';
    }

    function supplierForm(x) {
        x = x || {};
        openModal((x.id ? 'Edit' : 'Add') + ' Wholeseller',
            '<div class="form-row">' +
                '<div class="form-group"><label>Supplier ID *</label><input class="form-control" id="sId" value="' + CL.esc(x.id || '') + '"' + (x.id ? ' readonly' : '') + '></div>' +
                '<div class="form-group"><label>Status</label><select class="form-control" id="sStatus"><option' + (x.status === 'Active' ? ' selected' : '') + '>Active</option><option' + (x.status === 'Inactive' ? ' selected' : '') + '>Inactive</option></select></div>' +
            '</div>' +
            '<div class="form-group"><label>Business Name *</label><input class="form-control" id="sName" value="' + CL.esc(x.name || '') + '"></div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Phone</label><input class="form-control" id="sPhone" value="' + CL.esc(x.phone || '') + '"></div>' +
                '<div class="form-group"><label>City</label><input class="form-control" id="sCity" value="' + CL.esc(x.city || '') + '"></div>' +
            '</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>GST No</label><input class="form-control" id="sGst" value="' + CL.esc(x.gst || '') + '"></div>' +
                '<div class="form-group"><label>Opening Balance (₹)</label><input type="number" class="form-control" id="sOpen" value="' + (x.opening || 0) + '"></div>' +
            '</div>' +
            '<div class="form-group"><label>Notes</label><input class="form-control" id="sNotes" value="' + CL.esc(x.notes || '') + '"></div>',
            '<button class="btn btn-light" onclick="App.closeModal()">Cancel</button>' +
            '<button class="btn btn-primary" onclick="App.saveSupplier(' + (x.id ? 'true' : 'false') + ')"><i class="fas fa-floppy-disk"></i> Save</button>');
    }

    function saveSupplier(isEdit) {
        const s = CL.load();
        const id = $('sId').value.trim().toUpperCase();
        const name = $('sName').value.trim();
        if (!id || !name) { toast('ID aur Name zaroori hai'); return; }
        const rec = {
            id: id, name: name, phone: $('sPhone').value.trim(), city: $('sCity').value.trim(),
            gst: $('sGst').value.trim(), opening: CL.num($('sOpen').value),
            paid: 0, status: $('sStatus').value, notes: $('sNotes').value.trim()
        };
        const i = s.suppliers.map(function (x) { return x.id; }).indexOf(id);
        if (isEdit && i > -1) { rec.paid = s.suppliers[i].paid; s.suppliers[i] = rec; toast('Updated'); }
        else { if (i > -1) { toast('ID already exists'); return; } s.suppliers.push(rec); toast('Wholeseller added'); }
        CL.save(); CL.syncPush('suppliers', rec); closeModal(); render();
    }

    function editSupplier(id) { const x = CL.supplier(id); if (x) supplierForm(x); }
    function delSupplier(id) {
        if (!confirm('Delete supplier ' + id + '?')) return;
        const s = CL.load();
        s.suppliers = s.suppliers.filter(function (x) { return x.id !== id; });
        CL.save(); CL.syncDel('suppliers', id); render(); toast('Deleted');
    }

    function paySupplier(id) {
        const x = CL.supplier(id);
        const b = CL.supplierBalance(id);
        openModal('Pay to ' + CL.esc(x.name),
            '<div style="background:var(--bg);border-radius:10px;padding:14px;margin-bottom:16px">' +
                '<div style="display:flex;justify-content:space-between;font-size:13px;padding:3px 0"><span>Opening</span><span>' + CL.money(b.opening) + '</span></div>' +
                '<div style="display:flex;justify-content:space-between;font-size:13px;padding:3px 0"><span>Total Purchased</span><span>' + CL.money(b.purchased) + '</span></div>' +
                '<div style="display:flex;justify-content:space-between;font-size:13px;padding:3px 0"><span>Paid so far</span><span>' + CL.money(b.paid) + '</span></div>' +
                '<div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;border-top:1px dashed var(--border);margin-top:6px;padding-top:8px"><span>Balance Due</span><span style="color:var(--danger)">' + CL.money(b.balance) + '</span></div>' +
            '</div>' +
            '<div class="form-group"><label>Payment Amount (₹)</label><input type="number" class="form-control" id="payAmt" value="' + Math.max(0, b.balance) + '"></div>' +
            '<div class="form-group"><label>Mode</label><select class="form-control" id="payMode">' + CL.PAY_MODES.map(function (m) { return '<option>' + m + '</option>'; }).join('') + '</select></div>',
            '<button class="btn btn-light" onclick="App.closeModal()">Cancel</button>' +
            '<button class="btn btn-success" onclick="App.doPaySupplier(\'' + id + '\')"><i class="fas fa-check"></i> Record Payment</button>');
    }

    function doPaySupplier(id) {
        const amt = CL.num($('payAmt').value);
        if (amt <= 0) { toast('Amount daalein'); return; }
        const x = CL.supplier(id);
        x.paid = CL.num(x.paid) + amt;
        CL.createExpense({ category: 'Other', description: 'Payment to ' + x.name, amount: amt, mode: $('payMode').value, paidTo: x.name });
        CL.save(); CL.syncPush('suppliers', x); closeModal(); render(); toast('Payment recorded: ' + CL.money(amt));
    }

    /* ============================================================
       PURCHASES (Stock IN)
       ============================================================ */
    function renderPurchases() {
        const s = CL.load();
        const st = CL.stats();
        if ($('puTotal')) $('puTotal').textContent = CL.money(st.purchaseTotal);
        if ($('puPaid')) $('puPaid').textContent = CL.money(st.purchasePaid);
        if ($('puDue')) $('puDue').textContent = CL.money(st.purchaseDue);

        $('purchasesBody').innerHTML = s.purchases.length ? s.purchases.map(function (x) {
            return '<tr>' +
                '<td><strong>' + x.id + '</strong><div style="font-size:11px;color:var(--muted)">' + CL.esc(x.date) + '</div></td>' +
                '<td>' + CL.esc(x.supplierName || '—') + (x.invoice ? '<div style="font-size:11px;color:var(--muted)">Inv: ' + CL.esc(x.invoice) + '</div>' : '') + '</td>' +
                '<td>' + x.items.length + ' items<div style="font-size:11px;color:var(--muted)">' + x.items.reduce(function (a, i) { return a + i.qty; }, 0) + ' pcs</div></td>' +
                '<td class="num">' + CL.money(x.total) + '</td>' +
                '<td class="num">' + CL.money(x.paid) + '</td>' +
                '<td class="num" style="font-weight:700;color:' + (x.balance > 0 ? 'var(--danger)' : 'var(--success)') + '">' + CL.money(x.balance) + '</td>' +
                '<td>' + (x.balance <= 0 ? '<span class="badge green">Paid</span>' : x.paid > 0 ? '<span class="badge orange">Partial</span>' : '<span class="badge red">Unpaid</span>') + '</td>' +
                '<td style="white-space:nowrap">' +
                    '<button class="btn btn-icon" onclick="App.viewPurchase(\'' + x.id + '\')"><i class="fas fa-eye"></i></button> ' +
                    '<button class="btn btn-icon" onclick="App.delPurchase(\'' + x.id + '\')"><i class="fas fa-trash"></i></button>' +
                '</td></tr>';
        }).join('') : '<tr><td colspan="8"><div class="empty"><i class="fas fa-cart-flatbed"></i>No purchases</div></td></tr>';
    }

    function viewPurchase(id) {
        const x = CL.load().purchases.filter(function (p) { return p.id === id; })[0];
        if (!x) return;
        openModal('Purchase ' + x.id,
            '<div style="font-size:13px;color:var(--muted);margin-bottom:12px">' + CL.esc(x.date) + ' · ' + CL.esc(x.supplierName) + ' · ' + CL.esc(x.mode) + '</div>' +
            '<table><thead><tr><th>Product</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Total</th></tr></thead><tbody>' +
            x.items.map(function (i) {
                return '<tr><td>' + CL.esc(i.name) + '</td><td class="num">' + i.qty + '</td><td class="num">' + CL.money(i.price) + '</td><td class="num">' + CL.money(i.total) + '</td></tr>';
            }).join('') +
            '</tbody></table>' +
            '<div style="margin-top:14px;text-align:right">' +
                '<div style="font-size:14px">Total: <strong>' + CL.money(x.total) + '</strong></div>' +
                '<div style="font-size:14px">Paid: <strong>' + CL.money(x.paid) + '</strong></div>' +
                '<div style="font-size:16px;color:var(--danger);font-weight:800">Balance: ' + CL.money(x.balance) + '</div>' +
            '</div>');
    }

    function delPurchase(id) {
        if (!confirm('Delete purchase ' + id + '? Stock wapas ho jayega.')) return;
        const s = CL.load();
        const x = s.purchases.filter(function (p) { return p.id === id; })[0];
        if (x) {
            x.items.forEach(function (i) { CL.adjustStock(i.productId, -i.qty); });
            const sup = CL.supplier(x.supplierId);
            if (sup) sup.paid = Math.max(0, CL.num(sup.paid) - CL.num(x.paid));
            s.purchases = s.purchases.filter(function (p) { return p.id !== id; });
        }
        CL.save(); CL.syncDel('purchases', id); render(); toast('Purchase deleted');
    }

    /* ============================================================
       SALES (POS)
       ============================================================ */
    let saleLines = [];

    function renderSales() {
        const s = CL.load();
        const st = CL.stats();
        if ($('saTotal')) $('saTotal').textContent = CL.money(st.grossSale);
        if ($('saProfit')) $('saProfit').textContent = CL.money(st.grossProfit);
        if ($('saCount')) $('saCount').textContent = st.salesCount;

        $('salesBody').innerHTML = s.sales.length ? s.sales.map(function (x) {
            return '<tr>' +
                '<td><strong>' + x.id + '</strong><div style="font-size:11px;color:var(--muted)">' + CL.esc(x.date) + '</div></td>' +
                '<td>' + CL.esc(x.customer) + (x.phone ? '<div style="font-size:11px;color:var(--muted)">' + CL.esc(x.phone) + '</div>' : '') + '</td>' +
                '<td>' + x.items.length + ' items<div style="font-size:11px;color:var(--muted)">' + x.items.reduce(function (a, i) { return a + i.qty; }, 0) + ' pcs</div></td>' +
                '<td class="num">' + CL.money(x.total) + '</td>' +
                '<td class="num" style="color:' + (x.profit >= 0 ? 'var(--success)' : 'var(--danger)') + ';font-weight:700">' + CL.money(x.profit) + '</td>' +
                '<td class="num">' + x.margin + '%</td>' +
                '<td>' + CL.esc(x.mode) + '</td>' +
                '<td>' + (x.status === 'Paid' ? '<span class="badge green">Paid</span>' : x.status === 'Returned' ? '<span class="badge grey">Returned</span>' : '<span class="badge orange">Due</span>') + '</td>' +
                '<td style="white-space:nowrap">' +
                    '<button class="btn btn-icon" onclick="App.viewSale(\'' + x.id + '\')"><i class="fas fa-eye"></i></button> ' +
                    '<button class="btn btn-icon" onclick="App.delSale(\'' + x.id + '\')"><i class="fas fa-trash"></i></button>' +
                '</td></tr>';
        }).join('') : '<tr><td colspan="9"><div class="empty"><i class="fas fa-cash-register"></i>No sales yet</div></td></tr>';
    }

    function viewSale(id) {
        const x = CL.load().sales.filter(function (s) { return s.id === id; })[0];
        if (!x) return;
        openModal('Bill — ' + x.id,
            '<div style="font-size:13px;color:var(--muted);margin-bottom:12px">' + CL.esc(x.date) + ' · ' + CL.esc(x.customer) + ' · ' + CL.esc(x.mode) + '</div>' +
            '<table><thead><tr><th>Product</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Total</th><th class="num">Profit</th></tr></thead><tbody>' +
            x.items.map(function (i) {
                return '<tr><td>' + CL.esc(i.name) + '</td><td class="num">' + i.qty + '</td><td class="num">' + CL.money(i.price) +
                    '</td><td class="num">' + CL.money(i.total) + '</td>' +
                    '<td class="num" style="color:' + (i.profit >= 0 ? 'var(--success)' : 'var(--danger)') + '">' + CL.money(i.profit) + '</td></tr>';
            }).join('') +
            '</tbody></table>' +
            '<div style="margin-top:14px;text-align:right">' +
                '<div style="font-size:14px">Gross: <strong>' + CL.money(x.gross) + '</strong></div>' +
                (x.discount ? '<div style="font-size:14px">Discount: <strong>-' + CL.money(x.discount) + '</strong></div>' : '') +
                '<div style="font-size:17px;font-weight:800">Total: ' + CL.money(x.total) + '</div>' +
                '<div style="font-size:15px;color:' + (x.profit >= 0 ? 'var(--success)' : 'var(--danger)') + ';font-weight:800">Profit: ' + CL.money(x.profit) + ' (' + x.margin + '%)</div>' +
            '</div>',
            '<button class="btn btn-light" onclick="App.closeModal()">Close</button>' +
            '<button class="btn btn-primary" onclick="App.printReceipt(\'' + x.id + '\')"><i class="fas fa-print"></i> Print Bill</button>');
    }

    function delSale(id) {
        if (!confirm('Delete sale ' + id + '? Stock wapas ho jayega.')) return;
        const s = CL.load();
        const x = s.sales.filter(function (v) { return v.id === id; })[0];
        if (x) { x.items.forEach(function (i) { CL.adjustStock(i.productId, i.qty); }); s.sales = s.sales.filter(function (v) { return v.id !== id; }); }
        CL.save(); CL.syncDel('sales', id); render(); toast('Sale deleted');
    }

    /* ---------- POS SALE FORM ---------- */
    function openSale() {
        saleLines = [{ productId: '', qty: 1, price: 0 }];
        openModal('<i class="fas fa-cash-register"></i> New Sale (POS)',
            '<div class="pos-grid">' +
                '<div>' +
                    '<div id="posLines"></div>' +
                    '<button class="btn btn-light btn-sm" style="margin-top:6px" onclick="App.addLine()"><i class="fas fa-plus"></i> Add Item</button>' +
                '</div>' +
                '<div class="bill">' +
                    '<div class="row"><span>Items</span><span id="bItems">0</span></div>' +
                    '<div class="row"><span>Gross</span><span id="bGross">₹0</span></div>' +
                    '<div class="row"><span>Cost</span><span id="bCost">₹0</span></div>' +
                    '<div class="row"><span>Discount</span><span id="bDisc">₹0</span></div>' +
                    '<div class="row big"><span>Total</span><span id="bTotal">₹0</span></div>' +
                    '<div class="row profit" id="bProfitRow"><span>Profit</span><span id="bProfit">₹0</span></div>' +
                    '<div class="row" style="margin-top:10px"><span>Margin</span><span id="bMargin">0%</span></div>' +
                '</div>' +
            '</div>' +
            '<div class="form-row" style="margin-top:16px">' +
                '<div class="form-group"><label>Customer Name</label><input class="form-control" id="sCust" placeholder="Walk-in" value="Walk-in"></div>' +
                '<div class="form-group"><label>Phone</label><input class="form-control" id="sPhone" placeholder="optional"></div>' +
            '</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Discount (₹)</label><input type="number" class="form-control" id="sDisc" value="0" oninput="App.posCalc()"></div>' +
                '<div class="form-group"><label>Payment Mode</label><select class="form-control" id="sMode">' + CL.PAY_MODES.map(function (m) { return '<option>' + m + '</option>'; }).join('') + '</select></div>' +
                '<div class="form-group"><label>Status</label><select class="form-control" id="sStatus"><option>Paid</option><option>Due</option></select></div>' +
                '<div class="form-group"><label>Served By</label><select class="form-control" id="sStaff">' + CL.load().staff.map(function (x) { return '<option value="' + x.id + '">' + CL.esc(x.name) + '</option>'; }).join('') + '</select></div>' +
            '</div>',
            '<button class="btn btn-light" onclick="App.closeModal()">Cancel</button>' +
            '<button class="btn btn-success" onclick="App.saveSale()"><i class="fas fa-check"></i> Complete Sale</button>', true);
        drawLines();
    }

    function drawLines() {
        const s = CL.load();
        const opts = s.products.map(function (p) {
            return '<option value="' + p.id + '">' + CL.esc(p.name) + ' (' + CL.esc(p.size) + ') — Stock ' + p.stock + '</option>';
        }).join('');
        $('posLines').innerHTML = saleLines.map(function (l, i) {
            return '<div class="pos-line">' +
                '<select class="form-control" onchange="App.lineProduct(' + i + ',this.value)"><option value="">— Select Product —</option>' + opts + '</select>' +
                '<input type="number" class="form-control" placeholder="Qty" value="' + (l.qty || 1) + '" oninput="App.lineVal(' + i + ',\'qty\',this.value)">' +
                '<input type="number" class="form-control" placeholder="Rate" value="' + (l.price || '') + '" oninput="App.lineVal(' + i + ',\'price\',this.value)">' +
                '<input class="form-control" value="' + CL.money(CL.num(l.qty) * CL.num(l.price)) + '" readonly>' +
                '<button class="rm" onclick="App.rmLine(' + i + ')"><i class="fas fa-xmark"></i></button>' +
            '</div>';
        }).join('');
        // set selected values
        saleLines.forEach(function (l, i) {
            const sel = $('posLines').querySelectorAll('select')[i];
            if (sel && l.productId) sel.value = l.productId;
        });
        posCalc();
    }

    function addLine() { saleLines.push({ productId: '', qty: 1, price: 0 }); drawLines(); }
    function rmLine(i) { saleLines.splice(i, 1); if (!saleLines.length) saleLines.push({ productId: '', qty: 1, price: 0 }); drawLines(); }
    function lineProduct(i, pid) {
        saleLines[i].productId = pid;
        const p = CL.product(pid);
        if (p) saleLines[i].price = p.sale;
        drawLines();
    }
    function lineVal(i, k, v) { saleLines[i][k] = CL.num(v); posCalc(); }

    function posCalc() {
        let gross = 0, cost = 0, items = 0;
        saleLines.forEach(function (l) {
            const p = CL.product(l.productId);
            const q = CL.num(l.qty), pr = CL.num(l.price);
            gross += q * pr;
            cost += q * CL.num(p ? p.purchase : 0);
            items += q;
        });
        const disc = CL.num($('sDisc') ? $('sDisc').value : 0);
        const total = gross - disc;
        const profit = total - cost;
        const margin = total ? Math.round(profit / total * 100) : 0;

        $('bItems').textContent = items;
        $('bGross').textContent = CL.money(gross);
        $('bCost').textContent = CL.money(cost);
        $('bDisc').textContent = CL.money(disc);
        $('bTotal').textContent = CL.money(total);
        $('bProfit').textContent = CL.money(profit);
        $('bMargin').textContent = margin + '%';
        const row = $('bProfitRow');
        if (row) { row.className = 'row ' + (profit >= 0 ? 'profit' : 'loss'); }
    }

    function saveSale() {
        const items = saleLines.filter(function (l) { return l.productId && CL.num(l.qty) > 0; });
        if (!items.length) { toast('Kam se kam ek product chuno'); return; }

        // stock check
        for (let i = 0; i < items.length; i++) {
            const p = CL.product(items[i].productId);
            if (!p) continue;
            if (CL.num(items[i].qty) > CL.num(p.stock)) {
                toast('Stock kam hai: ' + p.name + ' (available ' + p.stock + ')');
                return;
            }
        }

        const rec = CL.createSale({
            customer: $('sCust').value.trim() || 'Walk-in',
            phone: $('sPhone').value.trim(),
            items: items,
            discount: CL.num($('sDisc').value),
            mode: $('sMode').value,
            status: $('sStatus').value,
            staffId: $('sStaff').value
        });
        closeModal();
        render();
        toast('Sale complete: ' + CL.money(rec.total) + ' · Profit ' + CL.money(rec.profit));
    }

    /* ============================================================
       EXPENSES
       ============================================================ */
    function renderExpenses() {
        const s = CL.load();
        const st = CL.stats();
        if ($('exTotal')) $('exTotal').textContent = CL.money(st.expenseTotal);
        if ($('exSalary')) $('exSalary').textContent = CL.money(st.salaryTotal);
        if ($('exAll')) $('exAll').textContent = CL.money(st.totalExpense);

        $('expensesBody').innerHTML = s.expenses.length ? s.expenses.map(function (x) {
            return '<tr>' +
                '<td><strong>' + x.id + '</strong><div style="font-size:11px;color:var(--muted)">' + CL.esc(x.date) + '</div></td>' +
                '<td><span class="badge purple">' + CL.esc(x.category) + '</span></td>' +
                '<td>' + CL.esc(x.description || '—') + '</td>' +
                '<td>' + CL.esc(x.paidTo || '—') + '</td>' +
                '<td>' + CL.esc(x.mode) + '</td>' +
                '<td class="num" style="font-weight:700;color:var(--danger)">' + CL.money(x.amount) + '</td>' +
                '<td><button class="btn btn-icon" onclick="App.delExpense(\'' + x.id + '\')"><i class="fas fa-trash"></i></button></td>' +
            '</tr>';
        }).join('') : '<tr><td colspan="7"><div class="empty"><i class="fas fa-receipt"></i>No expenses</div></td></tr>';
    }

    function expenseForm() {
        openModal('Add Expense',
            '<div class="form-row">' +
                '<div class="form-group"><label>Date</label><input type="date" class="form-control" id="eDate" value="' + CL.today() + '"></div>' +
                '<div class="form-group"><label>Category</label><select class="form-control" id="eCat">' + CL.EXPENSE_CATS.map(function (c) { return '<option>' + c + '</option>'; }).join('') + '</select></div>' +
            '</div>' +
            '<div class="form-group"><label>Description</label><input class="form-control" id="eDesc" placeholder="Kya kharcha hua"></div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Amount (₹) *</label><input type="number" class="form-control" id="eAmt"></div>' +
                '<div class="form-group"><label>Mode</label><select class="form-control" id="eMode">' + CL.PAY_MODES.map(function (m) { return '<option>' + m + '</option>'; }).join('') + '</select></div>' +
            '</div>' +
            '<div class="form-group"><label>Paid To</label><input class="form-control" id="ePaid" placeholder="Kisko diya"></div>',
            '<button class="btn btn-light" onclick="App.closeModal()">Cancel</button>' +
            '<button class="btn btn-primary" onclick="App.saveExpense()"><i class="fas fa-floppy-disk"></i> Save</button>');
    }

    function saveExpense() {
        const amt = CL.num($('eAmt').value);
        if (!amt) { toast('Amount daalein'); return; }
        CL.createExpense({
            date: $('eDate').value, category: $('eCat').value, description: $('eDesc').value.trim(),
            amount: amt, mode: $('eMode').value, paidTo: $('ePaid').value.trim()
        });
        closeModal(); render(); toast('Expense added');
    }

    function delExpense(id) {
        if (!confirm('Delete expense?')) return;
        const s = CL.load();
        s.expenses = s.expenses.filter(function (x) { return x.id !== id; });
        CL.save(); CL.syncDel('expenses', id); render(); toast('Deleted');
    }

    /* ============================================================
       STAFF
       ============================================================ */
    function renderStaff() {
        const s = CL.load();
        const totalSalary = s.staff.reduce(function (a, x) { return a + CL.num(x.salary); }, 0);
        if ($('stCount')) $('stCount').textContent = s.staff.length;
        if ($('stSalary')) $('stSalary').textContent = CL.money(totalSalary);
        if ($('stPaid')) $('stPaid').textContent = CL.money(CL.stats().salaryTotal);

        $('staffBody').innerHTML = s.staff.length ? s.staff.map(function (x) {
            const paid = s.salary.filter(function (v) { return v.staffId === x.id; }).reduce(function (a, v) { return a + CL.num(v.amount); }, 0);
            return '<tr>' +
                '<td><div class="cell-user"><div class="avatar">' + CL.esc(CL.initials(x.name)) + '</div>' +
                '<div><div class="cn">' + CL.esc(x.name) + '</div><div class="cs">' + CL.esc(x.id) + ' · ' + CL.esc(x.phone || '') + '</div></div></div></td>' +
                '<td><span class="badge purple">' + CL.esc(x.role) + '</span></td>' +
                '<td>' + CL.esc(x.joinDate || '—') + '</td>' +
                '<td class="num">' + CL.money(x.salary) + '</td>' +
                '<td class="num" style="color:var(--success);font-weight:700">' + CL.money(paid) + '</td>' +
                '<td>' + (x.status === 'Active' ? '<span class="badge green">Active</span>' : '<span class="badge grey">' + CL.esc(x.status) + '</span>') + '</td>' +
                '<td style="white-space:nowrap">' +
                    '<button class="btn btn-icon" onclick="App.payStaff(\'' + x.id + '\')" title="Pay Salary"><i class="fas fa-indian-rupee-sign"></i></button> ' +
                    '<button class="btn btn-icon" onclick="App.editStaff(\'' + x.id + '\')"><i class="fas fa-pen"></i></button> ' +
                    '<button class="btn btn-icon" onclick="App.delStaff(\'' + x.id + '\')"><i class="fas fa-trash"></i></button>' +
                '</td></tr>';
        }).join('') : '<tr><td colspan="7"><div class="empty"><i class="fas fa-users"></i>No staff</div></td></tr>';

        // salary history
        const sh = $('salaryBody');
        if (sh) {
            sh.innerHTML = s.salary.length ? s.salary.slice(0, 20).map(function (v) {
                return '<tr><td>' + CL.esc(v.id) + '</td><td>' + CL.esc(v.staffName) + '</td><td>' + CL.esc(v.month) + '</td>' +
                    '<td>' + CL.esc(v.date) + '</td><td class="num" style="font-weight:700">' + CL.money(v.amount) + '</td></tr>';
            }).join('') : '<tr><td colspan="5"><div class="empty"><i class="fas fa-money-check-dollar"></i>No salaries paid yet</div></td></tr>';
        }
    }

    function staffForm(x) {
        x = x || {};
        openModal((x.id ? 'Edit' : 'Add') + ' Staff',
            '<div class="form-row">' +
                '<div class="form-group"><label>Staff ID *</label><input class="form-control" id="stId" value="' + CL.esc(x.id || '') + '"' + (x.id ? ' readonly' : '') + '></div>' +
                '<div class="form-group"><label>Role</label><select class="form-control" id="stRole">' + CL.ROLES.map(function (r) { return '<option' + (x.role === r ? ' selected' : '') + '>' + r + '</option>'; }).join('') + '</select></div>' +
            '</div>' +
            '<div class="form-group"><label>Full Name *</label><input class="form-control" id="stName" value="' + CL.esc(x.name || '') + '"></div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Phone</label><input class="form-control" id="stPhone" value="' + CL.esc(x.phone || '') + '"></div>' +
                '<div class="form-group"><label>Monthly Salary (₹)</label><input type="number" class="form-control" id="stSal" value="' + (x.salary || '') + '"></div>' +
            '</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Join Date</label><input type="date" class="form-control" id="stJoin" value="' + CL.esc(x.joinDate || CL.today()) + '"></div>' +
                '<div class="form-group"><label>Status</label><select class="form-control" id="stStatus"><option' + (x.status === 'Active' ? ' selected' : '') + '>Active</option><option' + (x.status === 'Inactive' ? ' selected' : '') + '>Inactive</option></select></div>' +
            '</div>' +
            '<div class="form-group"><label>Address</label><input class="form-control" id="stAddr" value="' + CL.esc(x.address || '') + '"></div>',
            '<button class="btn btn-light" onclick="App.closeModal()">Cancel</button>' +
            '<button class="btn btn-primary" onclick="App.saveStaff(' + (x.id ? 'true' : 'false') + ')"><i class="fas fa-floppy-disk"></i> Save</button>');
    }

    function saveStaff(isEdit) {
        const s = CL.load();
        const id = $('stId').value.trim().toUpperCase();
        const name = $('stName').value.trim();
        if (!id || !name) { toast('ID aur Name zaroori hai'); return; }
        const rec = {
            id: id, name: name, role: $('stRole').value, phone: $('stPhone').value.trim(),
            salary: CL.num($('stSal').value), joinDate: $('stJoin').value,
            status: $('stStatus').value, address: $('stAddr').value.trim()
        };
        const i = s.staff.map(function (x) { return x.id; }).indexOf(id);
        if (isEdit && i > -1) { s.staff[i] = rec; toast('Updated'); }
        else { if (i > -1) { toast('ID already exists'); return; } s.staff.push(rec); toast('Staff added'); }
        CL.save(); CL.syncPush('staff', rec); closeModal(); render();
    }

    function editStaff(id) { const x = CL.staff(id); if (x) staffForm(x); }
    function delStaff(id) {
        if (!confirm('Delete staff ' + id + '?')) return;
        const s = CL.load();
        s.staff = s.staff.filter(function (x) { return x.id !== id; });
        CL.save(); CL.syncDel('staff', id); render(); toast('Deleted');
    }

    function payStaff(id) {
        const x = CL.staff(id);
        const month = new Date().toISOString().slice(0, 7);
        openModal('Pay Salary — ' + CL.esc(x.name),
            '<div style="background:var(--bg);border-radius:10px;padding:14px;margin-bottom:16px;font-size:13.5px">' +
                '<div style="display:flex;justify-content:space-between"><span>' + CL.esc(x.role) + '</span><span>' + CL.money(x.salary) + '/month</span></div>' +
            '</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Month</label><input type="month" class="form-control" id="slMonth" value="' + month + '"></div>' +
                '<div class="form-group"><label>Amount (₹)</label><input type="number" class="form-control" id="slAmt" value="' + x.salary + '"></div>' +
            '</div>',
            '<button class="btn btn-light" onclick="App.closeModal()">Cancel</button>' +
            '<button class="btn btn-success" onclick="App.doPayStaff(\'' + id + '\')"><i class="fas fa-check"></i> Pay Salary</button>');
    }

    function doPayStaff(id) {
        const amt = CL.num($('slAmt').value);
        if (amt <= 0) { toast('Amount daalein'); return; }
        CL.paySalary(id, $('slMonth').value, amt);
        const x = CL.staff(id);
        CL.createExpense({ category: 'Salary', description: 'Salary ' + $('slMonth').value + ' — ' + x.name, amount: amt, mode: 'Cash', paidTo: x.name, staffId: id });
        closeModal(); render(); toast('Salary paid: ' + CL.money(amt));
    }

    /* ============================================================
       REPORTS (P&L)
       ============================================================ */
    function renderReports() {
        const st = CL.stats();
        const s = CL.load();

        const cards = [
            { i: 'fa-cash-register', c: 'green', v: CL.money(st.grossSale), l: 'Total Sales' },
            { i: 'fa-box', c: 'blue', v: CL.money(st.cogs), l: 'Cost of Goods Sold' },
            { i: 'fa-arrow-trend-up', c: 'green', v: CL.money(st.grossProfit), l: 'Gross Profit' },
            { i: 'fa-receipt', c: 'orange', v: CL.money(st.expenseTotal), l: 'Expenses' },
            { i: 'fa-users', c: 'purple', v: CL.money(st.salaryTotal), l: 'Salaries' },
            { i: st.netProfit >= 0 ? 'fa-sack-dollar' : 'fa-triangle-exclamation', c: st.netProfit >= 0 ? 'green' : 'red', v: CL.money(st.netProfit), l: 'Net Profit / Loss' }
        ];
        $('rptStats').innerHTML = cards.map(function (c) {
            return '<div class="stat-card"><div class="stat-icon ' + c.c + '"><i class="fas ' + c.i + '"></i></div>' +
                   '<div><div class="stat-value">' + c.v + '</div><div class="stat-label">' + c.l + '</div></div></div>';
        }).join('');

        // P&L statement
        const rows = [
            ['Sales Revenue', st.grossSale, 'in'],
            ['Less: Cost of Goods Sold', -st.cogs, 'out'],
            ['GROSS PROFIT', st.grossProfit, 'bold'],
            ['Less: Expenses', -st.expenseTotal, 'out'],
            ['Less: Salaries', -st.salaryTotal, 'out'],
            ['NET PROFIT / LOSS', st.netProfit, 'total']
        ];
        $('plBody').innerHTML = rows.map(function (r) {
            return '<tr' + (r[2] === 'bold' || r[2] === 'total' ? ' style="background:#f8fafc;font-weight:800"' : '') + '>' +
                '<td>' + r[0] + '</td>' +
                '<td class="num" style="color:' + (CL.num(r[1]) >= 0 ? 'var(--success)' : 'var(--danger)') + ';font-weight:' + (r[2] ? '800' : '600') + '">' + CL.money(r[1]) + '</td></tr>';
        }).join('');

        // top products by profit
        const byProd = {};
        s.sales.filter(function (x) { return x.status !== 'Returned'; }).forEach(function (x) {
            x.items.forEach(function (i) {
                if (!byProd[i.productId]) byProd[i.productId] = { name: i.name, qty: 0, sale: 0, profit: 0 };
                byProd[i.productId].qty += i.qty;
                byProd[i.productId].sale += i.total;
                byProd[i.productId].profit += i.profit;
            });
        });
        const top = Object.keys(byProd).map(function (k) { return byProd[k]; }).sort(function (a, b) { return b.profit - a.profit; }).slice(0, 10);
        $('topBody').innerHTML = top.length ? top.map(function (t, i) {
            return '<tr><td>' + (i + 1) + '</td><td>' + CL.esc(t.name) + '</td><td class="num">' + t.qty + '</td>' +
                '<td class="num">' + CL.money(t.sale) + '</td>' +
                '<td class="num" style="color:var(--success);font-weight:700">' + CL.money(t.profit) + '</td></tr>';
        }).join('') : '<tr><td colspan="5"><div class="empty"><i class="fas fa-chart-line"></i>No sales yet</div></td></tr>';

        // supplier payables
        $('payBody').innerHTML = s.suppliers.map(function (x) {
            const b = CL.supplierBalance(x.id);
            return '<tr><td>' + CL.esc(x.name) + '</td><td>' + CL.esc(x.city || '') + '</td>' +
                '<td class="num">' + CL.money(b.purchased) + '</td>' +
                '<td class="num">' + CL.money(b.paid) + '</td>' +
                '<td class="num" style="font-weight:700;color:' + (b.balance > 0 ? 'var(--danger)' : 'var(--success)') + '">' + CL.money(b.balance) + '</td></tr>';
        }).join('');

        renderMonthly();
    }

    /* ============================================================
       BILL PRINT (thermal receipt)
       ============================================================ */
    function printReceipt(id) {
        const s = CL.load();
        const x = s.sales.filter(function (v) { return v.id === id; })[0];
        if (!x) return;
        const cfg = s.config;
        const rows = x.items.map(function (i) {
            return '<tr><td>' + CL.esc(i.name) + '<br><span class="sm">' + i.qty + ' × ' + CL.money(i.price) + '</span></td>' +
                   '<td class="r">' + CL.money(i.total) + '</td></tr>';
        }).join('');

        const w = window.open('', '_blank', 'width=420,height=700');
        w.document.write(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Bill ' + x.id + '</title><style>' +
            '*{margin:0;padding:0;box-sizing:border-box}' +
            'body{font-family:"Courier New",monospace;font-size:12px;padding:10px;width:80mm;margin:0 auto;color:#000}' +
            '.c{text-align:center}.r{text-align:right}.b{font-weight:700}' +
            '.hd{font-size:15px;font-weight:700;letter-spacing:.5px}' +
            '.sm{font-size:10.5px;color:#333}' +
            '.line{border-top:1px dashed #000;margin:6px 0}' +
            'table{width:100%;border-collapse:collapse}td{padding:2px 0;vertical-align:top}' +
            '.tot{font-size:15px;font-weight:700}' +
            '.foot{margin-top:8px;font-size:10.5px;text-align:center}' +
            '@media print{body{width:auto}@page{margin:4mm}}' +
            '</style></head><body>' +
            '<div class="c hd">' + CL.esc(cfg.shopName || 'Apnivo Store') + '</div>' +
            '<div class="c sm">' + CL.esc(cfg.address || '') + '</div>' +
            '<div class="c sm">Ph: ' + CL.esc(cfg.phone || '') + '</div>' +
            '<div class="line"></div>' +
            '<div style="display:flex;justify-content:space-between"><span>Bill: <b>' + x.id + '</b></span><span>' + CL.esc(x.date) + '</span></div>' +
            '<div>Customer: ' + CL.esc(x.customer) + (x.phone ? ' (' + CL.esc(x.phone) + ')' : '') + '</div>' +
            (x.staffName ? '<div class="sm">Served by: ' + CL.esc(x.staffName) + '</div>' : '') +
            '<div class="line"></div>' +
            '<table>' + rows + '</table>' +
            '<div class="line"></div>' +
            '<table>' +
            '<tr><td>Sub Total</td><td class="r">' + CL.money(x.gross) + '</td></tr>' +
            (CL.num(x.discount) ? '<tr><td>Discount</td><td class="r">-' + CL.money(x.discount) + '</td></tr>' : '') +
            '<tr><td class="tot">TOTAL</td><td class="r tot">' + CL.money(x.total) + '</td></tr>' +
            '<tr><td>Payment</td><td class="r">' + CL.esc(x.mode) + '</td></tr>' +
            '<tr><td>Status</td><td class="r">' + CL.esc(x.status) + '</td></tr>' +
            '</table>' +
            '<div class="line"></div>' +
            '<div class="c foot">Items: ' + x.items.reduce(function (a, i) { return a + i.qty; }, 0) + ' pcs</div>' +
            '<div class="c foot">Dhanyawad! Phir aaiye 🙏</div>' +
            '<div class="c foot sm">' + CL.esc(cfg.owner || '') + '</div>' +
            '<script>setTimeout(function(){window.print()},450)<\/script>' +
            '</body></html>'
        );
        w.document.close();
    }

    /* ============================================================
       BARCODE (generate + print)
       ============================================================ */
    function printBarcode(id) {
        const p = CL.product(id);
        if (!p) return;
        const w = window.open('', '_blank', 'width=460,height=420');
        w.document.write(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Barcode ' + p.id + '</title>' +
            '<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>' +
            '<style>body{font-family:Arial,sans-serif;text-align:center;padding:24px}' +
            '.nm{font-weight:700;font-size:15px}.sm{font-size:12px;color:#555;margin-bottom:10px}' +
            'svg{max-width:100%}.pr{font-weight:800;font-size:18px;margin-top:8px}' +
            '@media print{@page{margin:6mm}}</style></head><body>' +
            '<div class="nm">' + CL.esc(p.name) + '</div>' +
            '<div class="sm">' + CL.esc(p.size) + ' / ' + CL.esc(p.color) + '</div>' +
            '<svg id="bc"></svg>' +
            '<div class="pr">' + CL.money(p.sale) + '</div>' +
            '<script>JsBarcode("#bc","' + p.id + '",{format:"CODE128",width:2,height:72,fontSize:14,displayValue:true});<\/script>' +
            '<script>setTimeout(function(){window.print()},600)<\/script>' +
            '</body></html>'
        );
        w.document.close();
    }

    /* ============================================================
       BARCODE SCANNER (camera)
       ============================================================ */
    let scanner = null;
    function openScanner(target) {
        openModal('<i class="fas fa-barcode"></i> Scan Product',
            '<div id="qrReader" style="width:100%;min-height:260px;background:#000;border-radius:12px;overflow:hidden"></div>' +
            '<div id="scanMsg" style="margin-top:12px;font-size:13px;color:var(--muted)">Camera khul raha hai... product ka barcode dikhao.</div>' +
            '<div class="form-group" style="margin-top:12px"><label>Or type the Product ID</label>' +
            '<input class="form-control" id="scanManual" placeholder="jaise P001" onkeydown="if(event.key===\'Enter\')App.scanUse(this.value)"></div>',
            '<button class="btn btn-light" onclick="App.closeModal()">Close</button>' +
            '<button class="btn btn-primary" onclick="App.scanUse(document.getElementById(\'scanManual\').value)"><i class="fas fa-check"></i> Use</button>');

        const s = document.createElement('script');
        s.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
        s.onload = function () {
            try {
                scanner = new Html5Qrcode('qrReader');
                scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: 240 },
                    function (text) {
                        if (navigator.vibrate) navigator.vibrate(120);
                        App.scanUse(text.trim());
                    },
                    function () { /* ignore frame errors */ }
                ).catch(function (e) {
                    $('scanMsg').textContent = 'Camera did not open: ' + e.message + ' — type the ID below';
                });
            } catch (e) {
                $('scanMsg').textContent = 'Scanner could not load — type the ID';
            }
        };
        s.onerror = function () { $('scanMsg').textContent = 'Scanner library did not load — type the ID'; };
        document.head.appendChild(s);
    }

    function stopScanner() {
        if (scanner) {
            try { scanner.stop().then(function () { scanner.clear(); }); } catch (e) {}
            scanner = null;
        }
    }

    function scanUse(code) {
        const p = CL.product(String(code).trim().toUpperCase());
        if (!p) { toast('Product not found: ' + code); return; }
        stopScanner();
        closeModal();
        toast('Mila: ' + p.name);
        if (pendingScan === 'sale') {
            saleLines = [{ productId: p.id, qty: 1, price: p.sale }];
            openSale();
        } else if (pendingScan === 'purchase') {
            purLines = [{ productId: p.id, qty: 1, price: p.purchase }];
            openPurchase();
        } else {
            productForm(p);
        }
    }

    let pendingScan = '';
    function scanFor(where) { pendingScan = where; openScanner(where); }

    /* ============================================================
       MONTHLY REPORT
       ============================================================ */
    function monthlyData() {
        const s = CL.load();
        const m = {};
        function b(k) { if (!m[k]) m[k] = { month: k, bills: 0, sales: 0, cost: 0, profit: 0, expense: 0, salary: 0, purchase: 0 }; return m[k]; }
        s.sales.filter(function (x) { return x.status !== 'Returned'; }).forEach(function (x) {
            const k = (x.date || '').slice(0, 7); if (!k) return;
            const o = b(k); o.sales += CL.num(x.total); o.cost += CL.num(x.cost); o.profit += CL.num(x.profit); o.bills++;
        });
        s.expenses.forEach(function (x) { const k = (x.date || '').slice(0, 7); if (k) b(k).expense += CL.num(x.amount); });
        s.salary.forEach(function (x) { const k = (x.date || '').slice(0, 7); if (k) b(k).salary += CL.num(x.amount); });
        s.purchases.forEach(function (x) { const k = (x.date || '').slice(0, 7); if (k) b(k).purchase += CL.num(x.total); });
        return Object.keys(m).sort().reverse().map(function (k) {
            m[k].net = m[k].profit - m[k].expense - m[k].salary;
            return m[k];
        });
    }

    function renderMonthly() {
        const data = monthlyData();
        const body = $('monthBody');
        if (!body) return;
        body.innerHTML = data.length ? data.map(function (m) {
            return '<tr><td><strong>' + m.month + '</strong></td>' +
                '<td class="num">' + m.bills + '</td>' +
                '<td class="num">' + CL.money(m.sales) + '</td>' +
                '<td class="num">' + CL.money(m.cost) + '</td>' +
                '<td class="num" style="color:var(--success)">' + CL.money(m.profit) + '</td>' +
                '<td class="num">' + CL.money(m.purchase) + '</td>' +
                '<td class="num" style="color:var(--danger)">' + CL.money(m.expense + m.salary) + '</td>' +
                '<td class="num" style="font-weight:800;color:' + (m.net >= 0 ? 'var(--success)' : 'var(--danger)') + '">' + CL.money(m.net) + '</td></tr>';
        }).join('') : '<tr><td colspan="8"><div class="empty"><i class="fas fa-calendar"></i>No data</div></td></tr>';

        const chart = $('monthChart');
        if (chart) {
            const max = Math.max.apply(null, data.map(function (m) { return Math.max(m.sales, 1); }).concat([1]));
            chart.innerHTML = data.slice(0, 6).map(function (m) {
                const pct = Math.round(m.sales / max * 100);
                const npct = Math.round(Math.abs(m.net) / max * 100);
                return '<div style="margin-bottom:14px">' +
                    '<div style="display:flex;justify-content:space-between;font-size:12.5px;font-weight:600;margin-bottom:5px"><span>' + m.month + '</span><span>' + CL.money(m.sales) + '</span></div>' +
                    '<div style="height:9px;background:#f1f5f9;border-radius:6px;overflow:hidden;margin-bottom:3px"><div style="width:' + pct + '%;height:100%;background:var(--primary);border-radius:6px"></div></div>' +
                    '<div style="height:6px;background:#f1f5f9;border-radius:6px;overflow:hidden"><div style="width:' + npct + '%;height:100%;background:' + (m.net >= 0 ? 'var(--success)' : 'var(--danger)') + ';border-radius:6px"></div></div>' +
                '</div>';
            }).join('');
        }
    }

    /* ============================================================
       WHATSAPP LOW STOCK ALERT
       ============================================================ */
    function whatsappLowStock() {
        const s = CL.load();
        const st = CL.stats();
        if (!st.lowStockList.length) { toast('All stock is fine — no alerts'); return; }

        const lines = st.lowStockList.map(function (p) {
            return '• ' + p.name + ' (' + p.size + ') — ' + p.stock + ' pcs left  [' + p.id + ']';
        }).join('\n');

        const msg = '*' + (s.config.shopName || 'Clothing Store') + ' — LOW STOCK ALERT*\n' +
            'Date: ' + new Date().toLocaleDateString('en-IN') + '\n\n' +
            lines + '\n\n' +
            'Total ' + st.lowStockList.length + ' items need reorder.\n' +
            'Kripya maal mangwa lein. 🙏';

        const num = String(s.config.whatsapp || '').replace(/\D/g, '');
        const url = 'https://wa.me/' + num + '?text=' + encodeURIComponent(msg);
        window.open(url, '_blank');
        toast('WhatsApp khul raha hai...');
    }

    function copyLowStock() {
        const st = CL.stats();
        const lines = st.lowStockList.map(function (p) { return p.name + ' (' + p.size + ') — ' + p.stock + ' left [' + p.id + ']'; }).join('\n');
        const txt = (CL.load().config.shopName || '') + ' — Low Stock:\n' + lines;
        navigator.clipboard.writeText(txt).then(function () { toast('List copy ho gayi'); }).catch(function () { toast('Copy fail'); });
    }

    /* ============================================================
       SETTINGS
       ============================================================ */
    function renderSettings() {
        const s = CL.load();
        const cfg = s.config || {};
        if ($('cfgName'))  $('cfgName').value  = cfg.shopName || '';
        if ($('cfgOwner')) $('cfgOwner').value = cfg.owner || '';
        if ($('cfgPhone')) $('cfgPhone').value = cfg.phone || '';
        if ($('cfgWa'))    $('cfgWa').value    = cfg.whatsapp || '';
        if ($('cfgAddr'))  $('cfgAddr').value  = cfg.address || '';
        if ($('cfgLow'))   $('cfgLow').value   = cfg.lowStockAlert || 5;

        const box = $('syncBox');
        if (box) {
            const fb = window.FB || {};
            const online = !!fb.ready;
            const last = fb.lastSync ? new Date(fb.lastSync).toLocaleTimeString('en-IN') : '—';
            box.innerHTML =
                '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">' +
                    '<div class="stat-icon ' + (online ? 'green' : 'red') + '" style="width:42px;height:42px;font-size:17px">' +
                        '<i class="fas ' + (online ? 'fa-cloud-arrow-up' : 'fa-cloud-slash') + '"></i></div>' +
                    '<div><div style="font-weight:700;font-size:15px">' + (online ? 'Connected' : 'Offline') + '</div>' +
                    '<div style="font-size:12.5px;color:var(--muted)">' +
                        (online ? 'Project: apna-computer-ltd · Last sync: ' + last : (fb.error || 'Firestore unavailable')) +
                    '</div></div>' +
                '</div>' +
                '<div style="font-size:13px;color:var(--muted);line-height:1.8">' +
                    'Aapka data cloud mein save hota hai — <strong>sab devices pe same dikhega</strong>. ' +
                    'Ek device pe sale karo, doosre pe turant update ho jayega.' +
                '</div>';
        }
    }

    /* ============================================================
       DISPATCH
       ============================================================ */
    let searchQ = '';
    function render() {
        const p = page();
        if (p === 'dashboard') renderDashboard();
        if (p === 'products')  renderProducts();
        if (p === 'suppliers') renderSuppliers();
        if (p === 'purchases') renderPurchases();
        if (p === 'sales')     renderSales();
        if (p === 'expenses')  renderExpenses();
        if (p === 'staff')     renderStaff();
        if (p === 'reports')   renderReports();
        if (p === 'settings')  renderSettings();
    }

    function search(v) {
        const p = page();
        if (p === 'products') { prodQ = v; renderProducts(); }
    }

    function resetData() {
        if (!confirm('Reset ALL data to default?')) return;
        CL.reset(); render(); toast('Data reset');
    }

    /* ---------- PURCHASE FORM ---------- */
    let purLines = [];
    function openPurchase() {
        purLines = [{ productId: '', qty: 1, price: 0 }];
        const supOpts = CL.load().suppliers.map(function (x) { return '<option value="' + x.id + '">' + CL.esc(x.name) + ' — ' + CL.esc(x.city || '') + '</option>'; }).join('');
        openModal('<i class="fas fa-cart-flatbed"></i> New Purchase (Stock In)',
            '<div class="form-row">' +
                '<div class="form-group"><label>Wholeseller *</label><select class="form-control" id="puSup">' + supOpts + '</select></div>' +
                '<div class="form-group"><label>Date</label><input type="date" class="form-control" id="puDate" value="' + CL.today() + '"></div>' +
            '</div>' +
            '<div class="form-row">' +
                '<div class="form-group"><label>Invoice No</label><input class="form-control" id="puInv" placeholder="optional"></div>' +
                '<div class="form-group"><label>Amount Paid (₹)</label><input type="number" class="form-control" id="puPaid" value="0"></div>' +
                '<div class="form-group"><label>Mode</label><select class="form-control" id="puMode">' + CL.PAY_MODES.map(function (m) { return '<option>' + m + '</option>'; }).join('') + '</select></div>' +
            '</div>' +
            '<label style="font-size:12px;font-weight:600;color:#475569;display:block;margin:10px 0 8px">Items</label>' +
            '<div id="purLines"></div>' +
            '<button class="btn btn-light btn-sm" onclick="App.addPurLine()"><i class="fas fa-plus"></i> Add Item</button>' +
            '<div id="purTotal" style="text-align:right;font-size:17px;font-weight:800;margin-top:14px"></div>',
            '<button class="btn btn-light" onclick="App.closeModal()">Cancel</button>' +
            '<button class="btn btn-primary" onclick="App.savePurchase()"><i class="fas fa-check"></i> Save Purchase</button>', true);
        drawPurLines();
    }

    function drawPurLines() {
        const opts = CL.load().products.map(function (p) {
            return '<option value="' + p.id + '">' + CL.esc(p.name) + ' (' + CL.esc(p.size) + ')</option>';
        }).join('');
        $('purLines').innerHTML = purLines.map(function (l, i) {
            return '<div class="pos-line">' +
                '<select class="form-control" onchange="App.purProduct(' + i + ',this.value)"><option value="">— Select Product —</option>' + opts + '</select>' +
                '<input type="number" class="form-control" placeholder="Qty" value="' + (l.qty || 1) + '" oninput="App.purVal(' + i + ',\'qty\',this.value)">' +
                '<input type="number" class="form-control" placeholder="Rate" value="' + (l.price || '') + '" oninput="App.purVal(' + i + ',\'price\',this.value)">' +
                '<input class="form-control" value="' + CL.money(CL.num(l.qty) * CL.num(l.price)) + '" readonly>' +
                '<button class="rm" onclick="App.rmPurLine(' + i + ')"><i class="fas fa-xmark"></i></button>' +
            '</div>';
        }).join('');
        purLines.forEach(function (l, i) {
            const sel = $('purLines').querySelectorAll('select')[i];
            if (sel && l.productId) sel.value = l.productId;
        });
        const t = purLines.reduce(function (a, l) { return a + CL.num(l.qty) * CL.num(l.price); }, 0);
        $('purTotal').textContent = 'Total: ' + CL.money(t);
    }

    function addPurLine() { purLines.push({ productId: '', qty: 1, price: 0 }); drawPurLines(); }
    function rmPurLine(i) { purLines.splice(i, 1); if (!purLines.length) purLines.push({ productId: '', qty: 1, price: 0 }); drawPurLines(); }
    function purProduct(i, pid) { purLines[i].productId = pid; const p = CL.product(pid); if (p) purLines[i].price = p.purchase; drawPurLines(); }
    function purVal(i, k, v) { purLines[i][k] = CL.num(v); drawPurLines(); }

    function savePurchase() {
        const items = purLines.filter(function (l) { return l.productId && CL.num(l.qty) > 0; });
        if (!items.length) { toast('Kam se kam ek product chuno'); return; }
        const rec = CL.createPurchase({
            supplierId: $('puSup').value,
            date: $('puDate').value,
            invoice: $('puInv').value.trim(),
            items: items,
            paid: CL.num($('puPaid').value),
            mode: $('puMode').value
        });
        closeModal(); render();
        toast('Purchase added · Stock badh gaya · ' + CL.money(rec.total));
    }

    /* ---------- EXPORTS ---------- */
    window.App = {
        closeModal: closeModal, search: search, resetData: resetData,
        addProduct: function () { productForm(null); }, editProduct: editProduct, saveProduct: saveProduct, delProduct: delProduct,
        addSupplier: function () { supplierForm(null); }, editSupplier: editSupplier, saveSupplier: saveSupplier, delSupplier: delSupplier,
        paySupplier: paySupplier, doPaySupplier: doPaySupplier,
        openPurchase: openPurchase, viewPurchase: viewPurchase, delPurchase: delPurchase,
        addPurLine: addPurLine, rmPurLine: rmPurLine, purProduct: purProduct, purVal: purVal, savePurchase: savePurchase,
        openSale: openSale, addLine: addLine, rmLine: rmLine, lineProduct: lineProduct, lineVal: lineVal, posCalc: posCalc, saveSale: saveSale,
        viewSale: viewSale, delSale: delSale,
        addExpense: expenseForm, saveExpense: saveExpense, delExpense: delExpense,
        addStaff: function () { staffForm(null); }, editStaff: editStaff, saveStaff: saveStaff, delStaff: delStaff,
        payStaff: payStaff, doPayStaff: doPayStaff,
        printReceipt: printReceipt, printBarcode: printBarcode,
        openScanner: openScanner, scanFor: scanFor, scanUse: scanUse, stopScanner: stopScanner,
        whatsappLowStock: whatsappLowStock, copyLowStock: copyLowStock,
        monthlyData: monthlyData, saveShop: saveShop
    };

    /* ---------- BOOT ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        if (page() === 'login') return;
        if (!CL.requireAuth()) return;
        renderShell();
        render();
        if (window.FB) FB.onChange = function () { render(); };
    });

    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
})();
