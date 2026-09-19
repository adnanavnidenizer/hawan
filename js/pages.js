const dialog = document.querySelector('.gallery-dialog');
let opener;
document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
 opener = button;
 dialog.querySelector('img').src = button.dataset.photo;
 dialog.querySelector('img').alt = button.querySelector('img').alt;
 dialog.querySelector('p').textContent = button.querySelector('img').alt;
 dialog.showModal();
 document.body.style.overflow = 'hidden';
}));
if (dialog) {
 dialog.querySelector('button').addEventListener('click', () => dialog.close());
 dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
 dialog.addEventListener('close', () => { document.body.style.overflow = ''; opener?.focus(); });
}
