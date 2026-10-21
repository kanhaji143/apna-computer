const fs = require('fs');
const c = fs.readFileSync('public/blog/index.html', 'utf8');
const lines = c.split('\n');
for (let i = 118; i < 126; i++) console.log((i+1) + ': ' + lines[i]);
console.log('---');
// search for .then(
let idx = 0;
while ((idx = c.indexOf('.then(', idx)) !== -1) {
    const lineNum = c.slice(0, idx).split('\n').length;
    console.log('then at line ' + lineNum);
    idx += 6;
}
console.log('--- L. occurrences ---');
let i2 = 0;
while ((i2 = c.indexOf('L.', i2)) !== -1) {
    const lineNum = c.slice(0, i2).split('\n').length;
    console.log('L. at line ' + lineNum + ': ' + c.slice(i2, i2+20));
    i2 += 2;
}
