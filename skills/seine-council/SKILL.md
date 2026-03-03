---
name: seine-council
description: Deliberative council for multi-perspective analysis via Seine Backend 2
triggers:
  - seine council
  - triage analysis
  - deliberative council
  - council deliberate
---

# Seine Council (Backend 2)

Run Seine's deliberative council using Claude Code's native `Agent` tool.
Read `agents/seine-kb/REFERENCE.md` for schemas, ADR rules, and member semantics.

## Evidence Vocabulary

| Label | Meaning | Numeric |
|-------|---------|---------|
| SOLID | Multiple independent sources, no contradictions | 1.0 |
| SOFT | Single credible source or indirect evidence | 0.6 |
| SHAKY | Single biased source or conflicting evidence | 0.3 |
| UNKNOWN | Insufficient evidence | 0.0 |

## Two Modes

| Mode | Agents | When |
|------|--------|------|
| **Triage** | 3 agents (parallel) | Quick quality check — triggered by `/seine-search` on flag |
| **Deliberate** | 7 members + Round 2 synthesis | Full multi-perspective analysis (`dig+` depth) |

---

## Triage Mode

Spawn all 3 triage agents **in parallel** (single message):

```javascript
Agent({ subagent_type: "seine-triage-completeness", model: "sonnet",
        prompt: "Query: <query>\nResults: <search_results_json>" })
Agent({ subagent_type: "seine-triage-quality",      model: "sonnet",
        prompt: "Query: <query>\nResults: <search_results_json>" })
Agent({ subagent_type: "seine-triage-gaps",         model: "sonnet",
        prompt: "Query: <query>\nResults: <search_results_json>" })
```

Each returns: `{ "agent": "completeness|quality|gaps", "verdict": "pass|flag", "reason": "...", "action": null|{...} }`

---

## Deliberate Mode

### Round 1 — Spawn all 7 members in parallel (single message)

```javascript
Agent({ subagent_type: "seine-council-synthesizer",     model: "sonnet",
        prompt: "Query: <query>\nSearch results: <results_json>" })
Agent({ subagent_type: "seine-council-contrarian",      model: "sonnet",
        prompt: "Query: <query>\nSearch results: <results_json>" })
Agent({ subagent_type: "seine-council-lateral-hunter",  model: "sonnet",
        prompt: "Query: <query>\nSearch results: <results_json>" })
Agent({ subagent_type: "seine-council-source-critic",   model: "sonnet",
        prompt: "Query: <query>\nSearch results: <results_json>" })
Agent({ subagent_type: "seine-council-pattern-spotter", model: "sonnet",
        prompt: "Query: <query>\nSearch results: <results_json>" })
Agent({ subagent_type: "seine-council-blind-spot",      model: "sonnet",
        prompt: "Query: <query>\nSearch results: <results_json>" })
Agent({ subagent_type: "seine-council-temporal",        model: "sonnet",
        prompt: "Query: <query>\nSearch results: <results_json>" })
```

Each member returns the Council Member Schema (see KB Section 3):
`{ "member": "...", "findings": [...], "summary": "...", "verdict": "pass|flag" }`

### Round 2 — Synthesizer consolidation

After collecting all 7 member responses, spawn synthesizer again with ALL findings:

```javascript
Agent({ subagent_type: "seine-council-synthesizer", model: "sonnet",
        prompt: "Query: <query>\nAll member findings: <all_7_member_responses_json>\nTask: Produce final consolidated council output." })
```

### Return

```json
{
  "mode": "deliberate",
  "query": "...",
  "round1": {
    "synthesizer": {}, "contrarian": {}, "lateral-hunter": {},
    "source-critic": {}, "pattern-spotter": {}, "blind-spot": {}, "temporal": {}
  },
  "synthesis": { "summary": "...", "findings": [...], "verdict": "pass|flag" }
}
```

---

## Artifact Persistence (when artifact_dir is provided, ADR-S017)

The calling skill (seine-search or seine-research) passes `artifact_dir` in the prompt context (e.g., `research/artifacts/china-ai-chip-strategy-2026-03-02`). All persistence steps below only execute when `artifact_dir` is present.

### After Triage (Step 2 in triage mode)

**1. Create the triage directory:**

```javascript
Bash({ command: "mkdir -p {artifact_dir}/03-triage" })
```

**2. Write each triage agent's verdict.** Use the `Write` tool for each of the 3 agents:

```javascript
Write({ file_path: "{artifact_dir}/03-triage/completeness.json", content: "<completeness_agent_json>" })
Write({ file_path: "{artifact_dir}/03-triage/quality.json",      content: "<quality_agent_json>" })
Write({ file_path: "{artifact_dir}/03-triage/gaps.json",          content: "<gaps_agent_json>" })
```

Each file contains the full triage output object: `{ "agent": "completeness|quality|gaps", "verdict": "pass|flag", "reason": "...", "action": null|{...} }`.

### After Council R1 (deliberate mode)

**1. Create the council R1 directory:**

```javascript
Bash({ command: "mkdir -p {artifact_dir}/04-council-r1" })
```

