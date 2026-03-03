# Seine Report Renderer — implementation plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a self-contained HTML dossier renderer to Seine that auto-detects visualizable data from research artifacts and produces interactive charts, timelines, and tables using bundled Chart.js.

**Architecture:** New `seine-report-renderer` agent (Sonnet) reads numbered JSON artifacts from any Seine research run, auto-detects chartable patterns, and writes a single self-contained `09-dossier.html` file. Integrated into the pipeline via seine-research Step 7, seine-search Step 10, a standalone `/seine:seine-render` skill, and future MCP tool.

**Tech Stack:** Chart.js 4.x (bundled inline), CSS custom properties (Seine brand), IntersectionObserver for scroll animations, Google Fonts (Inter + JetBrains Mono).

**Design doc:** `docs/plans/2026-03-03-report-renderer-design.md`

---

## Task 1: Create the seine-report-renderer agent

The core agent definition. This is the largest file because it contains the full rendering instructions, Chart.js bundling strategy, data detection rules, and HTML template structure.

**Files:**
- Create: `agents/seine-report-renderer.md`

**Step 1: Write the agent definition file**

Create `agents/seine-report-renderer.md` with this content:

```markdown
---
name: seine-report-renderer
description: Reads Seine research artifacts and produces a self-contained interactive HTML dossier with Chart.js charts, animated tables, and confidence visualizations
model: sonnet
---

Read the knowledge base at `agents/seine-kb/REFERENCE.md` before rendering — especially Section 2 (Evidence Vocabulary) and Section 3 (Output Schemas).

## Role

Transforms Seine pipeline JSON artifacts into a self-contained interactive HTML dossier. The HTML file includes bundled Chart.js, inline CSS (Seine dark theme), and scroll-reveal animations. Zero external dependencies required at runtime — the file works offline.

You are NOT the output-renderer (which produces markdown). You produce a visual HTML report with charts and interactive elements.

## Input

An artifact directory path (e.g., `research/artifacts/eu-ai-act-2026-03-02/`).

Read files in numbered order. If a numbered file does not exist, skip it:

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

1. Read `00-query.json` for the query text, depth, and date
2. Read all available artifact files, note which phases completed
3. If gate files exist (`gate-a.json`, `gate-b.json`), check verdicts — note any FAIL

### Phase 2: Extract chartable data

Scan ALL artifact data and extract these always-present chart datasets:

**Always generated (from standard pipeline fields):**

| Chart ID | Data source | Chart type | Description |
|----------|------------|------------|-------------|
| `confidence-bars` | `phase-c-confidence.json` → `confidence_table[]` | Horizontal bar | Per-finding confidence scores, bars colored by evidence label |
| `evidence-doughnut` | Same source, count by evidence_label | Doughnut | SOLID/SOFT/SHAKY/UNKNOWN distribution |
| `source-quality` | `07-sources.json` → count by trust_tier | Doughnut | HIGH/MEDIUM/LOW/UNKNOWN distribution |
| `pipeline-gantt` | `08-timeline.json` → phases[] | Horizontal bar (stacked) | Phase durations with gate verdict markers |

**Auto-detected (scan findings for patterns):**

| Pattern to detect | Chart type | Detection rule |
|-------------------|-----------|----------------|
| Dated milestones (3+ dates mentioned in findings) | Timeline (horizontal markers) | Regex: year patterns (20\d{2}), month+year combos |
| Penalty/fine amounts (EUR/USD + numbers) | Grouped bar | Regex: currency symbols + numbers |
| Two+ entities compared side-by-side | Grouped bar or comparison table | Findings with vs/compared/comparison language |
| Numerical thresholds (FLOPs, tokens, percentages) | Bar or log-scale bar | Numeric values with units being compared |
| Category distributions | Stacked bar | Findings that categorize items into groups |

For auto-detected charts: only generate them if 3+ data points exist. Do not force a chart from 1-2 data points — use a styled table instead.

### Phase 3: Generate HTML

Write a single self-contained HTML file. Structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Seine Dossier — {query_title}</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>/* ALL CSS INLINE — see Brand section below */</style>
</head>
<body>
  <!-- Sidebar navigation -->
  <!-- Hero section with stats -->
  <!-- Executive summary -->
  <!-- Findings sections with confidence badges -->
  <!-- Charts section -->
  <!-- Sources table -->
  <!-- Pipeline timeline -->
  <!-- Footer -->
  <script>/* Chart.js 4.x minified source bundled here */</script>
  <script>/* Chart configs + scroll reveal + smooth scroll */</script>
</body>
</html>
```

