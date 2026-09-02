// Mengambil tombol toggle hamburger berdasarkan ID
const menuBtn = document.getElementById('menuBtn');

// Mengambil kontainer daftar menu mobile berdasarkan ID
const mobileMenu = document.getElementById('mobileMenu');

// ==========================================
// EVENT LISTENER HAMBURGER MENU
// ==========================================

// 1. Logika Klik Tombol Hamburger (Buka / Tutup Menu)
menuBtn?.addEventListener('click', (event) => {
  // Mencegah bubbling agar tidak langsung memicu event klik dokumen di bawah
  event.stopPropagation();

  // Memeriksa status apakah menu sedang tertutup
  const isClosed = mobileMenu.classList.contains('hidden');

  // Toggle kelas tampilan menu: buka (flex) atau sembunyikan (hidden)
  mobileMenu.classList.toggle('hidden');
  mobileMenu.classList.toggle('flex');

  // Mengubah atribut aksesibilitas pembaca layar (screen reader)
  menuBtn.setAttribute('aria-expanded', isClosed);

  // Toggle class 'active' pada tombol hamburger (berguna untuk animasi CSS menjadi tanda silang/X)
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

// 3. Tutup Menu Otomatis Saat Pengguna Mengklik Area di Luar Menu
document.addEventListener('click', (event) => {
  // Pastikan menu sedang terbuka sebelum memproses penutupan
  const isMenuOpen = !mobileMenu?.classList.contains('hidden');

  // Jika menu terbuka dan area yang diklik berada di luar menu maupun tombol hamburger
  if (isMenuOpen && !mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    menuBtn?.classList.remove('active');
    menuBtn?.setAttribute('aria-expanded', 'false');
  }
});
