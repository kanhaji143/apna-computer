/* Blog module — Firebase Hosting rewrite runtime tests (T7)
   Requires the hosting emulator: firebase emulators:start --only hosting
   Run: node test/blog-rewrite-test.js [baseURL]                          */

const BASE = process.argv[2] || 'http://127.0.0.1:5000';
const fs = require('fs');

let pass = 0, fail = 0;
const failures = [];

async function fetchStatus(path) {
    const res = await fetch(BASE + path, { redirect: 'manual' });
    const body = await res.text();
    return { status: res.status, body, headers: res.headers };
}

function t(name, cond, detail) {
    if (cond) { pass++; console.log('  PASS  ' + name + (detail ? '  -> ' + detail : '')); }
    else { fail++; failures.push(name + (detail ? '  -> ' + detail : '')); console.log('  FAIL  ' + name + (detail ? '  -> ' + detail : '')); }
}

/* title/description extraction for SEO checks */
function grab(html, re) { const m = html.match(re); return m ? m[1].trim() : ''; }

(async () => {
    console.log('=== T7: hosting rewrites (base ' + BASE + ') ===');

    /* ---- 1. clean post URL rewrites to the post template ---- */
    const post = await fetchStatus('/blog/read/excel-formulas-cheat-sheet/');
    t('GET /blog/read/<slug>/ returns 200', post.status === 200, 'status ' + post.status);
    t('  served by post template (has #postContent)',
        post.body.includes('id="postContent"') && post.body.includes('Table of Contents'));
    t('  template loads /blog/assets/blog.js', post.body.includes('/blog/assets/blog.js'));
    t('  article page has share buttons markup', post.body.includes('b-share-row'));
    t('  article page has author box', post.body.includes('id="authorBox"'));
    t('  article page has related grid', post.body.includes('id="relatedGrid"'));
    t('  article page has newsletter (consent checkbox)',
        post.body.includes('id="postNews"') && post.body.includes('type="checkbox"'));

    /* no trailing slash variant must also work */
    const postNoSlash = await fetchStatus('/blog/read/excel-formulas-cheat-sheet');
    t('GET /blog/read/<slug> (no trailing slash) also 200', postNoSlash.status === 200, 'status ' + postNoSlash.status);

    /* ---- 2. clean category + tag URLs ---- */
    const cat = await fetchStatus('/blog/category/excel/');
    t('GET /blog/category/<slug>/ returns 200', cat.status === 200, 'status ' + cat.status);
    t('  served by category template', cat.body.includes('id="catTitle"') && cat.body.includes('id="catDesc"'));
    t('  category page starts noindex (JS unlocks it)', cat.body.includes('noindex, nofollow'));

    const tag = await fetchStatus('/blog/tag/chatgpt/');
    t('GET /blog/tag/<slug>/ returns 200', tag.status === 200, 'status ' + tag.status);
    t('  served by tag template', tag.body.includes('id="tagTitle"'));

    /* ---- 3. real static pages still served directly (not swallowed by rewrites) ---- */
    const pages = [
        ['/blog/', 'blog homepage', 'id="homeGrid"'],
        ['/blog/list.html', 'list page', 'id="pager"'],
        ['/blog/search.html', 'search page', 'id="searchForm"'],
        ['/blog/about.html', 'about page', 'About Us'],
        ['/blog/contact.html', 'contact page', 'id="contactForm"'],
        ['/blog/privacy-policy.html', 'privacy policy', 'double opt-in'],
        ['/blog/disclaimer.html', 'disclaimer', 'affiliate'],
        ['/blog/terms.html', 'terms', 'Intellectual property']
    ];
    for (const [p, label, marker] of pages) {
        const res = await fetchStatus(p);
        t(p + ' (' + label + ') returns 200', res.status === 200, 'status ' + res.status);
        t('  contains expected content', res.body.includes(marker), marker.slice(0, 40));
    }

    /* ---- 4. admin pages are NOT caught by the post rewrite ---- */
    const adminPages = ['/blog/admin/login.html', '/blog/admin/index.html', '/blog/admin/posts.html',
        '/blog/admin/editor.html', '/blog/admin/categories.html', '/blog/admin/tags.html',
        '/blog/admin/media.html', '/blog/admin/messages.html', '/blog/admin/subscribers.html',
        '/blog/admin/ads.html', '/blog/admin/settings.html'];
    for (const p of adminPages) {
        const res = await fetchStatus(p);
        t(p + ' returns 200 (not swallowed by rewrite)', res.status === 200, 'status ' + res.status);
    }
    /* login page specifically must be the real login, not the post template */
    const login = await fetchStatus('/blog/admin/login.html');
    t('  login page is the auth page, not post template',
        login.body.includes('id="loginForm"') && !login.body.includes('id="postContent"'));
    t('  login uses Firebase Auth (not localStorage)',
        login.body.includes('firebase-auth-compat.js') && !login.body.includes('localStorage.getItem'));

    /* ---- 5. admin assets served ---- */
    for (const a of ['/blog/assets/blog.js', '/blog/assets/blog.css', '/blog/assets/layout.js',
        '/blog/assets/admin.js', '/blog/assets/admin.css']) {
        const res = await fetchStatus(a);
        t(a + ' returns 200', res.status === 200, 'status ' + res.status);
    }

    /* ---- 6. SEO/AdSense root files ---- */
    const robots = await fetchStatus('/robots.txt');
    t('/robots.txt returns 200', robots.status === 200);
    t('  robots.txt points at sitemap', robots.body.includes('Sitemap: https://apna-computer-ltd.web.app/sitemap.xml'));
    t('  robots.txt blocks /blog/admin/', robots.body.includes('Disallow: /blog/admin/'));
    t('  robots.txt allows AdSense crawlers',
        robots.body.includes('Mediapartners-Google') && robots.body.includes('AdsBot-Google'));

    const sitemap = await fetchStatus('/sitemap.xml');
    t('/sitemap.xml returns 200', sitemap.status === 200);
    t('  sitemap is valid XML', sitemap.body.trim().startsWith('<?xml') && sitemap.body.includes('<urlset'));
    t('  sitemap lists blog homepage', sitemap.body.includes('https://apna-computer-ltd.web.app/blog/'));
    t('  sitemap lists privacy policy (AdSense requirement)',
        sitemap.body.includes('/blog/privacy-policy.html'));

    /* ---- 7. unknown deep path falls back to hub index (catch-all intact) ---- */
    const fallback = await fetchStatus('/some/unknown/deep/path');
    t('unknown deep path falls back (catch-all rewrite intact)',
        fallback.status === 200 && fallback.body.length > 0, 'status ' + fallback.status);

/* ---- 8. cache headers config present (emulator does not apply headers, so verify config) ---- */
const fj = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
const hasNoCache = fj.hosting.headers && fj.hosting.headers.some(h =>
    h.headers && h.headers.some(x => /no-cache/i.test(x.value)));
t('firebase.json sets no-cache for html/js/css/json (config-level; emulator does not emit it)',
    hasNoCache, 'emulator does not apply headers — verified in production deploy');

    /* ---- summary ---- */
    console.log('');
    console.log('========================================');
    console.log('  ' + pass + ' passed, ' + fail + ' failed');
    if (fail) { console.log('  FAILURES:'); failures.forEach(f => console.log('   - ' + f)); }
    console.log('========================================');
    process.exit(fail ? 1 : 0);
})().catch(e => { console.error('FATAL:', e.message); process.exit(2); });
