// ============================================================
// Showcase page — scroll spy + reveal animations
// ============================================================

// Scroll spy: highlight active sidebar link
const navLinks = document.querySelectorAll('.sc-nav-link');
const sections = document.querySelectorAll('.sc-section');

function updateScrollSpy() {
  const scrollY = window.scrollY + 120;
  let current = '';

  sections.forEach((section) => {
    if (section.offsetTop <= scrollY) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', updateScrollSpy, { passive: true });
updateScrollSpy();

// Smooth scroll for sidebar links
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Intersection Observer for reveal animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.sc-reveal').forEach((el) => observer.observe(el));
