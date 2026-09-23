const fs = require('node:fs');
const path = require('node:path');
require('./generate-pages.cjs');
const out = path.join(__dirname, 'dist');
fs.mkdirSync(out, {recursive:true});
for(const file of ['index.html','index-tr.html']) fs.rmSync(path.join(out,file),{force:true});
fs.copyFileSync(path.join(__dirname,'_redirects'),path.join(out,'_redirects'));
fs.copyFileSync(path.join(__dirname,'_headers'),path.join(out,'_headers'));
for(const dir of ['css','js','assets','en','tr']) fs.cpSync(path.join(__dirname,dir),path.join(out,dir),{recursive:true});

fs.copyFileSync(path.join(__dirname,'_routes.json'),path.join(out,'_routes.json'));

// Publish only indexable content routes; carts and provisional terms are omitted.
const pageURLs=[];
function collectPages(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())collectPages(file);else if(entry.name==='index.html'){const url='/'+path.relative(out,path.dirname(file)).split(path.sep).join('/')+'/';if(!/\/(cart|sepet|terms-and-conditions|sartlar-ve-kosullar)\/$/.test(url))pageURLs.push('https://hawan.co'+url);}}}
for(const lang of ['en','tr'])collectPages(path.join(out,lang));
fs.writeFileSync(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pageURLs.map(url=>'<url><loc>'+url+'</loc></url>').join('')+'</urlset>');
fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://hawan.co/sitemap.xml\n');
