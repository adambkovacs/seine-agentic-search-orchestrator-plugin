---
name: seine-search
description: Multi-domain search orchestration via Seine Backend 2 (Claude-native agent pipeline)
triggers:
  - search across domains
  - seine query
  - multi-domain search
  - search for information
---

# Seine Search (Backend 2)

Multi-domain search using Claude Code's native `Agent` tool. No external API or CLI required.
Read `agents/seine-kb/REFERENCE.md` for domain registry, schemas, ADR rules, and depth behavior.
Read `agents/seine-kb/SEARCH-CRAFT.md` for query construction: boolean operators, site-restriction, dorking patterns, counter-evidence queries, and WebFetch limitations.

## Evidence Vocabulary

| Label | Meaning | Numeric |
|-------|---------|---------|
| SOLID | Multiple independent sources, no contradictions | 1.0 |
| SOFT | Single credible source or indirect evidence | 0.6 |
| SHAKY | Single biased source or conflicting evidence | 0.3 |
| UNKNOWN | Insufficient evidence | 0.0 |

## Depth Levels

| Depth | What Runs |
|-------|-----------|
| `skim` | Route + Fuse only |
| `scan` | + Triage (3 agents) |
| `dig` | + Full council (7 members) — invoke `/seine-council` |
| `drill` | + Research pipeline — invoke `/seine-research` |
| `siege` | + Research with opus models |

## Orchestration Steps

### Step 1 — Route

Map the query to relevant domains:

| Domain | Backend 2 Method |
|--------|-----------------|
| web | `WebSearch` (general) |
| academic | `WebSearch` with "site:arxiv.org" or "DBLP" qualifier |
| osint | `WebSearch` with EDGAR / OpenCorporates / Wikidata / OFAC qualifiers (see SEARCH-CRAFT.md for patterns) |
| social | `WebSearch` restricted to Twitter / Reddit / LinkedIn |

Select the 2-4 most relevant domains for the query.

### Step 2 — Dispatch (parallel)

Run all selected domain searches simultaneously in a single message. Example for a 3-domain query:

```
Agent(seine-research-hunter) ← academic search
WebSearch(query + "site:arxiv.org")
WebSearch(query + site:reddit.com OR site:twitter.com)
```

Use native Claude Code tools per the domain mapping above. **Do not call any CLI binary or shell script wrapper.**

### Step 3 — Fuse (RRF)

Apply Reciprocal Rank Fusion across all domain result lists:

```
RRF_score(result) = Σ  1 / (60 + rank_i)
                   domains
```

Sort results by descending RRF score. Each result MUST include provenance (ADR-S005):
- `domain`: origin domain
- `round`: search round number (1-indexed)
- `fusion_score`: computed RRF value

### Step 4 — Triage (depth >= scan)

Spawn 3 triage agents **in parallel** (single message, all 3 Agent calls):

```javascript
Agent({ subagent_type: "seine-triage-completeness", model: "sonnet",
        prompt: "Query: <query>\nResults: <fused_results_json>" })
Agent({ subagent_type: "seine-triage-quality",      model: "sonnet",
        prompt: "Query: <query>\nResults: <fused_results_json>" })
Agent({ subagent_type: "seine-triage-gaps",         model: "sonnet",
        prompt: "Query: <query>\nResults: <fused_results_json>" })
```

Each returns: `{ "agent": "...", "verdict": "pass|flag", "reason": "...", "action": null|{...} }`

### Step 5 — Escalation

If **any** triage agent returns `verdict: "flag"`, invoke the `/seine-council` skill with the query and fused results.

### Step 6 — Return

```json
{
  "results": [{ "title": "...", "url": "...", "snippet": "...", "domain": "...", "round": 1, "fusion_score": 0.0 }],
  "triage": { "completeness": {}, "quality": {}, "gaps": {} },
  "council": null,
  "timing": { "route_ms": 0, "dispatch_ms": 0, "fuse_ms": 0, "triage_ms": 0 }
}
```

### Step 7 — Artifact Persistence (depth >= dig, ADR-S017)

Skip this step entirely at `skim` and `scan` depth.

