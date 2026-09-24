const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const commerce = require('./commerce.json');
const modelNames = ['ORVA','ARDEN','NUMA','OREN','AVELA','TERVA'];
const routes = {en:{home:'/en/home',gallery:'/en/gallery',shop:'/en/shop',contact:'/en/contact',terms:'/en/terms-and-conditions'},tr:{home:'/tr/ana-sayfa',gallery:'/tr/galeri',shop:'/tr/magaza',contact:'/tr/iletisim',terms:'/tr/sartlar-ve-kosullar'}};
const photos = ['1wpVdCLw_iMiFEyREtaeEy0HhczUU2c18.jpg','1xZmrzdA47ImJogL0_9y4oONL5ZL63JC2.jpg','1VjD_BFMPkHXkFycNZ8IbAW-c8QS_SNjY.jpg','183LoPhbVaj2wphYY42tAAU6a2JEcoRVZ.jpg','1IdNl7Vp9sc0JYws6citq-qkWRi6dOmtd.jpg','1TDgyUIODFPQf9gK32z_xED77rc1uJJvT.jpg'];
const galleryAssets = require('./gallery-assets.json');
function galleryImage(file, alt) {
 const a=galleryAssets[file], original='/assets/images/'+file;
 if(!a)return `<img src="${esc(original)}" data-original="${esc(original)}" data-viewer="${esc(original)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
 return `<img src="${a['320']}" srcset="${a['320']} 320w, ${a['640']} 640w" sizes="auto, (max-width:767px) 33vw, 25vw" width="320" height="320" data-original="${esc(original)}" data-viewer="${esc(original)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
}
const logo='/assets/brand/hawan-logo.png';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function write(url,html){
 html=html.replace('</head>','<link rel="stylesheet" href="/css/text-effects.css"><script defer src="/js/text-effects.js"></script></head>');
 const tr=/<html\b[^>]*\slang="tr"/.test(html);
 const product=url.match(/^\/(en\/product|tr\/urun)\/hawan-no-(\d+)$/);
 const pair=product?{en:'/en/product/hawan-no-'+product[2]+'/',tr:'/tr/urun/hawan-no-'+product[2]+'/'}:url==='/en/cart'||url==='/tr/sepet'?{en:'/en/cart/',tr:'/tr/sepet/'}:null;
 if(pair){
  html=html.replace(/<link rel="alternate"[^>]*>/g,'').replace('</head>',Object.entries(pair).map(([lang,href])=>`<link rel="alternate" hreflang="${lang}" href="${href}">`).join('')+'</head>');
  html=html.replace(/(<div class="header-languages">)([\s\S]*?)(<\/div>)/,(_,open,links,close)=>open+links.replace(/href="[^"]*"([^>]*>)(EN|TR)<\/a>/g,(_,rest,lang)=>`href="${pair[lang.toLowerCase()]}"${rest}${lang}</a>`)+close);
 }

 html=html.replace(/href="#"([^>]*>)(Contact|İletişim)<\/a>/gi,(_,rest,label)=>'href="'+(tr?'/tr/iletisim/':'/en/contact/')+'"'+rest+label+'</a>');
 html=html.replace(/href="#"([^>]*>)(Terms &amp; Conditions|Şartlar ve Koşullar)<\/a>/gi,(_,rest,label)=>'href="'+(tr?'/tr/sartlar-ve-kosullar/':'/en/terms-and-conditions/')+'"'+rest+label+'</a>');
 // Match the hero text exactly while preserving the PNG's original alpha and geometry.
 if(!html.includes('id="hawan-logo-color"'))html=html.replace(/<body\b[^>]*>/,body=>body+'<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><filter id="hawan-logo-color" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0.2666666667 0 0 0 0 0.2509803922 0 0 0 0 0.2352941176 0 0 0 1 0"/></filter></defs></svg>');
 if(!html.includes('/js/cart.js'))html=html.replace('</head>','<link rel="stylesheet" href="/css/cart.css"><script defer src="/js/cart.js"></script></head>');
 if(!html.includes('class="header-1"'))html=html.replace(/<header\b[^>]*>([\s\S]*?)<\/header>/,(_,inner)=>{
  const languages=inner.match(/<div\b[^>]*>[\s\S]*?<\/div>/)[0];
  const links=languages.replace(/^<div[^>]*>/,'<div class="header-languages">');
  const icon='<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h3l3 12h11l3-9H6M8 15l-1 3h13"/><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></svg>';
  return `<header class="site-header"><div class="header-1">${links}<button class="hc-header" type="button" data-cart-open aria-label="${tr?'Sepet':'Cart'}">${icon}<span data-cart-count aria-hidden="true" hidden>0</span></button></div><div class="header-2">${inner.replace(languages,'')}</div></header>`;
 });
 html=html.replace(/(<button class="model-cart" type="button") disabled title="[^"]*"/g,'$1');
 // Give search engines one stable production URL for each localized page.
 html=html.replace(/<link rel="canonical"[^>]*>/g,'').replace('</head>',`<link rel="canonical" href="https://hawan.co${url}/"></head>`);
 html=html.replace(/(<link rel="alternate"[^>]*href=")([^"]+)(")/g,(_,before,href,after)=>before+(href.startsWith('/')?'https://hawan.co'+href.replace(/\/?$/,'/'):href)+after);
 // Refresh cached styles and scripts whenever their content changes.
 html=html.replace(/(href|src)="(\/(?:css|js)\/[^"?]+\.(?:css|js))(?:\?[^" ]*)?"/g,(_,attr,asset)=>{
  const hash=require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(root,asset))).digest('hex').slice(0,12);
  return `${attr}="${asset}?v=${hash}"`;
 });
 const dir=path.join(root,url);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);
}
function alternates(type){return Object.keys(routes).map(l=>`<link rel="alternate" hreflang="${l}" href="${routes[l][type]}">`).join('');}
function homeChrome(l,tag){
 const html=fs.readFileSync(path.join(root,routes[l].home,'index.html'),'utf8');
 return html.match(new RegExp('<'+tag+'\\b[\\s\\S]*?</'+tag+'>'))[0];
}
function header(l,type){return homeChrome(l,'header').replace('href="'+routes.en.home+'"','href="'+routes.en[type]+'"').replace('href="'+routes.tr.home+'"','href="'+routes.tr[type]+'"');}
function footer(l){return homeChrome(l,'footer');}
function shell(l,type,title,content){return `<!doctype html><html lang="${l}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | HAWAN — ${l === 'tr' ? 'Özel Tasarım Havan ve Tokmaklar' : 'Custom Mortars &amp; Pestles'}</title><meta name="description" content="${l==='tr'?'HAWAN ahşap havan ve tokmaklar. Doğal dokular, işlevsel tasarım.':'HAWAN wooden mortars and pestles. Natural textures, thoughtful design.'}">${alternates(type)}<link rel="icon" href="${logo}"><link rel="stylesheet" href="/css/fonts.css"><link rel="stylesheet" href="/css/${l}.css"><link rel="stylesheet" href="/css/pages.css"><link rel="stylesheet" href="/css/chrome.css"><script defer src="/js/pages.js"></script></head><body class="secondary-page"><a class="skip" href="#content">${l==='tr'?'İçeriğe geç':'Skip to content'}</a>${header(l,type)}<main id="content">${content}</main>${footer(l)}</body></html>`;}
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
 const gallery=`<div class="gallery-page-heading"><h1 class="eyebrow">${tr?'GALERİ':'GALLERY'}</h1></div><section class="gallery-viewer" tabindex="0" aria-label="${tr?'Galeri görüntüleyici':'Gallery viewer'}" aria-roledescription="${tr?'Görsel galerisi':'Carousel'}"><img class="viewer-image" src="${esc('/assets/images/'+galleryFiles[0])}" decoding="async" alt="${names[0]}" fetchpriority="high"><button class="viewer-arrow viewer-prev" aria-label="${tr?'Önceki görsel':'Previous image'}"><span aria-hidden="true">←</span></button><button class="viewer-arrow viewer-next" aria-label="${tr?'Sonraki görsel':'Next image'}"><span aria-hidden="true">→</span></button></section><section class="gallery-contact-sheet" aria-label="${tr?'Galeri görselleri':'Gallery images'}"><div class="thumbnail-grid">${galleryFiles.map((f,i)=>`<button class="gallery-thumb" data-index="${i}" aria-label="${esc(names[i])} — ${tr?'görüntüle':'view'}" aria-pressed="${i===0}">${galleryImage(f,names[i])}<span aria-hidden="true">${String(i+1).padStart(2,'0')}</span></button>`).join('')}</div></section>`;
 write(r.gallery,shell(l,'gallery',tr?'Galeri':'Gallery',gallery));
 const homeGrid='<section id="philosophy" class="home-gallery snap-target" aria-label="'+(tr?'Galeri':'Gallery')+'"><div class="thumbnail-grid">'+galleryFiles.map((f,i)=>'<button class="gallery-thumb" onclick="openLightbox(this.firstElementChild.dataset.viewer)" aria-label="'+esc(names[i])+'">'+galleryImage(f,names[i])+'</button>').join('')+'</div></section>';
 home=home.replace(/<section id="philosophy"[\s\S]*?<\/section>/,homeGrid).replace('</head>','<link rel="stylesheet" href="/css/home-gallery.css"></head>');
 // Quote introduces section four; gallery replaces Process, video takes its former slot.
 const motionSection=home.match(/<section id="motion"[\s\S]*?<\/section>/)[0];
 const quotationSection=home.match(/<section class="quotation-section[\s\S]*?<\/section>/)[0];
 home=home.replace(motionSection,quotationSection)
   .replace(homeGrid,motionSection)
   .replace(/<section id="craft"[\s\S]*?<\/section>/,homeGrid);
 write(r.home,home);

 const categoryNames=tr?['Havanlar','Tokmaklar','Diğer Ürünler']:['Mortars','Pestles','Other Products'];
 let purchase=`<span class="availability">${tr?'YAKINDA':'COMING SOON'}</span><p>${tr?'Yeni parçalar burada yerini alacak. Satışa açıldığında koleksiyonu bu sayfadan keşfedebileceksiniz.':'New pieces will find their place here. Discover the collection on this page when the shop opens.'}</p>`;
 [4,2,1,3,5,6].forEach((asset,i)=>{
  const n=i+1;
  const materials=tr?['Zeytin','Açık Ceviz','Koyu Ceviz','Selvi','Kiraz']:['Olive','Light Walnut','Dark Walnut','Cypress','Cherry'];
  const materialValues=['olive','walnut-light','walnut-dark','cypress','cherry'];
  const options=`<div class="product-options"><fieldset><legend>${tr?'Malzeme Seçimi':'Material Selection'}</legend><div class="option-list">${materials.map((label,j)=>`<label class="product-option"><input type="radio" name="material" value="${materialValues[j]}"><span><img class="wood-swatch" src="/assets/materials/${materialValues[j]}.svg" alt="" width="42" height="42" aria-hidden="true">${label}</span></label>`).join('')}</div><p class="material-note">${tr?'Renk ve doku örnekleri temsilidir; her ahşap parçası doğal farklılıklar gösterir.':'Colour and grain samples are illustrative; every piece of wood varies naturally.'}</p></fieldset><div class="size-preference"><label for="product-size">${tr?'Çap Tercihi':'Diameter Preference'}</label><div class="size-select-wrap"><select id="product-size" name="size" aria-describedby="size-note" required>${Array.from({length:8},(_,j)=>j+17).map(size=>`<option value="${size}"${size===17?' selected':""}>${size} cm</option>`).join('')}</select></div></div><p id="size-note" class="size-note">${tr?'Ürünler tam yuvarlak olmayan organik formlara sahiptir. Belirtilen çaplar yaklaşık ölçülerdir; ölçüm yönüne göre küçük farklılıklar olabilir.':'The products have organic shapes and are not perfectly round. Diameters are approximate and may vary slightly depending on the direction of measurement.'}</p></div>`;
  const detail=`<section class="shop-feature product-detail" data-product="${n}"><div class="shop-photo"><img src="/assets/models/HAWAN-0${asset}.png" alt="${modelNames[n-1]}" style="object-fit:contain"></div><div class="shop-copy"><span class="eyebrow">${categoryNames[0].toLocaleUpperCase(tr?'tr-TR':'en-US')}</span><h1>${modelNames[n-1]}</h1><p>${tr?'Üç ayaklı ahşap havan tasarımı.':'A three-legged wooden mortar design.'}</p><p class="availability">${tr?'Satış yakında açılacak.':'Available soon.'}</p><button type="button" data-product-add>${tr?'Sepete Ekle':'Add to Cart'}</button><p><a class="text-link" href="${r.shop}/">${tr?'Tüm tasarımlar':'All designs'} ↗</a></p></div></section>`;
  write(`/${tr?'tr/urun':'en/product'}/hawan-no-${n}`,shell(l,'shop',modelNames[n-1],detail.replace('<p class="availability">',options+'<p class="availability">')).replace('</head>','<link rel="stylesheet" href="/css/store.css"></head>'));
 });
 if(commerce.provider==='shopier'){
   const u=new URL(commerce.shopierUrl);if(u.protocol!=='https:'||!(u.hostname==='shopier.com'||u.hostname.endsWith('.shopier.com')))throw Error('Use an official HTTPS Shopier store link');
   purchase=`<a class="solid-link" href="${esc(u.href)}">${tr?'Shopier mağazasına git':'Visit our Shopier store'} ↗</a>`;
 } else if(commerce.provider==='shopify'){
   const p=path.resolve(root,commerce.shopifyEmbedFile);if(!commerce.shopifyEmbedFile||!p.startsWith(root+path.sep)||!fs.existsSync(p))throw Error('Provide reviewed Shopify Buy Button HTML inside this repository');
   purchase=fs.readFileSync(p,'utf8');
 } else if(commerce.provider!=='coming-soon')throw Error('Unknown commerce provider');
 const modelSection=home.match(/<section id="models"[\s\S]*?<\/section>/)[0];
 const categoryIds=tr?['havanlar','tokmaklar','diger-urunler']:['mortars','pestles','other-products'];
 const categoryNav=`<nav class="store-categories" aria-label="${tr?'Ürün kategorileri':'Product categories'}">${categoryNames.map((name,i)=>`<a href="#${categoryIds[i]}">${name}</a>`).join('')}</nav>`;
 const mortars=modelSection.replace('id="models"',`id="${categoryIds[0]}"`).replace('class="model-section snap-target"','class="store-collection"').replace(/aria-label="[^"]*"/,`aria-labelledby="category-mortars"`).replace(/<h2 class="model-heading">[\s\S]*?<\/h2>/,`<h2 id="category-mortars" class="store-category-heading">${categoryNames[0]}</h2>`);
 const collection=categoryNav+mortars+categoryNames.slice(1).map((name,i)=>`<section id="${categoryIds[i+1]}" class="store-category-empty" aria-labelledby="category-${i+1}"><h2 id="category-${i+1}" class="store-category-heading">${name}</h2><p>${tr?'Yakında':'Coming soon'}</p></section>`).join('');
 const shop='<section class="store-intro"><span class="eyebrow">'+(tr?'MAĞAZA':'STORE')+'</span><h1>'+(tr?'Tasarımını Seç...':'Choose Your Design...')+'</h1><p>'+(tr?'Doğal ahşap, üç ayaklı formlar.<br>Yaşam alanına eşlik edecek tasarımı keşfet.':'Natural wood, three-legged forms.<br>Discover a design to accompany your everyday life.')+'</p></section>'+collection+(commerce.provider==='coming-soon'?'':'<section class="store-availability"><div id="commerce-mount" data-provider="'+commerce.provider+'">'+purchase+'</div></section>');
 write(r.shop,shell(l,'shop',tr?'Mağaza':'Store',shop).replace('</head>','<link rel="stylesheet" href="/css/store.css"></head>'));

 const contactCopy=tr?{
 label:'İLETİŞİM',title:'Bir sohbetle başlayalım.',intro:'Bir tasarım hakkında merak ettiklerin, ahşap seçimin veya özel bir fikrin varsa seni dinlemek isteriz.',eyebrow:'HAWAN İLE İLETİŞİM',heading:'Aklındaki parçayı konuşalım.',body:'İlgilendiğin modeli, düşündüğün ağacı ve yaklaşık boyutu paylaşabilirsin. Birlikte, günlük yaşamına eşlik edecek parçanın ayrıntılarını keşfedelim.',topics:['Ürünler ve malzemeler','Özel üretim fikirleri','İşbirlikleri'],descriptions:['Form, ahşap ve ölçü seçeneklerini keşfet.','Aklındaki kullanım alanını ve beklentilerini paylaş.','Projeler, yaratıcı ortaklıklar ve diğer sorular.'],note:'İletişim bilgileri yakında burada paylaşılacak.',link:'Koleksiyonu Keşfet'
 }:{label:'CONTACT',title:'It starts with a conversation.',intro:'A question about a design, a choice of wood, or an idea of your own. We would love to hear it.',eyebrow:'GET IN TOUCH WITH HAWAN',heading:'Let’s talk about your piece.',body:'Share the model you have in mind, your preferred wood and an approximate size. Together, we can explore the details of a piece that belongs in your everyday life.',topics:['Products & materials','Bespoke ideas','Collaborations'],descriptions:['Explore forms, wood choices and dimensions.','Tell us about your space and what you have in mind.','Projects, creative partnerships and other questions.'],note:'Contact details will be shared here soon.',link:'Explore the Collection'};
 const contact='<div class="contact-band">'+contactCopy.label+'</div><section class="contact-intro"><h1>'+contactCopy.title+'</h1><p>'+contactCopy.intro+'</p></section><section class="contact-layout"><div class="contact-image"><img src="/assets/images/'+photos[0]+'" alt="'+(tr?'HAWAN ahşap havan ve tokmak':'HAWAN wooden mortar and pestle')+'"></div><div class="contact-copy"><span class="eyebrow">'+contactCopy.eyebrow+'</span><h2>'+contactCopy.heading+'</h2><p>'+contactCopy.body+'</p><div class="contact-topics">'+contactCopy.topics.map((t,i)=>'<div><h3>'+t+'</h3><p>'+contactCopy.descriptions[i]+'</p></div>').join('')+'</div></div></section>';
 const composer='<section class="contact-compose" aria-labelledby="message-heading"><span class="eyebrow">'+(tr?'BİZE YAZIN':'WRITE TO US')+'</span><h2 id="message-heading">'+(tr?'Mesajına yer açalım.':'A space for your message.')+'</h2><form data-contact-compose><div class="contact-honey" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><div class="compose-row"><label for="sender-name">'+(tr?'Adınız':'Your name')+'<input id="sender-name" name="name" autocomplete="name" maxlength="120" required></label><label for="sender-email">'+(tr?'E-posta adresiniz':'Your email')+'<input id="sender-email" name="email" type="email" autocomplete="email" maxlength="254" required></label></div><label for="message-subject">'+(tr?'Konu':'Subject')+'<input id="message-subject" name="subject" maxlength="160" required></label><label for="message-body">'+(tr?'Mesajınız':'Your message')+'<textarea id="message-body" name="message" rows="9" maxlength="5000" required aria-describedby="compose-note"></textarea></label><div class="compose-bottom"><p id="compose-note">'+(tr?'Gönderim bağlantısı kontrol ediliyor…':'Checking the sending connection…')+'</p><button type="submit">'+(tr?'Mesajı Gönder':'Send Message')+' <span aria-hidden="true">↗</span></button></div><p class="compose-status" role="status" hidden></p><noscript>'+(tr?'Bu form için JavaScript gereklidir. Bize adnanavni@hawan.co adresinden ulaşabilirsiniz.':'This form requires JavaScript. You can reach us at adnanavni@hawan.co.')+'</noscript></form></section>';
 // Reuse the same contact copy, form and backend on the home page.
 const homeContactForm=composer.replace('<section class="contact-compose"','<div class="contact-compose"').replace('</section>','</div>').replace(/<h2 id="message-heading">[\s\S]*?<\/h2>/,'<h2 id="message-heading">'+contactCopy.heading+'</h2><p class="home-contact-intro">'+contactCopy.intro+'</p>');
 home=home.replace(/(<!-- Bottom CTA Section -->\s*)<section\b[^>]*>([\s\S]*?)<\/section>/,(_,comment,old)=>{
  const pattern=old.match(/<div class="absolute inset-0 opacity-5"[\s\S]*?<\/div>/)?.[0]||'';
  return comment+'<section class="home-contact bg-stone-600 relative" aria-labelledby="message-heading">'+pattern+'<div class="home-contact-inner">'+homeContactForm+'</div></section>';
 });
 home=home.replace('</head>','<link rel="stylesheet" href="/css/contact.css"><script defer src="/js/contact.js"></script></head>');
 write(r.home,home);
 write(r.contact,shell(l,'contact',tr?'İletişim':'Contact',contact+composer).replace('</head>','<link rel="stylesheet" href="/css/contact.css"><script defer src="/js/contact.js"></script></head>'));
 write(r.terms,shell(l,'terms',tr?'Şartlar ve Koşullar':'Terms & Conditions',require('./terms-content.cjs')(l)).replace('</head>','<meta name="robots" content="noindex,follow"><link rel="stylesheet" href="/css/terms.css"></head>'));
 const cartPath=tr?'/tr/sepet':'/en/cart';
 const cartHTML=shell(l,'shop',tr?'Sepetin':'Your Cart','<section class="hc hc-page" data-cart-page></section>').replace(/<link rel="alternate"[^>]*>/g,'').replace('</head>','<link rel="alternate" hreflang="tr" href="/tr/sepet/"><link rel="alternate" hreflang="en" href="/en/cart/"></head>').replace('href="/en/shop"','href="/en/cart/"').replace('href="/tr/magaza"','href="/tr/sepet/"');
 write(cartPath,cartHTML);

}