**2. Write each council member's output.** Use the `Write` tool for each of the 7 members:

```javascript
Write({ file_path: "{artifact_dir}/04-council-r1/synthesizer.json",     content: "<synthesizer_json>" })
Write({ file_path: "{artifact_dir}/04-council-r1/contrarian.json",      content: "<contrarian_json>" })
Write({ file_path: "{artifact_dir}/04-council-r1/lateral-hunter.json",  content: "<lateral_hunter_json>" })
Write({ file_path: "{artifact_dir}/04-council-r1/source-critic.json",   content: "<source_critic_json>" })
Write({ file_path: "{artifact_dir}/04-council-r1/pattern-spotter.json", content: "<pattern_spotter_json>" })
Write({ file_path: "{artifact_dir}/04-council-r1/blind-spot.json",      content: "<blind_spot_json>" })
Write({ file_path: "{artifact_dir}/04-council-r1/temporal.json",        content: "<temporal_json>" })
```

Each file contains the full Council Member Schema: `{ "member": "...", "findings": [...], "summary": "...", "verdict": "pass|flag" }`.

### After Council R2 (if R2 runs)

**1. Create the council R2 directory:**

```javascript
Bash({ command: "mkdir -p {artifact_dir}/06-council-r2" })
```

**2. Write each R2 member's output** using the same file naming pattern:

```javascript
Write({ file_path: "{artifact_dir}/06-council-r2/synthesizer.json",     content: "<r2_synthesizer_json>" })
Write({ file_path: "{artifact_dir}/06-council-r2/contrarian.json",      content: "<r2_contrarian_json>" })
Write({ file_path: "{artifact_dir}/06-council-r2/lateral-hunter.json",  content: "<r2_lateral_hunter_json>" })
Write({ file_path: "{artifact_dir}/06-council-r2/source-critic.json",   content: "<r2_source_critic_json>" })
Write({ file_path: "{artifact_dir}/06-council-r2/pattern-spotter.json", content: "<r2_pattern_spotter_json>" })
Write({ file_path: "{artifact_dir}/06-council-r2/blind-spot.json",      content: "<r2_blind_spot_json>" })
Write({ file_path: "{artifact_dir}/06-council-r2/temporal.json",        content: "<r2_temporal_json>" })
```

## Council Deliberation Loop (R1 → R2)

For `dig` depth and above, the full deliberation loop runs in four concrete steps:

**Step 1 — Council R1 (divergent).** Spawn all 7 members in parallel (single message) as shown in the "Deliberate Mode" section above. Each member independently analyzes the search results. After all 7 respond, write their outputs to `{artifact_dir}/04-council-r1/` as described above.

**Step 2 — Ground Truth Overlay.** The orchestrator adds any primary source data available in the conversation context (meeting notes, contracts, verified facts, user-provided documents). This data is assembled into a `ground_truth_json` object to be passed into R2.

**Step 3 — Targeted Research.** Inspect the R1 findings for specific gaps. If any member flagged gaps or the blind-spot member identified missing perspectives, spawn targeted research agents to fill those gaps:

```javascript
Agent({ subagent_type: "seine-research-hunter", model: "sonnet",
        prompt: "Query: <query>\nGaps identified by R1: <gaps_list>\nTask: Fill these specific gaps with evidence." })
Agent({ subagent_type: "seine-research-scout",  model: "sonnet",
        prompt: "Query: <query>\nBlind spots from R1: <blind_spots>\nTask: Find adjacent signals addressing these blind spots." })
```

Collect their outputs into a `research_json` object.

**Step 4 — Council R2 (convergent).** Spawn all 7 members again in parallel (single message), this time with enriched context including R1 findings, new research, and ground truth:

```javascript
Agent({ subagent_type: "seine-council-synthesizer", model: "sonnet",
        prompt: "Query: <query>\nR1 findings: <all_r1_json>\nNew research: <research_json>\nGround truth: <ground_truth_json>\nTask: CONVERGENT validation. Identify what changed since R1, what new evidence emerged, and which R1 findings survived scrutiny." })
Agent({ subagent_type: "seine-council-contrarian", model: "sonnet",
        prompt: "Query: <query>\nR1 findings: <all_r1_json>\nNew research: <research_json>\nGround truth: <ground_truth_json>\nTask: CONVERGENT validation. Stress-test the enriched findings." })
// ... same pattern for all remaining 5 members (lateral-hunter, source-critic, pattern-spotter, blind-spot, temporal)
```

After all 7 R2 members respond, write their outputs to `{artifact_dir}/06-council-r2/` as described above.

---

## Council Members Reference

| Member | Cognitive Function |
|--------|-------------------|
| synthesizer | Integration, big-picture narrative |
| contrarian | Adversarial stress-test ("prove it") |
| lateral-hunter | Adjacent-domain analogies |
| source-critic | Provenance, authority, bias evaluation |
| pattern-spotter | Cross-domain trends and contradictions |
| blind-spot | Missing perspectives, unasked questions |
| temporal | Time-trajectory analysis (rising/declining) |
