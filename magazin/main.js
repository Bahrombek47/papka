const revealElements = document.querySelectorAll(".reveal");

function handleScrollReveal() {
  const triggerBottom = window.innerHeight * 0.85;

  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) el.classList.add("reveal--visible");
  });
}

window.addEventListener("scroll", handleScrollReveal);
window.addEventListener("load", handleScrollReveal);

// HERO: animated rotating/typewriter words
const rotatorEl = document.querySelector(".hero__rotator");
if (rotatorEl) {
  let words = [];
  try {
    const raw = rotatorEl.getAttribute("data-words") || "[]";
    words = JSON.parse(raw);
  } catch {
    words = [];
  }

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    rotatorEl.textContent = words[0] || "Pech";
    rotatorEl.classList.add("is-paused");
  } else if (Array.isArray(words) && words.length) {
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const tick = () => {
      const current = words[wordIdx % words.length];
      rotatorEl.textContent = current.slice(0, charIdx);

      if (!isDeleting) {
        charIdx += 1;
        if (charIdx > current.length) {
          isDeleting = true;
          setTimeout(tick, 900);
          return;
        }
      } else {
        charIdx -= 1;
        if (charIdx <= 0) {
          isDeleting = false;
          wordIdx += 1;
        }
      }

      const base = isDeleting ? 35 : 55;
      const jitter = Math.random() * 30;
      setTimeout(tick, base + jitter);
    };

    tick();
  }
}

const modal = document.getElementById("successModal");
function openSuccessModal() {
  if (!modal) return;
  modal.classList.add("modal--visible");
}
function closeSuccessModal() {
  if (!modal) return;
  modal.classList.remove("modal--visible");
}
window.openSuccessModal = openSuccessModal;
window.closeSuccessModal = closeSuccessModal;

// CONTACT: validate phone + open modal
const contactForm = document.getElementById("contactForm");
const phoneInput = document.getElementById("phone");
if (contactForm && phoneInput) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    phoneInput.setCustomValidity("");

    const digits = (phoneInput.value || "").replace(/\D/g, "");
    const local = digits.startsWith("998") ? digits.slice(3) : digits;

    if (local.length !== 9) {
      phoneInput.setCustomValidity("Telefon raqamni to‘liq kiriting. Masalan: +998 90 123 45 67");
      contactForm.reportValidity();
      return;
    }

    if (!contactForm.reportValidity()) return;

    openSuccessModal();
    contactForm.reset();
  });
}



const phone = document.getElementById("phone");
if (phone) {
  const prefix = "+998 ";

  const format = (raw) => {
    let d = raw.replace(/\D/g, "");
    if (d.startsWith("998")) d = d.slice(3);
    d = d.slice(0, 9);

    const a = d.slice(0, 2);
    const b = d.slice(2, 5);
    const c = d.slice(5, 7);
    const e = d.slice(7, 9);

    let out = prefix;
    if (a) out += a;
    if (b) out += (a ? " " : "") + b;
    if (c) out += (b ? " " : "") + c;
    if (e) out += (c ? " " : "") + e;
    return out;
  };

  phone.addEventListener("focus", () => {
    if (!phone.value) phone.value = prefix;
  });

  phone.addEventListener("input", () => {
    phone.value = format(phone.value);
  });
}

// CART badge + micro interaction
const cartBadge = document.getElementById("cartBadge");
const addToCartButtons = document.querySelectorAll(".js-add-to-cart");
let cartCount = 0;

function setCartCount(next) {
  cartCount = Math.max(0, Number(next) || 0);
  if (!cartBadge) return;

  cartBadge.textContent = String(cartCount);
  cartBadge.animate(
    [
      { transform: "scale(1)", offset: 0 },
      { transform: "scale(1.25)", offset: 0.35 },
      { transform: "scale(1)", offset: 1 },
    ],
    { duration: 280, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" }
  );
}

addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    setCartCount(cartCount + 1);
  });
});

// Subtle 3D tilt on product cards (pointer-based)
const cards = document.querySelectorAll(".product-card");
cards.forEach((card) => {
  let raf = 0;
  let lastX = 0;
  let lastY = 0;

  const reset = () => {
    card.style.transform = "";
    card.style.willChange = "";
  };

  const apply = () => {
    raf = 0;
    const rect = card.getBoundingClientRect();
    const px = (lastX - rect.left) / rect.width; // 0..1
    const py = (lastY - rect.top) / rect.height; // 0..1

    const rotY = (px - 0.5) * 10;
    const rotX = (0.5 - py) * 10;

    card.style.willChange = "transform";
    card.style.transform = `translateY(-10px) scale(1.01) perspective(900px) rotateX(${rotX.toFixed(
      2
    )}deg) rotateY(${rotY.toFixed(2)}deg)`;
  };

  card.addEventListener("pointermove", (ev) => {
    lastX = ev.clientX;
    lastY = ev.clientY;
    if (!raf) raf = requestAnimationFrame(apply);
  });

  card.addEventListener("pointerleave", () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    reset();
  });
});