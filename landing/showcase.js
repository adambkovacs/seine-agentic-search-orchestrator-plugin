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

// ============================================================
// Chart.js Visualizations
// ============================================================

function initCharts() {
  // Skip if Chart.js not loaded
  if (typeof Chart === 'undefined') return;

  // Seine brand colors
  const SOLID = '#48BB78';
  const SOFT = '#ECC94B';
  const SHAKY = '#F56565';
  const UNKNOWN = '#718096';
  const ACCENT = '#63B3ED';
  const TEXT_DIM = '#718096';
  const GRID = 'rgba(255,255,255,0.06)';

  // Shared defaults
  Chart.defaults.color = TEXT_DIM;
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 11;

  // --- 1. Confidence Scores (horizontal bar, full width) ---
  const confData = [
    { label: 'State AI laws effective', score: 1.000, level: 'SOLID' },
    { label: 'EU 4-tier risk classification', score: 0.895, level: 'SOLID' },
    { label: 'Phased enforcement timeline', score: 0.870, level: 'SOLID' },
    { label: 'No US federal AI legislation', score: 0.858, level: 'SOLID' },
    { label: 'EU AI Office (Articles 64-68)', score: 0.858, level: 'SOLID' },
    { label: 'Penalty structure (7%/3%/1.5%)', score: 0.842, level: 'SOLID' },
    { label: 'GPAI 10²⁵ FLOPs presumption', score: 0.753, level: 'SOFT' },
    { label: 'Extraterritorial reach', score: 0.748, level: 'SOFT' },
    { label: 'Trump EO not statutory', score: 0.695, level: 'SOFT' },
    { label: 'Brussels Effect (market-access)', score: 0.673, level: 'SOFT' },
    { label: 'AI Literacy (Article 4)', score: 0.668, level: 'SOFT' },
    { label: 'NIST AI RMF baseline', score: 0.668, level: 'SOFT' },
    { label: 'Digital Omnibus delay', score: 0.638, level: 'SOFT' },
    { label: 'Article 47/9 parallel obligations', score: 0.638, level: 'SOFT' },
    { label: 'No enforcement actions', score: 0.628, level: 'SOFT' },
    { label: 'CEN/CENELEC timeline risk', score: 0.628, level: 'SOFT' },
    { label: '4-pole regulatory taxonomy', score: 0.480, level: 'SHAKY' },
    { label: 'Insurance enforcement lever', score: 0.480, level: 'SHAKY' },
    { label: 'SME compliance cost $8-15M', score: 0.393, level: 'SHAKY' },
  ];

  const confColors = confData.map(d =>
    d.level === 'SOLID' ? SOLID : d.level === 'SOFT' ? SOFT : SHAKY
  );

  new Chart(document.getElementById('chart-confidence'), {
    type: 'bar',
    data: {
      labels: confData.map(d => d.label),
      datasets: [{
        data: confData.map(d => d.score),
        backgroundColor: confColors.map(c => c + '33'),
        borderColor: confColors,
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.7,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const d = confData[ctx.dataIndex];
              return `${d.score.toFixed(3)} [${d.level}]`;
            }
          }
        }
      },
      scales: {
        x: {
          min: 0, max: 1,
          grid: { color: GRID },
          ticks: { callback: (v) => v.toFixed(1) }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 10 } }
        }
      }
    }
  });

  // --- 2. Evidence Strength (doughnut) ---
  new Chart(document.getElementById('chart-evidence'), {
    type: 'doughnut',
    data: {
      labels: ['SOLID (6)', 'SOFT (10)', 'SHAKY (3)'],
      datasets: [{
        data: [6, 10, 3],
        backgroundColor: [SOLID + '99', SOFT + '99', SHAKY + '99'],
        borderColor: [SOLID, SOFT, SHAKY],
        borderWidth: 2,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      cutout: '55%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10 }
        }
      }
    }
  });

  // --- 3. Source Quality (doughnut) ---
  new Chart(document.getElementById('chart-sources'), {
    type: 'doughnut',
    data: {
      labels: ['HIGH (22)', 'MEDIUM (5)'],
      datasets: [{
        data: [22, 5],
        backgroundColor: [SOLID + '99', SOFT + '99'],
        borderColor: [SOLID, SOFT],
        borderWidth: 2,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      cutout: '55%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10 }
        }
      }
    }
  });

  // --- 4. Pipeline Execution (horizontal bar / gantt) ---
  new Chart(document.getElementById('chart-pipeline'), {
    type: 'bar',
    data: {
      labels: ['Phase A: Discovery', 'Gate A', 'Phase B: Analysis', 'Gate B', 'Phase C: Synthesis', 'Source Compilation'],
      datasets: [{
        label: 'Duration (minutes)',
        data: [8, 1, 11, 5, 25, 2],
        backgroundColor: [
          ACCENT + '66',
          SOLID + '66',
          ACCENT + '66',
          SHAKY + '66',
          ACCENT + '66',
          TEXT_DIM + '44'
        ],
        borderColor: [
          ACCENT,
          SOLID,
          ACCENT,
          SHAKY,
          ACCENT,
          TEXT_DIM
        ],
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const labels = ['hunter + scout', 'PASS_WITH_NOTES', 'skeptic + referee', 'FAIL (0.683 < 0.75)', 'adversarial + confidence', 'dedup + sort'];
              return labels[ctx.dataIndex] + ' — ' + ctx.raw + ' min';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: GRID },
          title: { display: true, text: 'Minutes', color: TEXT_DIM }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 10 } }
        }
      }
    }
  });

  // --- 5. EU Enforcement Timeline (horizontal bar as milestone) ---
  new Chart(document.getElementById('chart-eu-timeline'), {
    type: 'bar',
    data: {
      labels: ['Feb 2025: Prohibited practices', 'Aug 2025: GPAI obligations', 'Aug 2026: High-risk (Annex I/III)', 'Aug 2027: Employment/essential services'],
      datasets: [{
        label: 'Months from now',
        data: [
          -13, // Feb 2025 (past)
          -7,  // Aug 2025 (past)
          5,   // Aug 2026 (future)
          17,  // Aug 2027 (future)
        ],
        backgroundColor: [
          SOLID + '66',
          SOLID + '66',
          SOFT + '66',
          ACCENT + '66',
        ],
        borderColor: [SOLID, SOLID, SOFT, ACCENT],
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.5,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const val = ctx.raw;
              return val < 0 ? `${Math.abs(val)} months ago (in effect)` : `in ${val} months`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: GRID },
          title: { display: true, text: 'Months relative to March 2026', color: TEXT_DIM },
          ticks: {
            callback: (v) => v === 0 ? 'Now' : v > 0 ? '+' + v : v
          }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 10 } }
        }
      }
    }
  });

  // --- 6. Penalty Structure (grouped bar) ---
  new Chart(document.getElementById('chart-penalties'), {
    type: 'bar',
    data: {
      labels: ['Prohibited practices', 'Other high-risk', 'Misleading info'],
      datasets: [
        {
          label: 'Max fine (EUR millions)',
          data: [35, 15, 7.5],
          backgroundColor: SHAKY + '66',
          borderColor: SHAKY,
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: '% global turnover',
          data: [7, 3, 1.5],
          backgroundColor: SOFT + '66',
          borderColor: SOFT,
          borderWidth: 1,
          borderRadius: 4,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10 }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              if (ctx.datasetIndex === 0) return `EUR ${ctx.raw}M`;
              return `${ctx.raw}% global annual turnover`;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: GRID },
          ticks: { callback: (v) => v + (v > 10 ? 'M' : '%') }
        }
      }
    }
  });

  // --- 7. Compute Thresholds (bar, log-ish display) ---
  new Chart(document.getElementById('chart-compute'), {
    type: 'bar',
    data: {
      labels: ['EU AI Act (GPAI systemic risk)', 'California TFAIA'],
      datasets: [{
        label: 'FLOPs threshold',
        data: [25, 26],
        backgroundColor: [ACCENT + '66', SOFT + '66'],
        borderColor: [ACCENT, SOFT],
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.4,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `10^${ctx.raw} FLOPs`
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: GRID },
          title: { display: true, text: 'Exponent (10^N FLOPs)', color: TEXT_DIM },
          min: 24,
          max: 27,
          ticks: { callback: (v) => '10^' + v }
        }
      }
    }
  });
}

// Initialize charts when the charts section scrolls into view
ScrollTrigger.create({
  trigger: '#charts',
  start: 'top 85%',
  onEnter: () => {
    gsap.to('#charts', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
    });
    // Small delay to let section reveal before charts animate
    setTimeout(initCharts, 300);
  },
  once: true,
});
