/* ============================================================
   APNA COMPUTER — HUB SHARED SHELL
   Renders header + footer on every hub page.
   Usage: <header id="hubHeader"></header> ... <footer id="hubFooter"></footer>
   ============================================================ */

(function () {
    'use strict';

    var CONFIG = {
        email: 'kanhadigimkt@gmail.com',
        phone: '+918504985149',            // call / display
        whatsapp: '918504985149',          // WhatsApp (bina + ke)
        city: 'Amethi, Uttar Pradesh',
        hours: 'Mon – Sat · 9:00 AM – 7:00 PM'
    };

    var NAV = [
        { label: 'Home', href: '/', key: 'home' },
        { label: 'Services', href: '/services.html', key: 'services' },
        { label: 'Products', href: '#', key: 'products', drop: [
            { label: 'Online Center Website + CRM', href: '/shop/', live: true },
            { label: 'School ERP + CRM', href: '/crm/', live: true },
            { label: 'Apnivo Business (Seller CRM)', href: '/clothing/panel/', live: true },
            { label: 'Apnivo Fashion (Store)', href: '/clothing/store/', live: true },
            { label: 'Bondora — Relationship Preview', href: '/bondora/', live: true },
            { label: 'Blog (Tutorials)', href: '/blog/', live: true },
            { label: 'Online Courses (LMS)', href: '/contact.html?module=courses', live: false },
            { label: 'Coaching ERP', href: '/contact.html?module=coaching', live: false },
            { label: 'Security ERP', href: '/contact.html?module=security', live: false },
            { label: 'Real Estate Portal', href: '/contact.html?module=realestate', live: false }
        ] },
        { label: 'Pricing', href: '/pricing.html', key: 'pricing' },
        { label: 'About', href: '/about.html', key: 'about' },
        { label: 'Contact', href: '/contact.html', key: 'contact' }
    ];

    function pageKey() {
        var p = (location.pathname || '/').toLowerCase();
        if (p === '/' || p === '' || p === '/index.html') return 'home';
        if (p.indexOf('services') > -1) return 'services';
        if (p.indexOf('pricing') > -1) return 'pricing';
        if (p.indexOf('about') > -1) return 'about';
        if (p.indexOf('contact') > -1) return 'contact';
        return '';
    }

    function navItem(item, active) {
        if (item.drop) {
            var links = item.drop.map(function (d) {
                return '<a href="' + d.href + '"' + (d.ext ? ' target="_blank" rel="noopener"' : '') + '>' +
                    '<span class="dot ' + (d.live ? '' : 'soon') + '"></span>' +
                    '<span>' + d.label + '</span>' +
                    (d.ext ? ' <i class="fas fa-arrow-up-right-from-square" style="font-size:9px;margin-left:auto;opacity:.5"></i>' : '') +
                    '</a>';
            }).join('');
            return '<div class="nav-drop" data-drop>' +
                '<button class="nav-toggle" type="button" aria-expanded="false">' + item.label +
                ' <i class="fas fa-chevron-down" style="font-size:9px;opacity:.55"></i></button>' +
                '<div class="nav-drop-menu">' + links + '</div></div>';
        }
        return '<a href="' + item.href + '"' + (item.key === active ? ' class="active"' : '') + '>' + item.label + '</a>';
    }

    function headerTemplate() {
        var active = pageKey();
        var items = NAV.map(function (n) { return navItem(n, active); }).join('');
        return '<div class="header-inner">' +
            '<a class="brand" href="/">' +
                '<span class="brand-mark">A</span>' +
                '<span class="brand-text"><strong>Apna Software Hub</strong><small>Websites · CRM/ERP · Mobile</small></span>' +
            '</a>' +
            '<button class="mobile-toggle" type="button" aria-label="Menu"><i class="fas fa-bars"></i></button>' +
            '<nav class="main-nav" id="mainNav">' + items +
                '<a class="header-cta" href="/contact.html">Get Started</a>' +
            '</nav>' +
            themeSwitchTemplate() +
        '</div>';
    }

    function themeSwitchTemplate() {
        return '<div class="theme-switch" role="group" aria-label="Appearance">' +
                '<span class="theme-switch-label">Appearance</span>' +
                '<div class="theme-seg">' +
                    '<button class="theme-seg-btn" type="button" data-theme-set="light" aria-pressed="false">' +
                        '<i class="fas fa-sun"></i><span>Bright</span></button>' +
                    '<button class="theme-seg-btn" type="button" data-theme-set="dark" aria-pressed="false">' +
                        '<i class="fas fa-moon"></i><span>Dark</span></button>' +
                '</div>' +
            '</div>';
    }

    /* ---------- THEME (light / dark) ---------- */
    var THEME_KEY = 'hubTheme';

    function getTheme() {
        try {
            var t = localStorage.getItem(THEME_KEY);
            if (t === 'dark' || t === 'light') return t;
        } catch (e) {}
        return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }

    function applyTheme(theme, save) {
        document.documentElement.setAttribute('data-theme', theme);
        if (save) { try { localStorage.setItem(THEME_KEY, theme); } catch (e) {} }
        document.querySelectorAll('[data-theme-set]').forEach(function (b) {
            var on = b.getAttribute('data-theme-set') === theme;
            b.classList.toggle('active', on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }

    function footerTemplate() {
        var y = new Date().getFullYear();
        return '<div class="container">' +
            '<div class="footer-grid">' +
                '<div>' +
                    '<div class="footer-brand"><span class="brand-mark">A</span>' +
                        '<span><strong>Apna Software Hub</strong><small>Websites · CRM/ERP · Mobile</small></span></div>' +
                    '<p>Websites + CRM/ERP for schools, shops, coaching centres and growing businesses — all in one platform.</p>' +
                '</div>' +
                '<div class="footer-col"><h4>Products</h4>' +
                    '<a href="/shop/">Online Center Website + CRM</a>' +
                    '<a href="/crm/">School ERP + CRM</a>' +
                    '<a href="/clothing/panel/">Apnivo Business (Seller CRM)</a>' +
                    '<a href="/clothing/store/">Apnivo Fashion (Store)</a>' +
                    '<a href="/bondora/">Bondora — Relationship Preview</a>' +
                    '<a href="/blog/">Blog (Tutorials)</a>' +
                    '<a href="/contact.html?module=realestate">Real Estate Portal</a>' +
                '</div>' +
                '<div class="footer-col"><h4>Company</h4>' +
                    '<a href="/services.html">Services</a>' +
                    '<a href="/pricing.html">Pricing</a>' +
                    '<a href="/about.html">About</a>' +
                    '<a href="/contact.html">Contact</a>' +
                '</div>' +
                '<div class="footer-col"><h4>Contact</h4>' +
                    '<a href="mailto:' + CONFIG.email + '"><i class="fas fa-envelope" style="font-size:11px;margin-right:6px;opacity:.7"></i>' + CONFIG.email + '</a>' +
                    '<a href="tel:' + CONFIG.phone + '"><i class="fas fa-phone" style="font-size:11px;margin-right:6px;opacity:.7"></i>' + CONFIG.phone + '</a>' +
                    '<a href="https://wa.me/' + CONFIG.whatsapp + '" target="_blank" rel="noopener"><i class="fab fa-whatsapp" style="font-size:12px;margin-right:6px;color:#25D366"></i>WhatsApp</a>' +
                    '<a href="#">' + CONFIG.city + '</a>' +
                    '<a href="#">' + CONFIG.hours + '</a>' +
                '</div>' +
            '</div>' +
            '<div class="footer-bottom">' +
                '<span>© ' + y + ' Apna Software Hub · All rights reserved.</span>' +
                '<span>Made with ❤️ in India</span>' +
            '</div>' +
        '</div>';
    }

    function init() {
        var h = document.getElementById('hubHeader');
        var f = document.getElementById('hubFooter');
        if (h) { h.className = 'site-header'; h.innerHTML = headerTemplate(); }
        if (f) { f.className = 'site-footer'; f.innerHTML = footerTemplate(); }

        // mobile menu
        var toggle = document.querySelector('.mobile-toggle');
        var nav = document.getElementById('mainNav');
        if (toggle && nav) {
            toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
        }

        // dropdowns
        document.querySelectorAll('[data-drop]').forEach(function (drop) {
            var btn = drop.querySelector('.nav-toggle');
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var isOpen = drop.classList.contains('open');
                document.querySelectorAll('[data-drop].open').forEach(function (d) {
                    d.classList.remove('open');
                    var b = d.querySelector('.nav-toggle'); if (b) b.setAttribute('aria-expanded', 'false');
                });
                if (!isOpen) { drop.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
            });
        });
        document.addEventListener('click', function () {
            document.querySelectorAll('[data-drop].open').forEach(function (d) {
                d.classList.remove('open');
                var b = d.querySelector('.nav-toggle'); if (b) b.setAttribute('aria-expanded', 'false');
            });
        });

        // close mobile menu on link click
        if (nav) {
            nav.querySelectorAll('a').forEach(function (a) {
                a.addEventListener('click', function () { nav.classList.remove('open'); });
            });
        }

        // theme switch (top-right)
        applyTheme(getTheme(), false);
        document.querySelectorAll('[data-theme-set]').forEach(function (b) {
            b.addEventListener('click', function () {
                applyTheme(b.getAttribute('data-theme-set'), true);
            });
        });
    }

    window.HUB = {
        config: CONFIG,
        getTheme: getTheme,
        setTheme: function (t) { applyTheme(t, true); }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
