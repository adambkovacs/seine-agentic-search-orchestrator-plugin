# Seine Architecture

## Pipeline Overview

Seine processes queries through a depth-controlled pipeline. Each depth level activates more agents and produces deeper analysis.

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#2D3748', 'primaryTextColor': '#E2E8F0', 'lineColor': '#718096'}}}%%
flowchart TD
    Q["Query"] --> R["Router"]
    R --> D["Domain Dispatch"]
    D -->|web| W["WebSearch"]
    D -->|academic| A["WebSearch + arXiv/DBLP"]
    D -->|osint| O["WebSearch + EDGAR/Wikidata"]
    D -->|social| S["WebSearch + Twitter/Reddit"]

    W & A & O & S --> F["Result Fusion<br/><small>Reciprocal Rank Fusion</small>"]

    F --> T{"Triage Gate<br/><small>completeness / quality / gaps</small>"}
    T -->|pass| OUT
    T -->|flag| C1

    C1["Council R1<br/><small>7 members, parallel</small>"] --> GT["Targeted Research<br/><small>Fill gaps from R1</small>"]
    GT --> C2["Council R2<br/><small>Validation</small>"]

    C2 --> RP["Research Pipeline<br/><small>Phase A / Gate / B / Gate / C</small>"]

    RP --> SG["Siege Loop<br/><small>Multi-round convergence, max 10</small>"]
    SG --> OUT

    OUT["Output Layer<br/><small>renderer + humanizer</small>"] --> FINAL["research/final/{slug}.md"]

    style Q fill:#3182CE,color:#fff,stroke:#2B6CB0
    style R fill:#2D3748,color:#E2E8F0,stroke:#4A5568
    style D fill:#2D3748,color:#E2E8F0,stroke:#4A5568
    style W fill:#2D3748,color:#E2E8F0,stroke:#4A5568
    style A fill:#2D3748,color:#E2E8F0,stroke:#4A5568
    style O fill:#2D3748,color:#E2E8F0,stroke:#4A5568
    style S fill:#2D3748,color:#E2E8F0,stroke:#4A5568
    style F fill:#6B46C1,color:#fff,stroke:#553C9A
    style T fill:#D69E2E,color:#1A202C,stroke:#B7791F
    style C1 fill:#805AD5,color:#fff,stroke:#6B46C1
    style GT fill:#805AD5,color:#fff,stroke:#6B46C1
    style C2 fill:#805AD5,color:#fff,stroke:#6B46C1
    style RP fill:#C53030,color:#fff,stroke:#9B2C2C
    style SG fill:#9B2C2C,color:#fff,stroke:#742A2A
    style OUT fill:#2F855A,color:#fff,stroke:#276749
    style FINAL fill:#276749,color:#fff,stroke:#22543D
```

---

## Depth Behavior

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#2D3748', 'primaryTextColor': '#E2E8F0', 'lineColor': '#718096'}}}%%
graph LR
  skim["<b>skim</b><br/>Route + Fuse"] --> scan["<b>scan</b><br/>Triage Gate"]
  scan --> dig["<b>dig</b><br/>Council R1/R2"]
  dig --> drill["<b>drill</b><br/>Research Pipeline"]
  drill --> siege["<b>siege</b><br/>Multi-round Convergence"]

  style skim fill:#F6E05E,color:#1A202C,stroke:#D69E2E
  style scan fill:#FC8181,color:#1A202C,stroke:#E53E3E
  style dig fill:#63B3ED,color:#1A202C,stroke:#3182CE
  style drill fill:#B794F4,color:#1A202C,stroke:#805AD5
  style siege fill:#F687B3,color:#1A202C,stroke:#D53F8C
```

| Depth | What Activates | Sources Reviewed | Findings | Intensity |
|-------|---------------|-----------------|----------|-----------|
| **skim** | Route + Fuse only | -- | -- | None |
| **scan** | + 3 triage agents | Top 3 | 1-2 | Surface |
| **dig** | + 7 council members | Top 10 | 3-5 | Moderate |
| **drill** | + 7 research agents | All results | 5-8 | Deep |
| **siege** | + Opus models, multi-round | Exhaustive + adjacent | 8+ | Maximum |

---

## Agent Inventory

### Triage (3 agents, `scan`+)

