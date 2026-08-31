const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  mobileMenu.classList.toggle('flex');
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
  });
});
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Form ini masih contoh. Sambungkan ke Formspree, EmailJS, atau backend kamu sendiri.');
  contactForm.reset();
});
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
