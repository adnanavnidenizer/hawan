const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const commerce = require('./commerce.json');
const routes = {en:{home:'/en/home',gallery:'/en/gallery',shop:'/en/shop'},tr:{home:'/tr/ana-sayfa',gallery:'/tr/galeri',shop:'/tr/magaza'}};
const photos = ['1wpVdCLw_iMiFEyREtaeEy0HhczUU2c18.jpg','1xZmrzdA47ImJogL0_9y4oONL5ZL63JC2.jpg','1VjD_BFMPkHXkFycNZ8IbAW-c8QS_SNjY.jpg','183LoPhbVaj2wphYY42tAAU6a2JEcoRVZ.jpg','1IdNl7Vp9sc0JYws6citq-qkWRi6dOmtd.jpg','1TDgyUIODFPQf9gK32z_xED77rc1uJJvT.jpg'];
const logo='/assets/images/1z_ej3UIdM4Awa6kx_7ytjLjuUO9AGCMt.png';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function write(url,html){const dir=path.join(root,url);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);}
function alternates(type){return Object.keys(routes).map(l=>`<link rel="alternate" hreflang="${l}" href="${routes[l][type]}">`).join('');}
function homeChrome(l,tag){
 const html=fs.readFileSync(path.join(root,routes[l].home,'index.html'),'utf8');
 return html.match(new RegExp('<'+tag+'\\b[\\s\\S]*?</'+tag+'>'))[0];
}
function header(l,type){return homeChrome(l,'header').replace('href="'+routes.en.home+'"','href="'+routes.en[type]+'"').replace('href="'+routes.tr.home+'"','href="'+routes.tr[type]+'"');}
function footer(l){return homeChrome(l,'footer');}
function shell(l,type,title,content){return `<!doctype html><html lang="${l}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | HAWAN</title><meta name="description" content="${l==='tr'?'HAWAN ahşap havan ve tokmaklar. Doğal dokular, işlevsel tasarım.':'HAWAN wooden mortars and pestles. Natural textures, thoughtful design.'}">${alternates(type)}<link rel="icon" href="${logo}"><link rel="stylesheet" href="/css/fonts.css"><link rel="stylesheet" href="/css/${l}.css"><link rel="stylesheet" href="/css/pages.css"><link rel="stylesheet" href="/css/chrome.css"><script defer src="/js/pages.js"></script></head><body class="secondary-page"><a class="skip" href="#content">${l==='tr'?'İçeriğe geç':'Skip to content'}</a>${header(l,type)}<main id="content">${content}</main>${footer(l)}</body></html>`;}
for(const l of ['en','tr']){
 const tr=l==='tr',r=routes[l];
 let home=fs.readFileSync(path.join(root,tr?'index-tr.html':'index.html'),'utf8');
 home=home.replace(/(["'])((?:assets|css|js)\/)/g,'$1/$2').replace('href="index.html"',`href="${routes.en.home}"`).replace('href="index-tr.html"',`href="${routes.tr.home}"`).replace('href="#philosophy"',`href="${r.gallery}"`).replace('href="#craft"',`href="${r.shop}"`).replace('>GALLERY</a>',tr?'>GALERİ</a>':'>GALLERY</a>').replace('>SHOP</a>',tr?'>MAĞAZA</a>':'>SHOP</a>');
 home=home.replace(/(<img src="\/assets\/images\/1z_ej3UIdM4Awa6kx_7ytjLjuUO9AGCMt.png"[^>]+>)/,`<a href="${r.home}" aria-label="HAWAN">$1</a>`).replace('</head>',alternates('home')+'<link rel="stylesheet" href="/css/chrome.css"></head>');
 write(r.home,home);

 const galleryFiles=[...photos,...fs.readdirSync(path.join(root,'assets/images')).filter(f=>/\.(jpg|png|webp)$/i.test(f)&&!photos.includes(f))];
 const labels=tr?['Günün ışığı','Yaşamın içinde','Ahşabın izleri','Dokunuş','İşlevin biçimi','Emek ve keyif']:['In the daylight','At home','The grain of the wood','A tactile moment','Form follows use','The pleasure of making'];
 const names=galleryFiles.map((f,i)=>labels[i]||(f.endsWith('.png')?'HAWAN — '+(tr?'Logo':'Logo'):f==='19JJP6_u-qhbG3Rn4NIdiqwetXk0UjtHI.jpg'?'Adnan Avni':(tr?'HAWAN — Görsel ':'HAWAN — Image ')+(i+1)));
 const gallery=`<section class="gallery-viewer" tabindex="0" aria-label="${tr?'Galeri görüntüleyici':'Gallery viewer'}" aria-roledescription="${tr?'Görsel galerisi':'Carousel'}"><h1 class="visually-hidden">${tr?'HAWAN Galeri':'HAWAN Gallery'}</h1><img class="viewer-image" src="/assets/images/${galleryFiles[0]}" alt="${names[0]}" fetchpriority="high"><button class="viewer-arrow viewer-prev" aria-label="${tr?'Önceki görsel':'Previous image'}"><span aria-hidden="true">←</span></button><button class="viewer-arrow viewer-next" aria-label="${tr?'Sonraki görsel':'Next image'}"><span aria-hidden="true">→</span></button></section><section class="gallery-contact-sheet" aria-labelledby="all-images"><div class="sheet-heading"><h2 id="all-images">${tr?'Bütün görseller':'All images'}</h2><span>${galleryFiles.length} ${tr?'GÖRSEL':'IMAGES'}</span></div><div class="thumbnail-grid">${galleryFiles.map((f,i)=>`<button class="gallery-thumb" data-index="${i}" aria-label="${esc(names[i])} — ${tr?'görüntüle':'view'}" aria-pressed="${i===0}"><img src="/assets/images/${f}" alt="${esc(names[i])}" loading="lazy"><span aria-hidden="true">${String(i+1).padStart(2,'0')}</span></button>`).join('')}</div></section>`;
 write(r.gallery,shell(l,'gallery',tr?'Galeri':'Gallery',gallery));
 let purchase=`<span class="availability">${tr?'YAKINDA':'COMING SOON'}</span><p>${tr?'Yeni parçalar burada yerini alacak. Satışa açıldığında koleksiyonu bu sayfadan keşfedebileceksiniz.':'New pieces will find their place here. Discover the collection on this page when the shop opens.'}</p>`;
 if(commerce.provider==='shopier'){
   const u=new URL(commerce.shopierUrl);if(u.protocol!=='https:'||!(u.hostname==='shopier.com'||u.hostname.endsWith('.shopier.com')))throw Error('Use an official HTTPS Shopier store link');
   purchase=`<a class="solid-link" href="${esc(u.href)}">${tr?'Shopier mağazasına git':'Visit our Shopier store'} ↗</a>`;
 } else if(commerce.provider==='shopify'){
   const p=path.resolve(root,commerce.shopifyEmbedFile);if(!commerce.shopifyEmbedFile||!p.startsWith(root+path.sep)||!fs.existsSync(p))throw Error('Provide reviewed Shopify Buy Button HTML inside this repository');
   purchase=fs.readFileSync(p,'utf8');
 } else if(commerce.provider!=='coming-soon')throw Error('Unknown commerce provider');
 const shop=`<section class="shop-feature"><div class="shop-photo"><img src="/assets/images/${photos[0]}" alt="${tr?'Doğal ahşaptan HAWAN havan ve tokmak':'HAWAN wooden mortar and pestle'}"></div><div class="shop-copy"><span class="eyebrow">HAWAN / ${tr?'MAĞAZA':'SHOP'}</span><h1>${tr?'Gündelik bir ritüel.':'An everyday ritual.'}</h1><p class="lead">${tr?'Ahşabın karakterinden doğan, kullanıldıkça hayatın bir parçası olan havan ve tokmaklar.':'Mortars and pestles shaped by the character of the wood, becoming part of life through use.'}</p><div id="commerce-mount" data-provider="${commerce.provider}">${purchase}</div><a class="text-link" href="${r.gallery}">${tr?'Parçalara yakından bakın':'Take a closer look'} ↗</a></div></section><section class="shop-details"><article><span class="eyebrow">01 / ${tr?'DOĞA':'NATURE'}</span><h2>${tr?'Her damar farklı.':'No two grains alike.'}</h2><p>${tr?'Ahşabın doğal izleri tasarımın bir parçasıdır. Her HAWAN kendi karakterini taşır.':'The natural marks of the wood are part of the design. Each HAWAN carries its own character.'}</p></article><article><span class="eyebrow">02 / ${tr?'DOKUNUŞ':'TOUCH'}</span><h2>${tr?'Elde tamamlanır.':'Finished by hand.'}</h2><p>${tr?'Özenle şekillenen yüzeyler, ahşabın dokusunu ve sıcaklığını hissetmeniz için elde tamamlanır.':'Carefully shaped surfaces are finished by hand to bring out the texture and warmth of the wood.'}</p></article><article><span class="eyebrow">03 / ${tr?'İŞLEV':'FUNCTION'}</span><h2>${tr?'Kullanmak için.':'Made to be used.'}</h2><p>${tr?'Doğal biçimler ve düşünülmüş detaylar, hazırlama ve öğütme anlarına eşlik eder.':'Organic forms and considered details accompany the moments of preparing and grinding.'}</p></article></section>`;
 write(r.shop,shell(l,'shop',tr?'Mağaza':'Shop',shop));
}
