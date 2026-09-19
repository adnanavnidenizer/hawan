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
