# Seine Backend 2 — Agent Knowledge Base

> Shared domain knowledge for all Seine agents (triage, council, research). Read before acting.
> For search query construction, also read: `agents/seine-kb/SEARCH-CRAFT.md`

---

## Section 1: Domain Registry

| Domain | Description | Capabilities | Latency | Backend 2 Method |
|--------|-------------|--------------|---------|-----------------|
| web | Web search via search engines | search, snippet | fast | WebSearch |
| academic | Academic papers from arXiv and DBLP | search, cite, dblp | medium | WebSearch with "arxiv" or "DBLP" qualifiers |
| osint | Open-source intelligence from public databases (EDGAR, OpenCorporates, Wikidata, LittleSis, OFAC, FEC, etc.) | search, enrich, entity | slow | WebSearch with specialized queries per sub-adapter |
| social | Social media search (Twitter/X, Reddit) | search | medium | WebSearch on social platforms |

---

## Section 2: Evidence Vocabulary (Universal)

All Seine agents MUST use these labels for key claims:

| Label | Meaning | Numeric Value |
|-------|---------|--------------|
| **SOLID** | Multiple independent sources confirm, no contradictions | 1.0 |
| **SOFT** | Single credible source or indirect evidence | 0.6 |
| **SHAKY** | Single source with potential bias, or conflicting evidence | 0.3 |
| **UNKNOWN** | Insufficient evidence to assess | 0.0 |

---

## Section 3: Output Schemas

### Triage Agent Schema
```json
{
  "agent": "completeness|quality|gaps",
  "verdict": "pass|flag",
  "reason": "explanation",
  "action": null
}
```
When flagging, `action` becomes:
```json
{ "type": "search_domain|refine_query", "domain": "name", "subquery": "refined query" }
```

### Council Member Schema
```json
{
  "member": "synthesizer|contrarian|lateral-hunter|source-critic|pattern-spotter|blind-spot|temporal",
  "findings": [
    {
      "type": "endorsement|challenge|gap|pattern|recommendation",
      "target_rank": null,
      "detail": "specific finding text",
      "evidence_label": "SOLID|SOFT|SHAKY|UNKNOWN",
      "action": null
    }
  ],
  "summary": "2-3 sentence overall assessment",
  "verdict": "pass|flag"
}
```

### Research Agent Schema (6 required blocks)
```json
{
  "scope": { "query": "...", "depth": "...", "agent": "...", "timestamp": "ISO-8601" },
  "findings": [{ "type": "...", "detail": "...", "evidence_label": "...", "source": "...", "target_rank": null }],
  "counter_evidence": [{ "claim": "...", "counter": "...", "evidence_label": "..." }],
  "confidence_table": [{ "claim": "...", "evidence_label": "...", "source_count": 0, "strongest_source": "..." }],
  "gaps": ["..."],
  "sources": [{ "url": "...", "title": "...", "type": "...", "trust_tier": "HIGH|MEDIUM|LOW|DISQUALIFIED", "retrieved_at": "ISO-8601" }]
}
```

---

## Section 4: Depth Behavior

| Depth | What Activates | Sources Reviewed | Expected Findings | Analysis Intensity |
|-------|---------------|-----------------|-------------------|-------------------|
| skim | Route + Fuse only | — | — | None (no agents) |
| scan | + Triage council (3 agents) | Top 3 results | 1-2 findings | Surface-level |
| dig | + Full council (7 members) | Top 10 results | 3-5 findings | Moderate |
| drill | + Research pipeline (7 agents) | All results | 5-8 findings | Deep analysis |
| siege | + Research with opus models | Exhaustive + adjacent | 8+ findings | Maximum rigor |

---

## Section 5: Pipeline Architecture

```
Query → Router → Domain Dispatch → Result Fusion (RRF)
  ↓
  [scan+]  Triage Gate: completeness, quality, gaps (3 agents, parallel)
  ↓         → flag? escalate to council
  [dig+]   Council R1: 7 members in parallel → R1 synthesis
  ↓
  [dig+]   Ground Truth Overlay (optional): primary source data enriches findings
  ↓
  [dig+]   Targeted Research: sprint on specific gaps from R1
  ↓
  [dig+]   Council R2: 7 members validate new data, check second-order risks
  ↓
  [drill+] Research Pipeline:
             Phase A (Discovery): hunter + scout (parallel)
             Gate A: validator (PASS/FAIL)
             Phase B (Analysis): skeptic + referee (parallel)
             Gate B: validator (PASS/FAIL)
             Phase C (Synthesis): adversarial-reviewer + confidence-quantifier (parallel)
  ↓
  [siege]  Multi-round until convergence (max 10 rounds)
```

---

## Section 6: Key ADR Rules

| ADR | Rule | Enforcement |
|-----|------|-------------|
| S005 | Every result MUST include provenance (domain, source, council votes) | Hard block |
| S006 | Confidence formula: `(evidence×0.40)+(source_quality×0.25)+(recency×0.20)+(agreement×0.15)` | Advisory |
| S007 | Research agents MUST output 6 required JSON blocks (scope, findings, counter_evidence, confidence_table, gaps, sources) | Hard block |
| S008 | Per-member verdict semantics define what "flag" means for each council member | Advisory |
| S009 | Gate failure (FAIL verdict) STOPS pipeline immediately — no silent skipping | Hard block |
| S016 | Output at dig+ MUST include Sources & References, Work Log, Confidence Summary | Hard block |
| S017 | Intermediate outputs MUST persist to artifact directory at dig+ depth | Advisory |
| S018 | Final prose MUST pass through anti-slop + voice humanizer. Structured data exempt. | Advisory |
| S019 | Every prose claim MUST have `[N]` citation. Council attribution on challenged findings. | Hard block |

