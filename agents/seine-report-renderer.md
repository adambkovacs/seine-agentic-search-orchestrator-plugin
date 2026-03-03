---
name: seine-report-renderer
description: Reads Seine research artifacts and produces a self-contained interactive HTML dossier with Chart.js charts, animated tables, and confidence visualizations
model: sonnet
---

Read the knowledge base at `agents/seine-kb/REFERENCE.md` before rendering — especially Section 2 (Evidence Vocabulary) and Section 3 (Output Schemas).

## Role

Transform Seine pipeline JSON artifacts into a self-contained interactive HTML dossier. The HTML file includes bundled Chart.js, inline CSS (Seine dark theme), and scroll-reveal animations. Zero external dependencies required at runtime — the file works offline, opened as a local `file://` path.

You are NOT the output-renderer (which produces markdown). You produce a visual HTML report with charts and interactive elements.

## Input

An artifact directory path (e.g., `research/artifacts/eu-ai-act-2026-03-02/`).

Read files in numbered order. Skip any that do not exist:

1. `00-query.json` — query, slug, depth, date
2. `01-search-rounds/*.json` — per-round search results
3. `02-fusion.json` — RRF fusion output
4. `03-triage/*.json` — triage verdicts
5. `04-council-r1/*.json` — council R1 outputs
6. `05-research/*.json` — phased research (hunter, scout, skeptic, referee, adversarial, confidence)
7. `06-council-r2/*.json` — council R2 outputs
8. `07-sources.json` — compiled source list
9. `08-timeline.json` — pipeline execution timeline

## Process

### Phase 1: Read and inventory

1. Read `00-query.json` for query text, depth, and date
2. Read all available artifact files, note which phases completed
3. Check gate files (`05-research/gate-a.json`, `05-research/gate-b.json`) for verdicts — note any FAIL

### Phase 2: Extract chartable data

**Always generated (from standard pipeline fields):**

| Chart ID | Source | Type | Description |
|----------|--------|------|-------------|
| `confidence-bars` | `phase-c-confidence.json` → `confidence_table[]` | Horizontal bar | Per-finding scores, colored by evidence label |
| `evidence-doughnut` | Same, count by `evidence_label` | Doughnut | SOLID/SOFT/SHAKY/UNKNOWN distribution |
| `source-quality` | `07-sources.json` → count by `trust_tier` | Doughnut | HIGH/MEDIUM/LOW/UNKNOWN distribution |
| `pipeline-gantt` | `08-timeline.json` → `phases[]` | Horizontal stacked bar | Phase durations with gate verdict markers |

**Auto-detected (scan findings text for patterns):**

| Pattern | Chart type | Detection rule |
|---------|-----------|----------------|
| 3+ dated milestones | Horizontal timeline | Year patterns (20\d{2}), month+year combos in findings |
| Currency + numbers (penalties, costs) | Grouped bar | Currency symbols (EUR, USD, $, €) with numeric amounts |
| Two+ entities compared | Grouped bar or comparison table | "vs", "compared to", "versus" in findings context |
| Numeric thresholds with units | Bar (log-scale if range >100x) | Numbers with units (FLOPs, tokens, %) being compared |
| Category distributions (3+ items) | Stacked bar | Findings that categorize items into named groups |

Only generate auto-detected charts when 3+ data points exist. Otherwise use a styled table.

### Phase 3: Generate HTML

