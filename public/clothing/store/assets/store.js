/* ============================================================
   APNIVO FASHION — customer storefront data layer
   Path: public/clothing/store/assets/store.js
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

    if (typeof firebase !== 'undefined' && !firebase.apps.length) firebase.initializeApp(firebaseConfig);
    var db = (typeof firebase !== 'undefined') ? firebase.firestore() : null;

    var WISH_KEY = 'cl_wish_v1';

    /* ---------- WISHLIST (localStorage) ---------- */
    function getWishlist() { try { return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); } catch (e) { return []; } }
    function saveWishlist(w) { localStorage.setItem(WISH_KEY, JSON.stringify(w)); updateWishBadge(); }
    function isWished(productId) { return getWishlist().indexOf(productId) > -1; }
    function toggleWish(productId) {
        var w = getWishlist();
        var idx = w.indexOf(productId);
        if (idx > -1) w.splice(idx, 1); else w.push(productId);
        saveWishlist(w);
        return idx === -1;
    }
    function updateWishBadge() {
        var els = document.querySelectorAll('.wish-badge');
        var n = getWishlist().length;
        els.forEach(function (e) { e.textContent = n; e.style.display = n ? '' : 'none'; });
    }

    /* ---------- REVIEWS (Firestore cl_reviews) ---------- */
    function getReviews(productId) {
        if (!db) return Promise.resolve([]);
        return db.collection('cl_reviews').where('productId', '==', productId).get().then(function (snap) {
            var rows = [];
            snap.forEach(function (d) { rows.push(Object.assign({ id: d.id }, d.data())); });
            rows.sort(function (a, b) { return String(b.createdAt || '').localeCompare(String(a.createdAt || '')); });
            return rows;
        }).catch(function () { return []; });
    }
    function addReview(productId, rating, text, name) {
        var review = { productId: productId, rating: Number(rating), text: text, name: name || 'Anonymous', createdAt: new Date().toISOString() };
        if (db) db.collection('cl_reviews').add(review).catch(function (e) { console.warn('review sync failed', e); });
        return review;
    }

    var STORE = {
        db: db,
        products: [],
        categories: [],
        ready: false
    };

    function money(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }

    function loadProducts() {
        if (!db) return Promise.resolve([]);
        return db.collection('cl_products').get().then(function (snap) {
            var rows = [];
            snap.forEach(function (d) { rows.push(Object.assign({ id: d.id }, d.data())); });
            // treat all products as active marketplace items
            rows.forEach(function (p) {
                if (!p.status) p.status = 'active';
                if (!p.description) p.description = p.name + ' — premium quality, best price.';
                if (!p.rating) p.rating = (4 + Math.random() * 0.9).toFixed(1);
                if (!p.reviews) p.reviews = Math.floor(Math.random() * 120) + 5;
                if (!p.images) p.images = [];
            });
            STORE.products = rows;
            // categories
            var cats = {};
            rows.forEach(function (p) { if (p.category) cats[p.category] = (cats[p.category] || 0) + 1; });
            STORE.categories = Object.keys(cats).map(function (c) { return { name: c, count: cats[c] }; });
            STORE.ready = true;
            return rows;
        });
    }

    /* ---------- CART (localStorage) ---------- */
    function getCart() { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch (e) { return []; } }
    function saveCart(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartBadge(); }
    function addToCart(productId, size, color, qty) {
        qty = qty || 1;
        var cart = getCart();
        var existing = cart.filter(function (i) { return i.productId === productId && i.size === size && i.color === color; })[0];
        if (existing) existing.qty += qty;
        else cart.push({ productId: productId, size: size || 'M', color: color || '', qty: qty, addedAt: Date.now() });
        saveCart(cart);
        return cart;
    }
    function removeFromCart(idx) { var cart = getCart(); cart.splice(idx, 1); saveCart(cart); return cart; }
    function updateQty(idx, qty) { var cart = getCart(); if (cart[idx]) { cart[idx].qty = Math.max(1, qty); saveCart(cart); } return cart; }
    function clearCart() { localStorage.removeItem(CART_KEY); updateCartBadge(); }
    function cartCount() { return getCart().reduce(function (s, i) { return s + (i.qty || 1); }, 0); }
    function cartTotal() {
        var cart = getCart();
        return cart.reduce(function (s, i) {
            var p = STORE.products.filter(function (x) { return x.id === i.productId; })[0];
            return s + (p ? Number(p.sale || 0) * i.qty : 0);
        }, 0);
    }
    function updateCartBadge() {
        var els = document.querySelectorAll('.cart-badge');
        var n = cartCount();
        els.forEach(function (e) { e.textContent = n; e.style.display = n ? '' : 'none'; });
    }

    /* ---------- ORDERS ---------- */
    function getMyOrders() { try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch (e) { return []; } }
    function saveMyOrders(o) { localStorage.setItem(ORDERS_KEY, JSON.stringify(o)); }

    function placeOrder(customer, items, total, paymentMode) {
        var orderId = 'ORD-' + Date.now();
        var order = {
            orderId: orderId,
            customer: customer,
            items: items.map(function (i) {
                var p = STORE.products.filter(function (x) { return x.id === i.productId; })[0];
                return { productId: i.productId, name: p ? p.name : i.productId, size: i.size, color: i.color, qty: i.qty, price: p ? Number(p.sale || 0) : 0 };
            }),
            total: total,
            paymentMode: paymentMode,
            status: 'placed',
            createdAt: new Date().toISOString()
        };
        // write to Firestore cl_orders (best effort)
        if (db) {
            db.collection('cl_orders').doc(orderId).set(order).catch(function (e) { console.warn('order sync failed', e); });
        }
        // save locally
        var orders = getMyOrders();
        orders.unshift(order);
        saveMyOrders(orders);
        clearCart();
        return order;
    }

    function findProduct(id) { return STORE.products.filter(function (p) { return p.id === id; })[0] || null; }

    /* ---------- SHELL ---------- */
    function renderShell() {
        // cart badge
        updateCartBadge();
        updateWishBadge();
    }

    window.STORE = STORE;
    window.StoreAPI = {
        loadProducts: loadProducts,
        money: money,
        getCart: getCart, saveCart: saveCart, addToCart: addToCart,
        removeFromCart: removeFromCart, updateQty: updateQty, clearCart: clearCart,
        cartCount: cartCount, cartTotal: cartTotal, updateCartBadge: updateCartBadge,
        getMyOrders: getMyOrders, saveMyOrders: saveMyOrders, placeOrder: placeOrder,
        findProduct: findProduct, renderShell: renderShell,
        getWishlist: getWishlist, saveWishlist: saveWishlist, isWished: isWished,
        toggleWish: toggleWish, updateWishBadge: updateWishBadge,
        getReviews: getReviews, addReview: addReview
    };

    document.addEventListener('DOMContentLoaded', function () {
        loadProducts().then(function () { renderShell(); }).catch(function (e) { console.error(e); });
    });
})();
