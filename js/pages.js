const viewer = document.querySelector('.gallery-viewer');
if (viewer) {
 const image = viewer.querySelector('.viewer-image');
 const thumbs = [...document.querySelectorAll('.gallery-thumb')];
 let current = 0;
 function show(index) {
  current = (index + thumbs.length) % thumbs.length;
  const target = thumbs[current].querySelector('img');
  image.src = target.src;
  image.alt = target.alt;
  image.classList.toggle('is-logo', target.src.endsWith('.png'));
  thumbs.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
 }
 viewer.querySelector('.viewer-prev').addEventListener('click', () => show(current - 1));
 viewer.querySelector('.viewer-next').addEventListener('click', () => show(current + 1));
 viewer.addEventListener('keydown', event => {
  if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  event.preventDefault();
  show(event.key === 'Home' ? 0 : event.key === 'End' ? thumbs.length - 1 : current + (event.key === 'ArrowRight' ? 1 : -1));
 });
 thumbs.forEach((button, index) => button.addEventListener('click', () => {
  show(index);
  viewer.focus({preventScroll:true});
  viewer.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 }));
 let start;
 viewer.addEventListener('touchstart', event => { start = {x:event.touches[0].clientX,y:event.touches[0].clientY}; }, {passive:true});
 viewer.addEventListener('touchend', event => {
  if (!start) return;
  const dx=event.changedTouches[0].clientX-start.x,dy=event.changedTouches[0].clientY-start.y;
  if (Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5) show(current+(dx<0?1:-1));
  start=null;
 }, {passive:true});
}

// Repeat the viewer's lower breathing room below the contact sheet.
if (viewer) {
 const photo = viewer.querySelector('.viewer-image');
 function restoreFooterSpace() {
  if (!photo.naturalWidth) return;
  const style = getComputedStyle(viewer);
  const vertical = parseFloat(style.paddingBottom);
  const available = viewer.clientHeight - parseFloat(style.paddingTop) - vertical;
  const width = viewer.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  const displayedHeight = Math.min(available, width * photo.naturalHeight / photo.naturalWidth);
  viewer.parentElement.style.setProperty('--gallery-footer-space', (vertical + (available - displayedHeight) / 2) + 'px');
 }
 photo.addEventListener('load', restoreFooterSpace);
 new ResizeObserver(restoreFooterSpace).observe(viewer);
 restoreFooterSpace();
}

// Smallest column count that fits every square within one viewport section.
function galleryColumns(count, width, height) {
 if (!count || width <= 0 || height <= 0) return 1;
 let columns = Math.max(1, Math.ceil(Math.sqrt(count * width / height)));
 while (Math.ceil(count / columns) * width / columns > height) columns++;
 // Prefer complete rows while retaining the largest edge-to-edge squares.
 for(let full=columns;full<=count;full++)if(count%full===0)return full;
 return columns;
}
const adaptiveGrid = document.querySelector('.thumbnail-grid');
if (adaptiveGrid) {
 const measure = document.createElement('span');
 measure.setAttribute('aria-hidden', 'true');
 measure.style.cssText='position:absolute;width:0;height:100svh;visibility:hidden;pointer-events:none';
 adaptiveGrid.parentElement.append(measure);
 let pending;
 function layoutGrid() {
  cancelAnimationFrame(pending);
  pending = requestAnimationFrame(() => {
   const count=adaptiveGrid.querySelectorAll('.gallery-thumb').length;
   const columns=galleryColumns(count,adaptiveGrid.clientWidth,measure.getBoundingClientRect().height);
   adaptiveGrid.style.setProperty('--gallery-columns',columns);
  });
 }
 new ResizeObserver(layoutGrid).observe(adaptiveGrid);
 new ResizeObserver(layoutGrid).observe(measure);
 new MutationObserver(layoutGrid).observe(adaptiveGrid,{childList:true});
 layoutGrid();
}

// Explore product detail at the pointer position without changing the page layout.
for (const photo of document.querySelectorAll('.product-detail .shop-photo')) {
 const image = photo.querySelector('img');
 const reset = () => photo.classList.remove('is-zoomed');
 const point = event => {
  if (event.pointerType !== 'mouse') return;
  const box = photo.getBoundingClientRect();
  const x = Math.max(0, Math.min(100, (event.clientX - box.left) / box.width * 100));
  const y = Math.max(0, Math.min(100, (event.clientY - box.top + 28) / image.clientHeight * 100));
  photo.style.setProperty('--zoom-x', x + '%');
  photo.style.setProperty('--zoom-y', y + '%');
  photo.classList.add('is-zoomed');
 };
 photo.addEventListener('pointerenter', point);
 photo.addEventListener('pointermove', point);
 photo.addEventListener('pointerleave', reset);
 photo.addEventListener('pointercancel', reset);

 window.addEventListener('blur', reset);
}
