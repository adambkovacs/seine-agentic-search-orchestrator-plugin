# Seine Agentic Search Orchestrator

Multi-domain search orchestration with deliberative council consensus, phased research, and humanized output -- as a Claude Code / Claude Cowork plugin.

**20 agents | 7-member council | 4 domains | 5 depth levels**

---

## What This Is

Seine is a search orchestration engine that coordinates multiple specialized AI agents to research questions thoroughly. Instead of a single search, Seine:

1. **Routes** your query to relevant domains (web, academic, OSINT, social)
2. **Triages** results with 3 gate agents that check completeness, quality, and gaps
3. **Deliberates** with a 7-member council providing diverse cognitive perspectives
4. **Researches** deeply with a phased pipeline: discovery, analysis, synthesis
5. **Renders** findings into prose with full source attribution and confidence scoring
6. **Humanizes** output through anti-slop filtering and voice styling

This plugin runs entirely inside Claude Code or Claude Cowork using built-in tools (WebSearch, Agent, Read, Write, Grep, Bash). No external dependencies, no API keys, no shell scripts.

## Features

- **20 specialized agents** covering triage, deliberation, research, and output
- **7-member deliberative council** with distinct cognitive functions (synthesizer, contrarian, lateral-hunter, source-critic, pattern-spotter, blind-spot, temporal)
- **Phased research pipeline** with validation gates: Discovery -> Analysis -> Synthesis
- **4 search domains**: web, academic, OSINT, social
- **5 depth levels**: skim, scan, dig, drill, siege
- **Artifact persistence** at dig+ depth (per-query folders with numbered pipeline outputs)
- **Evidence vocabulary**: SOLID / SOFT / SHAKY / UNKNOWN across all agents
- **Output rendering** with mandatory Sources table, Work Log, and Confidence Summary
- **Anti-slop humanizer** with 5-tier detection and 90%+ quality gate
- **Inline citation** system with numbered source refs and council attribution
- **Search craft knowledge base** with boolean operators, OSINT patterns, counter-evidence techniques

---

## Installation

### Claude Code (Plugin Marketplace)

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

### Claude Code (Manual Install)

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

### Claude Cowork

1. Navigate to **Plugins** in Claude Cowork settings
2. Search the marketplace for `seine` or add by repository URL:
   ```
   adambkovacs/seine-agentic-search-orchestrator-plugin
   ```
3. Click **Install**

Skills will be available in your Cowork sessions under the `seine` namespace.

### Manual Install (Any Claude Environment)

Copy these directories into your project's `.claude/` folder:

| Source | Destination |
|--------|------------|
| `agents/seine-*.md` (20 files) | `.claude/agents/` |
| `agents/seine-kb/` (2 files) | `.claude/agents/seine-kb/` |
| `skills/seine-search/SKILL.md` | `.claude/skills/seine-search/SKILL.md` |
| `skills/seine-council/SKILL.md` | `.claude/skills/seine-council/SKILL.md` |
| `skills/seine-research/SKILL.md` | `.claude/skills/seine-research/SKILL.md` |

---

## Usage

### Quick Search

```
/seine:seine-search "What are the latest developments in AI safety?" scan
```

Depths: `skim` (fast fusion only), `scan` (+ triage), `dig` (+ council), `drill` (+ research), `siege` (+ convergence)

### Council Deliberation

```
/seine:seine-council "Should we adopt GraphQL over REST for our API?"
```

Runs triage gate (3 agents) followed by 7-member council analysis. Use for questions that benefit from multiple perspectives.

### Deep Research

```
/seine:seine-research "Competitive landscape of AI-powered code review tools"
```

Runs the full phased research pipeline:
- Phase A (Discovery): hunter + scout
- Gate A: validator
- Phase B (Analysis): skeptic + referee
- Gate B: validator
- Phase C (Synthesis): adversarial-reviewer + confidence-quantifier

### Depth Guide