| Agent | Question It Answers | On Flag |
|-------|-------------------|---------|
| **completeness** | Were all relevant domains searched? | Request missing domain |
| **quality** | Do results answer the query? | Refine query |
| **gaps** | What is conspicuously absent? | Escalate to council |

### Council (7 members, `dig`+, parallel)

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#2D3748', 'primaryTextColor': '#E2E8F0', 'lineColor': '#718096'}}}%%
graph TD
  Q((Query))
  Q --> Syn["<b>Synthesizer</b><br/><small>Integration, big-picture</small>"]
  Q --> Con["<b>Contrarian</b><br/><small>Stress-test, prove it</small>"]
  Q --> Lat["<b>Lateral Hunter</b><br/><small>Adjacent domains, analogies</small>"]
  Q --> Src["<b>Source Critic</b><br/><small>Provenance, authority, bias</small>"]
  Q --> Pat["<b>Pattern Spotter</b><br/><small>Trends, correlations</small>"]
  Q --> Bln["<b>Blind Spot</b><br/><small>Missing perspectives</small>"]
  Q --> Tmp["<b>Temporal</b><br/><small>Emerging / Peaking / Declining</small>"]

  Syn & Con & Lat & Src & Pat & Bln & Tmp --> S{{"Synthesis<br/>pass / flag"}}

  style Q fill:#3182CE,color:#fff,stroke:#2B6CB0
  style Syn fill:#2B6CB0,color:#fff,stroke:#2C5282
  style Con fill:#C53030,color:#fff,stroke:#9B2C2C
  style Lat fill:#D69E2E,color:#1A202C,stroke:#B7791F
  style Src fill:#2F855A,color:#fff,stroke:#276749
  style Pat fill:#6B46C1,color:#fff,stroke:#553C9A
  style Bln fill:#9B2C2C,color:#fff,stroke:#742A2A
  style Tmp fill:#2F855A,color:#fff,stroke:#276749
  style S fill:#2D3748,color:#E2E8F0,stroke:#718096
```

### Research Pipeline (7 agents, `drill`+)

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#2D3748', 'primaryTextColor': '#E2E8F0', 'lineColor': '#718096'}}}%%
graph LR
  subgraph A["Phase A: Discovery"]
    H["<b>hunter</b><br/><small>Evidence map</small>"]
    SC["<b>scout</b><br/><small>Adjacent signals</small>"]
  end

  subgraph GA["Gate A"]
    VA["<b>validator</b><br/><small>threshold: 0.70</small>"]
  end

  subgraph B["Phase B: Analysis"]
    SK["<b>skeptic</b><br/><small>Counter-evidence</small>"]
    RF["<b>referee</b><br/><small>Conflict resolution</small>"]
  end

  subgraph GB["Gate B"]
    VB["<b>validator</b><br/><small>threshold: 0.75</small>"]
  end

  subgraph C["Phase C: Synthesis"]
    AR["<b>adversarial-reviewer</b><br/><small>Red-team protocol</small>"]
    CQ["<b>confidence-quantifier</b><br/><small>4-dimension scoring</small>"]
  end

  H & SC --> VA
  VA -->|PASS| SK & RF
  VA -->|FAIL| STOP1["Pipeline Stops"]
  SK & RF --> VB
  VB -->|PASS| AR & CQ
  VB -->|FAIL| STOP2["Pipeline Stops"]

  style A fill:#2D3748,color:#E2E8F0,stroke:#F6E05E
  style GA fill:#2D3748,color:#E2E8F0,stroke:#D69E2E
  style B fill:#2D3748,color:#E2E8F0,stroke:#63B3ED
  style GB fill:#2D3748,color:#E2E8F0,stroke:#D69E2E
  style C fill:#2D3748,color:#E2E8F0,stroke:#B794F4
  style STOP1 fill:#FC8181,color:#1A202C,stroke:#E53E3E
  style STOP2 fill:#FC8181,color:#1A202C,stroke:#E53E3E
```

### Output (2 agents, `dig`+)

| Agent | Purpose |
|-------|---------|
| **output-renderer** | Transforms JSON artifacts into prose with `[N]` citations, Sources table, Work Log, Confidence Summary |
| **humanizer** | 5-tier anti-slop audit (threshold: 90/100) + voice styling. Structured data is never touched. |

