/* Blog module — static validation tests (T1–T6)
   Run: node test/blog-validate.js   (from repo root) */
const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
const failures = [];
function t(name, cond, detail) {
    if (cond) { pass++; console.log('  PASS  ' + name + (detail ? '  -> ' + detail : '')); }
    else { fail++; failures.push(name + (detail ? '  -> ' + detail : '')); console.log('  FAIL  ' + name + (detail ? '  -> ' + detail : '')); }
}
const read = p => fs.readFileSync(p, 'utf8');
const exists = p => fs.existsSync(p);

/* ================= T3: firestore.rules ================= */
console.log('=== T3: firestore.rules structure & security ===');
const r = read('firestore.rules');
/* strip // comments before counting delimiters — comments may contain stray brackets */
const rCode = r.split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
t('rules_version = 2 present', /rules_version\s*=\s*'2'/.test(r));
t('braces balanced (code only)', (rCode.match(/{/g) || []).length === (rCode.match(/}/g) || []).length,
    (rCode.match(/{/g) || []).length + ' open / ' + (rCode.match(/}/g) || []).length + ' close');
t('parens balanced (code only)', (rCode.match(/\(/g) || []).length === (rCode.match(/\)/g) || []).length,
    (rCode.match(/\(/g) || []).length + ' ( / ' + (rCode.match(/\)/g) || []).length + ' )');

['bl_posts', 'bl_categories', 'bl_tags', 'bl_media', 'bl_config', 'bl_subscribers', 'bl_messages']
    .forEach(c => t('collection declared: ' + c, new RegExp('match /' + c + '/\\{id\\}').test(r)));

t('default deny fallback kept', r.includes('match /{document=**}') && /allow read, write: if false/.test(r));
t('isAdmin() helper defined', /function isAdmin\(\)/.test(r));
t('canReadPublicPost() helper defined', /function canReadPublicPost\(\)/.test(r));

const blogStart = r.indexOf('---- Blog (Phase 7');
const blogEnd = r.indexOf('---- Clothing CRM');
const blogSection = r.substring(blogStart, blogEnd > 0 ? blogEnd : r.length);
const openWrites = blogSection.match(/allow[^;]*write:\s*if true/g) || [];
t('no blog collection has open public write', openWrites.length === 0, openWrites.length + ' open writes found');
t('posts: create requires admin', /allow create: if isAdmin\(\)/.test(r));
t('posts: delete requires admin', /allow delete: if isAdmin\(\)/.test(r));
t('subscribers: consent enforced on create', /allow create: if request\.resource\.data\.consent == true/.test(r));
t('subscriber list hidden from public', /match \/bl_subscribers\/\{id\}[\s\S]*?allow read, update, delete: if isAdmin\(\)/.test(r));
t('message inbox hidden from public', /match \/bl_messages\/\{id\}[\s\S]*?allow read, update, delete: if isAdmin\(\)/.test(r));
t('public update limited to view-count only', /hasOnly\(\['views'\]\)/.test(r));
t('scheduling enforced via publishAt timestamp', /resource\.data\.publishAt <= request\.time/.test(r));

console.log('');
console.log('=== T3b: existing modules left untouched ===');
['cl_products', 'sc_students', 'oc_customers', 'ch_students'].forEach(c => {
    t(c + ' still public demo (unchanged)', new RegExp('match /' + c + '/\\{id\\}\\s*{\\s*allow read, write: if true;').test(r));
});
t('hub_leads still create-only public', /match \/hub_leads\/\{id\}[\s\S]*?allow create: if true;/.test(r));

/* ================= T4: JS syntax ================= */
console.log('');
console.log('=== T4: JavaScript syntax (node --check) ===');
const { execSync } = require('child_process');
const jsFiles = [
    'public/blog/assets/blog.js',
    'public/blog/assets/layout.js',
    'public/blog/assets/admin.js'
];
jsFiles.forEach(f => {
    try { execSync('node --check "' + f + '"', { stdio: 'pipe' }); t('syntax OK: ' + f, true); }
    catch (e) { t('syntax OK: ' + f, false, String(e.stderr || e.message).slice(0, 200)); }
});

/* extract + check every inline <script> block that has no src= */
console.log('');
console.log('=== T4b: inline <script> blocks in HTML ===');
const htmlFiles = [];
(function walk(d) {
    fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
        const full = path.join(d, e.name);
        if (e.isDirectory()) walk(full);
        else if (e.name.endsWith('.html')) htmlFiles.push(full);
    });
})('public/blog');

