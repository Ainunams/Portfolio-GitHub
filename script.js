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
   ========================================= */
const counters = document.querySelectorAll(".counter-num");

const animateCounter = (el) => {
  const target = parseInt(el.getAttribute("data-target"), 10);
  const duration = 1500;
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

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

/* =========================================
   4. SMOOTH SCROLL
   ========================================= */
const allNavLinks = document.querySelectorAll('a[href^="#"]');

allNavLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (targetId === "#") return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();

    navMenu.classList.remove("open");
    hamburger.classList.remove("active");

    const navHeight = document.querySelector(".navbar").offsetHeight;
    const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({ top: targetTop, behavior: "smooth" });
  });
});

/* =========================================
   5. PROJECT CARD CLICK
   ========================================= */
const projectCards = document.querySelectorAll(".project-card[data-url]");

projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    window.open(card.getAttribute("data-url"), "_blank");
  });
});

/* =========================================
   6. SCROLL REVEAL
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

/* =========================================
   7. STICKY NAVBAR — Active Link Highlight
   ไฮไลท์เมนูที่ตรงกับ section ที่กำลัง scroll อยู่
   ========================================= */
const sections = document.querySelectorAll("section[id]");
const navMenuLinks = document.querySelectorAll(".nav-menu a");

const highlightActiveNav = () => {
  const scrollY = window.scrollY;
  const navHeight = document.querySelector(".navbar").offsetHeight;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - navHeight - 40;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      navMenuLinks.forEach((link) => {
        link.classList.remove("nav-active");
        if (link.getAttribute("href") === `#${section.id}`) {
          link.classList.add("nav-active");
        }
      });
    }
  });
};

window.addEventListener("scroll", highlightActiveNav);
highlightActiveNav();

/* =========================================
   8. VALIDASI FORM
   ========================================= */
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const nameInput = document.querySelector("#form-name");
  const emailInput = document.querySelector("#form-email");
  const messageInput = document.querySelector("#form-message");
  const formSuccess = document.querySelector(".form-success");
  const formError = document.querySelector(".form-error");

  const showError = (input, msg) => {
    const group = input.closest(".form-group");
    const existing = group.querySelector(".field-error");
    if (existing) existing.remove();
    input.classList.add("input-error");
    const errEl = document.createElement("span");
    errEl.className = "field-error";
    errEl.textContent = msg;
    group.appendChild(errEl);
  };

  const clearError = (input) => {
    const group = input.closest(".form-group");
    const existing = group.querySelector(".field-error");
    if (existing) existing.remove();
    input.classList.remove("input-error");
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener("input", () => clearError(input));
  });

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    if (nameInput.value.trim().length < 2) {
      showError(nameInput, "Nama minimal 2 karakter.");
      isValid = false;
    }

    if (!isValidEmail(emailInput.value)) {
      showError(emailInput, "Format email tidak valid.");
      isValid = false;
    }

    if (messageInput.value.trim().length < 10) {
      showError(messageInput, "Pesan minimal 10 karakter.");
      isValid = false;
    }

    if (!isValid) {
      if (formError) {
        formError.style.display = "block";
        setTimeout(() => (formError.style.display = "none"), 3000);
      }
      return;
    }

    contactForm.reset();
    if (formSuccess) {
      formSuccess.style.display = "block";
      setTimeout(() => (formSuccess.style.display = "none"), 4000);
    }
  });
}
