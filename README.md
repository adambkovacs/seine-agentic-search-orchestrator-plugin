<p align="center">
  <h1 align="center">Seine</h1>
  <h3 align="center">Agentic search orchestration. 20 AI agents. Gated pipeline. Calibrated confidence.</h3>
  <p align="center">
    Single searches satisfice. Orchestrated agents converge on truth.
  </p>
</p>

<p align="center">
  <a href="https://github.com/adambkovacs/seine-agentic-search-orchestrator-plugin/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/version-1.0.0-green.svg" alt="Version 1.0.0">
  <img src="https://img.shields.io/badge/agents-20-purple.svg" alt="20 Agents">
  <img src="https://img.shields.io/badge/council_members-7-orange.svg" alt="7 Council Members">
  <img src="https://img.shields.io/badge/domains-9-0D9488.svg" alt="9 Domains">
  <img src="https://img.shields.io/badge/depth_levels-5-red.svg" alt="5 Depth Levels">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Claude_Code-5A67D8.svg" alt="Claude Code">
  <img src="https://img.shields.io/badge/platform-Claude_Cowork-5A67D8.svg" alt="Claude Cowork">
  <img src="https://img.shields.io/badge/dependencies-zero-brightgreen.svg" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/API_keys-none_required-brightgreen.svg" alt="No API Keys">
  <img src="https://img.shields.io/badge/OSINT_adapters-12-1E3A5F.svg" alt="12 OSINT Adapters">
  <img src="https://img.shields.io/badge/search_rounds-up_to_10-D97706.svg" alt="Search Rounds: Up to 10">
</p>

---

## The Problem

When you need to understand something consequential (a regulatory shift, a competitive field, a technical decision with real downstream costs) a single AI search gives you one angle, one framing, and one level of confidence. The answer sounds authoritative. You have no way to know if the top result was the only result checked, or whether anyone tried to break the finding before it reached you.

This is the information asymmetry problem. The AI that searched for you is also the AI that summarized, framed, and presented the findings. There was no adversarial check, no second opinion, no "what if this is wrong?" pressure applied before the conclusion landed in your lap.

The confidence problem compounds this. AI systems rarely distinguish between a claim supported by eight independent primary sources and a claim found in one blog post. Both can read with identical conviction. And because there is no adversarial testing layer, the system has no mechanism to discover what it missed, who is absent from the analysis, or which findings would collapse under basic scrutiny.

Seine exists because consequential decisions deserve better than a well-formatted single search.


## What This Is

Seine is a search orchestration engine that coordinates **20 specialized AI agents** to research questions thoroughly. Instead of a single search, Seine:

1. **Routes** your query to relevant domains (web, academic, OSINT, social)
2. **Triages** results with 3 gate agents that check completeness, quality, and gaps
3. **Deliberates** with a 7-member council providing diverse cognitive perspectives
4. **Researches** deeply with a phased pipeline: discovery, analysis, synthesis
5. **Renders** findings into prose with full source attribution and confidence scoring
6. **Humanizes** output through anti-slop filtering and voice styling

This plugin runs entirely inside Claude Code or Claude Cowork using built-in tools. **No external dependencies, no API keys, no shell scripts.**

---

## Features

<table>
<tr>
<td width="50%">

**Search Orchestration**
- 4 search domains (web, academic, OSINT, social)
- Reciprocal Rank Fusion across domain results
- 5 depth levels: skim, scan, dig, drill, siege
- Search craft KB with boolean operators and OSINT patterns

</td>
<td width="50%">

**Deliberative Council**
- 7-member council with distinct cognitive functions
- Triage gate (3 agents) for quality control
- Multi-round deliberation (R1 + R2 validation)
- Universal evidence vocabulary (SOLID/SOFT/SHAKY/UNKNOWN)

</td>
</tr>
<tr>
<td width="50%">

**Research Pipeline**
- Phased: Discovery -> Analysis -> Synthesis
- Validation gates between phases (PASS/FAIL)
- 7 research agents (hunter, scout, skeptic, referee, validator, adversarial-reviewer, confidence-quantifier)

</td>
<td width="50%">

**Output Layer**
- Mandatory Sources table with trust tiers
- Work Log documenting every pipeline stage
- Confidence Summary with per-claim scoring
- Anti-slop humanizer with 90%+ quality gate

</td>
</tr>
</table>

---

## What a Report Looks Like

A `drill`-depth run on EU AI Act vs. US AI regulation produced this (abridged):

```markdown
# EU AI Act vs US AI Regulation: Comparative analysis

> Pipeline: drill | 4 search rounds | 34 sources | 7 council members
> Evidence: SOLID (verified) | SOFT (single source) | SHAKY (weak) | UNKNOWN
> Artifacts: research/artifacts/eu-ai-act-vs-us-regulation-2026-03-02/

The EU AI Act classifies AI systems into four risk tiers [1] [Source-Critic: SOLID]:
unacceptable (banned outright), high-risk (strict compliance), limited (transparency
obligations), and minimal (no specific rules). Enforcement follows a phased timeline
from February 2025 through August 2027 [2].

The EU AI Act's GPAI 10^25 FLOPs threshold operates as a rebuttable presumption,
not a hard ceiling, but the adversarial reviewer found that the inverse burden of
proof makes practical rebuttal difficult, making it "operationally close to a hard
threshold." [4] [Adversarial: SOFT]

The Trump executive order's claim to preempt state AI laws was downgraded from SOFT
to SHAKY by the adversarial reviewer. The EO lacks self-executing legal authority.
California, Texas, and Colorado AI laws remain in effect. [6] [9] [Adversarial: SHAKY]

[Gate B Caveat: Pipeline quality score 0.683 (threshold: 0.75). Shortfall concentrated
in comparative US analysis and predictive claims. Structural EU findings averaged 0.93
(SOLID). Seine reports this honestly.]

## Sources & References
| # | Title | Trust | Cited By |
|---|-------|-------|----------|
| 1 | EUR-Lex: Regulation 2024/1689 | HIGH | hunter, skeptic, referee |
| 2 | EU AI Office: Implementation Timeline | HIGH | hunter, scout |
| 3 | Congressional Research Service: AI Legislation | HIGH | hunter, contrarian |

## Confidence Summary
| Claim | Label | Sources | Score |
|-------|-------|---------|-------|
| 4-tier risk classification | SOLID | 8 | 0.92 |
| Phased timeline Feb 2025-Aug 2027 | SOLID | 6 | 0.89 |
| No US federal comprehensive AI law | SOLID | 5 | 0.87 |
| Trump EO federal preemption | SHAKY | 3 | 0.34 |
| SME compliance cost $8-15M | SHAKY | 1 | 0.34 |
```

Every factual claim carries a `[N]` linking to a sourced entry. Council members who challenged or qualified a finding are cited inline with their evidence label. The confidence summary shows exactly how reliable each claim is, including the ones that did not hold.


## Use cases

**Regulatory compliance research** (`drill` / `siege`). When you need to understand how a regulation applies across multiple jurisdictions, a single search returns the headline rule and misses everything that matters: enforcement timelines, penalty structures, carve-outs, and how the rule interacts with existing law in each territory. Seine's OSINT adapters pull from official registries and legal databases, the Temporal council member tracks what has changed since the rule was proposed, and the Adversarial Reviewer applies pressure to any claim that rests on secondary sources rather than the regulation text itself.

**Competitive intelligence** (`dig` / `drill`). Mapping a market with a standard AI search produces a list of companies with whatever claims they publish about themselves. Seine cross-references those claims against independent sources through the Source Critic, routes OSINT adapters to pull corporate registry data and financial filings, and assigns confidence labels to each competitive claim. The Contrarian assumes every vendor claim is marketing until proven otherwise.

**Due diligence** (`drill` / `siege`). Entity research that matters requires checking more than a company's website. Seine's OSINT adapters cover EDGAR filings, OpenCorporates, LittleSis, OFAC sanctions lists, FEC campaign finance records, Companies House, court records, and Wikidata, running in parallel across all relevant domains. The final report shows exactly which adapters returned data, which returned nothing, and which findings rest on a single source versus multiple corroborating records.

**Technical architecture decisions** (`dig` / `drill`). Choosing between two technologies is easy when one is clearly better. The hard cases require understanding trade-offs that are not stated in any documentation. Seine routes academic and web domains in parallel, applies the Lateral Hunter to find analogous decisions in adjacent fields, and uses the Adversarial Reviewer to stress-test the strongest case for each option.

**Academic literature review** (`drill`). Seine's academic domain routes through arXiv and DBLP simultaneously, the Scout finds relevant work in adjacent fields, and the Skeptic runs negation queries to surface null results and replication failures alongside confirmatory findings.

