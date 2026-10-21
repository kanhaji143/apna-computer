/* ============================================================
   APNA COMPUTER BLOG — admin shell
   Firebase Auth gate · sidebar · topbar · shared table helpers
   ============================================================ */

(function () {
    'use strict';

    var B = window.BLOG;
    var esc = B.ui.esc;

    var NAV = [
        { sec: 'Main' },
        { key: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line', href: '/blog/admin/index.html' },
        { sec: 'Content' },
        { key: 'posts', label: 'Posts', icon: 'fas fa-newspaper', href: '/blog/admin/posts.html' },
        { key: 'editor', label: 'Add Post', icon: 'fas fa-pen-to-square', href: '/blog/admin/editor.html' },
        { key: 'media', label: 'Media Library', icon: 'fas fa-images', href: '/blog/admin/media.html' },
        { sec: 'Taxonomy' },
        { key: 'categories', label: 'Categories', icon: 'fas fa-folder-tree', href: '/blog/admin/categories.html' },
        { key: 'tags', label: 'Tags', icon: 'fas fa-tags', href: '/blog/admin/tags.html' },
        { sec: 'Inbox' },
        { key: 'messages', label: 'Messages', icon: 'fas fa-inbox', href: '/blog/admin/messages.html' },
        { key: 'subscribers', label: 'Subscribers', icon: 'fas fa-envelope-open-text', href: '/blog/admin/subscribers.html' },
        { sec: 'Settings' },
        { key: 'ads', label: 'Ad Slots', icon: 'fas fa-ad', href: '/blog/admin/ads.html' },
        { key: 'settings', label: 'Site Settings', icon: 'fas fa-sliders', href: '/blog/admin/settings.html' }
    ];

    /* build sidebar + topbar around the existing .main content */
    function shell(activeKey, user, site) {
        site = site || {};

        var nav = NAV.map(function (n) {
            if (n.sec) return '<div class="sb-sec">' + esc(n.sec) + '</div>';
            return '<a href="' + n.href + '"' + (n.key === activeKey ? ' class="active"' : '') + '>' +
                '<i class="' + n.icon + '"></i> ' + esc(n.label) + '</a>';
        }).join('');

        var brandName = site.siteName || 'Apna Computer Blog';

        document.body.insertAdjacentHTML('afterbegin',
            '<div class="overlay" id="sbOverlay"></div>' +
            '<aside class="sidebar" id="sidebar">' +
                '<div class="sb-brand">' +
                    '<span class="mark">B</span>' +
                    '<span><b>' + esc(brandName) + '</b><span>Admin Panel</span></span>' +
                '</div>' +
                '<nav class="sb-nav">' + nav + '</nav>' +
                '<div class="sb-foot">Apna Computer Ltd · Admin</div>' +
            '</aside>' +
            '<header class="topbar">' +
                '<button class="burger" id="sbBurger" aria-label="Open menu"><i class="fas fa-bars"></i></button>' +
                '<h2>' + esc(pageTitle(activeKey)) + '</h2>' +
                '<span class="sp"></span>' +
                '<a class="view" href="/blog/" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> View Blog</a>' +
                '<span class="who"><i class="fas fa-circle-check"></i> <span>' + esc((user && user.email) || 'admin') + '</span></span>' +
                '<button class="out" id="sbOut"><i class="fas fa-right-from-bracket"></i> Logout</button>' +
            '</header>'
        );

        var burger = document.getElementById('sbBurger');
        var side = document.getElementById('sidebar');
        var ov = document.getElementById('sbOverlay');
        burger.addEventListener('click', function () { side.classList.add('open'); ov.classList.add('show'); });
        ov.addEventListener('click', function () { side.classList.remove('open'); ov.classList.remove('show'); });
        document.getElementById('sbOut').addEventListener('click', function () { B.auth.logout(); });
    }

    function pageTitle(key) {
        var f = null;
        NAV.forEach(function (n) { if (n.key === key) f = n; });
        return f ? f.label : 'Dashboard';
    }

    /* gate the page: show spinner, then either render shell or bounce to login */
    function guard(activeKey, onReady) {
        document.body.insertAdjacentHTML('afterbegin',
            '<div class="b-loading" id="adminBoot"><div class="spin"></div>Checking access…</div>');

        Promise.all([B.config()]).then(function (r) {
            var site = r[0];
            B.auth.require(function (user) {
                var boot = document.getElementById('adminBoot');
                if (boot) boot.remove();
                shell(activeKey, user, site);
                onReady(user, site);
            });
        });
    }

    /* ---- shared table/search helper ---- */
    function bindToolbar(opts) {
        /* opts: { searchId, filterId, onChange } */
        var s = document.getElementById(opts.searchId);
        var f = opts.filterId ? document.getElementById(opts.filterId) : null;
        function fire() { opts.onChange((s && s.value) || '', (f && f.value) || ''); }
        if (s) { s.addEventListener('input', fire); }
        if (f) { f.addEventListener('change', fire); }
        return { get: function () { return { q: (s && s.value) || '', f: (f && f.value) || '' }; } };
    }

    /* highlight search matches in a plain-text string (already escaped) */
    function highlight(text, q) {
        if (!q) return esc(text);
        var safe = esc(text);
        var rx = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
        return safe.replace(rx, '<mark style="background:var(--amber-light);color:var(--text);padding:0 2px">$1</mark>');
    }

    /* empty state */
    function emptyState(icon, title, sub) {
        return '<div class="b-empty"><i class="' + icon + '"></i><b>' + esc(title) + '</b>' + (sub ? esc(sub) : '') + '</div>';
    }

    /* confirm-delete helper */
    function askDelete(msg) { return window.confirm(msg || 'Delete this permanently? This cannot be undone.'); }

    window.BLOG_ADMIN = {
        guard: guard,
        shell: shell,
        nav: NAV,
        bindToolbar: bindToolbar,
        highlight: highlight,
        emptyState: emptyState,
        askDelete: askDelete
    };
})();
