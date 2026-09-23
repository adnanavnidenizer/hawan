(() => {
  let pending = false;
  function update() {
    pending = false;
    for (const el of document.body.querySelectorAll('*')) {
      if (el.closest('svg,script,style,template')) continue;
      const hasText = [...el.childNodes].some(node => node.nodeType === 3 && node.textContent.trim());
      if (!hasText && !el.matches('input,textarea,select')) continue;
      const color = getComputedStyle(el).color;
      const mode = color === 'rgb(68, 64, 60)' ? 'ink' : 'outline';
      if (el.dataset.textContour !== mode) el.dataset.textContour = mode;
    }
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }
  new MutationObserver(schedule).observe(document.body, {
    subtree: true, childList: true, characterData: true,
    attributes: true, attributeFilter: ['class', 'style', 'open', 'checked']
  });
  window.addEventListener('resize', schedule);
  document.addEventListener('pointerover', schedule);
  document.addEventListener('pointerout', schedule);
  document.addEventListener('focusin', schedule);
  document.addEventListener('focusout', schedule);
  document.addEventListener('change', schedule);
  document.addEventListener('transitionend', schedule);
  update();
})();