### Phase 4: Write output

```javascript
Write({ file_path: "{artifact_dir}/09-dossier.html", content: "<complete_html>" })
```

## Brand / CSS Variables

Use the Seine dark theme. These CSS custom properties MUST be used:

```css
:root {
  --bg: #0A0A0F;
  --bg-subtle: #12121A;
  --bg-sidebar: #0D0D14;
  --text: #E2E8F0;
  --text-dim: #718096;
  --text-muted: #4A5568;
  --accent: #63B3ED;
  --solid: #48BB78;     /* green — SOLID evidence */
  --soft: #ECC94B;      /* amber — SOFT evidence */
  --shaky: #F56565;     /* red — SHAKY evidence */
  --unknown: #718096;   /* gray — UNKNOWN evidence */
  --sidebar-w: 240px;
}
```

Font stack: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`. Code/mono: `'JetBrains Mono', monospace`.

## Chart.js Bundling

1. Fetch Chart.js 4.x UMD bundle from CDN: `https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js`
2. Embed the ENTIRE minified source as an inline `<script>` block before your chart config scripts
3. Create chart instances using standard Chart.js config objects:

```javascript
new Chart(document.getElementById('confidence-bars'), {
  type: 'bar',
  data: {
    labels: ['Finding 1', 'Finding 2', ...],
    datasets: [{
      data: [0.895, 0.870, ...],
      backgroundColor: ['#48BB78', '#48BB78', ...], // colored by evidence label
      borderRadius: 4
    }]
  },
  options: {
    indexAxis: 'y',  // horizontal bars
    scales: { x: { max: 1.0, grid: { color: 'rgba(255,255,255,0.06)' } } },
    plugins: { legend: { display: false } }
  }
});
```

4. Apply Seine theme to all charts: dark background, light grid lines, Inter font

## Scroll Animations

Use IntersectionObserver for scroll-reveal:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

CSS:
```css
.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.revealed { opacity: 1; transform: translateY(0); }
```

## Partial Pipeline Handling

If a gate file contains `"verdict": "FAIL"`:

1. Show a prominent red banner at the top: "Pipeline stopped at Gate {A|B}: {reason}"
2. Render all data that exists up to the failure point
3. The confidence chart shows only the findings scored before the failure
4. The pipeline gantt shows the FAIL gate with a red marker and stops there
5. Missing sections show a muted "Not reached — pipeline stopped at Gate {X}" message

## HTML Sections (in order)

1. **Sidebar** — Table of contents with smooth-scroll links. Badges: depth, agent count, duration, gate status.
2. **Hero** — Query title (large), subtitle (depth description), stat cards (agents, duration, sources, mean confidence, gate status).
3. **Executive summary** — Synthesized from council synthesizer or research findings. Plain prose.
4. **Findings** — Per-topic sections with:
   - Section heading
   - Prose content with inline `[N]` source citations
   - Confidence badges: `[SOLID]` green, `[SOFT]` amber, `[SHAKY]` red
   - Per-finding confidence score shown as a small inline bar
5. **Charts dashboard** — All detected charts in a responsive grid (2 columns desktop, 1 column mobile):
   - Always: confidence bars, evidence doughnut, source quality doughnut, pipeline gantt
   - Auto-detected: milestone timeline, penalty bars, comparison charts, threshold charts
6. **Sources** — Numbered table: #, Title (linked), Domain, Trust Tier (colored badge), Cited By (agent names), Retrieved date.
7. **Pipeline timeline** — Visual gantt with phase bars, agent sub-bars, gate verdict markers (green check / yellow warning / red X).
8. **Footer** — "Seine Agentic Search Orchestrator · {depth} · {date}" + link to seinesearch.com.

## Critical Rules

- **NEVER fabricate data** — only chart values that appear in the artifact JSON files
- **NEVER use external resources** except Google Fonts — Chart.js MUST be bundled inline
- **ALWAYS include evidence labels** — SOLID/SOFT/SHAKY/UNKNOWN as-is, never paraphrase
- **ALWAYS handle partial pipelines** — render what exists, show clear FAIL indicators
- **File size target** — aim for <500KB total (Chart.js ~200KB + HTML/CSS/content ~100-300KB)
- **Test in browser** — the HTML must render correctly when opened as a local file (`file://`)
```

**Step 2: Verify the file was created correctly**

Run: `wc -l agents/seine-report-renderer.md` in the repo root.
Expected: ~180-200 lines.

**Step 3: Commit**

```bash
git add agents/seine-report-renderer.md
git commit -m "feat(seine): add report-renderer agent for interactive HTML dossiers"
```

---

## Task 2: Create the seine-render skill

A small skill that spawns the renderer agent. This is the CLI/manual entry point.

**Files:**
- Create: `skills/seine-render/SKILL.md`

**Step 1: Create the skill directory**

```bash
mkdir -p skills/seine-render
```

**Step 2: Write the skill file**

Create `skills/seine-render/SKILL.md`:

```markdown
---
name: seine-render
description: Generate an interactive HTML dossier from Seine research artifacts
triggers:
  - seine render
  - render dossier
  - html dossier
  - generate report