### Orchestrator (1)

| Agent | Purpose |
|-------|---------|
| **researcher** | Coordinates all pipeline stages. Generates slug, creates artifact directory, routes between skills. Runs on Opus. |

---

## Domains

| Domain | Method | What It Searches |
|--------|--------|-----------------|
| **web** | `WebSearch` | General web content |
| **academic** | `WebSearch` + `site:` qualifiers | arXiv, DBLP, Semantic Scholar |
| **osint** | `WebSearch` + `site:` targeting | SEC/EDGAR, OpenCorporates, Wikidata, OFAC, FEC, LittleSis, CompaniesHouse, CANDID, court records, patents, news, sanctions, property |
| **social** | `WebSearch` + platform targeting | Twitter/X, Reddit, LinkedIn |

All OSINT uses `WebSearch` with `site:` restriction patterns. No external API keys or database connections.

---

## Output Schemas

<details>
<summary><strong>Council Member Output</strong></summary>

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

</details>

<details>
<summary><strong>Research Agent Output (ADR-S007, 6 required blocks)</strong></summary>

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

</details>

---

## Artifact Directory

At `dig`+ every query creates a persistent, auditable artifact directory:

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'primaryColor': '#2D3748', 'primaryTextColor': '#E2E8F0', 'lineColor': '#718096'}}}%%
graph TD
    ROOT["research/artifacts/{slug}-{date}/"] --> Q0["00-query.json<br/><small>Routing + domains</small>"]
    ROOT --> S1["01-search-rounds/<br/><small>Per-domain raw results</small>"]
    ROOT --> F2["02-fusion.json<br/><small>RRF-fused + scores</small>"]
    ROOT --> T3["03-triage/<br/><small>3 verdicts</small>"]
    ROOT --> C4["04-council-r1/<br/><small>7 member outputs</small>"]
    ROOT --> R5["05-research/<br/><small>Phase outputs + gates</small>"]
    ROOT --> C6["06-council-r2/<br/><small>R2 outputs</small>"]
    ROOT --> S7["07-sources.json<br/><small>Master source list</small>"]
    ROOT --> T8["08-timeline.json<br/><small>Per-stage timing</small>"]
    ROOT -.-> FINAL["research/final/{slug}.md"]

    style ROOT fill:#2D3748,color:#E2E8F0,stroke:#718096
    style Q0 fill:#2D3748,color:#E2E8F0,stroke:#4A5568
    style S1 fill:#2D3748,color:#E2E8F0,stroke:#4A5568
    style F2 fill:#6B46C1,color:#fff,stroke:#553C9A
    style T3 fill:#D69E2E,color:#1A202C,stroke:#B7791F
    style C4 fill:#805AD5,color:#fff,stroke:#6B46C1
    style R5 fill:#C53030,color:#fff,stroke:#9B2C2C
    style C6 fill:#805AD5,color:#fff,stroke:#6B46C1
    style S7 fill:#2F855A,color:#fff,stroke:#276749
    style T8 fill:#2D3748,color:#E2E8F0,stroke:#4A5568
    style FINAL fill:#276749,color:#fff,stroke:#22543D
```

---

## Evidence Vocabulary

| Label | Meaning | Score |
|-------|---------|-------|
| **SOLID** | Multiple independent sources, no contradictions | 1.0 |
| **SOFT** | Single credible source or indirect evidence | 0.6 |
| **SHAKY** | Single biased source or conflicting evidence | 0.3 |
| **UNKNOWN** | Insufficient evidence to assess | 0.0 |

**Confidence formula:**

```
confidence = (evidence x 0.40) + (source_quality x 0.25) + (recency x 0.20) + (agreement x 0.15)
```

| Composite Score | Label |
|----------------|-------|
| >= 0.80 | SOLID |
| >= 0.55 | SOFT |
| >= 0.30 | SHAKY |
| < 0.30 | UNKNOWN |

**Source quality tiers:** HIGH (`.gov`, peer-reviewed) > MEDIUM-HIGH (Reuters, Bloomberg) > MEDIUM (industry reports) > LOW (forums, unvetted blogs) > DISQUALIFIED (anonymous, no attribution)

**Recency tiers:** CURRENT (< 30d) > RECENT (30-180d) > DATED (180-365d) > STALE (> 365d)
