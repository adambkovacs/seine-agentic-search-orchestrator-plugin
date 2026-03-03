# Seine Architecture

## Pipeline Overview

Seine processes queries through a depth-controlled pipeline. Deeper depths activate more agents and produce more thorough analysis.

```mermaid
flowchart TD
    Q["Query"] --> R["Router"]
    R --> D["Domain Dispatch"]
    D --> |web| W["WebSearch"]
    D --> |academic| A["WebSearch + arxiv/DBLP"]
    D --> |osint| O["WebSearch + EDGAR/Wikidata"]
    D --> |social| S["WebSearch + Twitter/Reddit"]

    W & A & O & S --> F["Result Fusion (RRF)"]

    F --> T{"Triage Gate · scan+
    completeness · quality · gaps"}
    T --> |"pass"| OUT
    T --> |"flag"| C1

    C1["Council R1 · dig+
    7 members · parallel"] --> GT["Ground Truth +
    Targeted Research"]
    GT --> C2["Council R2
    Validation"]

    C2 --> RP["Research Pipeline · drill+
    Phase A → Gate → B → Gate → C"]

    RP --> SG["Siege Loop · siege
    Multi-round convergence (max 10)"]
    SG --> OUT

    OUT["Output Layer · dig+
    renderer → humanizer"] --> FINAL["research/final/{slug}.md"]

    style Q fill:#1E3A8A,color:#fff
    style F fill:#5B21B6,color:#fff
    style T fill:#B45309,color:#fff
    style C1 fill:#6B21A8,color:#fff
    style C2 fill:#6B21A8,color:#fff
    style RP fill:#991B1B,color:#fff
    style SG fill:#7F1D1D,color:#fff
    style OUT fill:#15803D,color:#fff
    style FINAL fill:#166534,color:#fff
```

## Depth Behavior

| Depth | What Activates | Sources Reviewed | Expected Findings | Analysis Intensity |
|-------|---------------|-----------------|-------------------|-------------------|
| skim | Route + Fuse only | -- | -- | None (no agents) |
| scan | + Triage council (3 agents) | Top 3 results | 1-2 findings | Surface-level |
| dig | + Full council (7 members) | Top 10 results | 3-5 findings | Moderate |
| drill | + Research pipeline (7 agents) | All results | 5-8 findings | Deep analysis |
| siege | + Research with opus models | Exhaustive + adjacent | 8+ findings | Maximum rigor |

## Agent Inventory

### Triage Agents (3) -- Gate at scan+

| Agent | Question | Action on Flag |
|-------|----------|----------------|
| **completeness** | Were all relevant domains searched? | Request missing domain search |
| **quality** | Do results actually answer the query? | Suggest refined query |
| **gaps** | What's conspicuously absent? | Escalate to full council |

### Council Members (7) -- Parallel at dig+

| Member | Cognitive Function | Key Behavior |
|--------|-------------------|-------------|
| **synthesizer** | Integration, big-picture | Finds unifying narrative across domains |
| **contrarian** | Adversarial stress-test | Assumes top result is wrong, applies "prove it" / "so what?" |
| **lateral-hunter** | Adjacent-domain search | Finds structural analogies from unexpected fields |
| **source-critic** | Provenance evaluation | Checks recency, authority, bias, citation quality |
| **pattern-spotter** | Cross-domain correlation | Finds themes, emerging trends, contradictions between domains |
| **blind-spot** | Missing-perspective detection | "What questions haven't been asked?" |
| **temporal** | Time-trajectory analysis | Maps emerging -> growing -> peaking -> declining trajectories |

### Research Agents (7) -- Phased at drill+

| Agent | Mission | Phase | Output |
|-------|---------|-------|--------|
| **hunter** | Build strongest evidence base | A (Discovery) | Evidence Map + Confidence Table |
| **scout** | Find non-obvious signals | A (Discovery) | Adjacent/Weak Signals + Timing Triggers |
| **skeptic** | Challenge claims with negation queries | B (Analysis) | Claim-by-Claim Challenge + Survived Claims |
| **referee** | Resolve conflicting evidence | B (Analysis) | Verdict + Source Quality Comparison |
| **validator** | Phase gate quality check | Gate | PASS / PASS WITH NOTES / FAIL |
| **adversarial-reviewer** | Red-team final analysis | C (Synthesis) | Weaknesses + Failure Scenarios + Corrections |
| **confidence-quantifier** | Calibrate confidence scores | C (Synthesis) | Per-finding scoring |