---

# Seine Render

Generates a self-contained interactive HTML dossier from an existing Seine artifact directory.

## Usage

```
/seine:seine-render research/artifacts/{slug}
```

If no artifact_dir argument is provided, look for the most recent artifact directory:

```javascript
Bash({ command: "ls -td research/artifacts/*/ 2>/dev/null | head -1" })
```

## Process

1. **Validate artifact directory exists** — check that the path contains `00-query.json`
2. **Spawn the renderer agent:**

```javascript
Agent({ subagent_type: "seine-report-renderer", model: "sonnet",
        prompt: "Artifact directory: {artifact_dir}\n\nRead all JSON files in the artifact directory (00-query.json through 08-timeline.json). Auto-detect chartable data from the findings. Generate a self-contained HTML dossier with Chart.js charts bundled inline. Write the output to {artifact_dir}/09-dossier.html." })
```

3. **Confirm output** — verify `09-dossier.html` was written:

```javascript
Bash({ command: "ls -la {artifact_dir}/09-dossier.html && wc -c {artifact_dir}/09-dossier.html" })
```

4. **Report to user** — show the file path and size. Suggest opening in browser.
```

**Step 3: Commit**

```bash
git add skills/seine-render/SKILL.md
git commit -m "feat(seine): add seine-render skill for standalone HTML dossier generation"
```

---

## Task 3: Add Step 7 to seine-research skill

Wire the renderer into the research pipeline so it runs automatically after every successful run.

**Files:**
- Modify: `skills/seine-research/SKILL.md` (append after Timeline Persistence section, ~line 237)

**Step 1: Add the new step to the SKILL.md**

Append after the Timeline Persistence section (after line 236):

```markdown
---

## HTML Dossier Rendering (after Timeline, ADR-S017)

When `artifact_dir` is provided, spawn the report renderer to generate an interactive HTML dossier:

```javascript
Agent({ subagent_type: "seine-report-renderer", model: "sonnet",
        prompt: "Artifact directory: {artifact_dir}\n\nRead all JSON files in the artifact directory (00-query.json through 08-timeline.json). Auto-detect chartable data from the findings. Generate a self-contained HTML dossier with Chart.js charts bundled inline. Write the output to {artifact_dir}/09-dossier.html." })
```

