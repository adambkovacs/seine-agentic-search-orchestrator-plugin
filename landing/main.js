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

// Connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ============================================================
// Particle system
// ============================================================
const canvas = document.getElementById('particle-canvas');
const particleSystem = new ParticleSystem(canvas);

// Track overall scroll progress for particles
const totalHeight = () => document.documentElement.scrollHeight - window.innerHeight;

function updateParticleScroll() {
  const progress = Math.max(0, Math.min(1, window.scrollY / totalHeight()));
  particleSystem.setScrollProgress(progress);
}

window.addEventListener('scroll', updateParticleScroll, { passive: true });

// Animation loop
function animate(time) {
  particleSystem.update(time);
  particleSystem.render();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Resize handler
window.addEventListener('resize', () => {
  particleSystem.resize();
  ScrollTrigger.refresh();
});

// ============================================================
// GSAP Scroll Animations
// ============================================================

// -- Hero animations --
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTl
  .to('.hero-title', { opacity: 1, y: 0, duration: 1.2, delay: 0.3 })
  .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
  .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
  .to('.scroll-hint', { opacity: 1, duration: 1 }, '-=0.2');


// Fade out hero on scroll
gsap.to('.hero-inner', {
  opacity: 0,
  y: -60,
  ease: 'power2.in',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: '60% top',
    scrub: 1,
  },
});

// -- Problem Section --
ScrollTrigger.create({
  trigger: '#problem',
  start: 'top 70%',
  onEnter: () => {
    gsap.to('.problem-text', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    gsap.to('.problem-stats', { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' });
  },
  once: true,
});

// Animate stat numbers (only numeric ones, skip "?")
ScrollTrigger.create({
  trigger: '.problem-stats',
  start: 'top 80%',
  onEnter: () => {
    document.querySelectorAll('.stat-number').forEach((el, i) => {
      const val = el.textContent.trim();
      if (!isNaN(val) && val !== '') {
        gsap.from(el, {
          textContent: 0,
          duration: 1.5,
          snap: { textContent: 1 },
          delay: i * 0.2,
          ease: 'power2.out',
        });
      } else {
        // Non-numeric (like "?") - just fade in with a pulse
        gsap.fromTo(el,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, delay: i * 0.2, ease: 'back.out(1.7)' }
        );
      }
    });
  },
  once: true,
});

// -- Pipeline Section (Depth Levels) --
const depthLevels = gsap.utils.toArray('.depth-level');
const depthWidths = [15, 30, 55, 80, 100]; // bar fill percentages

depthLevels.forEach((level, i) => {
  ScrollTrigger.create({
    trigger: level,
    start: 'top 80%',
    onEnter: () => {
      gsap.to(level, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: i * 0.12,
        ease: 'power3.out',
      });
      gsap.to(level.querySelector('.depth-fill'), {
        width: `${depthWidths[i]}%`,
        duration: 1.2,
        delay: i * 0.12 + 0.3,
        ease: 'power3.out',
      });
    },
    once: true,
  });
});

// -- Council Section --
const councilMembers = gsap.utils.toArray('.council-member');

councilMembers.forEach((member, i) => {
  ScrollTrigger.create({
    trigger: member,
    start: 'top 85%',
    onEnter: () => {
      gsap.to(member, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: i * 0.08,
        ease: 'back.out(1.4)',
      });
    },
    once: true,
  });
});

// -- Research Pipeline Section --
const phases = gsap.utils.toArray('.phase');
const gates = gsap.utils.toArray('.gate');

phases.forEach((phase, i) => {
  ScrollTrigger.create({
    trigger: phase,
    start: 'top 80%',
    onEnter: () => {
      gsap.to(phase, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.2,
        ease: 'power3.out',
      });
    },
    once: true,
  });
});

gates.forEach((gate, i) => {
  ScrollTrigger.create({
    trigger: gate,
    start: 'top 80%',
    onEnter: () => {
      gsap.to(gate, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: i * 0.2 + 0.3,
        ease: 'back.out(1.7)',
      });
    },
    once: true,
  });
});

// -- Evidence Section --
const evidenceRows = gsap.utils.toArray('.evidence-row');

evidenceRows.forEach((row, i) => {
  ScrollTrigger.create({
    trigger: row,
    start: 'top 85%',
    onEnter: () => {
      gsap.to(row, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power3.out',
      });
      // Animate bar fill
      const fill = row.querySelector('.evidence-bar-fill');
      if (fill) {
        const targetWidth = fill.style.getPropertyValue('--bar-width');
        gsap.to(fill, {
          width: targetWidth,
          duration: 1.4,
          delay: i * 0.1 + 0.2,
          ease: 'power3.out',
        });
      }
    },
    once: true,
  });
});

ScrollTrigger.create({
  trigger: '.confidence-formula',
  start: 'top 85%',
  onEnter: () => {
    gsap.to('.confidence-formula', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  },
  once: true,
});

// -- Output Showcase Section --
ScrollTrigger.create({
  trigger: '#output',
  start: 'top 70%',
  onEnter: () => {
    gsap.to('.output-card', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    });
  },
  once: true,
});

const confRows = gsap.utils.toArray('.output-conf-row');
confRows.forEach((row, i) => {
  ScrollTrigger.create({
    trigger: row,
    start: 'top 90%',
    onEnter: () => {
      gsap.to(row, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        delay: i * 0.08,
        ease: 'power3.out',
      });
    },
    once: true,
  });
});

// -- Convergence Section --
ScrollTrigger.create({
  trigger: '#convergence',
  start: 'top 60%',
  onEnter: () => {
    gsap.to('.convergence-text', {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
    });
    // particles converge into the dot — no CSS pulse needed
  },
  once: true,
});

// -- Install Section --
ScrollTrigger.create({
  trigger: '#install',
  start: 'top 70%',
  onEnter: () => {
    gsap.from('#install .section-inner > *', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    });
  },
  once: true,
});

// ============================================================
// Copy buttons
// ============================================================
document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 2000);
    }
  });
});

// ============================================================
// Refresh ScrollTrigger after layout
// ============================================================
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
  updateParticleScroll();
});
