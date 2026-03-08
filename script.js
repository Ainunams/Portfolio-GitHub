/* =========================================
   script.js — Ai Aminsen Portfolio
   Vanilla JS Only (No jQuery / No Library)
   ========================================= */

/* =========================================
   1. NAVBAR: Hamburger Menu + Scroll Effect
   ========================================= */
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  hamburger.classList.toggle("active");
});

window.addEventListener("scroll", () => {
  document.querySelector(".navbar").classList.toggle("scrolled", window.scrollY > 50);
});

/* =========================================
   2. DARK / LIGHT MODE TOGGLE
   ========================================= */
const themeBtn = document.querySelector(".theme-toggle");

// โหลด theme ที่บันทึกไว้ (ถ้ามี)
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  themeBtn.textContent = "🌙";
}

themeBtn.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-mode");
  themeBtn.textContent = isLight ? "🌙" : "☀️";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

/* =========================================
   3. COUNTER ANIMATION
   เมื่อ scroll ถึง skills section จะนับตัวเลขขึ้น
   ========================================= */
const counters = document.querySelectorAll(".counter-num");

const animateCounter = (el) => {
  const target = parseInt(el.getAttribute("data-target"), 10);
  const duration = 1500; // ms
  const step = target / (duration / 16);
  let current = 0;

  const update = () => {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  };
  update();
};

// ใช้ IntersectionObserver เพื่อ trigger เมื่อ element อยู่ใน viewport
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target); // นับแค่ครั้งเดียว
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

/* =========================================
   4. SMOOTH SCROLL (Custom — ควบคุมได้เอง)
   =========================================
   หมายเหตุ: css scroll-behavior: smooth ทำ smooth scroll อยู่แล้ว
   แต่โจทย์ต้องการ JS version — ทำด้วย addEventListener แทน onclick
   ========================================= */
const allNavLinks = document.querySelectorAll('a[href^="#"]');

allNavLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (targetId === "#") return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();

    // ปิด mobile menu ถ้าเปิดอยู่
    navMenu.classList.remove("open");
    hamburger.classList.remove("active");

    const navHeight = document.querySelector(".navbar").offsetHeight;
    const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  });
});

/* =========================================
   5. PROJECT CARD CLICK — ใช้ addEventListener แทน onclick=""
   ========================================= */
const projectCards = document.querySelectorAll(".project-card[data-url]");

projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    window.open(card.getAttribute("data-url"), "_blank");
  });
});

/* =========================================
   6. SCROLL REVEAL (BONUS)
   Card และ section จะ fade-in เมื่อ scroll ถึง
   ========================================= */
const revealEls = document.querySelectorAll(".skill-card, .project-card, .contact-card, .stat-card");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => {
  el.classList.add("reveal-hidden");
  revealObserver.observe(el);
});
