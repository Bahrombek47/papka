document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const links = document.querySelectorAll("a[href^='#']");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const section = document.querySelector(targetId);
      if (!section) return;

      e.preventDefault();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      if (window.innerWidth <= 768) {
        const navList = document.querySelector(".nav-list");
        if (navList) navList.classList.remove("show");
      }
    });
  });

  const scrollButtons = document.querySelectorAll("[data-scroll-to]");
  scrollButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = btn.getAttribute("data-scroll-to");
      if (!target) return;
      const section = document.querySelector(target);
      if (!section) return;
      e.preventDefault();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      navList.classList.toggle("show");
    });
  }

  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealEls.forEach((el) => observer.observe(el));

  const testimonials = document.querySelectorAll(".testimonial");
  const dots = document.querySelectorAll(".dot");
  if (testimonials.length && dots.length) {
    let activeIndex = 0;

    const setActive = (index) => {
      testimonials.forEach((t, i) => {
        t.classList.toggle("active", i === index);
      });
      dots.forEach((d, i) => {
        d.classList.toggle("active", i === index);
      });
      activeIndex = index;
    };

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => setActive(index));
    });

    setInterval(() => {
      const next = (activeIndex + 1) % testimonials.length;
      setActive(next);
    }, 8000);
  }

  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (form && note) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      note.textContent =
        "Xabaringiz qabul qilindi (demo). Haqiqiy loyiha uchun backend qo‘shish kerak bo‘ladi.";
      note.style.color = "#4ade80";
      form.reset();
      setTimeout(() => {
        note.textContent =
          "Forma demo rejimida ishlaydi — ma’lumotlar serverga yuborilmaydi.";
        note.style.color = "";
      }, 6000);
    });
  }
});

