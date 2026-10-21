const fs = require('fs');
const f = 'public/blog/index.html';
let c = fs.readFileSync(f, 'utf8');

const marker = '            B.seo.setMeta({\n                title: site.defaultSeo.title,';
const idx = c.indexOf(marker);
if (idx === -1) { console.log('marker not found'); process.exit(1); }

// Insert the L.mount wrapper before B.seo.setMeta
const wrapper = '        L.mount(\'home\').then(function (site) {\n            window.__BLOG_SITE__ = site;\n';
const newC = c.slice(0, idx) + wrapper + c.slice(idx);

fs.writeFileSync(f, newC);
console.log('inserted wrapper before B.seo.setMeta');

// verify
const c2 = fs.readFileSync(f, 'utf8');
console.log('has L.mount:', c2.includes("L.mount('home')"));
console.log('has heroFeaturedHtml:', c2.includes('heroFeaturedHtml'));
