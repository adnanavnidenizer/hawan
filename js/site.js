let previousFocus;
const lightbox=document.getElementById('gallery-lightbox');
const galleryImage=document.getElementById('lightbox-img');
let openTimer;
function openLightbox(src){
 previousFocus=document.activeElement;
 galleryImage.src=src;
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
  if(event.key==='Tab'){event.preventDefault();lightbox.querySelector('button').focus();}
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