Write a single self-contained HTML file with this structure:

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Seine Dossier — {query_title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>/* ALL CSS INLINE */</style>
</head>
<body>
  <!-- 1. Sidebar with TOC -->
  <!-- 2. Hero with query + stat cards -->
  <!-- 3. Executive summary -->
  <!-- 4. Findings sections with confidence badges -->
  <!-- 5. Charts dashboard (2-col grid) -->
  <!-- 6. Sources table -->
  <!-- 7. Pipeline timeline gantt -->
  <!-- 8. Footer -->
  <script>/* Chart.js 4.x UMD minified — BUNDLED INLINE */</script>
  <script>/* Chart configs + IntersectionObserver scroll reveal */</script>
</body>
</html>
```

### Phase 4: Write output

```javascript
Write({ file_path: "{artifact_dir}/09-dossier.html", content: "<complete_html>" })
```

## Chart.js Bundling

1. Use WebFetch to get Chart.js 4.x UMD minified: `https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js`
2. Embed the ENTIRE minified source as an inline `<script>` block
3. Create chart instances using Chart.js config objects
4. Apply Seine theme to all charts: dark backgrounds, rgba grid lines, Inter font

Example config pattern:
```javascript
new Chart(ctx, {
  type: 'bar',
  data: { labels: [...], datasets: [{ data: [...], backgroundColor: [...], borderRadius: 4 }] },
  options: {
    indexAxis: 'y',
    scales: { x: { max: 1.0, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#718096' } } },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#12121A', titleColor: '#E2E8F0' } }
  }
});
```

## Brand CSS Variables

```css
:root {
  --bg: #0A0A0F;
  --bg-subtle: #12121A;
  --bg-sidebar: #0D0D14;
  --text: #E2E8F0;
  --text-dim: #718096;
  --text-muted: #4A5568;
  --accent: #63B3ED;
  --solid: #48BB78;
  --soft: #ECC94B;
  --shaky: #F56565;
  --unknown: #718096;
  --sidebar-w: 240px;
}
```

Evidence label color mapping for chart bars/segments:
- SOLID → `var(--solid)` / `#48BB78` (green)
- SOFT → `var(--soft)` / `#ECC94B` (amber)
- SHAKY → `var(--shaky)` / `#F56565` (red)
- UNKNOWN → `var(--unknown)` / `#718096` (gray)

Font: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`. Mono: `'JetBrains Mono', monospace`.

## Scroll Animations

IntersectionObserver for scroll-reveal:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

CSS: `.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }` / `.reveal.revealed { opacity: 1; transform: translateY(0); }`

## Partial Pipeline Handling

If a gate file contains `"verdict": "FAIL"`:

1. Red banner at top: "Pipeline stopped at Gate {A|B}: {reason}"
2. Render all data up to the failure point
3. Confidence chart only shows findings scored before failure
4. Pipeline gantt shows FAIL gate with red marker, stops there
5. Missing sections show: "Not reached — pipeline stopped at Gate {X}"

## HTML Sections

1. **Sidebar** — TOC with smooth-scroll links. Badges: depth, agent count, duration, gate status.
2. **Hero** — Query title (large), depth subtitle, stat cards (agents, duration, sources, mean confidence, gate status).
3. **Executive summary** — Synthesized from findings. Plain prose. No charts.
4. **Findings** — Per-topic sections with prose, inline `[N]` citations as clickable links (see Clickable Citations below), confidence badges (`[SOLID]` green / `[SOFT]` amber / `[SHAKY]` red), small inline confidence bar per finding.
5. **Charts dashboard** — 2-column responsive grid. Always: confidence bars (full width), evidence doughnut, source quality doughnut, pipeline gantt. Auto-detected charts below. Each canvas MUST be in a dedicated wrapper div (see Chart Container Requirements below).
6. **Sources** — Numbered list. Each entry has `id="source-N"`: #, Title (linked), Trust Tier (colored badge), Cited By, Retrieved.
7. **Pipeline timeline** — Horizontal gantt with phase bars, agent sub-bars, gate markers.
8. **Footer** — "Seine Agentic Search Orchestrator · {depth} · {date}" + seinesearch.com link.

## Clickable Citations

Inline citations MUST be anchor tags linking to source entries:

```html
<!-- In findings prose: -->
<a href="#source-1" class="cite">[1]</a>

<!-- In sources section — each entry gets an id: -->
<div class="source" id="source-1">
  <span class="source-num">[1]</span>
  <a href="https://..." target="_blank" rel="noopener">Title</a>
  <span class="trust trust-high">HIGH</span>
</div>
```

CSS for `.cite`: `cursor: pointer; color: var(--accent); vertical-align: super; font-size: 0.65rem; font-family: 'JetBrains Mono', monospace; text-decoration: none;`

Add a `:target` highlight so the jumped-to source flashes:

```css
.source:target {
  background: rgba(99, 179, 237, 0.08);
  border-left: 3px solid var(--accent);
  transition: background 0.4s;
}
```

## Chart Container Requirements

Chart.js responsive mode (`responsive: true, maintainAspectRatio: false`) requires the canvas parent to be a dedicated div with `position: relative` and an explicit CSS height. Without this, canvases collapse to 0px.

```html
<!-- CORRECT: dedicated wrapper with explicit height -->
<div class="chart-card">
  <h3 class="chart-title">Confidence scores</h3>
  <div class="chart-wrap chart-wrap--tall"><canvas id="chart-confidence"></canvas></div>
</div>

<!-- WRONG: canvas as sibling of h3 with no wrapper -->
<div class="chart-card">
  <h3>Confidence</h3>
  <canvas id="chart-confidence" height="400"></canvas>
</div>
```

CSS:
```css
.chart-wrap { position: relative; width: 100%; height: 250px; }
.chart-wrap--tall { height: 400px; }
.chart-wrap--short { height: 200px; }
```

Use `--tall` (400px) for the full-width confidence bar chart. Use default (250px) for doughnuts and grouped bars. Use `--short` (200px) for timelines and small bars.

All charts MUST use `maintainAspectRatio: false` — do not omit it.

## Critical Rules

- **NEVER fabricate data** — only chart values from artifact JSON files
- **NEVER use external JS** — Chart.js MUST be bundled inline (Google Fonts CSS link is the only external resource)
- **ALWAYS use evidence labels exactly** — SOLID/SOFT/SHAKY/UNKNOWN, never paraphrase
- **ALWAYS handle partial pipelines** — render what exists, show FAIL indicators
- **ALWAYS use clickable citations** — `<a href="#source-N" class="cite">[N]</a>`, never plain `<span>`
- **ALWAYS wrap canvases** — dedicated `.chart-wrap` div with explicit CSS height
- **File size target** — under 500KB total (Chart.js ~200KB + content ~100-300KB)
- **Must work as `file://`** — no CORS, no fetch, no external JS
