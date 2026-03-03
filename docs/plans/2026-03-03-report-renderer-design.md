# Seine Report Renderer — design

## What

A new `seine-report-renderer` agent that reads Seine research artifacts, auto-detects visualizable data, and produces a self-contained interactive HTML dossier with Chart.js charts, animated elements, and styled tables.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | New dedicated agent (`seine-report-renderer.md`) | Reusable from plugin, MCP, CLI, manual. Not coupled to one skill. |
| Chart library | Chart.js bundled inline (~200KB) | Zero external dependencies. Works offline, air-gapped, any browser. |
| Model | Sonnet | Fast, cheap, reliable at structured HTML. Not worth Opus cost for rendering. |
| Visualization detection | Automatic from data | Agent inspects findings for chartable patterns. No manual config. |
| Output | `{artifact_dir}/09-dossier.html` | Continues numbered artifact convention (00-08 existing). |
| Website | Replace showcase.html with real rendered output | Self-demonstrating. Proves the feature works. |

## Always-present visualizations

These are generated from every research run regardless of topic:

1. **Confidence score bar chart** — Horizontal bars per finding, color-coded by evidence level (SOLID green, SOFT amber, SHAKY red). From `phase-c-confidence.json`.
2. **Evidence strength doughnut** — Distribution of SOLID/SOFT/SHAKY/UNKNOWN findings. Same source.
3. **Source quality doughnut** — HIGH/MEDIUM/LOW/UNKNOWN trust tier counts. From `07-sources.json`.
4. **Pipeline timeline gantt** — Phase durations as horizontal bars with agent sub-bars. Gate pass/fail markers. From `08-timeline.json`.

## Auto-detected visualizations

The agent inspects actual findings and generates charts when data fits:

| Pattern | Chart type | Example from EU AI Act dossier |
|---------|-----------|------|
| Dated milestones | Milestone timeline | EU enforcement dates: Feb 2025, Aug 2025, Aug 2026, Aug 2027 |
| Penalty/fine tiers | Grouped bar | EUR 35M/7%, 15M/3%, 7.5M/1.5% |
| Two+ entities compared | Comparison table or grouped chart | EU prescriptive vs US sectoral approach |
| Numerical thresholds | Log-scale bar | EU 10^25 vs CA 10^26 FLOPs |
| Category counts | Stacked bar | State laws by focus area |
| State law dates | Timeline | CA/TX Jan 2026, CO Jun 2026 |

If nothing fits a chart, data stays as styled tables or prose. No forced visualizations.

## HTML structure

- Dark theme (Seine brand: deep navy #0d0d14, gradient accents)
- Self-contained single file: inline CSS, Chart.js in <script> block, all JS inline
- Responsive layout (desktop + mobile)
- @media print styles for PDF export
- Sections: hero/stats, executive summary, findings with confidence badges, charts, sources, pipeline timeline, gate verdicts
- Chart.js animations on load
- CSS fade-in on scroll via IntersectionObserver (inline JS)
- Table of contents with smooth scroll

## Integration points

| Context | How | When |
|---------|-----|------|
| seine-research skill | Step 7: spawn renderer after timeline persistence | Every successful pipeline run |
| seine-search skill | After research phase completes | drill/siege depth |
| MCP | New `seine_render_dossier` tool or part of `seine_research` response | On demand |
| CLI | `/seine:seine-render {artifact_dir}` (new small skill) | Manual |
| Manual | Spawn agent directly with artifact_dir path | Any time |

## Partial pipeline handling

When a gate returns FAIL and the pipeline stops early, the renderer still works. It renders whatever artifacts exist (phase-a only, or phases a+b) and shows a red FAIL banner explaining where the pipeline stopped and why. The FAIL visualization is part of the product.

## New files

| File | Type | Purpose |
|------|------|---------|
| `agents/seine-report-renderer.md` | Agent definition | The renderer agent prompt with Chart.js template, detection rules, HTML template |
| `skills/seine-render/SKILL.md` | Skill | Small skill that spawns the renderer. Callable as `/seine:seine-render` |

## Chart.js bundling

The agent prompt includes instructions to bundle Chart.js v4.x minified source as an inline `<script>` block. The Sonnet agent writes Chart.js config objects (JSON-like) which are simple and well-documented. The agent does not write Chart.js from scratch — it writes config objects that Chart.js renders.

## Files budget

| Category | Count |
|----------|-------|
| New agent | 1 |
| New skill | 1 |
| Modified skills (seine-research, seine-search) | 2 |
| Website (showcase.html replacement) | 1 |
| **Total** | 6 |