let inlineChecked = 0;
htmlFiles.forEach(f => {
    const html = read(f);
    const blocks = html.match(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g) || [];
    blocks.forEach((b, i) => {
        const code = b.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '');
        if (!code.trim()) return;
        inlineChecked++;
        const tmp = path.join(require('os').tmpdir(), 'blk.js');
        fs.writeFileSync(tmp, code);
        try { execSync('node --check "' + tmp + '"', { stdio: 'pipe' }); }
        catch (e) { t('inline script #' + (i + 1) + ' in ' + f, false, String(e.stderr || e.message).slice(0, 240)); }
    });
});
t('all inline script blocks parsed (' + inlineChecked + ' blocks across ' + htmlFiles.length + ' files)', true);

/* ================= T5: asset references ================= */
console.log('');
console.log('=== T5: every referenced local asset/file exists ===');
let refs = 0, missing = 0;
const missingList = [];
const dynamic = /['"+]|encodeURIComponent|\.html'/;   // JS-concatenated URLs are not static refs
htmlFiles.forEach(f => {
    const html = read(f);
    const found = html.match(/(?:href|src)="(\/[^"]+)"/g) || [];
    found.forEach(m => {
        let url = m.replace(/^(href|src)="/, '').replace(/"$/, '').split('?')[0].split('#')[0];
        if (!url.startsWith('/blog/')) return;           // only verify blog module paths
        if (dynamic.test(url)) return;                    // skip JS-built URLs (verified separately)
        if (url.endsWith('/')) url += 'index.html';       // directory URL -> index.html
        refs++;
        if (!exists('public' + url)) { missing++; missingList.push(f + ' -> ' + url); }
    });
});
t('all static /blog/ references resolve (' + refs + ' checked)', missing === 0,
    missing === 0 ? '' : missing + ' MISSING: ' + missingList.slice(0, 6).join(', '));

/* T5b: the JS-built clean URLs must point at the real rewrite targets */
console.log('');
console.log('=== T5b: dynamic (JS-built) URLs point at rewrite targets ===');
const dynamicPatterns = [
    ['/blog/read/<slug>/', '/blog/templates/post.html', 'post template'],
    ['/blog/category/<slug>/', '/blog/templates/category.html', 'category template'],
    ['/blog/tag/<slug>/', '/blog/templates/tag.html', 'tag template']
];
dynamicPatterns.forEach(([label, dest]) => {
    const tpl = 'public' + dest;
    t('rewrite target exists: ' + dest, exists(tpl));
    const h = read(tpl);
    t(dest + ' reads ?slug= from URL', h.includes("qs('slug')"));
});

/* ================= T6: SEO meta on every public page ================= */
console.log('');
console.log('=== T6: SEO meta present on public pages ===');
const publicPages = ['public/blog/index.html', 'public/blog/list.html', 'public/blog/search.html',
    'public/blog/about.html', 'public/blog/contact.html', 'public/blog/privacy-policy.html',
    'public/blog/disclaimer.html', 'public/blog/terms.html'];
publicPages.forEach(f => {
    const h = read(f);
    const name = f.replace('public', '');
    t(name + ' has <title>', /<title>[^<]{10,}<\/title>/.test(h));
    t(name + ' has meta description', /<meta name="description" content="[^"]{30,}"/.test(h));
    t(name + ' has robots tag', /<meta name="robots"/.test(h));
    t(name + ' is lang="en"', /<html lang="en">/.test(h));
    t(name + ' has viewport (mobile-first)', /name="viewport"/.test(h));
});

/* templates start noindex (correct: only the JS unlocks indexing for real posts) */
['public/blog/templates/post.html', 'public/blog/templates/category.html', 'public/blog/templates/tag.html']
    .forEach(f => {
        const h = read(f);
        t(f.replace('public', '') + ' starts noindex (safe default)', /<meta name="robots" content="noindex, nofollow">/.test(h));
    });

/* ================= summary ================= */
console.log('');
console.log('========================================');
console.log('  ' + pass + ' passed, ' + fail + ' failed');
if (fail) { console.log('  FAILURES:'); failures.forEach(f => console.log('   - ' + f)); }
console.log('========================================');
process.exit(fail ? 1 : 0);