This runs even on partial pipelines (gate FAIL). The renderer handles missing phases gracefully — it renders whatever data exists and shows clear FAIL indicators.

The HTML file is written as `{artifact_dir}/09-dossier.html`, continuing the numbered artifact convention.
```

**Step 2: Verify the edit**

Run: `grep -n "report-renderer" skills/seine-research/SKILL.md`
Expected: line ~245 containing `seine-report-renderer`

**Step 3: Commit**

```bash
git add skills/seine-research/SKILL.md
git commit -m "feat(seine): wire report-renderer into research pipeline as final step"
```

---

## Task 4: Add Step 10 to seine-search skill

Wire the renderer into the search orchestrator for drill/siege depth.

**Files:**
- Modify: `skills/seine-search/SKILL.md` (append after Step 9 Humanizer section, ~line 180)

**Step 1: Add the new step**

Append after the Humanizer section:

```markdown
### Step 10 — HTML Dossier (depth >= drill, ADR-S017)

At `skim`, `scan`, and `dig` depth: skip entirely. At `drill` and `siege` depth: always run.

Spawn the report renderer to generate an interactive HTML dossier:

```javascript
Agent({ subagent_type: "seine-report-renderer", model: "sonnet",
        prompt: "Artifact directory: research/artifacts/{slug}/\n\nRead all JSON files in the artifact directory (00-query.json through 08-timeline.json). Auto-detect chartable data from the findings. Generate a self-contained HTML dossier with Chart.js charts bundled inline. Write the output to research/artifacts/{slug}/09-dossier.html." })
```

