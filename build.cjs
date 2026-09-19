const fs = require('node:fs');
const path = require('node:path');
require('./generate-pages.cjs');
const out = path.join(__dirname, 'dist');
fs.mkdirSync(out, {recursive:true});
for(const file of ['index.html','index-tr.html']) fs.rmSync(path.join(out,file),{force:true});
fs.copyFileSync(path.join(__dirname,'_redirects'),path.join(out,'_redirects'));
for(const dir of ['css','js','assets','en','tr']) fs.cpSync(path.join(__dirname,dir),path.join(out,dir),{recursive:true});
