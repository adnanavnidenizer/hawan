let previousFocus;
const lightbox=document.getElementById('gallery-lightbox');
const galleryImage=document.getElementById('lightbox-img');
let openTimer;
const homeGalleryImages=[...document.querySelectorAll('.home-gallery .gallery-thumb img')];
let lightboxIndex=0;
function stepLightbox(direction){
 if(!homeGalleryImages.length)return;
 lightboxIndex=(lightboxIndex+direction+homeGalleryImages.length)%homeGalleryImages.length;
 const selected=homeGalleryImages[lightboxIndex];
 galleryImage.removeAttribute('srcset');galleryImage.removeAttribute('sizes');
 galleryImage.src=selected.dataset.original||selected.dataset.viewer;galleryImage.alt=selected.alt;
}
if(lightbox&&homeGalleryImages.length){
 const tr=document.documentElement.lang==='tr';
 for(const [direction,name,label] of [[-1,'prev',tr?'Önceki görsel':'Previous image'],[1,'next',tr?'Sonraki görsel':'Next image']]){
  const button=document.createElement('button');button.type='button';
  button.className='home-viewer-arrow home-viewer-'+name;
  button.setAttribute('aria-label',label);button.innerHTML='<span aria-hidden="true">'+(direction<0?'←':'→')+'</span>';
  button.addEventListener('click',event=>{event.stopPropagation();stepLightbox(direction);});
  lightbox.append(button);
 }
}
function openLightbox(src){
 lightboxIndex=Math.max(0,homeGalleryImages.findIndex(img=>new URL(img.dataset.original||img.dataset.viewer,location.href).href===new URL(src,location.href).href));
 galleryImage.alt=homeGalleryImages[lightboxIndex]?.alt||'Gallery Image';
 previousFocus=document.activeElement;
 galleryImage.removeAttribute('srcset');galleryImage.removeAttribute('sizes');
 galleryImage.src=homeGalleryImages[lightboxIndex]?.dataset.original||src;
 lightbox.classList.remove('opacity-0','pointer-events-none');
 lightbox.setAttribute('aria-hidden','false');
 document.body.style.overflow='hidden';
 lightbox.querySelector('button').focus();
 clearTimeout(openTimer);
 openTimer=setTimeout(()=>{galleryImage.classList.remove('scale-95');galleryImage.classList.add('scale-100');},50);
}
function closeLightbox(){
 clearTimeout(openTimer);
 lightbox.classList.add('opacity-0','pointer-events-none');
 lightbox.setAttribute('aria-hidden','true');
 galleryImage.classList.remove('scale-100');galleryImage.classList.add('scale-95');
 document.body.style.overflow='';
 previousFocus?.focus();
}
document.addEventListener('keydown',event=>{
 if(lightbox.getAttribute('aria-hidden')==='false'){
  if(event.key==='Escape')closeLightbox();
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();stepLightbox(event.key==='ArrowLeft'?-1:1);}
  if(event.key==='Tab'){
   const buttons=[...lightbox.querySelectorAll('button')];
   const index=buttons.indexOf(document.activeElement);
   event.preventDefault();buttons[(index+(event.shiftKey?-1:1)+buttons.length)%buttons.length].focus();
  }
 }
});
document.querySelectorAll('[onclick^="openLightbox"]').forEach(element=>{
 element.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();element.click();}});
});
document.querySelectorAll('[data-waitlist]').forEach((form,index)=>{
 const status=document.createElement('p');status.className='form-status';status.id='form-status-'+index;status.setAttribute('role','status');status.hidden=true;
 form.insertAdjacentElement('afterend',status);
 form.querySelector('input').setAttribute('aria-describedby',status.id);
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  status.hidden=false;
  status.textContent=document.documentElement.lang==='tr'?'Bekleme listesi kaydı henüz açılmadı. E-posta adresiniz gönderilmedi veya kaydedilmedi.':'Waitlist registration is not open yet. Your email has not been sent or saved.';
 });
});
// Load only the video appropriate for the current screen orientation/layout.
document.querySelectorAll('.motion-video').forEach(video=>{
 const mobile=matchMedia('(max-width:767px)');
 const load=()=>{
  video.muted=true;
  video.src=mobile.matches?video.dataset.mobile:video.dataset.desktop;
  video.load();
  video.play().catch(()=>{});
 };
 mobile.addEventListener('change',load);
 load();
});