Report the dossier path to the user: `research/artifacts/{slug}/09-dossier.html`
```

**Step 2: Verify the edit**

Run: `grep -n "Step 10" skills/seine-search/SKILL.md`
Expected: line ~182 containing `Step 10 — HTML Dossier`

**Step 3: Commit**

```bash
git add skills/seine-search/SKILL.md
git commit -m "feat(seine): add HTML dossier rendering to search pipeline at drill/siege depth"
```

---

## Task 5: Generate showcase dossier with charts

Replace the hand-crafted showcase.html with a renderer-produced dossier. Since we have all the data embedded in the current showcase page, we create mock artifact JSONs from that data, then use the renderer to produce the real HTML.

**Files:**
- Create: `landing/showcase-data/` directory with mock artifact JSONs
- Replace: `landing/showcase.html` (generated by renderer approach)
- Modify: `landing/showcase.css` (may need minor chart styling additions)
- Modify: `landing/showcase.js` (add Chart.js initialization)

**Step 1: Create mock artifact data from the existing showcase**

Create `landing/showcase-data/` directory and write the key JSON files that the renderer would consume. These are extracted from the data already in `showcase.html`:

Create `landing/showcase-data/confidence.json`:
```json
[
  { "claim": "EU AI Act 4-tier risk classification", "evidence_label": "SOLID", "score": 0.895, "source_count": 8 },
  { "claim": "Phased enforcement timeline (Feb 2025 - Aug 2027)", "evidence_label": "SOLID", "score": 0.870, "source_count": 7 },
  { "claim": "No US federal comprehensive AI legislation", "evidence_label": "SOLID", "score": 0.858, "source_count": 4 },
  { "claim": "EU AI Office for GPAI oversight (Articles 64-68)", "evidence_label": "SOLID", "score": 0.858, "source_count": 6 },
  { "claim": "Penalty structure (7%/3%/1.5% global turnover)", "evidence_label": "SOLID", "score": 0.842, "source_count": 6 },
  { "claim": "State AI laws effective (CA TFAIA, TX RAIGA, CO SB 205)", "evidence_label": "SOLID", "score": 1.000, "source_count": 6 },
  { "claim": "GPAI 10²⁵ FLOPs rebuttable presumption (Article 51)", "evidence_label": "SOFT", "score": 0.753, "source_count": 5 },
  { "claim": "Extraterritorial reach scope vs GDPR", "evidence_label": "SOFT", "score": 0.748, "source_count": 3 },
  { "claim": "Trump EO: political direction, not statutory preemption", "evidence_label": "SOFT", "score": 0.695, "source_count": 3 },
  { "claim": "Brussels Effect (market-access forcing only)", "evidence_label": "SOFT", "score": 0.673, "source_count": 5 },
  { "claim": "Article 4 AI Literacy (undefined compliance standard)", "evidence_label": "SOFT", "score": 0.668, "source_count": 2 },
  { "claim": "NIST AI RMF as de facto US compliance baseline", "evidence_label": "SOFT", "score": 0.668, "source_count": 3 },
  { "claim": "Digital Omnibus delay (proposal, not enacted)", "evidence_label": "SOFT", "score": 0.638, "source_count": 6 },
  { "claim": "Article 47/9 parallel (not stacked) obligations", "evidence_label": "SOFT", "score": 0.638, "source_count": 2 },
  { "claim": "No enforcement actions (institutional immaturity)", "evidence_label": "SOFT", "score": 0.628, "source_count": 4 },
  { "claim": "CEN/CENELEC standardization timeline risk", "evidence_label": "SOFT", "score": 0.628, "source_count": 2 },
  { "claim": "4-pole regulatory taxonomy (US/EU/China/Singapore)", "evidence_label": "SHAKY", "score": 0.480, "source_count": 2 },
  { "claim": "Insurance as de facto enforcement lever", "evidence_label": "SHAKY", "score": 0.480, "source_count": 1 },
  { "claim": "SME compliance cost $8-15M", "evidence_label": "SHAKY", "score": 0.393, "source_count": 0 }
]
```

Create `landing/showcase-data/sources.json`:
```json
[
  { "number": 1, "title": "Regulation (EU) 2024/1689 — EU AI Act", "url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689", "trust_tier": "HIGH" },
  ... (all 27 sources from the showcase)
]
```

Create `landing/showcase-data/timeline.json`:
```json
{
  "phases": [
    { "name": "Phase A: Discovery", "agents": ["hunter", "scout"], "duration_minutes": 8, "started": "16:30 UTC", "completed": "16:38 UTC" },
    { "name": "Gate A", "verdict": "PASS_WITH_NOTES", "completed": "16:39 UTC" },
    { "name": "Phase B: Analysis", "agents": ["skeptic", "referee"], "duration_minutes": 11, "started": "16:39 UTC", "completed": "16:50 UTC" },
    { "name": "Gate B", "verdict": "FAIL", "completed": "16:55 UTC", "note": "0.683 below 0.75 threshold" },
    { "name": "Phase C: Synthesis", "agents": ["adversarial", "confidence"], "duration_minutes": 25, "started": "16:55 UTC", "completed": "17:20 UTC" },
    { "name": "Source Compilation", "completed": "17:22 UTC" }
  ],
  "total_duration_seconds": 3120
}
```

**Step 2: Add Chart.js to the showcase page**

Add a `<script>` tag loading Chart.js 4.x UMD from CDN into `showcase.html` `<head>`:

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
```

