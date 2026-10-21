/* ============================================================
   APNA COMPUTER BLOG — shared public layout
   News-style header: top bar (live date + breaking ticker) +
   masthead (logo + search) + dark navbar strip.
   Footer + back-to-top. Rendered from Firestore config.
   ============================================================ */

(function () {
    'use strict';

    var B = window.BLOG;
    var esc = B.ui.esc;

    var NAV = [
        { key: 'home', label: 'Home', href: '/blog/' },
        { key: 'list', label: 'All Articles', href: '/blog/list.html' },
        { key: 'about', label: 'About', href: '/blog/about.html' },
        { key: 'contact', label: 'Contact', href: '/blog/contact.html' }
    ];

    function logoHtml(site) {
        if (site.logoUrl) return '<img src="' + esc(site.logoUrl) + '" alt="' + esc(site.siteName) + '">';
        return '<span class="b-logo-mark">B</span>';
    }

    /* format today's date for the top bar */
    function todayStr() {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    }

    /* build ticker items: config.breakingText (split by |) OR latest post titles */
    function tickerItems(site, posts) {
        var items = [];
        if (site.breakingText) {
            site.breakingText.split('|').forEach(function (s) {
                s = s.trim();
                if (s) items.push(s);
            });
        }
        if (!items.length && posts && posts.length) {
            posts.slice(0, 6).forEach(function (p) {
                items.push(p.title);
            });
        }
        if (!items.length) items.push('Welcome to ' + (site.siteName || 'Apna Computer Blog'));
        return items;
    }

    function tickerHtml(items) {
        /* duplicate the list so the CSS loop is seamless */
        var one = items.map(function (t) {
            return '<span class="b-tick-item"><i class="fas fa-bolt"></i> ' + esc(t) + '</span>';
        }).join('');
        return one + one;
    }

    function renderHeader(active, site, posts) {
        var el = document.getElementById('bHeader');
        if (!el) return;

        var nav = NAV.map(function (n) {
            return '<a class="b-nav-link' + (n.key === active ? ' active' : '') + '" href="' + n.href + '"' +
                (n.key === active ? ' aria-current="page"' : '') + '>' + esc(n.label) + '</a>';
        }).join('');

        var items = tickerItems(site, posts);

        el.className = 'b-header';
        el.innerHTML =
            /* ---- TOP BAR ---- */
            '<div class="b-topbar">' +
                '<div class="wrap b-topbar-inner">' +
                    '<span class="b-topbar-date"><i class="far fa-calendar-alt"></i> ' + esc(todayStr()) + '</span>' +
                    '<div class="b-ticker" aria-label="Breaking news">' +
                        '<span class="b-ticker-label">BREAKING</span>' +
                        '<div class="b-ticker-viewport">' +
                            '<div class="b-ticker-track" id="bTickerTrack">' + tickerHtml(items) + '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            /* ---- MASTHEAD ---- */
            '<div class="b-masthead">' +
                '<div class="wrap b-masthead-inner">' +
                    '<a class="b-logo" href="/blog/">' + logoHtml(site) +
                        '<span>' + esc(site.siteName) +
                            '<span class="b-logo-sub">' + esc(site.tagline) + '</span>' +
                        '</span>' +
                    '</a>' +
                    '<form class="b-masthead-search" action="/blog/search.html" method="get" role="search">' +
                        '<input type="search" name="q" placeholder="Search tutorials…" aria-label="Search articles">' +
                        '<button type="submit" aria-label="Search"><i class="fas fa-search"></i></button>' +
                    '</form>' +
                '</div>' +
            '</div>' +
            /* ---- DARK NAVBAR STRIP ---- */
            '<nav class="b-navbar" aria-label="Blog navigation">' +
                '<div class="wrap b-navbar-inner">' +
                    '<div class="b-navbar-links" id="bNav">' + nav + '</div>' +
                    '<button class="b-burger" id="bBurger" aria-label="Open menu" aria-expanded="false"><i class="fas fa-bars"></i></button>' +
                '</div>' +
            '</nav>';

        /* mobile burger toggles the dark navbar links */
        var burger = document.getElementById('bBurger');
        var navEl = document.getElementById('bNav');
        if (burger && navEl) {
            burger.addEventListener('click', function () {
                var open = navEl.classList.toggle('open');
                burger.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
        }

        /* keep the date fresh if the tab stays open past midnight */
        var dateEl = el.querySelector('.b-topbar-date');
        if (dateEl) {
            setInterval(function () { dateEl.innerHTML = '<i class="far fa-calendar-alt"></i> ' + esc(todayStr()); }, 60000);
        }
    }

    function socialHtml(site) {
        var s = site.social || {};
        var out = '';
        var map = {
            facebook: ['fab fa-facebook-f', 'Facebook'],
            twitter: ['fab fa-x-twitter', 'X (Twitter)'],
            youtube: ['fab fa-youtube', 'YouTube'],
            instagram: ['fab fa-instagram', 'Instagram'],
            telegram: ['fab fa-telegram-plane', 'Telegram']
        };
        Object.keys(map).forEach(function (k) {
            if (s[k]) {
                out += '<a href="' + esc(s[k]) + '" target="_blank" rel="noopener" aria-label="' + map[k][1] + '"><i class="' + map[k][0] + '"></i></a>';
            }
        });
        return out;
    }

    function renderFooter(site) {
        var el = document.getElementById('bFooter');
        if (!el) return;

        var cats = window.__BLOG_CATS__ || [];

        var catLinks = cats.length
            ? cats.map(function (c) {
                return '<li><a href="/blog/category/' + encodeURIComponent(c.slug) + '/">' + esc(c.name) + '</a></li>';
            }).join('')
            : '<li><a href="/blog/list.html">All Articles</a></li>';

        el.className = 'b-footer';
        el.innerHTML =
            '<div class="wrap">' +
                '<div class="b-footer-grid">' +
                    '<div>' +
                        '<h5>' + esc(site.siteName) + '</h5>' +
                        '<p class="about">' + esc(site.about) + '</p>' +
                        (socialHtml(site) ? '<div class="b-footer-social">' + socialHtml(site) + '</div>' : '') +
                    '</div>' +
                    '<div>' +
                        '<h5>Categories</h5>' +
                        '<ul>' + catLinks + '</ul>' +
                    '</div>' +
                    '<div>' +
                        '<h5>Quick Links</h5>' +
                        '<ul>' +
                            '<li><a href="/blog/">Home</a></li>' +
                            '<li><a href="/blog/list.html">All Articles</a></li>' +
                            '<li><a href="/blog/about.html">About Us</a></li>' +
                            '<li><a href="/blog/contact.html">Contact</a></li>' +
                            '<li><a href="/shop/">Apna Online Center</a></li>' +
                            '<li><a href="/">Apna Computer Ltd</a></li>' +
                        '</ul>' +
                    '</div>' +
                    '<div>' +
                        '<h5>Contact</h5>' +
                        '<ul class="contact">' +
                            (site.address ? '<li><i class="fas fa-map-marker-alt"></i><span>' + esc(site.address) + '</span></li>' : '') +
                            (site.contactPhone ? '<li><i class="fas fa-phone"></i><a href="tel:' + esc(site.contactPhone) + '">' + esc(site.contactPhone) + '</a></li>' : '') +
                            (site.contactEmail ? '<li><i class="fas fa-envelope"></i><a href="mailto:' + esc(site.contactEmail) + '">' + esc(site.contactEmail) + '</a></li>' : '') +
                        '</ul>' +
                    '</div>' +
                '</div>' +
                '<div class="b-footer-bottom">' +
                    '<span>&copy; ' + new Date().getFullYear() + ' ' + esc(site.siteName) + '. All rights reserved.</span>' +
                    '<span class="links">' +
                        '<a href="/blog/privacy-policy.html">Privacy Policy</a>' +
                        '<a href="/blog/disclaimer.html">Disclaimer</a>' +
                        '<a href="/blog/terms.html">Terms &amp; Conditions</a>' +
                    '</span>' +
                '</div>' +
            '</div>';
    }

    function mountTop() {
        var btn = document.createElement('button');
        btn.className = 'b-top';
        btn.id = 'bTop';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(btn);
        btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
        window.addEventListener('scroll', function () {
            btn.classList.toggle('show', window.scrollY > 500);
        }, { passive: true });
    }

    function wireNewsletter(formId, noteId) {
        var form = document.getElementById(formId);
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = (form.querySelector('input[type=email]').value || '').trim();
            var consent = form.querySelector('input[type=checkbox]').checked;
            if (!email) { B.ui.toast('Please enter your email.', 'error'); return; }
            if (!consent) { B.ui.toast('Please tick the consent box first.', 'error'); return; }
            B.subs.add(email, consent).then(function () {
                form.reset();
                var n = document.getElementById(noteId);
                if (n) n.textContent = 'Thanks! Please check your inbox to confirm your subscription.';
                B.ui.toast('Subscribed — confirmation email on the way.');
            }).catch(function (err) {
                B.ui.toast('Could not subscribe: ' + err.message, 'error');
            });
        });
    }

    function mount(activeKey) {
        document.body.insertAdjacentHTML('afterbegin', '<a class="skip-link" href="#bMain">Skip to content</a>');
        return B.config().then(function (site) {
            window.__BLOG_SITE__ = site;

            if (site.faviconUrl) {
                var f = document.querySelector('link[rel="icon"]');
                if (!f) { f = document.createElement('link'); f.rel = 'icon'; document.head.appendChild(f); }
                f.href = site.faviconUrl;
            }

            /* fetch latest posts so the breaking ticker can fall back to real headlines */
            return B.posts.published().then(function (posts) {
                posts.sort(function (a, b) { return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0); });
                window.__BLOG_POSTS__ = posts;
                renderHeader(activeKey, site, posts);
                return posts;
            }).catch(function () {
                renderHeader(activeKey, site, []);
                return [];
            }).then(function () {
                return B.cats.all('name', 'asc').then(function (cats) {
                    window.__BLOG_CATS__ = cats.filter(function (c) { return c.slug; });
                    renderFooter(site);
                    return site;
                }).catch(function () {
                    renderFooter(site);
                    return site;
                });
            });
        });
    }

    window.BLOG_LAYOUT = {
        mount: mount,
        renderHeader: renderHeader,
        renderFooter: renderFooter,
        wireNewsletter: wireNewsletter,
        nav: NAV
    };
})();