**Confidence composite-to-label ranges:** >=0.80=SOLID, >=0.55=SOFT, >=0.30=SHAKY, <0.30=UNKNOWN

**Source quality tiers:** HIGH (peer-reviewed, official), MEDIUM (reputable), LOW (unvetted), DISQUALIFIED (known unreliable)

**Recency tiers:** CURRENT (<30 days), RECENT (30-180 days), DATED (180-365 days), STALE (>365 days)

---

## Section 7: Output Layer (ADR-S016, S017, S018, S019)

The output layer transforms raw pipeline artifacts into human-readable documents with full provenance. Three stages run after the research pipeline completes.

### 7.1 Artifact Persistence (Stage 7, ADR-S017)

At `dig` depth and above, every pipeline run creates a work artifact directory:

```
research/artifacts/{query-slug}-{date}/
├── 00-query.json              # Original query + routing decision + domains selected
├── 01-search-rounds/          # Each domain's raw results per round
│   ├── round-1-web.json
│   ├── round-1-academic.json
│   └── round-2-osint.json     # If triage triggered additional rounds
├── 02-fusion.json             # RRF-fused results with per-result scores
├── 03-triage/                 # All 3 triage verdicts (JSON)
│   ├── completeness.json
│   ├── quality.json
│   └── gaps.json
├── 04-council-r1/             # All 7 member outputs (full council schema)
│   ├── synthesizer.json
│   ├── contrarian.json
│   ├── lateral-hunter.json
│   ├── source-critic.json
│   ├── pattern-spotter.json
│   ├── blind-spot.json
│   └── temporal.json
├── 05-research/               # All research phase outputs
│   ├── phase-a-hunter.json
│   ├── phase-a-scout.json
│   ├── gate-a.json
│   ├── phase-b-skeptic.json
│   ├── phase-b-referee.json
│   ├── gate-b.json
│   ├── phase-c-adversarial.json
│   └── phase-c-confidence.json
├── 06-council-r2/             # R2 member outputs (if R2 was run)
├── 07-sources.json            # Deduplicated master source list
└── 08-timeline.json           # Timing for every pipeline stage
```

The artifact directory path MUST appear in the output header so readers can audit raw data.

### 7.2 Output Rendering (Stage 8, ADR-S016)

The `seine-output-renderer` agent transforms artifacts into a prose document. Mandatory sections:

**Header:**
```markdown
> Pipeline: [depth] | [N] search rounds | [N] sources | [N] council members
> Evidence vocabulary: SOLID | SOFT | SHAKY | UNKNOWN
> Artifacts: research/artifacts/{slug}/
```

**Prose body** with inline citations:
- `[N]` links to numbered Sources table
- `[Member: LABEL]` attributes findings to council members

**Mandatory sections after prose:**

1. **Sources & References** — numbered table:

| # | Title | URL | Domain | Trust Tier | Cited By | Retrieved |
|---|-------|-----|--------|-----------|----------|-----------|
| 1 | ... | ... | web | HIGH | hunter, source-critic | 2026-03-02 |

2. **Work Log** — what each pipeline stage did

3. **Confidence Summary** — per-claim scoring:

| Claim | Evidence | Sources | Strongest Source |
|-------|----------|---------|-----------------|
| ... | SOLID | 4 | [peer-reviewed, #3] |

### 7.3 Humanizer (Stage 9, ADR-S018)

The `seine-humanizer` agent post-processes rendered prose:

1. **Anti-slop audit** — 5-tier detection of AI-generated patterns
2. **Voice application** — route through appropriate voice style
3. **Quality gate** — NO-SLOP Score > 90% required. If below, re-run.

**Scope rule:** Humanizer applies to **prose sections ONLY**. Source tables, work logs, JSON artifacts, evidence labels, confidence scores, and pipeline metadata are NEVER humanized.

### 7.4 Source Deduplication Rules (ADR-S019)

| Rule | Detail |
|------|--------|
| **Same URL** | Single entry; note all agents that cited it in "Cited By" column |
| **Trust tier** | Use highest tier assigned by any agent; source-critic's assessment takes precedence |
| **Retrieved timestamp** | Use earliest retrieval time |
| **Sort order** | Trust tier (HIGH first) → citation count (descending) → alphabetical |
| **Inline citation** | Every factual claim in prose MUST have `[N]` ref. Uncited claims are flagged. |
| **Council attribution** | Findings challenged or flagged by council members include `[Member: VERDICT]` inline |

### 7.5 Depth-Dependent Output Behavior

| Depth | Artifacts | Sources Section | Work Log | Humanizer |
|-------|-----------|----------------|----------|-----------|
| skim | No | No | No | No |
| scan | No | Recommended | No | No |
| dig | **Mandatory** | **Mandatory** | **Mandatory** | Recommended |
| drill | **Mandatory** | **Mandatory** | **Mandatory** | Recommended |
| siege | **Mandatory** | **Mandatory** | **Mandatory** | **Strongly recommended** |
