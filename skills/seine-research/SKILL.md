---
name: seine-research
description: Deep multi-round research with phased pipeline and evidence mapping via Seine Backend 2
triggers:
  - seine research
  - deep research
  - research pipeline
  - drill research
  - siege research
---

# Seine Research (Backend 2)

Phased research pipeline using Claude Code's native `Agent` tool. Requires `drill` or `siege` depth.
Read `agents/seine-kb/REFERENCE.md` for schemas, ADR rules, and depth behavior.

## Evidence Vocabulary

| Label | Meaning | Numeric |
|-------|---------|---------|
| SOLID | Multiple independent sources, no contradictions | 1.0 |
| SOFT | Single credible source or indirect evidence | 0.6 |
| SHAKY | Single biased source or conflicting evidence | 0.3 |
| UNKNOWN | Insufficient evidence | 0.0 |

## Model Selection

| Depth | Model |
|-------|-------|
| `drill` | sonnet |
| `siege` | opus |

## Pipeline

```
Phase A (Discovery)    hunter + scout        → Evidence map + adjacent signals
    ↓ Gate A           validator             → PASS / PASS_WITH_NOTES / FAIL
Phase B (Analysis)     skeptic + referee     → Claim challenges + conflict resolution
    ↓ Gate B           validator             → PASS / PASS_WITH_NOTES / FAIL
Phase C (Synthesis)    adversarial-reviewer  → Red-team analysis
                       confidence-quantifier → Calibrated confidence scores
```

Gate failure stops the pipeline immediately (ADR-S009). Partial results returned with `stopped_at` field.

---

## Step 1 — Phase A: Discovery (parallel)

Spawn hunter and scout simultaneously in a single message:

```javascript
Agent({ subagent_type: "seine-research-hunter", model: "<drill=sonnet|siege=opus>",
        prompt: "Query: <query>\nPrior results: <search_results_json>\nTask: Build evidence map and confidence table." })
Agent({ subagent_type: "seine-research-scout",  model: "<drill=sonnet|siege=opus>",
        prompt: "Query: <query>\nPrior results: <search_results_json>\nTask: Find adjacent signals, weak signals, and timing triggers." })
```

Both must output the Research Agent Schema (KB Section 3): 6 required blocks — scope, findings, counter_evidence, confidence_table, gaps, sources (ADR-S007).

## Step 2 — Gate A

Spawn validator with Phase A combined outputs:

```javascript
Agent({ subagent_type: "seine-research-validator", model: "sonnet",
        prompt: "Query: <query>\nPhase A outputs: <hunter_json + scout_json>\nTask: Schema check + confidence assessment. Return PASS, PASS_WITH_NOTES, or FAIL." })
```

**If Gate A returns FAIL**: Stop pipeline. Return `{ "stopped_at": "gate_a", "research": { "phase_a": {...} } }`.

## Step 3 — Phase B: Analysis (parallel)

Spawn skeptic and referee simultaneously:

```javascript
Agent({ subagent_type: "seine-research-skeptic",  model: "<drill=sonnet|siege=opus>",
        prompt: "Query: <query>\nPhase A outputs: <phase_a_json>\nTask: Challenge all major claims. Identify survived vs collapsed claims." })
Agent({ subagent_type: "seine-research-referee",  model: "<drill=sonnet|siege=opus>",
        prompt: "Query: <query>\nPhase A outputs: <phase_a_json>\nTask: Resolve conflicts between sources. Compare source quality." })
```

## Step 4 — Gate B

Spawn validator with Phase B combined outputs:

```javascript
Agent({ subagent_type: "seine-research-validator", model: "sonnet",
        prompt: "Query: <query>\nPhase B outputs: <skeptic_json + referee_json>\nTask: Schema check + confidence assessment. Return PASS, PASS_WITH_NOTES, or FAIL." })
```

**If Gate B returns FAIL**: Stop pipeline. Return `{ "stopped_at": "gate_b", "research": { "phase_a": {...}, "phase_b": {...} } }`.

## Step 5 — Phase C: Synthesis (parallel)

Spawn adversarial reviewer and confidence quantifier simultaneously:

```javascript
Agent({ subagent_type: "seine-research-adversarial",  model: "<drill=sonnet|siege=opus>",
        prompt: "Query: <query>\nAll prior phases: <phases_a_b_json>\nTask: Steelman → attack → negate → identify fail scenarios." })
Agent({ subagent_type: "seine-research-confidence",   model: "<drill=sonnet|siege=opus>",
        prompt: "Query: <query>\nAll prior phases: <phases_a_b_json>\nTask: Produce per-finding calibrated confidence scores using formula: (evidence×0.40)+(source_quality×0.25)+(recency×0.20)+(agreement×0.15)." })
```

## Step 6 — Return

```json
{
  "stopped_at": null,
  "research": {
    "phase_a": { "hunter": {}, "scout": {} },
    "gate_a":  { "verdict": "PASS|PASS_WITH_NOTES|FAIL", "notes": "..." },
    "phase_b": { "skeptic": {}, "referee": {} },
    "gate_b":  { "verdict": "PASS|PASS_WITH_NOTES|FAIL", "notes": "..." },
    "phase_c": { "adversarial": {}, "confidence": {} }
  },
  "timing": { "research_ms": 0 }
}
```

---

## Artifact Persistence (when artifact_dir is provided, ADR-S017)

The calling skill passes `artifact_dir` in the prompt context (e.g., `research/artifacts/china-ai-chip-strategy-2026-03-02`). All persistence steps below only execute when `artifact_dir` is present.

**Create the research directory once at the start of Phase A:**

```javascript
Bash({ command: "mkdir -p {artifact_dir}/05-research" })
```