**Fact-checking and verification** (`dig` / `drill`). Seine routes the claim through multiple independent domains, runs negation queries to find contradicting evidence, and produces a per-source confidence table with trust tiers. The Blind Spot council member asks who is absent from the analysis and whether the confirming sources share a common origin.

**Market entry analysis** (`siege`). Seine's siege depth runs multi-round convergence across OSINT, web, academic, and social domains. The full artifact directory produced at siege depth gives you a permanent, auditable record of every source consulted and every confidence score assigned.

**Grant and proposal research** (`drill`). Seine routes across academic and OSINT domains to build an evidence base, assigns confidence labels to each supporting claim, and surfaces counter-evidence that the proposal should address rather than ignore.

---

## Quick Start

### Install via Plugin Marketplace

```bash
/plugin marketplace add adambkovacs/seine-agentic-search-orchestrator-plugin
/plugin install seine
```

### Run your first search

```bash
# Quick scan (triage only)
/seine:seine-search "What are the latest developments in AI safety?" scan

# Deep analysis (triage + 7-member council)
/seine:seine-search "Impact of EU AI Act on startups" dig

# Full research (all 20 agents)
/seine:seine-research "Competitive landscape of AI code review tools"
```

---

## Installation

<details>
<summary><strong>Claude Code (Plugin Marketplace)</strong></summary>

```
/plugin marketplace add adambkovacs/seine-agentic-search-orchestrator-plugin
/plugin install seine
```

After installation, skills are available as:
```
/seine:seine-search "your query" dig
/seine:seine-council "your query"
/seine:seine-research "your query"
```
</details>

<details>
<summary><strong>Claude Code (Manual Install)</strong></summary>

Clone this repo and copy files into your project:

```bash
git clone https://github.com/adambkovacs/seine-agentic-search-orchestrator-plugin.git /tmp/seine-plugin

# Copy agents
cp /tmp/seine-plugin/agents/seine-*.md /path/to/your/project/.claude/agents/
mkdir -p /path/to/your/project/.claude/agents/seine-kb
cp /tmp/seine-plugin/agents/seine-kb/*.md /path/to/your/project/.claude/agents/seine-kb/

# Copy skills
for skill in seine-search seine-council seine-research; do
  mkdir -p /path/to/your/project/.claude/skills/$skill
  cp /tmp/seine-plugin/skills/$skill/SKILL.md /path/to/your/project/.claude/skills/$skill/
done
```
</details>

<details>
<summary><strong>Claude Cowork</strong></summary>

1. Navigate to **Plugins** in Claude Cowork settings
2. Search the marketplace for `seine` or add by repository URL:
   ```
   adambkovacs/seine-agentic-search-orchestrator-plugin
   ```
3. Click **Install**

Skills will be available in your Cowork sessions under the `seine` namespace.
</details>

<details>
<summary><strong>Manual Install (Any Claude Environment)</strong></summary>

Copy these directories into your project's `.claude/` folder:

| Source | Destination |
|--------|------------|
| `agents/seine-*.md` (20 files) | `.claude/agents/` |
| `agents/seine-kb/` (2 files) | `.claude/agents/seine-kb/` |
| `skills/seine-search/SKILL.md` | `.claude/skills/seine-search/SKILL.md` |
| `skills/seine-council/SKILL.md` | `.claude/skills/seine-council/SKILL.md` |
| `skills/seine-research/SKILL.md` | `.claude/skills/seine-research/SKILL.md` |
</details>

---

## Usage

### Three Skills

| Skill | Purpose | Depth |
|-------|---------|-------|
| `/seine:seine-search` | Multi-domain search with triage | Any (`skim` to `siege`) |
| `/seine:seine-council` | Deliberative council analysis | `dig`+ |
| `/seine:seine-research` | Full phased research pipeline | `drill`+ |

### Depth Guide

| Depth | Best For | Agents | Time |
|-------|----------|--------|------|
| `skim` | Quick fact checks | 0 | ~30s |
| `scan` | Surface-level overview | 3 (triage) | ~1-2min |
| `dig` | Thorough analysis | 10 (triage + council) | ~3-5min |
| `drill` | Deep investigation | 17 (+ research) | ~8-15min |
| `siege` | Exhaustive research | 20 (all, multi-round) | ~20-40min |

### Examples

```bash
# Quick scan
/seine:seine-search "Latest transformer architecture papers" scan

# Council deliberation for decisions
/seine:seine-council "Should we adopt GraphQL over REST for our API?"

# Deep research with full pipeline
/seine:seine-research "State of open-source LLMs for enterprise deployment"
```

---

## Skills reference

Seine exposes three composable skills. They form a pipeline: `seine-search` handles routing and fusion, `seine-council` handles deliberation and gap analysis, `seine-research` handles deep phased investigation. Each can be invoked independently or as part of the full pipeline.

---

### seine-search

**What it does.** Routes a query to 2-4 relevant domains, dispatches searches in parallel, fuses results using Reciprocal Rank Fusion, and runs triage. At `dig` depth and above, it writes structured artifacts to `research/artifacts/` and calls the downstream skills automatically.

**Invocation:**

```
/seine-search <query> [depth]
```

**Depth levels:**

| Depth | What runs | Artifacts |
|-------|-----------|-----------|
| `skim` | Route + fuse only | No |
| `scan` | + 3 triage agents | No |
| `dig` | + Full council (7 members) | Mandatory |
| `drill` | + Research pipeline | Mandatory |
| `siege` | + Research with opus models, multi-round convergence | Mandatory |

**Artifacts produced:**

```
research/artifacts/{slug}/
├── 00-query.json            # Routing decision and domain selection
├── 01-search-rounds/        # Per-domain results for each round
├── 02-fusion.json           # RRF-fused results with scores
├── 03-triage/               # Triage verdicts (at scan+)
research/final/{slug}.md     # Rendered output (at dig+)
```

**Returns:**

```json
{
  "results": [{ "title": "...", "url": "...", "snippet": "...", "domain": "...", "round": 1, "fusion_score": 0.0 }],
  "triage": { "completeness": {}, "quality": {}, "gaps": {} },
  "council": null,
  "timing": { "route_ms": 0, "dispatch_ms": 0, "fuse_ms": 0, "triage_ms": 0 }
}
```

**Decision table:**

| Use `seine-search` when... |
|---------------------------|
| You want a fast answer without deep analysis (`skim` or `scan`) |
| You need multi-domain results fused into a single ranked list |
| You want the full pipeline from a single invocation (use `drill` or `siege`) |
| You are not sure which skill to use. Start here and let triage escalate |

**Do not use `seine-search` when** you already have fused results and only want deliberation (use `seine-council` directly) or you have pre-processed results and only need the research phases (use `seine-research` directly).

---

### seine-council

**What it does.** Runs a deliberative council of 7 specialists on a set of search results. Each member has a distinct cognitive function: synthesizer, contrarian, lateral-hunter, source-critic, pattern-spotter, blind-spot, temporal. Members run in parallel in Round 1. The synthesizer consolidates in Round 2. At `dig` depth, a targeted research pass fills gaps identified in R1 before R2 runs.

**Invocation:**

```
/seine-council triage   <query> <results_json>
/seine-council deliberate <query> <results_json>
```

**Depth levels:**

| Mode | Agents | When it runs |
|------|--------|-------------|
| `triage` | 3 agents (completeness, quality, gaps) | Quick quality gate, triggered by `seine-search` on flag |
| `deliberate` | 7 members + R2 synthesis | `dig` depth and above |

**Artifacts produced:**

```
{artifact_dir}/03-triage/          # completeness.json, quality.json, gaps.json
{artifact_dir}/04-council-r1/      # All 7 member outputs
{artifact_dir}/06-council-r2/      # R2 validation outputs (if R2 runs)
```

**Returns:**

```json
{
  "mode": "deliberate",
  "query": "...",
  "round1": { "synthesizer": {}, "contrarian": {}, "lateral-hunter": {},
              "source-critic": {}, "pattern-spotter": {}, "blind-spot": {}, "temporal": {} },
  "synthesis": { "summary": "...", "findings": [...], "verdict": "pass|flag" }
}
```

**Council members reference:**

| Member | What they do |
|--------|-------------|
| synthesizer | Integrates across sources, builds narrative |
| contrarian | Adversarial stress-test ("prove it") |
| lateral-hunter | Finds analogies and signals from adjacent domains |
| source-critic | Assesses provenance, authority, and bias |
| pattern-spotter | Identifies cross-domain trends and contradictions |
| blind-spot | Flags missing perspectives and unasked questions |
| temporal | Analyzes time trajectory (rising, declining, stable) |

**Decision table:**

