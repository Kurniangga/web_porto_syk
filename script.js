"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  /* =========================================================
     1. Toggle Dark Mode / Light Mode
     (kelas "dark" di <html> sudah diset lebih awal di <head>)
     ========================================================= */
  const themeToggle = $("#themeToggle");
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function syncThemeButton() {
    const isDark = root.classList.contains("dark");
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"
    );
  }

  themeToggle.addEventListener("click", () => {
    const isDark = root.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (err) { /* localStorage tidak tersedia, abaikan */ }
    syncThemeButton();
  });

  // Kalau belum pernah memilih manual, ikuti pengaturan tema perangkat
  darkQuery.addEventListener("change", (event) => {
    try {
      if (localStorage.getItem("theme")) return;
    } catch (err) { /* abaikan */ }
    root.classList.toggle("dark", event.matches);
    syncThemeButton();
  });

  syncThemeButton();


  /* =========================================================
     2. Menu mobile + ikon burger berubah jadi X
     (animasi ikon ada di style.css lewat [aria-expanded="true"])
     ========================================================= */
  const menuBtn = $("#menuBtn");
  const mobileMenu = $("#mobileMenu");

  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    mobileMenu.classList.toggle("open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
  }

  menuBtn.addEventListener("click", () => {
    setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
  });

  // Tutup menu saat salah satu link diklik
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  // Tutup dengan tombol Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  // Tutup saat klik di luar navbar
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#navbar")) setMenu(false);
  });

  // Tutup otomatis kalau layar melebar ke ukuran desktop
  window.matchMedia("(min-width: 768px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });


  /* =========================================================
     3. Navbar: bayangan saat di-scroll
     ========================================================= */
  const navbar = $("#navbar");

  function onScroll() {
    navbar.classList.toggle("nav-scrolled", window.scrollY > 8);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();


  /* =========================================================
     4. Tandai link navbar sesuai section yang sedang dilihat
     ========================================================= */
  const navLinks = $$(".nav-link");
  const sections = ["home", "about", "experience", "skills", "projects", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => spy.observe(section));


  /* =========================================================
     5. Tahun otomatis di footer
     ========================================================= */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();


  /* =========================================================
     6. Carousel project (scroll-snap + tombol + indikator)
     ========================================================= */
  const track = $("#carouselTrack");
  const prevBtn = $("#carouselPrev");
  const nextBtn = $("#carouselNext");
  const dotsWrap = $("#carouselDots");

  if (track && prevBtn && nextBtn && dotsWrap) {
    const cards = Array.from(track.children);
    let dots = [];

    // Jarak geser satu card (lebar card + gap)
    function stepSize() {
      if (cards.length < 2) return track.clientWidth;
      return cards[1].offsetLeft - cards[0].offsetLeft;
    }

    // Posisi terakhir yang bisa dicapai (jumlah "langkah" geser)
    function maxIndex() {
      const scrollable = track.scrollWidth - track.clientWidth;
      return Math.max(0, Math.round(scrollable / stepSize()));
    }

    function currentIndex() {
      const index = Math.round(track.scrollLeft / stepSize());
      return Math.min(maxIndex(), Math.max(0, index));
    }

    function goTo(index) {
      track.scrollTo({ left: index * stepSize(), behavior: "smooth" });
    }

    function update() {
      const active = currentIndex();
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === active);
        dot.setAttribute("aria-current", i === active ? "true" : "false");
      });
      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    }

    function buildDots() {
      dotsWrap.innerHTML = "";
      dots = [];
      const total = maxIndex() + 1;
      // Sembunyikan indikator kalau semua card sudah muat dalam satu layar
      dotsWrap.style.display = total <= 1 ? "none" : "";
      for (let i = 0; i < total; i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", "Ke posisi " + (i + 1));
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
        dots.push(dot);
      }
      update();
    }

    prevBtn.addEventListener("click", () => {
      track.scrollBy({ left: -stepSize(), behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      track.scrollBy({ left: stepSize(), behavior: "smooth" });
    });

    // Navigasi keyboard saat carousel sedang fokus
    track.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        track.scrollBy({ left: stepSize(), behavior: "smooth" });
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        track.scrollBy({ left: -stepSize(), behavior: "smooth" });
      }
    });

    // Perbarui indikator saat digeser (dibatasi satu kali per frame)
    let ticking = false;
    track.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      },
      { passive: true }
    );

    // Hitung ulang saat ukuran layar berubah (jumlah card yang tampil ikut berubah)
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildDots, 150);
    });

    buildDots();
  }
});