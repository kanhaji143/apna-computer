const fs = require('fs');
const f = 'public/blog/index.html';
let c = fs.readFileSync(f, 'utf8');

const startMarker = '        function heroFeaturedHtml(p) {';
const endMarker = "        }\n            B.seo.setMeta({";
const startIdx = c.indexOf(startMarker);
const endIdx = c.indexOf(endMarker);
if (startIdx === -1 || endIdx === -1) { console.log('markers not found'); process.exit(1); }

const funcBlock = c.slice(startIdx, endIdx + "        }".length);
// remove the function block + the following blank line from its current location
const before = c.slice(0, startIdx);
const after = c.slice(endIdx + "        }".length);
// after should start with "\n            B.seo.setMeta..."
// remove one leading newline
const afterClean = after.startsWith('\n') ? after.slice(1) : after;

const newContent = before + afterClean;

// now insert funcBlock before "L.mount('home')"
const mountMarker = "        L.mount('home').then(function (site) {";
const mi = newContent.indexOf(mountMarker);
if (mi === -1) { console.log('mount marker not found'); process.exit(1); }
const finalContent = newContent.slice(0, mi) + funcBlock + "\n\n" + newContent.slice(mi);

fs.writeFileSync(f, finalContent);
console.log('done. funcBlock length:', funcBlock.length);
console.log('moved function to before L.mount');
