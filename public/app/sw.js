/* ============================================================
   APNA COMPUTER — APP SERVICE WORKER (public/app/sw.js)
   Scope: /app/  — only owns app pages, never the main site.
   Rules:
     • Precache the small app shell.
     • Firestore / other cross-origin + non-GET: NEVER intercepted.
     • Navigations: network-first, offline fallback to offline.html.
     • Same-origin GET under /app/: stale-while-revalidate.
   No sensitive or authenticated data is cached (the app performs
   only hub_leads create POSTs and no Firestore reads).
   ============================================================ */
var VERSION = 'v2';
var PREFIX = '/app/';

var PRECACHE = PREFIX + 'shell-' + VERSION;
var PRECACHE_URLS = [
    PREFIX,
    PREFIX + 'index.html',
    PREFIX + 'detail.html',
    PREFIX + 'contact.html',
    PREFIX + 'offline.html',
    PREFIX + 'assets/app.css',
    PREFIX + 'assets/app.js',
    PREFIX + 'assets/products.js',
    PREFIX + 'manifest.webmanifest',
    PREFIX + 'icons/icon-192.png',
    PREFIX + 'icons/icon-512.png'
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(PRECACHE)
            .then(function (c) { return c.addAll(PRECACHE_URLS); })
            .then(function () { return self.skipWaiting(); })
    );
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.filter(function (k) {
                return k.indexOf(PREFIX + 'shell-') === 0 && k !== PRECACHE;
            }).map(function (k) { return caches.delete(k); }));
        }).then(function () { return self.clients.claim(); })
    );
});

self.addEventListener('fetch', function (e) {
    var req = e.request;

    /* Never intercept: non-GET, cross-origin (Firestore REST etc.) */
    if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

    var path = new URL(req.url).pathname;

    /* Only manage files inside /app/ scope */
    if (path.indexOf(PREFIX) !== 0 && path !== '/') return;
    if (path === '/') return; /* main site pages are NOT cached here */

    /* App page navigations: network-first with offline fallback */
    if (req.mode === 'navigate') {
        e.respondWith(
            fetch(req).then(function (res) {
                var copy = res.clone();
                caches.open(PRECACHE).then(function (c) { c.put(req, copy); });
                return res;
            }).catch(function () {
                return caches.match(req).then(function (hit) {
                    if (hit) return hit;
                    /* BUG-4 fix: template pages are precached, so an offline
                       first-visit to a query-string URL (detail.html?id=…,
                       contact.html?module=…) can still render from cache —
                       the page JS rejects unknown ids with a clear message. */
                    if (path.indexOf(PREFIX + 'detail.html') === 0 ||
                        path.indexOf(PREFIX + 'contact.html') === 0 ||
                        path.indexOf(PREFIX + 'index.html') === 0) {
                        return caches.match(path.indexOf(PREFIX + 'detail.html') === 0
                            ? PREFIX + 'detail.html'
                            : (path.indexOf(PREFIX + 'contact.html') === 0
                                ? PREFIX + 'contact.html'
                                : PREFIX + 'index.html'));
                    }
                    return caches.match(PREFIX + 'offline.html');
                });
            })
        );
        return;
    }

    /* Static assets: stale-while-revalidate */
    e.respondWith(
        caches.match(req).then(function (hit) {
            var fetching = fetch(req).then(function (res) {
                if (res.ok) {
                    var copy = res.clone();
                    caches.open(PRECACHE).then(function (c) { c.put(req, copy); });
                }
                return res;
            }).catch(function () { return hit; });
            return hit || fetching;
        })
    );
});