### After Phase A (Discovery)

Write each agent's full output using the `Write` tool:

```javascript
Write({ file_path: "{artifact_dir}/05-research/phase-a-hunter.json", content: "<hunter_json>" })
Write({ file_path: "{artifact_dir}/05-research/phase-a-scout.json",  content: "<scout_json>" })
```

Each file contains the complete ADR-S007 Research Agent JSON envelope with all 6 required blocks: `scope`, `findings`, `counter_evidence`, `confidence_table`, `gaps`, `sources`.

### After Gate A

Write the validator verdict:

```javascript
Write({ file_path: "{artifact_dir}/05-research/gate-a.json", content: "<gate_a_json>" })
```

Gate file schema: `{ "verdict": "PASS|PASS_WITH_NOTES|FAIL", "notes": "...", "schema_errors": [], "timestamp": "ISO 8601" }`.

If Gate A returns `FAIL`, the pipeline stops here. The partial artifacts (phase-a files + gate-a.json) remain in the directory for inspection.

### After Phase B (Analysis)

```javascript
Write({ file_path: "{artifact_dir}/05-research/phase-b-skeptic.json", content: "<skeptic_json>" })
Write({ file_path: "{artifact_dir}/05-research/phase-b-referee.json", content: "<referee_json>" })
```

### After Gate B

```javascript
Write({ file_path: "{artifact_dir}/05-research/gate-b.json", content: "<gate_b_json>" })
```

If Gate B returns `FAIL`, the pipeline stops here. Partial artifacts remain.

### After Phase C (Synthesis)

```javascript
Write({ file_path: "{artifact_dir}/05-research/phase-c-adversarial.json",  content: "<adversarial_json>" })
Write({ file_path: "{artifact_dir}/05-research/phase-c-confidence.json",   content: "<confidence_json>" })
```

---

## Source Compilation (after Phase C, ADR-S017)

After all three phases complete successfully, compile a master source list from all 6 research agent outputs.

**Step 1 — Collect.** Gather the `sources[]` array from each of the 6 agent output files: hunter, scout, skeptic, referee, adversarial, confidence.

**Step 2 — Deduplicate by URL.** If two or more agents reference the same URL, merge them into a single entry.

**Step 3 — Compute fields for each unique source:**

| Field | Rule |
|-------|------|
| `url` | The unique URL |
| `title` | Title from the first agent that cited it |
| `trust_tier` | Use the **highest** tier assigned by any agent. Tier hierarchy: `HIGH > MEDIUM > LOW > UNKNOWN`. Exception: if the `source-critic` council member (from a prior council round) assessed this URL, the source-critic's tier takes precedence over all research agents. |
| `cited_by` | Array of agent names that referenced this URL (e.g., `["hunter", "skeptic", "confidence"]`) |
| `retrieved_at` | The **earliest** retrieval timestamp across all agents that cited it |

**Step 4 — Sort.** Order the deduplicated sources by: (1) trust tier descending (`HIGH` first, `UNKNOWN` last), then (2) citation count descending (most-cited first), then (3) alphabetical by title.

**Step 5 — Number.** Assign sequential source numbers starting at 1. These numbers correspond to the `[N]` inline citations in the rendered output.

**Step 6 — Write to the artifact directory:**

```javascript
Write({ file_path: "{artifact_dir}/07-sources.json", content: "<compiled_sources_json>" })
```

The file is a JSON array of objects: `[{ "number": 1, "url": "...", "title": "...", "trust_tier": "HIGH", "cited_by": ["hunter", "skeptic"], "retrieved_at": "ISO 8601" }, ...]`.

---

## Timeline Persistence (after Source Compilation)

Write a timeline of the entire research pipeline to the artifact directory:

```javascript
Write({ file_path: "{artifact_dir}/08-timeline.json", content: "<timeline_json>" })
```

Timeline schema:

```json
{
  "phases": [
    { "name": "phase-a", "agents": ["hunter", "scout"], "started": "2026-03-02T14:30:00Z", "completed": "2026-03-02T14:31:12Z" },
    { "name": "gate-a", "verdict": "PASS", "completed": "2026-03-02T14:31:18Z" },
    { "name": "phase-b", "agents": ["skeptic", "referee"], "started": "2026-03-02T14:31:18Z", "completed": "2026-03-02T14:32:45Z" },
    { "name": "gate-b", "verdict": "PASS_WITH_NOTES", "completed": "2026-03-02T14:32:50Z" },
    { "name": "phase-c", "agents": ["adversarial", "confidence"], "started": "2026-03-02T14:32:50Z", "completed": "2026-03-02T14:34:10Z" },
    { "name": "source-compilation", "completed": "2026-03-02T14:34:12Z" }
  ],
  "total_duration_seconds": 252
}
```

Each phase entry records ISO 8601 timestamps for `started` and `completed`. Gate entries include the `verdict`. The `total_duration_seconds` is the wall-clock time from Phase A start to source compilation completion.

---

## HTML Dossier Rendering (after Timeline, ADR-S017)

When `artifact_dir` is provided, spawn the report renderer to generate an interactive HTML dossier:

```javascript
Agent({ subagent_type: "seine-report-renderer", model: "sonnet",
        prompt: "Artifact directory: {artifact_dir}\n\nRead all JSON files in the artifact directory (00-query.json through 08-timeline.json, skip missing). Auto-detect chartable data from the findings. Generate a self-contained HTML dossier with Chart.js charts bundled inline. Write the output to {artifact_dir}/09-dossier.html." })
```

This step runs even on partial pipelines (gate FAIL). The renderer handles missing phases — it renders whatever data exists and shows FAIL indicators for stopped gates.

Output: `{artifact_dir}/09-dossier.html`
