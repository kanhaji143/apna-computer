/* ============================================================
   APNA COMPUTER — MOBILE APP LOGIC
   No framework. Backend: Firestore hub_leads create-only
   (same verified endpoint/pattern as public/contact.html).
   ============================================================ */
(function () {
    'use strict';

    /* Shared SVG icon set (offline-friendly, no CDN fonts needed) */
    var ICONS = {
        layers: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
        code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
        store: '<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/>',
        school: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><line x1="22" y1="10" x2="22" y2="16"/>',
        shirt: '<path d="M15 4a3 3 0 0 1-6 0L5 6l2 4 2-1v11h6V9l2 1 2-4-6-2z"/>',
        pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>',
        grad: '<path d="M12 3L1 9l11 6 11-6-11-6z"/><path d="M5 11.5V17c0 1.7 3.1 3 7 3s7-1.3 7-3v-5.5"/>',
        chalk: '<path d="M17 10l4-4-3-3-4 4"/><path d="M14 7l2 2"/><rect x="3" y="3" width="14" height="21" rx="2" transform="rotate(90 10 10)"/>',
        shield: '<path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
        building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
        home: '<path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z"/>',
        search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/>',
        send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
        globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
        arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'
    };

    function icon(name, cls) {
        return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' +
            (ICONS[name] || ICONS.layers) + '</svg>';
    }
    window.AC_ICONS = icon;

    /* ---------- Offline detection ---------- */
    var banner = document.getElementById('offlineBanner');
    function netState() {
        var off = navigator.onLine === false;
        if (banner) banner.classList.toggle('show', off);
    }
    window.addEventListener('online', netState);
    window.addEventListener('offline', netState);
    netState();

    /* ---------- Service worker registration ---------- */
    if ('serviceWorker' in navigator &&
        (location.protocol === 'https:' || location.hostname === 'localhost')) {
        navigator.serviceWorker.register('/app/sw.js').catch(function () {
            /* SW failure must never break the app */
        });
    }

    /* ---------- EMBEDDED CONTACT BACKEND (verified pattern) ----------
       Copies the exact create-only endpoint used by the production
       /contact.html form. hub_leads rules: public may CREATE only,
       with type/length validation enforced server-side by rules.   */
    var LEAD_CONFIG = {
        project: 'apna-computer-ltd',
        apiKey: 'AIzaSyC_iVUneR8fu_haqWPm5UMc5eu8ATBX1Y', /* public Firebase web config, already shipped on production */
        collection: 'hub_leads'
    };

    function leadEndpoint() {
        return 'https://firestore.googleapis.com/v1/projects/' + LEAD_CONFIG.project +
            '/databases/(default)/documents/' + LEAD_CONFIG.collection +
            '?key=' + LEAD_CONFIG.apiKey;
    }

    window.submitLead = function (data, onDone, onFail, btn) {
        var body = { fields: {} };
        Object.keys(data).forEach(function (k) {
            body.fields[k] = { stringValue: String(data[k]) };
        });
        if (btn) { btn.disabled = true; btn.dataset.label = btn.innerHTML; }
        fetch(leadEndpoint(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            onDone();
        }).catch(function (err) {
            onFail(err && err.message);
        }).then(function () {
            if (btn) { btn.disabled = false; btn.innerHTML = btn.dataset.label || btn.innerHTML; }
        });
    };

    /* ---------- PWA installability support ----------
       Chrome fires beforeinstallprompt ONLY on sessions that genuinely
       meet install criteria. We defer the prompt behind our own button. */
    var AC_PWA = window.AC_PWA = { deferred: null, installed: false };
    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        AC_PWA.deferred = e;
    });
    window.addEventListener('appinstalled', function () {
        AC_PWA.deferred = null;
        AC_PWA.installed = true;
    });

    function wireInstallUI() {
        var btn = document.getElementById('installBtn');
        if (!btn) return;
        var hint = document.getElementById('installHint');
        var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        if (isIOS) {
            if (hint) hint.hidden = false;
            btn.hidden = true;
            return;
        }
        if (AC_PWA.deferred) { btn.hidden = false; return; }
        /* Chrome evaluates installability shortly after SW activation */
        var timer = setInterval(function () {
            if (AC_PWA.deferred) { clearInterval(timer); btn.hidden = false; }
        }, 700);
        setTimeout(function () {
            clearInterval(timer);
            if (!AC_PWA.deferred && !AC_PWA.installed && btn && btn.hidden && hint) {
                var isDesktop = !/android|iphone|ipad|ipod/i.test(navigator.userAgent);
                if (isDesktop) {
                    hint.hidden = false;
                    hint.innerHTML = 'Desktop: Chrome menu (three dots) -> Install Apna Software Hub, or use the install icon in the address bar.';
                }
            }
        }, 6000);
        if (btn) {
            btn.addEventListener('click', function () {
                var d = AC_PWA.deferred;
                if (!d) return;
                d.prompt();
                d.userChoice.then(function (choice) {
                    if (choice && choice.outcome === 'accepted') btn.hidden = true;
                    AC_PWA.deferred = null;
                });
            });
        }
    }

    /* ---------- Offline safety: out-of-app pages need internet ----------
       Demo/support links (/shop/, /crm/, wa.me, tel:, mailto:) sit outside
       this app's service-worker scope. While offline they would hit the
       browser error page — instead show a clear, honest toast. */
    var toastTimer = null;
    function toast(msg) {
        var old = document.querySelector('.offline-toast');
        if (old) old.remove();
        var el = document.createElement('div');
        el.className = 'offline-toast';
        el.textContent = msg;
        document.body.appendChild(el);
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { el.remove(); }, 3400);
    }

    document.addEventListener('click', function (e) {
        if (navigator.onLine !== false) return;
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) return;
        var href = a.getAttribute('href') || '';
        if (href.charAt(0) === '#') return;
        var inApp = href.indexOf('/app/') === 0 ||
            /^(index|detail|contact|offline)\.html/.test(href);
        if (!inApp) {
            e.preventDefault();
            toast('📴 You are offline — this page/demo will open once internet returns.');
        }
    }, true);

    /* ---------- App shell helpers exposed to pages ---------- */
    var AC_APP = window.AC_APP = {
        icon: icon,
        PRODUCTS: PRODUCTS,
        CATEGORIES: CATEGORIES,
        STATUS_META: STATUS_META,
        toast: toast,
        wireInstallUI: wireInstallUI,
        productById: function (id) {
            for (var i = 0; i < PRODUCTS.length; i++) {
                if (PRODUCTS[i].id === id) return PRODUCTS[i];
            }
            return null;
        },
        catLabel: function (cid) {
            var c = CATEGORIES.filter(function (x) { return x.id === cid; })[0];
            return c ? c.label : cid;
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wireInstallUI);
    } else {
        wireInstallUI();
    }
})();
