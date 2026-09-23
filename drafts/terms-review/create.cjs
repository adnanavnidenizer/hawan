const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const content = require(path.join(root, 'docs/terms-review-archive.cjs'));
for (const [lang, route, file] of [['tr','tr/sartlar-ve-kosullar','index.html'],['en','en/terms-and-conditions','en.html']]) {
 let html = fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');
 html = html.replace(/<main id="content">[\s\S]*?<\/main>/, () => `<main id="content">${content(lang)}</main>`)
  .replace('noindex,follow', 'noindex,nofollow')
  .replaceAll('/en/terms-and-conditions', '/drafts/terms-review/en.html')
  .replaceAll('/tr/sartlar-ve-kosullar', '/drafts/terms-review/');
 fs.writeFileSync(path.join(__dirname, file), html);
}
