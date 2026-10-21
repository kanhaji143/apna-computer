/* ============================================================
   APNA COMPUTER BLOG — shared engine
   Firebase Auth (real) · Firestore data layer · SEO helpers
   Storage uploads · utilities
   ============================================================ */

(function () {
    'use strict';

    var FIREBASE_CONFIG = {
        apiKey: 'AIzaSyC_iVUneR8fu_haqWPm5UMc5eu8ATBX1Y',
        authDomain: 'apna-computer-ltd.firebaseapp.com',
        projectId: 'apna-computer-ltd',
        storageBucket: 'apna-computer-ltd.firebasestorage.app',
        messagingSenderId: '235081920000',
        appId: '1:235081920000:web:f7de02bf7680617a33f2e5'
    };

    var COLL = {
        posts: 'bl_posts',
        categories: 'bl_categories',
        tags: 'bl_tags',
        media: 'bl_media',
        config: 'bl_config',
        subs: 'bl_subscribers',
        messages: 'bl_messages'
    };

    var SITE_DEFAULT = {
        siteName: 'Apna Computer Blog',
        tagline: 'Simplifying Technology for Everyone',
        logoUrl: '',
        faviconUrl: '',
        breakingText: 'Welcome to Apna Computer Blog — new technology tutorials published every week. Subscribe for updates.',
        about: 'Apna Computer Blog publishes practical technology tutorials in simple English — AI tools, computer basics, Excel, Power BI and digital skills for students, job seekers and beginners.',
        contactEmail: 'kanhadigimkt@gmail.com',
        contactPhone: '+918504985149',
        address: 'Amethi, Uttar Pradesh',
        author: 'Krishna Ji',
        social: { facebook: '', twitter: '', youtube: '', instagram: '', telegram: '' },
        ads: {
            header: { enabled: false, code: '' },
            home: { enabled: false, code: '' },
            inArticle: { enabled: false, code: '' },
            sidebar: { enabled: false, code: '' },
            footer: { enabled: false, code: '' }
        },
        defaultSeo: {
            title: 'Apna Computer Blog — Technology Tutorials',
            description: 'Practical technology tutorials in simple English — AI tools, computer basics, Excel, Power BI and digital skills.',
            image: ''
        },
        analyticsId: ''
    };

    var _db = null, _auth = null, _storage = null;
    var _cfg = null;
    var _user = null;
    var _userWaiters = [];

    /* ---------------- firebase ---------------- */
    function initFirebase() {
        if (typeof firebase === 'undefined') throw new Error('Firebase SDK not loaded');
        if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
        _db = firebase.firestore();
        _auth = firebase.auth();
        _storage = firebase.storage();
        return _db;
    }

    function db() { if (_db) return _db; return initFirebase(); }
    function auth() { if (_auth) return _auth; return initFirebase(); }
    function storage() { if (_storage) return _storage; return initFirebase(); }

    /* ---------------- firestore data layer ---------------- */
    function all(coll, orderKey, direction) {
        var q = db().collection(coll);
        if (orderKey) q = q.orderBy(orderKey, direction || 'desc');
        return q.get().then(function (snap) {
            var rows = [];
            snap.forEach(function (doc) { var d = doc.data() || {}; d.id = doc.id; rows.push(d); });
            return rows;
        });
    }

    function allPublished() {
        return db().collection(COLL.posts).where('status', '==', 'published').get().then(function (snap) {
            var rows = [];
            snap.forEach(function (doc) { var d = doc.data() || {}; d.id = doc.id; rows.push(d); });
            var now = Date.now();
            return rows.filter(function (p) {
                return !p.publishedAt || new Date(p.publishedAt).getTime() <= now;
            });
        });
    }

    function add(coll, data) {
        var payload = Object.assign({}, data);
        if (!payload.createdAt) payload.createdAt = new Date().toISOString();
        return db().collection(coll).add(payload).then(function (ref) { return ref.id; });
    }

    function set(coll, id, data) {
        var payload = Object.assign({}, data);
        payload.updatedAt = new Date().toISOString();
        return db().collection(coll).doc(id).set(payload, { merge: true });
    }

    function remove(coll, id) { return db().collection(coll).doc(id).delete(); }

    function getDoc(coll, id) {
        return db().collection(coll).doc(id).get().then(function (d) {
            return d.exists ? Object.assign({ id: d.id }, d.data()) : null;
        });
    }

    /* ---------------- config ---------------- */
    function config() {
        if (_cfg) return Promise.resolve(_cfg);
        return getDoc(COLL.config, 'site').then(function (doc) {
            _cfg = Object.assign({}, SITE_DEFAULT, doc || {});
            _cfg.social = Object.assign({}, SITE_DEFAULT.social, (doc && doc.social) || {});
            _cfg.ads = Object.assign({}, SITE_DEFAULT.ads, (doc && doc.ads) || {});
            _cfg.defaultSeo = Object.assign({}, SITE_DEFAULT.defaultSeo, (doc && doc.defaultSeo) || {});
            return _cfg;
        }).catch(function () { _cfg = SITE_DEFAULT; return _cfg; });
    }

    function saveConfig(data) {
        _cfg = Object.assign({}, SITE_DEFAULT, data);
        return set(COLL.config, 'site', data);
    }

    /* ---------------- firebase auth (real login) ---------------- */
    function login(email, password) {
        return auth().signInWithEmailAndPassword(email, password).then(function (cred) {
            _user = { email: cred.user.email, uid: cred.user.uid, name: (cred.user.email || '').split('@')[0] };
            return _user;
        });
    }

    function signup(email, password) {
        return auth().createUserWithEmailAndPassword(email, password).then(function (cred) {
            _user = { email: cred.user.email, uid: cred.user.uid, name: (cred.user.email || '').split('@')[0] };
            return _user;
        });
    }

    function logout() {
        return auth().signOut().then(function () {
            _user = null;
            location.href = '/blog/admin/login.html';
        });
    }

    function currentUser() { return _user; }

    /* onAuthStateChanged — admin pages use this to gate access */
    function watchAuth(cb) {
        initFirebase();
        var fired = false;
        auth().onAuthStateChanged(function (u) {
            _user = u ? { email: u.email, uid: u.uid, name: (u.email || '').split('@')[0] } : null;
            fired = true;
            cb(_user);
        });
        /* safety: if Firebase auth never responds, do not hang the page */
        setTimeout(function () { if (!fired) cb(null); }, 6000);
    }

    function requireAuth(cb) {
        watchAuth(function (u) {
            if (!u) { location.href = '/blog/admin/login.html?next=' + encodeURIComponent(location.pathname); return; }
            cb(u);
        });
    }

    /* ---------------- storage (media) ---------------- */
    function uploadImage(file, folder, onProgress) {
        var name = folder + '/' + Date.now() + '-' + String(file.name || 'img').replace(/[^a-zA-Z0-9._-]/g, '-');
        var ref = storage().ref().child(name);
        var task = ref.put(file);
        return new Promise(function (resolve, reject) {
            task.on('state_changed',
                function (s) { if (onProgress) onProgress(Math.round((s.totalBytesTransferred / s.totalBytes) * 100)); },
                reject,
                function () { task.snapshot.ref.getDownloadURL().then(resolve, reject); }
            );
        });
    }

    /* ---------------- slugs ---------------- */
    function slugify(s) {
        return String(s || '').toLowerCase().trim()
            .replace(/['"`]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 90) || 'post';
    }

    /* ---------------- reading helpers ---------------- */
    function readingTime(html) {
        var txt = String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        var words = txt ? txt.split(' ').length : 0;
        return Math.max(1, Math.round(words / 200));
    }

    function excerptFrom(html, n) {
        var txt = String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        if (!txt) return '';
        if (txt.length <= (n || 160)) return txt;
        return txt.slice(0, (n || 160)).replace(/\s+\S*$/, '') + '…';
    }

    /* pull H2/H3 from content for the table of contents */
    function buildToc(html) {
        var div = document.createElement('div');
        div.innerHTML = html || '';
        var heads = div.querySelectorAll('h2, h3');
        var toc = [];
        Array.prototype.forEach.call(heads, function (h, i) {
            var id = 'sec-' + i;
            h.id = id;
            toc.push({ id: id, level: h.tagName === 'H3' ? 3 : 2, text: h.textContent.trim() });
        });
        /* return { toc, html } — html now has ids injected */
        return { toc: toc, html: div.innerHTML };
    }

    /* ---------------- SEO ---------------- */
    function setMeta(opts) {
        opts = opts || {};
        var d = document;

        d.title = opts.title || SITE_DEFAULT.defaultSeo.title;

        function meta(name, content, attr) {
            if (!content) return;
            var a = attr || 'name';
            var el = d.head.querySelector('meta[' + a + '="' + name + '"]');
            if (!el) { el = d.createElement('meta'); el.setAttribute(a, name); d.head.appendChild(el); }
            el.setAttribute('content', content);
        }

        meta('description', opts.description);
        meta('robots', opts.noindex ? 'noindex, nofollow' : 'index, follow');
        meta('author', opts.author);

        meta('og:title', opts.ogTitle || opts.title, 'property');
        meta('og:description', opts.ogDescription || opts.description, 'property');
        meta('og:image', opts.ogImage, 'property');
        meta('og:type', opts.ogType || 'website', 'property');
        meta('og:url', opts.canonical || location.href, 'property');
        meta('og:site_name', opts.siteName, 'property');

        meta('twitter:card', opts.ogImage ? 'summary_large_image' : 'summary');
        meta('twitter:title', opts.ogTitle || opts.title);
        meta('twitter:description', opts.ogDescription || opts.description);
        meta('twitter:image', opts.ogImage);

        var link = d.head.querySelector('link[rel="canonical"]');
        if (!link) { link = d.createElement('link'); link.rel = 'canonical'; d.head.appendChild(link); }
        link.href = opts.canonical || location.href;
    }

    function setJsonLd(obj) {
        if (!obj) return;
        var s = document.createElement('script');
        s.type = 'application/ld+json';
        s.textContent = JSON.stringify(obj);
        document.head.appendChild(s);
    }

    function articleJsonLd(post, site) {
        var url = location.origin + '/blog/read/' + (post.slug || '');
        var out = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.metaDescription || post.excerpt || '',
            url: url,
            mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            author: { '@type': 'Person', name: post.author || site.author || 'Krishna Ji' },
            publisher: {
                '@type': 'Organization',
                name: site.siteName,
                logo: site.logoUrl ? { '@type': 'ImageObject', url: site.logoUrl } : undefined
            }
        };
        if (post.featuredImage) out.image = [post.featuredImage];
        if (post.publishedAt) out.datePublished = post.publishedAt;
        if (post.updatedAt) out.dateModified = post.updatedAt;
        return out;
    }

    function breadcrumbJsonLd(items) {
        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map(function (it, i) {
                return { '@type': 'ListItem', position: i + 1, name: it.name, item: it.url };
            })
        };
    }

    /* ---------------- ads ---------------- */
    /* inject an ad slot only if enabled in config — code is admin-controlled */
    function renderAd(el, slotName, site) {
        if (!el) return;
        var slot = site && site.ads && site.ads[slotName];
        if (!slot || !slot.enabled || !slot.code) { el.style.display = 'none'; return; }
        el.innerHTML = slot.code;
        el.setAttribute('data-ad-slot', slotName);
    }

    /* ---------------- newsletter (GDPR-style double opt-in) ---------------- */
    function subscribe(email, consent) {
        if (!consent) return Promise.reject(new Error('Consent required'));
        return add(COLL.subs, {
            email: String(email || '').toLowerCase().trim(),
            consent: true,
            consentAt: new Date().toISOString(),
            status: 'pending',
            source: location.pathname
        });
    }

    /* ---------------- utilities ---------------- */
    function esc(v) {
        return String(v === null || v === undefined ? '' : v)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function qs(k) {
        var m = location.search.match(new RegExp('[?&]' + k + '=([^&]*)'));
        return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
    }

    function fmtDate(v) {
        if (!v) return '';
        var d = new Date(v);
        if (isNaN(d.getTime())) return esc(v);
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    function fmtDateShort(v) {
        if (!v) return '';
        var d = new Date(v);
        if (isNaN(d.getTime())) return esc(v);
        return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function toast(msg, kind) {
        var el = document.getElementById('blogToast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'blogToast';
            el.className = 'blog-toast';
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.className = 'blog-toast show' + (kind === 'error' ? ' error' : '');
        clearTimeout(el._t);
        el._t = setTimeout(function () { el.className = 'blog-toast'; }, 3200);
    }

    function confirmBox(msg) { return window.confirm(msg); }

    /* copy text to clipboard (share button) */
    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        ta.remove();
        return Promise.resolve();
    }

    window.BLOG = {
        config: config,
        saveConfig: saveConfig,
        db: db, auth: auth, storage: storage, initFirebase: initFirebase,
        coll: COLL,
        posts: { all: all, published: allPublished, add: add, set: set, remove: remove, get: getDoc },
        cats: { all: function (o, d) { return all(COLL.categories, o, d); }, add: add, set: set, remove: remove },
        tags: { all: function (o, d) { return all(COLL.tags, o, d); }, add: add, set: set, remove: remove },
        media: { all: function (o, d) { return all(COLL.media, o, d); }, add: add, remove: remove },
        subs: { add: subscribe, all: function (o, d) { return all(COLL.subs, o, d); } },
        messages: { add: function (d) { return add(COLL.messages, d); }, all: function (o, d) { return all(COLL.messages, o, d); } },
        auth: { login: login, signup: signup, logout: logout, user: currentUser, watch: watchAuth, require: requireAuth },
        upload: uploadImage,
        slugify: slugify,
        readingTime: readingTime,
        excerptFrom: excerptFrom,
        buildToc: buildToc,
        seo: { setMeta: setMeta, setJsonLd: setJsonLd, articleJsonLd: articleJsonLd, breadcrumbJsonLd: breadcrumbJsonLd },
        renderAd: renderAd,
        ui: { esc: esc, qs: qs, fmtDate: fmtDate, fmtDateShort: fmtDateShort, toast: toast, confirm: confirmBox, copy: copyText }
    };
})();
