// ============================================================
// Showcase page — GSAP + Lenis + Particle System
// Inherits visual language from main landing page
// ============================================================

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParticleSystem } from './particles.js';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// Smooth scrolling with Lenis
// ============================================================
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ============================================================
// Particle system (ambient river mode)
// ============================================================
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const particleSystem = new ParticleSystem(canvas);

  // Never update scrollProgress — particles stay in ambient drift (phase 0)
  function animate(time) {
    particleSystem.update(time);
    particleSystem.render();
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  window.addEventListener('resize', () => {
    particleSystem.resize();
  });
}

// ============================================================
// Scroll spy: highlight active sidebar link
// ============================================================
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

// Smooth scroll for sidebar links (via Lenis)
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      lenis.scrollTo(target, { offset: -20 });
    }
  });
});

// ============================================================
// GSAP Scroll Animations
// ============================================================

// -- Overview section reveal --
ScrollTrigger.create({
  trigger: '#overview',
  start: 'top 85%',
  onEnter: () => {
    gsap.to('#overview', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    });
  },
  once: true,
});

// -- Stat counter animations --
ScrollTrigger.create({
  trigger: '.sc-stats',
  start: 'top 85%',
  onEnter: () => {
    document.querySelectorAll('.sc-stat-value').forEach((el, i) => {
      const text = el.textContent.trim();
      const numericMatch = text.match(/^(\d+\.?\d*)/);

      if (numericMatch) {
        const target = parseFloat(numericMatch[1]);
        const suffix = text.replace(numericMatch[1], '');
        const isDecimal = text.includes('.');
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 1.8,
          delay: i * 0.15,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = isDecimal
              ? obj.val.toFixed(3) + suffix
              : Math.round(obj.val) + suffix;
          },
        });
      } else {
        // Non-numeric (FAIL) — scale-in
        gsap.fromTo(el,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, delay: i * 0.15, ease: 'back.out(1.7)' }
        );
      }
    });
  },
  once: true,
});

// -- Section reveals (all .sc-reveal except overview) --
document.querySelectorAll('.sc-reveal:not(#overview)').forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    onEnter: () => {
      gsap.to(section, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
      });
    },
    once: true,
  });
});

// -- Confidence bars (inject + animate) --
const confScoreCells = document.querySelectorAll('.sc-conf-score');

confScoreCells.forEach((cell) => {
  const score = parseFloat(cell.textContent);
  if (isNaN(score)) return;

  // Determine bar color class
  let barClass = 'bar-shaky';
  if (score >= 0.75) barClass = 'bar-solid';
  else if (score >= 0.55) barClass = 'bar-soft';

  // Create bar elements
  const track = document.createElement('div');
  track.className = 'sc-conf-bar';
  const fill = document.createElement('div');
  fill.className = `sc-conf-bar-fill ${barClass}`;
  fill.dataset.target = `${score * 100}%`;
  track.appendChild(fill);
  cell.appendChild(track);
});

ScrollTrigger.create({
  trigger: '#scores',
  start: 'top 70%',
  onEnter: () => {
    document.querySelectorAll('.sc-conf-bar-fill').forEach((fill, i) => {
      gsap.to(fill, {
        width: fill.dataset.target,
        duration: 1.4,
        delay: i * 0.06,
        ease: 'power3.out',
      });
    });
  },
  once: true,
});

// -- Source list stagger --
ScrollTrigger.create({
  trigger: '#sources',
  start: 'top 75%',
  onEnter: () => {
    gsap.from('.sc-source', {
      opacity: 0,
      x: -15,
      duration: 0.4,
      stagger: 0.04,
      ease: 'power3.out',
    });
  },
  once: true,
});

// -- Timeline stagger --
ScrollTrigger.create({
  trigger: '#timeline',
  start: 'top 75%',
  onEnter: () => {
    gsap.from('.sc-tl-item', {
      opacity: 0,
      x: -20,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power3.out',
    });
  },
  once: true,
});

// ============================================================
// Refresh on load
// ============================================================
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});

window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});
