const fs = require('fs');
const path = require('path');
const snippet = `<script>(function(){try{var t=localStorage.getItem('blogTheme');if(t!=='dark'&&t!=='light'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>`;
const needle = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';

function walk(d) {
    const out = [];
    fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
        const full = path.join(d, e.name);
        if (e.isDirectory()) out.push(...walk(full));
        else if (e.name.endsWith('.html')) out.push(full);
    });
    return out;
}

let count = 0;
walk('public/blog').forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    if (c.includes("blogTheme")) { console.log('skip (already): ' + f); return; }
    if (!c.includes(needle)) { console.log('NO VIEWPORT META: ' + f); return; }
    c = c.replace(needle, needle + '\n    ' + snippet);
    fs.writeFileSync(f, c);
    count++;
    console.log('updated: ' + f);
});
console.log('Total updated: ' + count);