| Use `seine-council` when... |
|----------------------------|
| You have search results and want multi-perspective analysis without re-running the search |
| You want a quick quality gate on a result set (`triage` mode) |
| You want adversarial challenge on a specific claim before presenting it |
| You need attribution in the output ("this finding was challenged by the contrarian") |

**Do not use `seine-council` when** you need original evidence gathered (use `seine-search` or `seine-research`) or you only need a single synthesized answer without dissenting perspectives.

---

### seine-research

**What it does.** Runs a phased research pipeline on a query and its prior search results. Three phases (Discovery, Analysis, Synthesis) run sequentially with gate checks between each. All 7 research agents output the ADR-S007 6-block JSON schema: scope, findings, counter\_evidence, confidence\_table, gaps, sources.

**Invocation:**

```
/seine-research <query> [depth]
```

Requires `drill` or `siege` depth. `skim`, `scan`, and `dig` are handled by `seine-search` + `seine-council`.

**Depth levels:**

| Depth | Model | Use when |
|-------|-------|---------|
| `drill` | sonnet | Standard deep research |
| `siege` | opus | Maximum rigor, multi-round convergence |

**Pipeline:**

```
Phase A (Discovery)    hunter + scout        → Evidence map + adjacent signals
    ↓ Gate A           validator             → PASS / PASS_WITH_NOTES / FAIL
Phase B (Analysis)     skeptic + referee     → Claim challenges + conflict resolution
    ↓ Gate B           validator             → PASS / PASS_WITH_NOTES / FAIL
Phase C (Synthesis)    adversarial-reviewer  → Red-team analysis
                       confidence-quantifier → Calibrated confidence scores
```

Gate failure at either gate A or gate B stops the pipeline immediately and returns a `stopped_at` field with partial artifacts intact for inspection.

**Artifacts produced:**

```
{artifact_dir}/05-research/
├── phase-a-hunter.json
├── phase-a-scout.json
├── gate-a.json
├── phase-b-skeptic.json
├── phase-b-referee.json
├── gate-b.json
├── phase-c-adversarial.json
└── phase-c-confidence.json
{artifact_dir}/07-sources.json     # Deduplicated master source list
{artifact_dir}/08-timeline.json    # Per-phase timing
```

**Returns:**

```json
{
  "stopped_at": null,
  "research": {
    "phase_a": { "hunter": {}, "scout": {} },
    "gate_a":  { "verdict": "PASS", "notes": "..." },
    "phase_b": { "skeptic": {}, "referee": {} },
    "gate_b":  { "verdict": "PASS_WITH_NOTES", "notes": "..." },
    "phase_c": { "adversarial": {}, "confidence": {} }
  },
  "timing": { "research_ms": 0 }
}
```

**Decision table:**

| Use `seine-research` when... |
|-----------------------------|
| You need calibrated confidence scores per finding (Phase C output) |
| You want adversarial red-teaming of a research position |
| You need a full audit trail of how each claim was challenged and resolved |
| You are at `drill` or `siege` depth and have already completed the council round |
| You want the research to stop cleanly if quality gates fail, rather than producing low-confidence output |

**Do not use `seine-research` when** you need the initial search and fusion step (use `seine-search`) or you only want deliberative commentary without structured evidence mapping (use `seine-council`).


### Architecture references

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full pipeline specification, agent schemas, depth behavior tables, JSON output formats, and artifact directory structure.

See [docs/EVIDENCE-VOCABULARY.md](docs/EVIDENCE-VOCABULARY.md) for the evidence vocabulary formula, source quality tiers, recency tiers, and composite-to-label mapping.

See [agents/seine-kb/SEARCH-CRAFT.md](agents/seine-kb/SEARCH-CRAFT.md) for the search craft knowledge base (boolean operators, OSINT sub-adapter patterns, counter-evidence query construction, and WebFetch rules).

---

## Domains

| Domain | Description | Method | Sources |
|--------|-------------|--------|---------|
| **web** | General web search | `WebSearch` | Any web content |
| **academic** | Academic papers | `WebSearch` + site qualifiers | arXiv, DBLP, Semantic Scholar |
| **osint** | Open-source intelligence | `WebSearch` + specialized queries | EDGAR, OpenCorporates, Wikidata, LittleSis, OFAC, FEC, and more |
| **social** | Social media | `WebSearch` + platform targeting | Twitter/X, Reddit, LinkedIn |

The search craft knowledge base ([`agents/seine-kb/SEARCH-CRAFT.md`](agents/seine-kb/SEARCH-CRAFT.md)) includes:
- Boolean operators and exact phrase matching
- Site-restriction patterns for 13 OSINT sub-adapters
- Counter-evidence query construction
- Query expansion strategies and synonym tables
- WebFetch best practices and limitations

---

## Search craft

Seine's search layer is not a wrapper around a single web search call. It applies structured query construction, counter-evidence generation, multi-round gap filling, and source trust classification before any analytical agent sees a result.

### Boolean query construction

Every query is decomposed into at minimum three variants: a direct query, an angle shift, and a counter-evidence query. Direct queries use exact phrase matching and domain restriction to maximize signal-to-noise. Angle shifts reframe the same question from a different perspective (hiring signals instead of press releases, regulatory filings instead of company blogs). Counter-evidence queries are covered in the next section.

**Exact phrase matching** pins the query to specific terminology rather than relying on keyword proximity:

```
"EU AI Act Article 4" site:eur-lex.europa.eu
"GPAI" "systemic risk" "10^25 FLOPs" site:artificialintelligenceact.eu
"switched away from Notion" -site:reddit.com -"sponsored"
```

**Domain restriction** routes queries to authoritative sources by source type:

```
site:arxiv.org "foundation model" "compute budget" 2026
site:sec.gov "Delivery Hero" "risk factors"
site:(europa.eu OR eur-lex.europa.eu) "AI Act" compliance
```

**Exclusion patterns** strip tutorial content, ads, and low-signal results:

```
"AI training provider" -site:reddit.com -site:quora.com -"how to" -free -tutorial
"AI regulation" -"sponsored" -"advertisement" after:2025
```

**Temporal operators** bound results to the relevant window:

```
"AI regulation" after:2025-06-01 before:2026-01-01
"GPAI foundation model" after:2025-01-01 site:europa.eu
```

**Boolean grouping** handles synonym families and nested conditions:

```
("artificial intelligence" OR "machine learning") (training OR upskilling OR enablement)
site:(sec.gov OR europa.eu) ("AI Act" OR "artificial intelligence") (compliance OR regulation)
```

**Proximity operators** find co-occurrence within a window rather than requiring adjacency:

```
"Delivery Hero" AROUND(3) "AI training"
```

**Wildcard expansion** catches variant titles and roles:

```
"VP of * at Delivery Hero"
```

### Counter-evidence queries

Every strong claim the search pipeline surfaces is followed by a deliberate negation query. This is not optional at `dig` depth or above. The purpose is to find sources that would cause a claim to fail before the council sees it.

The negation pattern maps directly to the claim structure:

```
Claim: "X is growing"       → "[X] declining" OR "[X] stagnant" OR "[X] saturated"
Claim: "X is the best"      → "[X] worst" OR "[X] overrated" OR "[ALTERNATIVE] better than [X]"
Claim: "market is $Xbn"     → "[MARKET] smaller than" OR "[MARKET] overstated"
Claim: "Z is innovative"    → "[Z] nothing new" OR "[Z] already exists"
Claim: "customers want Y"   → "[Y] unnecessary" OR "nobody needs [Y]" OR "[Y] overhyped"
```

Applied to a real research question ("Is Delivery Hero investing in AI training?"):

```
# Query 1 (direct)
"Delivery Hero" "AI training" OR "AI upskilling" 2026

# Query 2 (angle shift: hiring signals)
"Delivery Hero" site:linkedin.com/jobs "machine learning" OR "AI" Berlin

# Query 3 (counter-evidence)
"Delivery Hero" "cost cutting" OR "layoffs" OR "restructuring" 2026
```

Competitor and product intelligence follows the same pattern:

```
"[COMPETITOR] problem" OR "issue" OR "frustrated"
"cancelled [COMPETITOR]" OR "leaving [COMPETITOR]" OR "alternative to [COMPETITOR]"
"[COMPETITOR] review" site:g2.com
```

The contrarian council member will flag any finding that lacks a corresponding counter-evidence search. Claims that survive negation queries receive SOLID evidence labeling; claims that only have supporting evidence are capped at SOFT until corroborated.

### Multi-round search

Seine treats search as a spiral, not a single pass. The depth level controls how many rounds run and what triggers additional rounds.

