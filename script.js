// ============================================================
// Mobile menu: buka/tutup saat tombol ☰ diklik
// ============================================================
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  mobileMenu.classList.toggle('flex');
});

// Tutup menu otomatis kalau salah satu link diklik
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
  });
});

// ============================================================
// Form kontak — masih placeholder, belum tersambung backend.
// Ganti bagian ini dengan integrasi Formspree / EmailJS / API kamu.
// ============================================================
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Form ini masih contoh. Sambungkan ke Formspree, EmailJS, atau backend kamu sendiri.');
  contactForm.reset();
});

// ============================================================
// Tahun otomatis di footer
// ============================================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