| Depth | Best For | Time | Agents Active |
|-------|----------|------|--------------|
| `skim` | Quick fact checks | ~30s | 0 |
| `scan` | Surface-level overview | ~1-2min | 3 (triage) |
| `dig` | Thorough analysis | ~3-5min | 10 (triage + council) |
| `drill` | Deep investigation | ~8-15min | 17 (triage + council + research) |
| `siege` | Exhaustive research | ~20-40min | 20 (all agents, multi-round) |

---

## Architecture

```
Query -> Router -> Domain Dispatch -> Result Fusion (RRF)
  |
  [scan+]  Triage Gate (3 agents): completeness, quality, gaps
  |
  [dig+]   Council R1 (7 members, parallel): synthesizer, contrarian,
  |         lateral-hunter, source-critic, pattern-spotter, blind-spot, temporal
  |
  [dig+]   Ground Truth Overlay + Targeted Research
  |
  [dig+]   Council R2 (validation round)
  |
  [drill+] Research Pipeline (A -> Gate -> B -> Gate -> C)
  |
  [dig+]   Output: renderer -> humanizer -> final document
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full architecture reference including agent schemas and output format.

---

## Domains

| Domain | Description | Method |
|--------|-------------|--------|
| **web** | General web search | WebSearch |
| **academic** | arXiv and DBLP papers | WebSearch with site qualifiers |
| **osint** | EDGAR, OpenCorporates, Wikidata, LittleSis, OFAC, FEC, and more | WebSearch with specialized queries |
| **social** | Twitter/X, Reddit, LinkedIn | WebSearch on social platforms |

The search craft knowledge base (`agents/seine-kb/SEARCH-CRAFT.md`) includes boolean operators, site-restriction patterns, OSINT sub-adapter equivalents, counter-evidence techniques, and query expansion strategies for all 4 domains.

---

## Artifact Output

At `dig` depth and above, every query creates a persistent artifact directory:

```
research/artifacts/{query-slug}-{date}/
  00-query.json              # Routing decision + domains selected
  01-search-rounds/          # Per-domain raw results
  02-fusion.json             # RRF-fused results with scores
  03-triage/                 # 3 triage verdicts
  04-council-r1/             # 7 council member outputs
  05-research/               # Research phase outputs + gates
  06-council-r2/             # R2 outputs (if run)
  07-sources.json            # Deduplicated master source list
  08-timeline.json           # Per-stage timing
```

Final rendered output: `research/final/{slug}.md`

---

## Evidence Vocabulary

All agents use a universal 4-level system for labeling claims:

| Label | Meaning |
|-------|---------|
| **SOLID** | Multiple independent sources confirm, no contradictions |
| **SOFT** | Single credible source or indirect evidence |
| **SHAKY** | Single source with potential bias, or conflicting evidence |
| **UNKNOWN** | Insufficient evidence to assess |

See [docs/EVIDENCE-VOCABULARY.md](docs/EVIDENCE-VOCABULARY.md) for the confidence formula and source quality tiers.

---

## Agent Inventory

| Category | Count | Agents |
|----------|-------|--------|
| Orchestrator | 1 | researcher |
| Output | 2 | output-renderer, humanizer |
| Triage | 3 | completeness, quality, gaps |
| Council | 7 | synthesizer, contrarian, lateral-hunter, source-critic, pattern-spotter, blind-spot, temporal |
| Research | 7 | hunter, scout, skeptic, referee, validator, adversarial-reviewer, confidence-quantifier |
| **Total** | **20** | |

Plus 2 knowledge base files (REFERENCE.md, SEARCH-CRAFT.md) and 3 skills.

---

## Requirements

- **Claude Code** v1.0.33 or later, OR
- **Claude Cowork** with plugin support

No external dependencies. No API keys. No environment variables. The plugin uses only Claude's built-in tools.

---

## Updating

To get the latest version:

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

## License

MIT License. See [LICENSE](LICENSE) for details.