```
Round 1: Direct queries → establish baseline understanding
Round 2: Follow-up on gaps from Round 1 → deepen
Round 3: Counter-evidence → challenge findings
Round 4: Adjacent domains → find what you didn't know to look for
Round 5: Temporal → how has this changed over time?
```

After the initial dispatch, triage agents run in parallel on the fused results. If any triage agent returns `verdict: "flag"`, the gaps agent specifies what additional search is needed. The council's R1 round surfaces further gaps; targeted research agents then fill those gaps before R2 runs. At `siege` depth, this loop repeats until convergence (capped at 10 rounds).

Artifacts from each round are written to the artifact directory (`01-search-rounds/round-{N}-{domain}.json`), so every search iteration is traceable and auditable after the fact.

### WebFetch extraction rules

`WebFetch` summarizes content through an AI model and returns a condensed output, not the raw page text. This means 90%+ of detail is lost unless the extraction prompt is narrow and targeted.

Seine applies these rules when fetching specific URLs found in search results:

- Use `WebFetch` only when extracting specific facts from a known URL, not for raw text capture.
- The prompt must be concrete: "Extract the pricing tiers and their features" produces usable output; "summarize this page" does not.
- Ask for structured output: "List all board members with their titles" is far more recoverable than open-ended extraction.
- Chain `WebSearch` first to find URLs, then use `WebFetch` for targeted deep-dives on the most relevant ones.
- Handle failures explicitly: paywalls, login walls, and Cloudflare blocks return nothing. Note the URL in the provenance chain even when content extraction fails.
- For raw text (Google Docs, PDFs, full article bodies), use `curl -sL` instead of `WebFetch`.

URLs recorded during WebFetch always appear in the sources list with `retrieved_at` timestamps, even when extraction is partial.

### Source quality assessment during search

Trust tiers are assigned at query time, not deferred to the council. Each result is tagged with a tier based on source type as it enters the pipeline:

| Source type | Trust tier | Evidence ceiling |
|-------------|-----------|-----------------|
| Government (.gov), peer-reviewed journals | HIGH | Can support SOLID |
| Major news (Reuters, Bloomberg), official company pages | MEDIUM-HIGH | Supports SOLID with corroboration |
| Industry reports, reputable blogs | MEDIUM | Supports SOFT |
| Reddit, forums, unvetted blogs | LOW | SHAKY at best |
| Anonymous, no attribution | DISQUALIFIED | UNKNOWN |

These tiers feed directly into the confidence formula applied at Phase C of the research pipeline:

```
confidence = (evidence × 0.40) + (source_quality × 0.25) + (recency × 0.20) + (agreement × 0.15)
```

The `source-critic` council member can override any tier assignment. If the source-critic changes a tier, that assessment takes precedence over all research agents in the final source list.

Recency is also assessed at retrieval time: CURRENT (under 30 days), RECENT (30-180 days), DATED (180-365 days), STALE (over 365 days). Stale sources from authoritative domains still qualify as HIGH trust but carry a recency penalty in the confidence score.

---

---

## Artifact Output

At `dig` depth and above, every query creates a persistent, auditable artifact directory:

```
research/artifacts/{query-slug}-{date}/
├── 00-query.json              # Routing decision + domains selected
├── 01-search-rounds/          # Per-domain raw results
├── 02-fusion.json             # RRF-fused results with scores
├── 03-triage/                 # 3 triage verdicts
├── 04-council-r1/             # 7 council member outputs
├── 05-research/               # Research phase outputs + gates
├── 06-council-r2/             # R2 outputs (if run)
├── 07-sources.json            # Deduplicated master source list
└── 08-timeline.json           # Per-stage timing
```

Final rendered output: `research/final/{slug}.md`

---

## Evidence Vocabulary

All agents use a universal 4-level evidence system:

| Label | Meaning | Score |
|-------|---------|-------|
| **SOLID** | Multiple independent sources, no contradictions | 1.0 |
| **SOFT** | Single credible source or indirect evidence | 0.6 |
| **SHAKY** | Single biased source or conflicting evidence | 0.3 |
| **UNKNOWN** | Insufficient evidence to assess | 0.0 |

**Confidence formula:** `(evidence x 0.40) + (source_quality x 0.25) + (recency x 0.20) + (agreement x 0.15)`

See [docs/EVIDENCE-VOCABULARY.md](docs/EVIDENCE-VOCABULARY.md) for source quality tiers and recency definitions.

---

## How Seine prevents hallucination

There is no single "fact checker" agent. Instead, six overlapping verification mechanisms create structural pressure against ungrounded claims at every pipeline stage.

**Source-level verification.** The Source Critic council member scrutinizes every source's credibility, recency, funding, and agenda before any claim is built on it. Sources receive trust tiers (HIGH, MEDIUM, LOW, DISQUALIFIED). When the evidence base rests on sources with conflicting incentives, the Source Critic flags it before synthesis begins.

**Adversarial negation.** The Contrarian council member and the Skeptic research agent both construct the case *against* each finding. The Contrarian assumes the top result is wrong and works backward. The Skeptic runs negation queries and actively builds counter-evidence. Claims that survive both agents earn higher confidence. Claims that collapse are downgraded or excluded from the final report.

**Conflict resolution.** When agents disagree, the Referee issues binding verdicts with explicit source quality comparisons. Disagreement is surfaced in the output, not buried. If Hunter says X and Skeptic says not-X, the Referee's resolution appears in the prose with attribution.

**Red-team synthesis.** The Adversarial Reviewer applies a 5-step protocol to every major finding: steelman the conclusion, attack it, negate it, name concrete failure scenarios, then classify the correction as upheld, qualified, downgraded, or rejected.

**Calibrated confidence.** The Confidence Quantifier scores every claim using the weighted formula: `(evidence x 0.40) + (source_quality x 0.25) + (recency x 0.20) + (agreement x 0.15)`. A claim scored 0.34 reads differently from a claim scored 0.89, and the reader can see exactly why.

**Pipeline gates.** The Validator agent runs at Gate A and Gate B. If the aggregate confidence falls below threshold, the pipeline stops. Seine will tell you "the evidence is insufficient" rather than producing confident-sounding prose on weak foundations.

The net effect: no single agent's judgment is trusted. Every claim must survive independent discovery, adversarial analysis, conflict resolution, red-team attack, and calibrated scoring before it reaches the output layer.

---

## Agent Inventory

<table>
<tr><th>Category</th><th>Count</th><th>Agents</th></tr>
<tr><td><strong>Orchestrator</strong></td><td>1</td><td><code>researcher</code></td></tr>
<tr><td><strong>Output</strong></td><td>2</td><td><code>output-renderer</code> <code>humanizer</code></td></tr>
<tr><td><strong>Triage</strong></td><td>3</td><td><code>completeness</code> <code>quality</code> <code>gaps</code></td></tr>
<tr><td><strong>Council</strong></td><td>7</td><td><code>synthesizer</code> <code>contrarian</code> <code>lateral-hunter</code> <code>source-critic</code> <code>pattern-spotter</code> <code>blind-spot</code> <code>temporal</code></td></tr>
<tr><td><strong>Research</strong></td><td>7</td><td><code>hunter</code> <code>scout</code> <code>skeptic</code> <code>referee</code> <code>validator</code> <code>adversarial-reviewer</code> <code>confidence-quantifier</code></td></tr>
<tr><td><strong>Total</strong></td><td><strong>20</strong></td><td></td></tr>
</table>

Plus 2 knowledge base files and 3 skills.

---

## Agent deep-dives

<details>
<summary><strong>Triage agents (3)</strong>: Completeness, Quality, Gaps</summary>

These three agents run at `scan` depth and above, in parallel, immediately after result fusion. Their job is to decide whether the evidence base is worth analyzing before any deeper agents are invoked. A single flag from any of them can trigger additional search rounds or escalate to the full council. They are the cheapest insurance in the pipeline.

---

### Completeness

**TLDR: Checks whether all relevant search domains were queried before deeper analysis begins.**

**What it produces:**

```json
{
  "agent": "completeness",
  "verdict": "pass|flag",
  "reason": "explanation",
  "action": null | { "type": "search_domain", "domain": "name", "subquery": "refined query" }
}
```

**Unique behavior.** Completeness reads the domain registry from the knowledge base (`REFERENCE.md`) and compares it against the `domains_searched` field in the incoming context. It does not evaluate the quality of results. It asks one question: given this query, are there domains that should have been searched but were not? For a query about academic benchmarking that skipped the `academic` domain, Completeness will flag it and return an action pointing to the specific domain and a refined sub-query. It does not invent domains; it works from a fixed registry of: `academic`, `web`, `memory`, `osint`, `social`, `intel`, `entity`, `crm`, `vision`.

