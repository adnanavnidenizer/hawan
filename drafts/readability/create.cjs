const fs=require('node:fs');
for(const [source,target] of [['tr/ana-sayfa/index.html','index.html'],['en/home/index.html','en.html']]) fs.copyFileSync(source,`${__dirname}/${target}`);