**7a. Generate slug.** Take the query string, lowercase it, replace every non-alphanumeric character with a hyphen, collapse consecutive hyphens into one, strip leading/trailing hyphens, truncate to 60 characters, then append `-{YYYY-MM-DD}` (today's date). Example: `"What is China's AI chip strategy?"` becomes `what-is-china-s-ai-chip-strategy-2026-03-02`.

**7b. Create the artifact directory tree:**

```javascript
Bash({ command: "mkdir -p research/artifacts/{slug}/01-search-rounds" })
```

**7c. Write `00-query.json`** using the `Write` tool. Schema:

```json
{
  "query": "the original query string",
  "depth": "dig|drill|siege",
  "domains_selected": ["academic", "web", "osint"],
  "routing_decision": "Brief explanation of why these domains were selected",
  "timestamp": "2026-03-02T14:30:00Z"
}
```

The `timestamp` field is ISO 8601. The `domains_selected` array comes from Step 1. The `routing_decision` is the one-sentence rationale produced during routing.

**7d. Write search round files.** For each search round executed in Step 2, use the `Write` tool to create:

```
research/artifacts/{slug}/01-search-rounds/round-{N}-{domain}.json
```

where `{N}` is the 1-indexed round number and `{domain}` is the domain name (e.g., `round-1-academic.json`). Each file contains the raw search results array returned by that domain search.

**7e. Write `02-fusion.json`** using the `Write` tool. Contains the full fused result list from Step 3: each entry includes `title`, `url`, `snippet`, `domain`, `round`, and `fusion_score`.

### Step 8 — Output Rendering (depth >= dig, ADR-S016)

**8a. Spawn the output renderer agent:**

```javascript
Agent({ subagent_type: "seine-output-renderer", model: "sonnet",
        prompt: "Artifact directory: research/artifacts/{slug}/\nQuery: <query>\nDepth: <depth>\n\nInstructions:\n1. Read all JSON files in the artifact directory (00-query.json, 01-search-rounds/*.json, 02-fusion.json, and any 03-triage/, 04-council-r1/, 05-research/, 06-council-r2/, 07-sources.json files that exist).\n2. Produce a markdown document containing:\n   - A prose body with inline [N] citations referencing numbered sources\n   - A Sources & References table: | # | Title | URL | Trust Tier | Cited By |\n   - A Work Log section listing every search round, triage verdict, council member, and research phase with timestamps\n   - A Confidence Summary section with per-claim confidence scores from the evidence vocabulary\n3. Return the complete markdown document." })
```

**8b. Write the rendered output:**

```javascript
Write({ file_path: "research/final/{slug}.md", content: "<rendered_markdown_from_agent>" })
```

### Step 9 — Humanizer (depth >= drill OR --humanize flag, ADR-S018)

At `skim` and `scan` depth: skip entirely. At `dig` depth: skip unless the user explicitly passed a `--humanize` flag. At `drill` and `siege` depth: always run.

**9a. Read the rendered document:**

```javascript
Read({ file_path: "research/final/{slug}.md" })
```

**9b. Spawn the humanizer agent:**

```javascript
Agent({ subagent_type: "seine-humanizer", model: "sonnet",
        prompt: "Document to humanize:\n<rendered_markdown>\n\nDocument type: <strategic|research|general>\n\nInstructions:\n1. Run the 5-tier anti-slop audit: Tier 1 (banned words/phrases), Tier 2 (structural patterns), Tier 3 (hedging density), Tier 4 (sentence-start variety), Tier 5 (paragraph rhythm).\n2. Apply voice settings appropriate to the document type.\n3. Compute the NO-SLOP score (percentage of sentences passing all 5 tiers).\n4. Quality gate: NO-SLOP score MUST exceed 90%. If below 90%, re-edit and re-score until it passes.\n5. Return the polished markdown and the final NO-SLOP score." })
```

**9c. Overwrite the output file with the humanized version:**

```javascript
Write({ file_path: "research/final/{slug}.md", content: "<humanized_markdown_from_agent>" })
```

### Step 10 — HTML Dossier (depth >= drill, ADR-S017)

At `skim`, `scan`, and `dig` depth: skip. At `drill` and `siege`: always run.

```javascript
Agent({ subagent_type: "seine-report-renderer", model: "sonnet",
        prompt: "Artifact directory: research/artifacts/{slug}/\n\nRead all JSON files in the artifact directory (00-query.json through 08-timeline.json, skip missing). Auto-detect chartable data from the findings. Generate a self-contained HTML dossier with Chart.js charts bundled inline. Write the output to research/artifacts/{slug}/09-dossier.html." })
```

Report the dossier path to the user: `research/artifacts/{slug}/09-dossier.html`