**Example output snippet:**
```json
{
  "agent": "completeness",
  "verdict": "flag",
  "reason": "Query is about SEC filings but 'osint' domain (which covers EDGAR) was not searched.",
  "action": { "type": "search_domain", "domain": "osint", "subquery": "Delivery Hero 10-K SEC annual report 2025" }
}
```

---

### Quality

**TLDR: Checks whether the top-ranked results actually answer the stated query, not just match its keywords.**

**What it produces:**

```json
{
  "agent": "quality",
  "verdict": "pass|flag",
  "reason": "explanation",
  "action": null | { "type": "refine_query", "subquery": "better query text" }
}
```

**Unique behavior.** Quality looks at topical relevance versus answer relevance. A result can match the query's keywords and still fail to answer the question. Quality specifically checks for results that are too generic (e.g., a landing page returned for a compliance question), too narrow (a single jurisdiction's rules returned for a multi-jurisdictional question), or where the snippet text implies the full page is tangential. When it flags, the action is always a `refine_query` type with a more specific sub-query, not a new domain search. This separates it from Completeness, which handles domain gaps, and Gaps, which handles absence of perspective.

**Example output snippet:**
```json
{
  "agent": "quality",
  "verdict": "flag",
  "reason": "Top 4 results are all EU AI Act summaries from marketing blogs, not compliance guidance. None address the specific question about SME obligations.",
  "action": { "type": "refine_query", "subquery": "EU AI Act SME obligations Article 9 compliance steps 2025" }
}
```

---

### Gaps

**TLDR: Identifies what is conspicuously absent from the results: missing perspectives, populations, timeframes, and geographies.**

**What it produces:**

```json
{
  "agent": "gaps",
  "verdict": "pass|flag",
  "reason": "explanation",
  "action": null | { "type": "search_domain", "domain": "name", "subquery": "query for missing content" }
}
```

**Unique behavior.** Gaps looks at what is not in the results rather than what is. It evaluates five absence types: missing perspectives (no opposing viewpoints), important subtopics not covered, missing timeframes (only old results, or only very recent), geographic or demographic blind spots, and key organizations or people who should appear but do not. A flag from Gaps triggers escalation to the full council rather than just a search refinement. This reflects its role as the highest-stakes triage agent: systematic absence is a structural problem, not a query problem. It is the only triage agent whose flag can directly route the pipeline to council deliberation.

**Example output snippet:**
```json
{
  "agent": "gaps",
  "verdict": "flag",
  "reason": "All 8 results represent the vendor perspective. No independent regulator, civil society, or affected-party sources appear in the result set.",
  "action": { "type": "search_domain", "domain": "web", "subquery": "EU AI Act criticism civil society NGO response 2025" }
}
```

</details>

<details>
<summary><strong>Council agents (7)</strong>: Contrarian, Lateral Hunter, Blind Spot, Temporal, Source Critic, Pattern Spotter, Synthesizer</summary>

The council runs at `dig` depth and above. All seven members analyze the fused results in parallel. None sees another member's output before forming its own. Each has a fixed cognitive role, a fixed output schema, and a distinct definition of what "flag" means. A single flag from any member can trigger a second council round (R2) with additional targeted research inserted between rounds.

All seven members output the same JSON envelope:

```json
{
  "member": "<name>",
  "findings": [
    { "type": "endorsement|challenge|gap|pattern|recommendation", "target_rank": null,
      "detail": "...", "evidence_label": "SOLID|SOFT|SHAKY|UNKNOWN", "action": null }
  ],
  "summary": "2-3 sentence overall assessment",
  "verdict": "pass|flag"
}
```

---

### Contrarian

**TLDR: Assumes the top result is wrong and builds the strongest case against it before considering any endorsement.**

**What it produces.** The standard council schema above, with findings typed as `challenge`, `endorsement` (only after surviving attack), or `gap`. Evidence labels reflect adversarial pressure rather than source quality alone: SOLID means it survived attack from multiple angles; SHAKY means it cracked under basic scrutiny.

**Unique behavior.** The Contrarian's process is fixed: attack the top result first, find internal contradictions between results, apply "so what?" to every finding (does it actually answer the query?), and identify results that are technically correct but useless. It only endorses after trying and failing to break a claim. When the top results are all from the same source family (monoculture sourcing), it flags regardless of individual result quality. It reads the Search Craft guide specifically for counter-evidence query patterns, so its challenges are backed by actively searched disconfirming sources, not just skeptical framing.

**Example output snippet:**
```json
{
  "member": "contrarian",
  "findings": [
    { "type": "challenge", "detail": "Result #1 cites $8-15M SME compliance cost. Source is a vendor whitepaper with no methodology disclosed. Searched 'EU AI Act SME compliance cost independent study 2025' and found no corroborating primary source. Verdict: SHAKY.", "evidence_label": "SHAKY" }
  ],
  "summary": "Three of five top results rest on vendor-sourced figures with no independent corroboration. The structural EU risk tier classification (4 tiers) held under pressure from three angles — that finding is SOLID. Cost estimates did not survive basic scrutiny.",
  "verdict": "flag"
}
```

---

### Lateral Hunter

**TLDR: Searches adjacent fields and structural analogies to find insights that domain-specific searches miss by design.**

**What it produces.** Standard council schema, with findings typed as `recommendation` (specific adjacent domain to search) or `pattern` (structural analogy found and validated). Evidence labels map to how well the analogy holds: SOLID means multiple parallel-domain sources validate the analogy; SHAKY means only a surface-level structural match was found.

**Unique behavior.** The Lateral Hunter audits which domains were searched, then looks for the originating field: which discipline originally solved this class of problem? It generates structural analogies from biology, physics, economics, linguistics, and game theory, then probes them with actual `WebSearch` calls before reporting. Its recommendations must be specific: "search evolutionary game theory for iterated cooperation models" not "search biology." It flags when all citations come from the same discipline (monoculture sourcing as a risk signal). It is particularly valuable for questions at the frontier of a field, where the relevant prior art exists under a different name in a different domain.

**Example output snippet:**
```json
{
  "member": "lateral-hunter",
  "findings": [
    { "type": "recommendation", "detail": "AI compliance cost estimation is structurally analogous to pharmaceutical GMP compliance in 2002-2005. That literature (FDA 21 CFR Part 11) contains validated SME cost models. Searched 'pharmaceutical GMP compliance cost SME validated models 2003' and found 3 relevant studies. Recommend: search 'FDA 21 CFR Part 11 SME compliance cost framework' as a calibration anchor.", "evidence_label": "SOFT" }
  ],
  "summary": "Current results are confined to EU legal commentary. The compliance economics literature exists primarily in pharma and financial services, where analogous frameworks were implemented 20 years earlier.",
  "verdict": "flag"
}
```

---

### Blind Spot

**TLDR: Asks what questions nobody asked, which populations are absent, and whether the results are answering the right question.**

**What it produces.** Standard council schema, with findings typed as `gap` (systematic absence) or `recommendation` (how to address it). Evidence labels reflect how clearly the absence is structural versus incidental: SOLID means the absence is systematic and structurally important; SHAKY means it is speculative and possibly intentional.

**Unique behavior.** Blind Spot works from five absence types: population (whose voice is missing?), time (is a historical or future dimension unexamined?), discipline (what field would see this completely differently?), scale (macro vs. micro), and incentive (who benefits from the current framing?). It specifically challenges shared premises: what do ALL results agree on that nobody questioned? It asks the unasked question: what is the real question hiding behind the stated one? It also checks scope: are the results answering the query, or a convenient nearby version of it? This is the agent most likely to surface the frame problem, not just the content problem.

**Example output snippet:**
```json
{
  "member": "blind-spot",
  "findings": [
    { "type": "gap", "detail": "All 7 results assume compliance is a cost to minimize. No result examines compliance as a competitive signal or procurement requirement. The question 'who benefits from being first-compliant?' has not been asked. Missing perspective: procurement teams at large enterprises evaluating AI vendors.", "evidence_label": "SOLID" }
  ],
  "summary": "The result set is answering 'how do we comply with minimum cost?' rather than the more strategically useful question 'how do early movers use compliance for differentiation?' The population of enterprise procurement decision-makers is entirely absent.",
  "verdict": "flag"
}
```

---

### Temporal

**TLDR: Maps the topic's trajectory over time, names the life stage (emerging, growing, peaking, declining, disrupted), and flags stale results in fast-moving fields.**

**What it produces.** Standard council schema, with findings typed as `pattern` (trajectory finding) or `challenge` (stale result flag). Evidence labels reflect temporal data quality: SOLID requires multiple dated sources across distinct periods; SHAKY means a single time point or undated majority.

