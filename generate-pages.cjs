const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const commerce = require('./commerce.json');
const routes = {en:{home:'/en/home',gallery:'/en/gallery',shop:'/en/shop'},tr:{home:'/tr/ana-sayfa',gallery:'/tr/galeri',shop:'/tr/magaza'}};
const photos = ['1wpVdCLw_iMiFEyREtaeEy0HhczUU2c18.jpg','1xZmrzdA47ImJogL0_9y4oONL5ZL63JC2.jpg','1VjD_BFMPkHXkFycNZ8IbAW-c8QS_SNjY.jpg','183LoPhbVaj2wphYY42tAAU6a2JEcoRVZ.jpg','1IdNl7Vp9sc0JYws6citq-qkWRi6dOmtd.jpg','1TDgyUIODFPQf9gK32z_xED77rc1uJJvT.jpg'];
const logo='/assets/brand/hawan-logo.png';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function write(url,html){
 const tr=html.includes('lang="tr"');
 if(!html.includes('/js/cart.js'))html=html.replace('</head>','<link rel="stylesheet" href="/css/cart.css"><script defer src="/js/cart.js"></script></head>');
 if(!html.includes('class="header-1"'))html=html.replace(/<header\b[^>]*>([\s\S]*?)<\/header>/,(_,inner)=>{
  const languages=inner.match(/<div\b[^>]*>[\s\S]*?<\/div>/)[0];
  const links=languages.replace(/^<div[^>]*>/,'<div class="header-languages">');
  const icon='<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h3l3 12h11l3-9H6M8 15l-1 3h13"/><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></svg>';
  return `<header class="site-header"><div class="header-1">${links}<button class="hc-header" type="button" data-cart-open aria-label="${tr?'Sepet':'Cart'}">${icon}<span data-cart-count aria-hidden="true" hidden>0</span></button></div><div class="header-2">${inner.replace(languages,'')}</div></header>`;
 });
 html=html.replace(/(<button class="model-cart" type="button") disabled title="[^"]*"/g,'$1');
 const dir=path.join(root,url);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);
}
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
 home=home.replace(/(["'])((?:assets|css|js)\/)/g,'$1/$2').replace('href="index.html"',`href="${routes.en.home}"`).replace('href="index-tr.html"',`href="${routes.tr.home}"`).replace('href="#philosophy"',`href="${r.gallery}"`).replace('href="#craft"',`href="${r.shop}"`).replace('>GALLERY</a>',tr?'>GALERİ</a>':'>GALLERY</a>').replace('>SHOP</a>',tr?'>MAĞAZA</a>':'>STORE</a>');
 home=home.replace(/(<img src="\/assets\/brand\/hawan-logo.png"[^>]+>)/,`<a href="${r.home}" aria-label="HAWAN">$1</a>`).replace('</head>',alternates('home')+'<link rel="stylesheet" href="/css/chrome.css"></head>');
 write(r.home,home);

 const excludedGallery=new Set(["183LoPhbVaj2wphYY42tAAU6a2JEcoRVZ.jpg","1IdNl7Vp9sc0JYws6citq-qkWRi6dOmtd.jpg","1TDgyUIODFPQf9gK32z_xED77rc1uJJvT.jpg","1EpInJSkem1CmNEOchEw95UW8XALYpSth.jpg","1_Dta5Z9RVmYjtttM9SsH5KYxEHng9BM4.jpg","1fSWU7hC2BKr2pzesuual7ikg7lL1G34-.jpg","1vxb4_matyd_lnGSWDWQnQHWBQT802JLc.jpg","1wlaVVgswHyGznrdipXnHpd-SnSDU3dFo.jpg",'1z_ej3UIdM4Awa6kx_7ytjLjuUO9AGCMt.png','19JJP6_u-qhbG3Rn4NIdiqwetXk0UjtHI.jpg','1SaIce1ZsJMOMUMeECBZx5js87pgc64x4.jpg','1SSxlSM9ZGpMO3KeJn4nNkg2P9ZiWEMtp.jpg']);
 const galleryFiles=[...photos,...fs.readdirSync(path.join(root,'assets/images')).sort().filter(f=>/\.(jpe?g|png|webp)$/i.test(f)&&!photos.includes(f))].filter(f=>!excludedGallery.has(f));
 const finalImage='The_compact_handcrafted_Hawan_mortar_2026.jpg';
 galleryFiles.splice(galleryFiles.indexOf(finalImage),1);galleryFiles.push(finalImage);
 const labels=tr?['Günün ışığı','Yaşamın içinde','Ahşabın izleri','Dokunuş','İşlevin biçimi','Emek ve keyif']:['In the daylight','At home','The grain of the wood','A tactile moment','Form follows use','The pleasure of making'];
 const names=galleryFiles.map((f,i)=>labels[photos.indexOf(f)]||(f.endsWith('.png')?'HAWAN — '+(tr?'Logo':'Logo'):f==='19JJP6_u-qhbG3Rn4NIdiqwetXk0UjtHI.jpg'?'Adnan Avni':(tr?'HAWAN — Görsel ':'HAWAN — Image ')+(i+1)));
 const gallery=`<div class="gallery-page-heading"><h1 class="eyebrow">${tr?'GALERİ':'GALLERY'}</h1></div><section class="gallery-viewer" tabindex="0" aria-label="${tr?'Galeri görüntüleyici':'Gallery viewer'}" aria-roledescription="${tr?'Görsel galerisi':'Carousel'}"><img class="viewer-image" src="/assets/images/${galleryFiles[0]}" alt="${names[0]}" fetchpriority="high"><button class="viewer-arrow viewer-prev" aria-label="${tr?'Önceki görsel':'Previous image'}"><span aria-hidden="true">←</span></button><button class="viewer-arrow viewer-next" aria-label="${tr?'Sonraki görsel':'Next image'}"><span aria-hidden="true">→</span></button></section><section class="gallery-contact-sheet" aria-label="${tr?'Galeri görselleri':'Gallery images'}"><div class="thumbnail-grid">${galleryFiles.map((f,i)=>`<button class="gallery-thumb" data-index="${i}" aria-label="${esc(names[i])} — ${tr?'görüntüle':'view'}" aria-pressed="${i===0}"><img src="/assets/images/${f}" alt="${esc(names[i])}" loading="lazy"><span aria-hidden="true">${String(i+1).padStart(2,'0')}</span></button>`).join('')}</div></section>`;
 write(r.gallery,shell(l,'gallery',tr?'Galeri':'Gallery',gallery));
 const homeGrid='<section id="philosophy" class="home-gallery snap-target" aria-label="'+(tr?'Galeri':'Gallery')+'"><div class="thumbnail-grid">'+galleryFiles.map((f,i)=>'<button class="gallery-thumb" onclick="openLightbox(this.firstElementChild.src)" aria-label="'+esc(names[i])+'"><img src="/assets/images/'+f+'" alt="'+esc(names[i])+'" loading="lazy"></button>').join('')+'</div></section>';
 home=home.replace(/<section id="philosophy"[\s\S]*?<\/section>/,homeGrid).replace('</head>','<link rel="stylesheet" href="/css/home-gallery.css"></head>');
 write(r.home,home);

 let purchase=`<span class="availability">${tr?'YAKINDA':'COMING SOON'}</span><p>${tr?'Yeni parçalar burada yerini alacak. Satışa açıldığında koleksiyonu bu sayfadan keşfedebileceksiniz.':'New pieces will find their place here. Discover the collection on this page when the shop opens.'}</p>`;
 [4,2,1,3,5,6].forEach((asset,i)=>{
  const n=i+1;
  const materials=tr?['Zeytin','Ceviz','Selvi','Kiraz']:['Olive','Walnut','Cypress','Cherry'];
  const materialValues=['olive','walnut','cypress','cherry'];
  const options=`<div class="product-options"><fieldset><legend>${tr?'Malzeme Seçimi':'Material Selection'}</legend><div class="option-list">${materials.map((label,j)=>`<label class="product-option"><input type="radio" name="material" value="${materialValues[j]}"><span>${label}</span></label>`).join('')}</div></fieldset><div class="size-preference"><label for="product-size">${tr?'Boyut Tercihi':'Size Preference'}</label><div class="size-select-wrap"><select id="product-size" name="size" aria-describedby="size-note" required>${Array.from({length:9},(_,j)=>j+17).map(size=>`<option value="${size}"${size===17?' selected':""}>${size} cm</option>`).join('')}</select></div></div><p id="size-note" class="size-note">${tr?'Ürünler tam yuvarlak olmayan organik formlara sahiptir. Belirtilen boyutlar yaklaşık ölçülerdir; ölçüm yönüne göre küçük farklılıklar olabilir.':'The products have organic shapes and are not perfectly round. Sizes are approximate and may vary slightly depending on the direction of measurement.'}</p></div>`;
  const detail=`<section class="shop-feature product-detail" data-product="${n}"><div class="shop-photo"><img src="/assets/models/HAWAN-0${asset}.png" alt="HAWAN No.${n}" style="object-fit:contain"></div><div class="shop-copy"><span class="eyebrow">HAWAN / ${tr?'KOLEKSİYON':'COLLECTION'}</span><h1>HAWAN No.${n}</h1><p>${tr?'Üç ayaklı ahşap havan tasarımı.':'A three-legged wooden mortar design.'}</p><p class="availability">${tr?'Satış yakında açılacak.':'Available soon.'}</p><button type="button" data-product-add>${tr?'Sepete Ekle':'Add to Cart'}</button><p><a class="text-link" href="${r.shop}/">${tr?'Tüm tasarımlar':'All designs'} ↗</a></p></div></section>`;
  write(`/${tr?'tr/urun':'en/product'}/hawan-no-${n}`,shell(l,'shop','HAWAN No.'+n,detail.replace('<p class="availability">',options+'<p class="availability">')).replace('</head>','<link rel="stylesheet" href="/css/store.css"></head>'));
 });
 if(commerce.provider==='shopier'){
   const u=new URL(commerce.shopierUrl);if(u.protocol!=='https:'||!(u.hostname==='shopier.com'||u.hostname.endsWith('.shopier.com')))throw Error('Use an official HTTPS Shopier store link');
   purchase=`<a class="solid-link" href="${esc(u.href)}">${tr?'Shopier mağazasına git':'Visit our Shopier store'} ↗</a>`;
 } else if(commerce.provider==='shopify'){
   const p=path.resolve(root,commerce.shopifyEmbedFile);if(!commerce.shopifyEmbedFile||!p.startsWith(root+path.sep)||!fs.existsSync(p))throw Error('Provide reviewed Shopify Buy Button HTML inside this repository');
   purchase=fs.readFileSync(p,'utf8');
 } else if(commerce.provider!=='coming-soon')throw Error('Unknown commerce provider');
 const modelSection=home.match(/<section id="models"[\s\S]*?<\/section>/)[0];
 const categoryNames=tr?['Havanlar','Tokmaklar','Diğer Ürünler']:['Mortars','Pestles','Other Products'];
 const categoryIds=tr?['havanlar','tokmaklar','diger-urunler']:['mortars','pestles','other-products'];
 const categoryNav=`<nav class="store-categories" aria-label="${tr?'Ürün kategorileri':'Product categories'}">${categoryNames.map((name,i)=>`<a href="#${categoryIds[i]}">${name}</a>`).join('')}</nav>`;
 const mortars=modelSection.replace('id="models"',`id="${categoryIds[0]}"`).replace('class="model-section snap-target"','class="store-collection"').replace(/aria-label="[^"]*"/,`aria-labelledby="category-mortars"`).replace(/<h2 class="model-heading">[\s\S]*?<\/h2>/,`<h2 id="category-mortars" class="store-category-heading">${categoryNames[0]}</h2>`);
 const collection=categoryNav+mortars+categoryNames.slice(1).map((name,i)=>`<section id="${categoryIds[i+1]}" class="store-category-empty" aria-labelledby="category-${i+1}"><h2 id="category-${i+1}" class="store-category-heading">${name}</h2><p>${tr?'Yakında':'Coming soon'}</p></section>`).join('');
 const shop='<section class="store-intro"><span class="eyebrow">'+(tr?'MAĞAZA':'STORE')+'</span><h1>'+(tr?'Tasarımını Seç...':'Choose Your Design...')+'</h1><p>'+(tr?'Doğal ahşap, üç ayaklı formlar.<br>Yaşam alanına eşlik edecek tasarımı keşfet.':'Natural wood, three-legged forms.<br>Discover a design to accompany your everyday life.')+'</p></section>'+collection+(commerce.provider==='coming-soon'?'':'<section class="store-availability"><div id="commerce-mount" data-provider="'+commerce.provider+'">'+purchase+'</div></section>');
 write(r.shop,shell(l,'shop',tr?'Mağaza':'Store',shop).replace('</head>','<link rel="stylesheet" href="/css/store.css"></head>'));

 const cartPath=tr?'/tr/sepet':'/en/cart';
 const cartHTML=shell(l,'shop',tr?'Sepetin':'Your Cart','<section class="hc hc-page" data-cart-page></section>').replace(/<link rel="alternate"[^>]*>/g,'').replace('</head>','<link rel="alternate" hreflang="tr" href="/tr/sepet/"><link rel="alternate" hreflang="en" href="/en/cart/"></head>').replace('href="/en/shop"','href="/en/cart/"').replace('href="/tr/magaza"','href="/tr/sepet/"');
 write(cartPath,cartHTML);

}
