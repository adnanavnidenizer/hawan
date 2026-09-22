const fs=require('node:fs');
for(const [lang,route,file] of [['tr','tr/ana-sayfa','index.html'],['en','en/home','en.html']]){
 let html=fs.readFileSync(`${route}/index.html`,'utf8');
 html=html.replace(/(<div class="photo-copy[^>]*>)([\s\S]*?)(<\/div>\s*<\/section>)/g,(all,start,inside,end)=>{
   const last=inside.lastIndexOf('</p>');
   return start+'<div class="reading-surface">'+inside.slice(0,last+4)+'</div>'+inside.slice(last+4)+end;
 });
 html=html.replace('</head>','<link rel="stylesheet" href="/drafts/readability/example.css"></head>');
 html=html.replace('<body','<body data-readability="on"');
 html=html.replace('</body>',`<aside class="readability-tools"><strong>OKUNABİLİRLİK TASLAĞI</strong><button type="button" onclick="document.body.dataset.readability=document.body.dataset.readability==='on'?'off':'on';this.textContent=document.body.dataset.readability==='on'?'Önceki görünümü göster':'Öneriyi göster'">Önceki görünümü göster</button><select aria-label="Bölüm" onchange="document.querySelector('.'+this.value).scrollIntoView({behavior:'smooth',block:'center'})"><option value="scene-hero">Giriş</option><option value="scene-organic">Organik Tasarım</option><option value="scene-texture">Yüzey Dokusu</option><option value="scene-utility">İşlevsellik</option><option value="scene-pleasure">Keyif</option></select><a href="/drafts/readability/${lang==='tr'?'en.html':'index.html'}">${lang==='tr'?'EN':'TR'}</a></aside></body>`);
 fs.writeFileSync(`${__dirname}/${file}`,html);
}