**Unique behavior.** Temporal reads publication dates before content. It treats every result as a data point on a timeline, not a static fact. It maps trajectory chronologically, classifies the topic's life stage from the evidence, and flags results older than 18 months in fast-moving fields with an explicit caveat. Its specificity rule is strict: it always names specific years ("2023-2024 results show X, while 2022 results assumed Y"), never "recent results" or "older research." It identifies leading indicators (early results that predicted current state). In fast-moving domains like AI regulation or foundation model benchmarks, Temporal's output often triggers a full council R2 because its age-based downgrades change the evidence labels on findings other members built.

**Example output snippet:**
```json
{
  "member": "temporal",
  "findings": [
    { "type": "challenge", "detail": "Results #3 and #4 cite GPAI compliance guidance from 2023. The EU AI Office issued updated guidance in Q1 2025 that supersedes the 2023 framing. These results should be marked STALE and weighted accordingly.", "evidence_label": "SHAKY" },
    { "type": "pattern", "detail": "Topic life stage: GROWING. Volume of compliance-focused content accelerated from ~12 publications/month (2023) to ~47/month (2025). Framing shifted from 'theoretical risk' to 'operational implementation' between 2024 and 2025.", "evidence_label": "SOLID" }
  ],
  "summary": "Two of seven top results are materially outdated. Excluding them, the trajectory is clearly growth-stage with operational framing dominant from mid-2024 onward.",
  "verdict": "flag"
}
```

---

### Source Critic

**TLDR: Scrutinizes every source's credibility, recency, authority, and conflict of interest before any claim is built on it.**

**What it produces.** Standard council schema, with findings typed as `challenge` (source problem) or `endorsement` (source cleared). Uses the trust tier system: HIGH (peer-reviewed, named author, dated, primary source), MEDIUM (reputable secondary, dated, accountable author), LOW (blog, undated, anonymous), DISQUALIFIED (unverifiable origin, fabricated citation, AI-generated slop).

**Unique behavior.** Source Critic reads bylines and publication dates before reading content. It checks source type, recency (undated = SHAKY minimum, no exceptions), author credentials and institution, citation depth (is this primary research or secondary reporting?), and conflicts of interest including funding sources and vendor affiliation. It flags when the top results are all from the same source family even if each individual source appears credible. Its trust tier assignments directly feed the Confidence Quantifier's `source_quality` dimension in Phase C, so Source Critic's verdicts have downstream numerical consequences on every final confidence score.

**Example output snippet:**
```json
{
  "member": "source-critic",
  "findings": [
    { "type": "challenge", "detail": "Result #2: 'EU AI Act Compliance Cost Report' — published by TechVendorCo, undated landing page, no named author. Conflicts of interest: vendor sells compliance automation software. Trust tier: LOW. Evidence label downgraded to SHAKY regardless of claim content.", "evidence_label": "SHAKY" },
    { "type": "endorsement", "detail": "Result #1: EUR-Lex Regulation (EU) 2024/1689, official primary source, dated 12 July 2024, no conflict of interest. Trust tier: HIGH.", "evidence_label": "SOLID" }
  ],
  "summary": "3 of 7 top results are vendor-produced with undisclosed methodology. 1 is a peer-reviewed primary source. The evidence base for cost figures is LOW tier; the evidence base for regulatory text is HIGH tier.",
  "verdict": "flag"
}
```

---

### Pattern Spotter

**TLDR: Builds a frequency map across all results, surfaces convergence and contradiction, and quantifies how many sources support each distinct claim.**

**What it produces.** Standard council schema, with findings typed as `pattern` (convergence or contradiction found). Uses a strict quantification rule: "4 of 8 results cite X", never "several results suggest." Evidence labels reflect cross-domain corroboration: SOLID requires 3+ independent sources from different domains; SHAKY is a single occurrence.

**Unique behavior.** Pattern Spotter reads the entire result set before speaking. It builds a frequency map: for each distinct claim, how many results support it? It surfaces convergence (themes appearing in 3+ results from different domains) and contradictions (specific result ranks where claims conflict, cited by number). It identifies trend direction: is the field moving toward or away from this claim? It flags outliers that don't fit any cluster, noting these could be noise or early signal. When using `WebSearch` to extend analysis, it includes new results in its counts. The quantification discipline is what differentiates Pattern Spotter from the Synthesizer: Pattern Spotter measures; Synthesizer interprets.

**Example output snippet:**
```json
{
  "member": "pattern-spotter",
  "findings": [
    { "type": "pattern", "detail": "4 of 8 results (academic ×2, web ×2) independently confirm a 4-tier EU AI Act risk classification. Convergent across domains: SOLID.", "evidence_label": "SOLID" },
    { "type": "pattern", "detail": "Contradiction: Results #3 and #6 directly conflict on GPAI threshold — #3 states 10^25 FLOPs as a hard ceiling, #6 states it is a rebuttable presumption. Sources are secondary reports from different law firms. Neither cites the regulation text directly.", "evidence_label": "SHAKY" }
  ],
  "summary": "Strong convergence on tier classification (4 sources, cross-domain). Active contradiction on GPAI threshold interpretation. 1 outlier result (#7) discusses AI liability rather than compliance — possible noise, but could indicate a related regulatory track.",
  "verdict": "flag"
}
```

---

### Synthesizer

**TLDR: Finds the unifying thread across all domains, names the connecting principle in one sentence, and flags disconnected results that do not fit the narrative.**

