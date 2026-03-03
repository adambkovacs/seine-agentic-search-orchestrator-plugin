# Evidence Vocabulary Reference

All Seine agents use a universal 4-level evidence vocabulary for labeling claims. This vocabulary applies across triage agents, council members, and research agents.

## Evidence Labels

| Label | Meaning | Numeric Value |
|-------|---------|--------------|
| **SOLID** | Multiple independent sources confirm, no contradictions | 1.0 |
| **SOFT** | Single credible source or indirect evidence | 0.6 |
| **SHAKY** | Single source with potential bias, or conflicting evidence | 0.3 |
| **UNKNOWN** | Insufficient evidence to assess | 0.0 |

## Confidence Formula

Composite confidence score combines four factors:

```
confidence = (evidence x 0.40) + (source_quality x 0.25) + (recency x 0.20) + (agreement x 0.15)
```

### Composite-to-Label Ranges

| Composite Score | Label |
|----------------|-------|
| >= 0.80 | SOLID |
| >= 0.55 | SOFT |
| >= 0.30 | SHAKY |
| < 0.30 | UNKNOWN |

## Source Quality Tiers

| Tier | Description | Examples |
|------|-------------|---------|
| **HIGH** | Peer-reviewed, official records, primary sources | Academic papers, SEC filings, court records |
| **MEDIUM** | Reputable outlets, established organizations | Major news outlets, industry reports, verified databases |
| **LOW** | Unvetted or user-generated content | Blog posts, forum comments, social media |
| **DISQUALIFIED** | Known unreliable or fabricated | Content farms, retracted papers, parody sites |

## Recency Tiers

| Tier | Time Range |
|------|-----------|
| **CURRENT** | < 30 days old |
| **RECENT** | 30-180 days old |
| **DATED** | 180-365 days old |
| **STALE** | > 365 days old |
