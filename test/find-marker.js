const fs = require('fs');
const c = fs.readFileSync('public/blog/index.html', 'utf8');
// find all occurrences of 'mount'
let idx = 0;
while ((idx = c.indexOf('mount', idx)) !== -1) {
    console.log(idx, JSON.stringify(c.slice(Math.max(0, idx - 15), idx + 25)));
    idx += 5;
}
