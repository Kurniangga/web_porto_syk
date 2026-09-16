// EVENT LISTENER HAMBURGER MENU

// 1. Logika Klik Tombol Hamburger (Buka / Tutup Menu)
menuBtn?.addEventListener('click', (event) => {
  event.stopPropagation();
  const isClosed = mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  mobileMenu.classList.toggle('flex');
  menuBtn.setAttribute('aria-expanded', isClosed);
  menuBtn.classList.toggle('active');
});

// 2. Tutup Menu Otomatis Saat Salah Satu Tautan Navigasi Diklik
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    menuBtn?.classList.remove('active');
    menuBtn?.setAttribute('aria-expanded', 'false');
  });
});