**What it produces.** Standard council schema, with findings typed as `endorsement` (convergent signal), `challenge` (productive tension requiring higher-level frame), `gap` (result that doesn't fit), or `recommendation` (synthesis action). Scales with depth: at `scan`, 1-2 findings from the top 3 results; at `siege`, 8+ findings from an exhaustive read.

**Unique behavior.** The Synthesizer runs last within each council round by design. It is the integrator. It identifies the 2-3 strongest signals across all domains, looks for convergence (where multiple domains independently point to the same answer), and where results conflict, constructs a higher-level frame that holds the tension without collapsing it. It names the unifying principle in one sentence. It flags results that don't fit the narrative, which is as important as flagging weak results. Unlike Pattern Spotter (which counts) and Contrarian (which attacks), the Synthesizer builds. Its summary is the input the output renderer uses to open the prose body. It can use `WebSearch` to actively verify claims, making it a discovery agent as well as an integration agent.

**Example output snippet:**
```json
{
  "member": "synthesizer",
  "findings": [
    { "type": "endorsement", "detail": "The unifying principle: EU AI Act compliance is fundamentally a documentation and process audit challenge, not a technical capability gap. 5 sources across academic, web, and official domains converge on this framing.", "evidence_label": "SOLID" },
    { "type": "gap", "detail": "Result #7 (AI liability discussion) does not fit the compliance framing. It may represent a distinct regulatory track. Flagging for targeted research in council R2.", "evidence_label": "SOFT" }
  ],
  "summary": "The evidence converges on compliance as a process audit problem. Cost variation in the results is explained by scope differences (technical vs. full organizational compliance), not contradictory data. One result points to an adjacent liability track that warrants a separate research thread.",
  "verdict": "flag"
}
```

</details>

<details>
<summary><strong>Research pipeline agents (8)</strong>: Hunter, Scout, Validator (Gates A and B), Skeptic, Referee, Adversarial Reviewer, Confidence Quantifier</summary>

The research pipeline runs at `drill` depth and above. It is a three-phase sequence with validation gates between phases. All agents in the same phase run in parallel. Phases cannot be skipped and gates cannot be bypassed. Every research agent output follows the ADR-S007 schema with 6 mandatory blocks: `scope`, `findings`, `counter_evidence`, `confidence_table`, `gaps`, `sources`.

---

### Orchestrator: seine-researcher

**TLDR: Coordinates the full phased pipeline, generates the artifact directory, and routes between skills, research agents, and output agents.**

**What it produces.** A complete artifact directory at `research/artifacts/{slug}/`, a rendered document at `research/artifacts/{slug}/08-rendered.md`, a humanized final document at `research/artifacts/{slug}/09-humanized.md`, and a copy at `research/final/{slug}.md`.

**Unique behavior.** The orchestrator is the only agent that runs on Opus. All other agents run on Sonnet. Its first act on any query is to generate a URL-safe slug and create the artifact directory structure before invoking any skill or spawning any agent. It generates the slug deterministically: lowercase, non-alphanumeric to hyphens, deduplicated, truncated at 60 characters at the last hyphen, then `{YYYY-MM-DD}` appended. It passes `artifact_dir` to every spawned agent so every intermediate output is persisted. It reads gate results and stops the pipeline immediately on FAIL rather than silently continuing. It can invoke the three skills (`/seine-search`, `/seine-council`, `/seine-research`) for structured runs or spawn agents directly for the manual pipeline path.

**Example output snippet (from `00-query.json`):**
```json
{ "query": "How is Delivery Hero investing in AI training?",
  "slug": "how-is-delivery-hero-investing-in-ai-training-2026-03-02",
  "depth": "drill",
  "created": "2026-03-02T09:14:22Z" }
```

---

### Hunter (Phase A)

**TLDR: Builds the strongest possible evidence base by extracting every discrete claim from the results, clustering them, and assessing each cluster's strength.**

**What it produces.** ADR-S007 envelope plus `evidence_map`: an array of clusters, each with a label, claim list, and source count. Full source provenance: URL, title, type, trust tier, and retrieval timestamp per source.

**Unique behavior.** Hunter's explicit mission is to catalog, not evaluate. Evaluation is the Skeptic's job. Hunter extracts core claims from every result (one claim per discrete assertion), clusters them into thematic families, assigns an evidence label per claim, and builds the evidence map. It identifies gaps: what would a complete answer require that is currently missing? At `siege` depth, it catalogs every claim from every result exhaustively. It can use `WebSearch` when evidence is thin or a cluster needs reinforcement. Its output is the primary input for Gate A and, on pass, for Phase B. The `evidence_map` structure is what makes the Skeptic's work tractable: instead of attacking unstructured text, Phase B agents work from labeled clusters with source counts.

**Example output snippet (findings + evidence_map excerpt):**
```json
{
  "findings": [
    { "type": "evidence", "detail": "EU AI Act establishes 4 risk tiers for AI systems.", "evidence_label": "SOLID", "source": "EUR-Lex 2024/1689", "target_rank": null }
  ],
  "evidence_map": [
    { "cluster": "Risk classification", "claims": ["4 risk tiers: unacceptable, high, limited, minimal"], "evidence_label": "SOLID", "source_count": 6 },
    { "cluster": "SME compliance cost", "claims": ["$8-15M estimated compliance cost"], "evidence_label": "SHAKY", "source_count": 1 }
  ]
}
```

---

### Scout (Phase A)

**TLDR: Finds non-obvious signals by looking around the results rather than at them: adjacent connections, weak signals, timing triggers, and structural analogies.**

**What it produces.** ADR-S007 envelope plus three Scout-specific blocks: `adjacent_signals` (domain, signal, implication, evidence label), `weak_signals` (signal, basis, confidence float), and `timing_triggers` (trigger, timeframe, indicator type: leading, lagging, or coincident).

**Unique behavior.** Scout explicitly reads low-ranked results, because the periphery is where scouts live. For every result, it asks: "What does this imply that it does not state explicitly?" It traces temporal trajectory and flags leading indicators. At `drill`, it produces 2-3 adjacent signals and 1-2 timing triggers. At `siege`, it maps the full cross-domain bridge structure. Scout runs parallel to Hunter, so neither contaminates the other's discovery. Together they produce the complete Phase A picture: Hunter builds the evidence map from what was found; Scout surfaces signals from what was implied.

**Example output snippet (scout-specific blocks):**
```json
{
  "adjacent_signals": [
    { "signal": "Pharma GMP compliance literature has validated SME cost models from 2003-2007", "domain": "pharmaceutical regulation", "implication": "Could calibrate EU AI Act cost estimates currently based on vendor claims only", "evidence_label": "SOFT" }
  ],
  "weak_signals": [
    { "signal": "One result mentions AI liability insurance products emerging in Germany", "basis": "Single secondary source, unverified", "confidence": 0.25 }
  ],
  "timing_triggers": [
    { "trigger": "GPAI compliance deadline", "timeframe": "August 2025", "indicator_type": "leading" }
  ]
}
```

---

### Validator (Gates A and B)

**TLDR: Runs schema verification and aggregate confidence checks at each phase gate; a FAIL verdict stops the pipeline immediately with no override.**

**What it produces.** ADR-S007 envelope plus gate-specific fields: `verdict` (PASS, PASS_WITH_NOTES, or FAIL), `notes`, `aggregate_confidence` (float), and `per_agent_assessment` (schema OK, vocab OK, confidence, issues per agent).

**Unique behavior.** The Validator enforces two types of rules with different strictness. Schema compliance is hard: a missing ADR-S007 block is always FAIL, no exceptions. Evidence vocabulary compliance is also hard: any label outside SOLID/SOFT/SHAKY/UNKNOWN is FAIL. Confidence threshold is judgment: Gate A requires an aggregate confidence of 0.70 or above; Gate B requires 0.75. A near-miss (within 0.05) can be PASS_WITH_NOTES if findings are otherwise strong. PASS_WITH_NOTES still allows the pipeline to continue, but the caveats are attached to the final output. Gate A and Gate B use the same agent with different threshold parameters. When a gate fails, the output's `stopped_at` field is set to `"gate_a"` or `"gate_b"` and the partial results are returned honestly.

**Example output snippet:**
```json
{
  "verdict": "PASS_WITH_NOTES",
  "aggregate_confidence": 0.683,
  "notes": ["Aggregate confidence 0.683 below Gate B threshold 0.75. Shortfall concentrated in SME cost estimates (0.34) and preemption claims (0.28). Structural EU findings averaged 0.93. Pipeline continues with caveat."],
  "per_agent_assessment": [
    { "agent": "skeptic", "schema_ok": true, "vocab_ok": true, "confidence": 0.71, "issues": [] }
  ]
}
```

---

### Skeptic (Phase B)

**TLDR: Tests every major claim from Phase A by actively searching for counter-evidence, classifying each as survived, collapsed, or weakened.**

**What it produces.** ADR-S007 envelope plus skeptic-specific blocks: `claims_tested` (claim, origin, verdict: survived/collapsed/weakened, reason), `survived_claims`, and `collapsed_claims`.

**Unique behavior.** The Skeptic receives the full Hunter evidence map and Scout signals and applies adversarial pressure to each claim. Its process per claim: state the claim, search for counter-evidence (not just argue against it), test the foundation, apply negation queries ("NOT [claim]", "[claim] criticism", "[claim] debunked"), then classify. At `drill` depth, it tests the top 3-5 claims from Hunter's highest-confidence clusters. At `siege`, it tests every claim across both Phase A outputs. The distinction from the Contrarian council agent: Skeptic has the full Phase A structured output (labeled clusters, source counts, Scout signals) as input, making its challenges more targeted and its verdicts more traceable. The `survived_claims` list feeds directly into the Adversarial Reviewer in Phase C.

**Example output snippet:**
```json
{
  "claims_tested": [
    { "claim": "EU AI Act establishes 4 risk tiers", "origin": "hunter", "verdict": "survived", "reason": "Searched 'EU AI Act risk classification wrong' and 'EU AI Act more than 4 tiers'. No contradicting sources found. Primary legal text confirms 4-tier structure." },
    { "claim": "SME compliance cost $8-15M", "origin": "hunter", "verdict": "collapsed", "reason": "Counter-search found Parliamentary Research Service estimate of €500K-2M for typical SME. Original figure is from a vendor whitepaper. Primary source wins." }
  ]
}
```

---

### Referee (Phase B)

**TLDR: Issues binding verdicts on conflicting evidence by comparing source quality and evidence weight; "it's complicated" is not a verdict.**

**What it produces.** ADR-S007 envelope plus referee-specific blocks: `conflicts` (claim A vs. claim B, with source arrays for each), `verdicts` (verdict: affirmed/rejected/qualified/indeterminate, rationale, residual uncertainty 0.0-1.0), and `source_quality_comparison` (winning tier, differentiator per conflict).

**Unique behavior.** Referee receives the same Phase A outputs as Skeptic and identifies where sources disagree or evidence labels diverge. It then applies a structured comparison: source quality first (peer-reviewed beats blog regardless of claim specifics), then evidence weight (source count, source independence, recency). The four verdicts have strict semantics: `affirmed` (weight of evidence clearly supports), `rejected` (preponderance contradicts), `qualified` (true under specific conditions, stated explicitly), `indeterminate` (genuinely split with no quality differentiator, escalated to gaps). Only `indeterminate` is allowed to leave a conflict unresolved. The `residual_uncertainty` float (0.0-1.0) captures how much doubt remains after the verdict. Qualified verdicts include the conditions explicitly, making them actionable.

**Example output snippet:**
```json
{
  "conflicts": [
    { "claim_a": "GPAI threshold is a hard ceiling at 10^25 FLOPs", "claim_b": "GPAI threshold is a rebuttable presumption", "sources_a": ["law firm blog, 2024"], "sources_b": ["EUR-Lex primary text, 2024"] }
  ],
  "verdicts": [
    { "conflict_index": 0, "verdict": "rejected", "rationale": "Claim A is a secondary interpretation from a law firm blog. Claim B is the direct regulatory text. PRIMARY SOURCE wins.", "residual_uncertainty": 0.1 }
  ]
}
```

---

### Adversarial Reviewer (Phase C)

**TLDR: Red-teams every conclusion from all prior phases using a fixed 5-step protocol: steelman, attack, negate, fail scenarios, correction.**

**What it produces.** ADR-S007 envelope plus adversarial-specific blocks: `steelman` (conclusion, strongest form), `attacks` (conclusion, attack type, detail), `negations` (conclusion, counter-argument), `fail_scenarios` (conclusion, scenario, failure mode), and `corrections` (conclusion, correction: upheld/qualified/downgraded/rejected, rationale).

**Unique behavior.** The Adversarial Reviewer receives all Phase A and Phase B outputs plus both gate results, giving it the full pipeline context. The 5-step protocol applies to each major conclusion: steelman it first (to ensure the attack is against the strongest version), then attack (probe logical fallacies, single-source dependency, temporal validity, selection bias, anchoring), then negate (construct the strongest counter-argument), then name 2-3 concrete failure scenarios (acting on this conclusion leads to a bad outcome because...), then classify the correction. At `drill`, it applies the protocol to the top 3 conclusions. At `siege`, it applies the protocol to all conclusions across all phase outputs. The four correction labels map directly to how the output renderer presents the finding: `upheld` gets full confidence; `downgraded` gets a confidence reduction and inline attribution.

**Example output snippet:**
```json
{
  "steelman": [{ "conclusion": "EU compliance requires €500K-2M for typical SME", "strongest_form": "Based on Parliamentary Research Service 2024 estimate, covering documentation, technical review, and external audit fees for a mid-size software vendor." }],
  "attacks": [{ "conclusion": "EU compliance requires €500K-2M for typical SME", "attack_type": "selection_bias", "detail": "Sample is mid-size software vendors. Hardware AI providers and professional services firms have different cost structures not covered." }],
  "corrections": [{ "conclusion": "EU compliance requires €500K-2M for typical SME", "correction": "qualified", "rationale": "Holds for software SMEs with limited data processing. Hardware and services sectors require separate estimates." }]
}
```

---

### Confidence Quantifier (Phase C)

**TLDR: Scores every finding on four dimensions using the ADR-S006 weighted formula and flags miscalibration if the distribution shows insufficient variance.**

**What it produces.** ADR-S007 envelope plus confidence-specific blocks: `per_finding_scores` (four dimension scores, composite, label per finding), `calibration_notes` (distribution anomalies), and `score_distribution` (counts by label, mean, standard deviation).

**Unique behavior.** The formula is fixed by ADR-S006: `(evidence × 0.40) + (source_quality × 0.25) + (recency × 0.20) + (agreement × 0.15)`. Each dimension scores 1.0, 0.6, 0.3, or 0.0 against explicit criteria (not a judgment call). The composite maps to SOLID (≥0.80), SOFT (≥0.55), SHAKY (≥0.30), or UNKNOWN (<0.30). The calibration check is what makes this agent non-trivial: if more than 80% of findings score above 0.80, that is over-confidence and gets flagged. If scores cluster within 0.10 of each other, that signals mechanical scoring. The `agreement` dimension encodes the full pipeline history: 1.0 if all prior phases agreed; 0.0 if the adversarial reviewer collapsed the claim. This means every upstream agent's verdict has a direct numeric consequence on the final confidence score.

**Example output snippet:**
```json
{
  "per_finding_scores": [
    { "finding": "EU AI Act 4-tier risk classification", "evidence": 1.0, "source_quality": 1.0, "recency": 1.0, "agreement": 1.0, "composite": 1.0, "label": "SOLID" },
    { "finding": "SME compliance cost €500K-2M", "evidence": 0.6, "source_quality": 0.6, "recency": 0.6, "agreement": 0.6, "composite": 0.6, "label": "SOFT" }
  ],
  "calibration_notes": ["Distribution healthy. Std dev 0.21. No over-confidence or over-skepticism flags."],
  "score_distribution": { "solid": 4, "soft": 3, "shaky": 2, "unknown": 0, "mean": 0.71, "std_dev": 0.21 }
}
```

</details>

<details>
<summary><strong>Output agents (2)</strong>: Output Renderer, Humanizer</summary>

The output layer runs after the research pipeline completes. It transforms JSON artifacts into a human-readable document with full provenance, then audits and rewrites the prose to meet a minimum quality bar. These agents operate on prose zones only. Sources tables, confidence scores, evidence labels, JSON artifacts, and pipeline metadata are never modified.

---

### Output Renderer

**TLDR: Transforms all raw pipeline artifacts into structured prose with inline citations, council member attribution, a sources table, a work log, and a confidence summary.**

**What it produces.** A markdown document saved to `research/artifacts/{slug}/08-rendered.md`. Mandatory sections: header (depth, search rounds, source count, council members, artifact path), prose body with `[N]` inline citations and `[Member: LABEL]` council attributions, Sources and References table, Work Log, and Confidence Summary.

**Unique behavior.** The renderer reads every artifact file in the slug directory, not just the final phase outputs. It assembles the Sources table from `07-sources.json` using ADR-S019 deduplication rules: same URL = single entry with all citing agents listed, trust tier set to the highest assigned by any agent, sort order by trust tier then citation count. Every factual claim in the prose gets a `[N]` citation. Findings challenged or qualified by council members get `[Member: VERDICT]` inline attribution. The Work Log documents what each stage did (domains searched, triage verdicts, council R1 per-member summaries, research phase finding counts, gate verdicts). Citations and attributions are structural data and are never modified by the Humanizer in the next stage.

**Example output snippet (prose body):**
```markdown
The EU AI Act classifies AI systems into four risk tiers [1] [Source-Critic: SOLID]:
unacceptable (banned), high-risk (strict compliance), limited (transparency obligations),
and minimal (no specific rules). The GPAI 10^25 FLOPs threshold is a rebuttable
presumption, not a hard ceiling [2] [Adversarial: SOFT], but in practice, the inverse
burden of proof makes rebuttal difficult.
```

---

### Humanizer

**TLDR: Runs a 5-tier anti-slop audit on all prose zones and rewrites to a NO-SLOP score of 90 or above before the final document is written.**

**What it produces.** A cleaned prose document saved to `research/artifacts/{slug}/09-humanized.md`, then copied to `research/final/{slug}.md`. The audit score and tier-by-tier violation list are attached as a comment block at the end.

**Unique behavior.** The Humanizer applies a tiered detection system to prose sections only. Tier 1 violations (em dashes, emoji bullets, Title Case headings) each cost 10 points from a starting score of 100. Tier 2 violations (forbidden words: "leverage", "seamless", "cutting-edge", "holistic", "robust" as metaphor, "harness", "ecosystem" as metaphor, "innovative" without evidence) cost 1 point each. Tier 3 violations (forbidden phrases: significance inflation, hollow transitions, "serve as") cost 1 point each. Tier 4 violations (structural patterns: burying the finding, hedging stacks, passive voice overuse) cost 1 point. Tier 5 violations (domain-specific rules: frameworks must be named, proof points must be concrete, numbers must be cited) cost 1 point. The threshold is 90. If the score falls below 90, the audit re-runs on the failing sections. The humanizer routes prose through a voice filter based on document type: strategic and commercial documents go through `adam-voice`; general research through `academy-voice`; client communications through `client-comms`. Structured data (sources tables, confidence scores, evidence labels, JSON, code blocks) is never touched.

**Example output snippet (audit comment block):**
```
<!-- NO-SLOP Score: 94/100
     Tier 1 violations: 0
     Tier 2 violations: 4 (leverage ×2, seamless ×1, ecosystem ×1)
     Tier 3 violations: 2 (furthermore ×1, serves as ×1)
     Re-run: No. Score above threshold.
-->

</details>

---

## Requirements

| Requirement | Version |
|-------------|---------|
| Claude Code | v1.0.33+ |
| Claude Cowork | Any with plugin support |
| External dependencies | **None** |
| API keys | **None** |
| Environment variables | **None** |

---

## Updating

**Plugin Marketplace:**
```
/plugin update seine
```

**Manual:**
```bash
cd /tmp/seine-plugin && git pull
# Re-copy agents, KB, and skills as shown in manual installation above
```

---

## Contributing

Contributions are welcome. Please open an issue or pull request.

---

<p align="center">
  <sub>Built by <a href="https://github.com/adambkovacs">Adam Kovacs</a> at <a href="https://github.com/AI-Enablement-Academy">AI Enablement Academy</a></sub>
</p>

<p align="center">
  <a href="LICENSE">MIT License</a>
</p>