### Output Agents (2) -- Post-pipeline at dig+

| Agent | Purpose |
|-------|---------|
| **output-renderer** | Transform JSON artifacts into prose with Sources, Work Log, Confidence Summary |
| **humanizer** | Anti-slop audit + voice application + quality gate (NO-SLOP > 90%) |

### Orchestrator (1)

| Agent | Purpose |
|-------|---------|
| **researcher** | Main orchestrator for deep research runs. Coordinates all pipeline stages. |

## Domains

| Domain | Description | Method |
|--------|-------------|--------|
| **web** | General web search | WebSearch |
| **academic** | arXiv and DBLP papers | WebSearch with qualifiers |
| **osint** | EDGAR, OpenCorporates, Wikidata, LittleSis, OFAC, FEC, and more | WebSearch with specialized queries |
| **social** | Twitter/X, Reddit, LinkedIn | WebSearch on social platforms |

## Council Output Schema

All 7 council members produce the same JSON structure:

```json
{
  "member": "<name>",
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

## Research Agent Schema (6 Required Blocks)

```json
{
  "scope": { "query": "...", "depth": "...", "agent": "...", "timestamp": "ISO-8601" },
  "findings": [{ "type": "...", "detail": "...", "evidence_label": "...", "source": "..." }],
  "counter_evidence": [{ "claim": "...", "counter": "...", "evidence_label": "..." }],
  "confidence_table": [{ "claim": "...", "evidence_label": "...", "source_count": 0 }],
  "gaps": ["..."],
  "sources": [{ "url": "...", "title": "...", "trust_tier": "HIGH|MEDIUM|LOW|DISQUALIFIED" }]
}
```

## Research Pipeline Detail

```mermaid
flowchart LR
    subgraph "Phase A — Discovery"
        H["hunter"] & SC["scout"]
    end

    subgraph GA["Gate A"]
        VA["validator"]
    end

    subgraph "Phase B — Analysis"
        SK["skeptic"] & RF["referee"]
    end

    subgraph GB["Gate B"]
        VB["validator"]
    end

    subgraph "Phase C — Synthesis"
        AR["adversarial-reviewer"] & CQ["confidence-quantifier"]
    end

    H & SC --> VA
    VA --> |PASS| SK & RF
    VA --> |FAIL| STOP1["Pipeline Stops"]
    SK & RF --> VB
    VB --> |PASS| AR & CQ
    VB --> |FAIL| STOP2["Pipeline Stops"]

    style GA fill:#FFF3E0,stroke:#FF9800
    style GB fill:#FFF3E0,stroke:#FF9800
    style STOP1 fill:#FFCDD2,stroke:#F44336
    style STOP2 fill:#FFCDD2,stroke:#F44336
```

## Artifact Directory Structure

At `dig` depth and above, each query creates a persistent artifact directory:

```mermaid
graph TD
    ROOT["research/artifacts/{query-slug}-{date}/"] --> Q0["00-query.json
    Routing decision + domains"]
    ROOT --> S1["01-search-rounds/
    Per-domain raw results"]
    ROOT --> F2["02-fusion.json
    RRF-fused results + scores"]
    ROOT --> T3["03-triage/
    3 triage verdicts"]
    ROOT --> C4["04-council-r1/
    7 council member outputs"]
    ROOT --> R5["05-research/
    Research phase outputs + gates"]
    ROOT --> C6["06-council-r2/
    R2 outputs (if run)"]
    ROOT --> S7["07-sources.json
    Deduplicated master source list"]
    ROOT --> T8["08-timeline.json
    Per-stage timing"]

    ROOT -.-> FINAL["research/final/{slug}.md"]

    style ROOT fill:#1E293B,color:#fff
    style FINAL fill:#166534,color:#fff
```