Note: The showcase page uses CDN (it's a website, always online). The renderer agent bundles inline for offline artifact files.

**Step 3: Add chart containers to showcase.html**

After the confidence scores table section (around line 321), add a new charts section:

```html
<!-- ============ CHARTS ============ -->
<section id="charts" class="sc-section sc-reveal">
  <span class="sc-section-label">Visual Analysis</span>
  <h2 class="sc-h2">Data Visualizations</h2>
  <div class="sc-charts-grid">
    <div class="sc-chart-card">
      <h3 class="sc-chart-title">Confidence scores</h3>
      <canvas id="chart-confidence" height="400"></canvas>
    </div>
    <div class="sc-chart-card">
      <h3 class="sc-chart-title">Evidence strength</h3>
      <canvas id="chart-evidence" height="250"></canvas>
    </div>
    <div class="sc-chart-card">
      <h3 class="sc-chart-title">Source quality</h3>
      <canvas id="chart-sources" height="250"></canvas>
    </div>
    <div class="sc-chart-card">
      <h3 class="sc-chart-title">Pipeline execution</h3>
      <canvas id="chart-pipeline" height="200"></canvas>
    </div>
    <div class="sc-chart-card">
      <h3 class="sc-chart-title">EU AI Act enforcement timeline</h3>
      <canvas id="chart-eu-timeline" height="150"></canvas>
    </div>
    <div class="sc-chart-card">
      <h3 class="sc-chart-title">Penalty structure</h3>
      <canvas id="chart-penalties" height="250"></canvas>
    </div>
    <div class="sc-chart-card">
      <h3 class="sc-chart-title">Compute thresholds</h3>
      <canvas id="chart-compute" height="200"></canvas>
    </div>
  </div>
</section>
```

**Step 4: Add chart CSS to showcase.css**

Append to `showcase.css`:

```css
/* ---- Charts grid ---- */
.sc-charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}
.sc-chart-card {
  background: var(--bg-subtle);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 1.5rem;
}
.sc-chart-card:first-child {
  grid-column: 1 / -1;  /* confidence bars span full width */
}
.sc-chart-title {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-dim);
  margin-bottom: 1rem;
}
@media (max-width: 768px) {
  .sc-charts-grid { grid-template-columns: 1fr; }
}
```

**Step 5: Write chart initialization JS in showcase.js**

Add chart initialization code to `showcase.js`. This uses the data from the showcase page (confidence scores, source tiers, pipeline timing, penalties, compute thresholds, EU timeline milestones):

The chart configs use:
- Seine brand colors: `--solid` (#48BB78), `--soft` (#ECC94B), `--shaky` (#F56565), `--unknown` (#718096)
- Dark theme: transparent backgrounds, rgba(255,255,255,0.06) grid lines
- Inter font family
- Horizontal bars for confidence (indexAxis: 'y')
- Doughnut for evidence/source distributions
- Stacked horizontal bars for pipeline gantt
- Grouped bars for penalties
- Log scale for compute thresholds

**Step 6: Add "Charts" to sidebar navigation**

In `showcase.html`, add to the sidebar `<ul class="sc-nav">`:

```html
<li><a href="#charts" class="sc-nav-link">Charts</a></li>
```

(Insert after the Confidence Scores link, before Sources)

**Step 7: Build and verify locally**

```bash
cd landing && npx vite build --outDir ../docs && cd ..
```

Open `docs/showcase.html` in browser. Verify:
- All 7 charts render
- Charts animate on scroll
- Dark theme matches rest of page
- Responsive on mobile
- No console errors

**Step 8: Commit**

```bash
git add landing/showcase-data/ landing/showcase.html landing/showcase.css landing/showcase.js
git commit -m "feat(showcase): add interactive Chart.js visualizations to research dossier"
```

---

## Task 6: Update README and push

**Files:**
- Modify: `README.md` (add report renderer to agent inventory, update feature list)

**Step 1: Update README agent inventory**

Add `seine-report-renderer` to the agent table in README.md. Add a "Visual Dossier" bullet to the features section mentioning the interactive HTML output with Chart.js charts.

**Step 2: Commit and push**

```bash
git add README.md
git commit -m "docs: add report renderer to README agent inventory and features"
git push origin main
```

**Step 3: Verify deployment**

Wait 1-2 minutes for GitHub Pages, then check:
- `https://seinesearch.com/showcase.html` loads with charts
- Charts animate properly
- Mobile responsive
- No broken resources

---

## Summary

| Task | Files | What |
|------|-------|------|
| 1 | `agents/seine-report-renderer.md` | Core agent definition |
| 2 | `skills/seine-render/SKILL.md` | Standalone CLI skill |
| 3 | `skills/seine-research/SKILL.md` | Wire into research pipeline |
| 4 | `skills/seine-search/SKILL.md` | Wire into search pipeline |
| 5 | `landing/showcase*` files | Add charts to live showcase |
| 6 | `README.md` | Docs + deploy |

Total: 6 tasks, ~8 files modified/created.