// Fit text to the original image space without moving or resizing photography.
(()=>{
 const scenes=[...document.querySelectorAll('.photo-section')];if(!scenes.length)return;
 let pending;
 const fit=()=>{
  const mobile=matchMedia('(max-width:767px)').matches;
  const headerHeight=document.querySelector('.site-header')?.getBoundingClientRect().height||152;
  for(const section of scenes){
   const copy=section.querySelector('.photo-copy');if(!copy)continue;
   const text=[...copy.children].filter(e=>e.matches('span,h1,h2,p'));
   for(const el of text)el.style.setProperty('transition','none','important');
   for(const el of text)for(const prop of ['font-size','margin-top','margin-bottom'])el.style.removeProperty(prop);
   const hero=section.classList.contains('scene-hero');
   if(hero){
    const title=copy.querySelector('h1');
    if(title){
     let size=parseFloat(getComputedStyle(title).fontSize);
     while((title.getBoundingClientRect().height>parseFloat(getComputedStyle(title).lineHeight)*2+1||title.scrollWidth>title.clientWidth+1)&&size>1){
      size*=.97;title.style.setProperty('font-size',size+'px','important');
     }
    }
   }

   const style=getComputedStyle(section);
   const top=hero?headerHeight+12:0;
   if(mobile&&hero)section.style.setProperty('--hero-copy-top',top+'px');
   let available=mobile?section.clientWidth*(hero?1600/788:section.classList.contains('scene-pleasure')?1600/899:1600/900)*(hero ? .51 : parseFloat(style.getPropertyValue('--copy-fraction')))-top-(hero?24:48):section.clientHeight-(hero?headerHeight+48:64);
   if(!mobile&&hero){const action=copy.querySelector('.hero-store-action');if(action){const a=getComputedStyle(action);available-=action.getBoundingClientRect().height+parseFloat(a.marginTop)+parseFloat(a.marginBottom)}}
   const bases=text.map(el=>{const c=getComputedStyle(el);return {el,font:parseFloat(c.fontSize),mt:(parseFloat(c.marginTop)||0),mb:(parseFloat(c.marginBottom)||0)}});
   const measure=()=>text.reduce((sum,el)=>{const c=getComputedStyle(el);return sum+el.getBoundingClientRect().height+(parseFloat(c.marginTop)||0)+(parseFloat(c.marginBottom)||0)},0);
   
   let scale=1;
   while(measure()>Math.max(1,available)&&scale>.05){
    scale*=.95;
    for(const b of bases){b.el.style.setProperty('font-size',b.font*scale+'px','important');b.el.style.setProperty('margin-top',b.mt*scale+'px','important');b.el.style.setProperty('margin-bottom',b.mb*scale+'px','important')}
   }
   if(mobile&&hero){
    const productTop=section.clientWidth*1600/788*.51;
    section.style.setProperty('--hero-copy-top',(headerHeight+(productTop-headerHeight-measure())/2)+'px');
   }
   if(!mobile&&hero)section.style.setProperty('--hero-copy-center',(headerHeight+(section.clientHeight-headerHeight)/2)+'px');
  }
 };
 const schedule=()=>{cancelAnimationFrame(pending);pending=requestAnimationFrame(fit)};
 addEventListener('resize',schedule);addEventListener('load',schedule);document.fonts.ready.then(schedule);
 schedule();
})();

// Balance model-section spacing against visible PNG pixels, not image boxes.
(()=>{
 const section=document.querySelector('.model-section');if(!section)return;
 const grid=section.querySelector('.model-grid');
 const images=[...grid.querySelectorAll('.model-card img')];
 const bounds=new WeakMap();let frame;
 function alphaTop(img){
  if(bounds.has(img))return bounds.get(img);
  if(!img.complete||!img.naturalWidth)return null;
  const canvas=document.createElement('canvas');
  canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);
  const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
  let top=0,found=false;
  for(let y=0;y<canvas.height&&!found;y++)for(let x=0;x<canvas.width;x++)if(pixels[(y*canvas.width+x)*4+3]>16){top=y;found=true;break}
  bounds.set(img,top);return top;
 }
 function balance(){
  const columns=getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  const first=images.slice(0,columns);
  if(first.some(img=>!img.complete||!img.naturalWidth))return;
  const visibleTop=Math.min(...first.map(img=>{
   const top=alphaTop(img),rect=img.getBoundingClientRect();
   const scale=Math.min(rect.width/img.naturalWidth,rect.height/img.naturalHeight);
   return rect.bottom-img.naturalHeight*scale+top*scale;
  }));
  const gap=parseFloat(getComputedStyle(section).rowGap)||0;
  const inset=visibleTop-grid.getBoundingClientRect().top;
  section.style.setProperty('--models-visible-space',Math.max(gap,gap+inset)+'px');
 }
 const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(balance)};
 images.forEach(img=>img.addEventListener('load',schedule));
 addEventListener('resize',schedule);document.fonts.ready.then(schedule);
 new ResizeObserver(schedule).observe(grid);schedule();
})();
