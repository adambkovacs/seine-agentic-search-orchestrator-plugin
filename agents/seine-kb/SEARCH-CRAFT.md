# Seine Backend 2 — Search Craft Guide

> How to use `WebSearch` and `WebFetch` effectively. Adapted from search-tactics.md for Claude Code native tools.
> Every Seine agent that performs active searching MUST read this before constructing queries.

---

## The 8 Universal Rules

1. **Always include year** — `"AI training compliance 2026"` not `"AI training compliance"`
2. **3 queries minimum** — One query is a search. Three queries is research. Vary angle, not just wording.
3. **Use negation queries** — Find what's wrong, not just what's right. Every claim deserves a counter-query.
4. **Quote exact phrases** — `"switched away from Notion"` beats `Notion alternatives`
5. **Site-restrict for quality** — `site:arxiv.org`, `site:sec.gov`, `site:linkedin.com/in`
6. **Cross-source corroborate** — Never trust a single source. Triangulate across 2+ independent sources.
7. **Vary query structure** — Don't just rephrase. Change the angle entirely (who/what/why/when/where).
8. **Check low-ranked results** — The periphery often contains the highest-value signals.

---

## WebSearch: Operators That Work

Claude Code's `WebSearch` supports standard web search operators. Use them.

### Core Operators

| Operator | What It Does | Example |
|----------|-------------|---------|
| `"..."` | Exact phrase match | `"EU AI Act Article 4"` |
| `site:` | Restrict to domain | `site:arxiv.org "transformer architecture"` |
| `OR` | Boolean OR | `"AI training" OR "AI enablement"` |
| `-` | Exclude term | `"AI training" -chatgpt -tutorial -beginner` |
| `()` | Group terms | `(grant OR funding) "AI" site:europa.eu` |
| `filetype:` | File type filter | `filetype:pdf "strategic plan" 2026` |
| `intitle:` | Term in page title | `intitle:"board of directors" "Delivery Hero"` |
| `inurl:` | Term in URL | `inurl:careers site:deliveryhero.com` |
| `after:` | Date filter | `"AI regulation" after:2025-06-01` |
| `before:` | Date filter | `"AI regulation" before:2026-01-01` |
| `AROUND(X)` | Proximity (terms within X words) | `"Delivery Hero" AROUND(3) "AI training"` |
| `*` | Wildcard | `"VP of * at Delivery Hero"` |

### Boolean Combinations

```
# AND is implicit (space between terms)
"AI compliance" Germany regulation 2026

# OR for synonyms and alternatives
("artificial intelligence" OR "machine learning") (training OR upskilling OR enablement)

# Nested groups for complex queries
site:(sec.gov OR europa.eu) ("AI Act" OR "artificial intelligence") (compliance OR regulation)

# Exclude noise
"AI training provider" -site:reddit.com -site:quora.com -"how to" -free -tutorial
```

---

## WebSearch: Domain-Specific Patterns

### Academic (arxiv, DBLP, Scholar)
```
site:arxiv.org "[TOPIC]" 2026
site:arxiv.org "[TOPIC]" "[AUTHOR]"
site:semanticscholar.org "[TOPIC]"
site:scholar.google.com "[TOPIC]" "[AUTHOR]"
site:edu "[TOPIC]" "research" filetype:pdf
```

### Corporate / Business Intelligence
```
# SEC filings and annual reports
"[COMPANY]" filetype:pdf "annual report" OR "10-K" 2026
site:sec.gov "[COMPANY]" "risk factors"

# Hiring signals reveal strategy
"[COMPANY]" site:linkedin.com/jobs
"[COMPANY]" inurl:careers ("AI" OR "machine learning")

# Vendor and partner intel
"[COMPANY]" "partnership" OR "partner with" OR "collaboration"

# Strategy documents
"[COMPANY]" filetype:pdf "strategic plan" OR "roadmap"
"[COMPANY]" filetype:pptx "strategy" OR "OKR"
```

### People Research (LinkedIn X-ray)
```
# Bypass LinkedIn login via Google X-ray
site:linkedin.com/in "[NAME]" "[COMPANY]"
site:linkedin.com/in ("CEO" OR "CTO" OR "VP" OR "Director") "[COMPANY]"

# Thought leadership
"[NAME]" "keynote" OR "speaker" OR "panelist"
"[NAME]" site:medium.com OR site:substack.com
"[NAME]" "I believe" OR "my take" OR "the future of"

# Board and governance connections
"[NAME]" "board of directors" OR "trustee" OR "advisory board"
```

### OSINT Sub-Adapter Equivalents

Backend 1 has 13 OSINT sub-adapters. In Backend 2, replicate with targeted WebSearch:

| Sub-Adapter | B2 WebSearch Equivalent |
|-------------|------------------------|
| **EDGAR** | `site:sec.gov "[COMPANY]" "10-K" OR "10-Q" OR "DEF 14A"` |
| **OpenCorporates** | `site:opencorporates.com "[COMPANY]"` or `"[COMPANY]" "company number" OR "registration"` |
| **Wikidata** | `site:wikidata.org "[ENTITY]"` |
| **LittleSis** | `site:littlesis.org "[NAME]"` or `"[NAME]" "board" "director" "connections"` |
| **OFAC** | `site:treasury.gov "[ENTITY]" "sanctions"` or `"[ENTITY]" OFAC SDN` |
| **FEC** | `site:fec.gov "[NAME]"` or `"[NAME]" "political contribution" OR "campaign donation"` |
| **CompaniesHouse** | `site:companieshouse.gov.uk "[COMPANY]"` |
| **CANDID/GuideStar** | `site:candid.org "[ORG]"` or `"[ORG]" "Form 990" filetype:pdf` |
| **Court Records** | `"[NAME]" OR "[COMPANY]" site:courtlistener.com OR site:pacer.gov` |
| **Patent** | `site:patents.google.com "[COMPANY]"` or `"[COMPANY]" patent "artificial intelligence"` |
| **News Archives** | `"[ENTITY]" after:2025-01-01` (general) or `site:reuters.com OR site:bloomberg.com "[ENTITY]"` |
| **Sanctions** | `"[ENTITY]" sanctions OR "designated national" OR "blocked person"` |
| **Property** | `"[NAME]" OR "[COMPANY]" "property" OR "real estate" OR "deed"` |

### Social Media
```
site:twitter.com OR site:x.com "[COMPANY]" "[TOPIC]"
site:reddit.com "[COMPANY]" "review" OR "experience" OR "honest"
site:reddit.com "[PRODUCT]" "alternative" OR "vs" OR "switched"
```

### Government / Regulatory
```
# EU institutions
site:europa.eu "[TOPIC]" "regulation" OR "directive"
site:eur-lex.europa.eu "[TOPIC]"

# German federal
site:bmas.de OR site:bmwk.de "[TOPIC]"
site:gesetze-im-internet.de "[LAW]"

# US federal
site:gov "[TOPIC]" "grant" OR "funding"
site:grants.gov "[TOPIC]"
site:sam.gov "[COMPANY]"
```

### GitHub Intelligence
```
"[COMPANY]" site:github.com
"[COMPANY]" site:github.com "AI" OR "LLM" OR "machine learning"
# For tech stack: "[COMPANY]" site:stackshare.io
```

---

## WebSearch: Query Expansion Strategy

### The 3-Query Framework

For any topic, construct at minimum:

1. **Direct query** — What you're looking for, stated plainly
2. **Angle shift** — Same topic, different framing (who/what/why/when perspective)
3. **Counter-evidence query** — What would prove the opposite?

**Example: "Is Delivery Hero investing in AI training?"**
```
# Query 1 (direct)
"Delivery Hero" "AI training" OR "AI upskilling" 2026

# Query 2 (angle shift — hiring signals)
"Delivery Hero" site:linkedin.com/jobs "machine learning" OR "AI" Berlin

# Query 3 (counter-evidence)
"Delivery Hero" "cost cutting" OR "layoffs" OR "restructuring" 2026
```

### Synonym Expansion

Never search just one term. Expand:

| Base Term | Expand To |
|-----------|-----------|
| AI training | AI training OR AI upskilling OR AI enablement OR AI literacy |
| compliance | compliance OR regulation OR regulatory OR legal requirement |
| grant | grant OR funding OR subsidy OR award OR programme |
| employee | employee OR workforce OR staff OR team OR personnel |
| company | company OR corporation OR enterprise OR firm OR organization |

### Counter-Evidence Queries (Critical for Skeptic/Contrarian)

For **every** strong claim, negate it:

```
Claim: "X is growing"       → "[X] declining" OR "[X] stagnant" OR "[X] saturated"
Claim: "X is the best"      → "[X] worst" OR "[X] overrated" OR "[ALTERNATIVE] better than [X]"
Claim: "Market is $Xbn"     → "[MARKET] smaller than" OR "[MARKET] overstated"
Claim: "Z is innovative"    → "[Z] nothing new" OR "[Z] already exists"
Claim: "Customers want Y"   → "[Y] unnecessary" OR "nobody needs [Y]" OR "[Y] overhyped"
```

---

## WebFetch: Critical Rules

### WARNING: WebFetch SUMMARIZES — It Does NOT Return Raw Content

`WebFetch` processes content through an AI model and returns a **summary**, not the original text. You will lose 90%+ of detail.

### When To Use WebFetch
- Extracting specific facts from a known URL (with a targeted prompt)
- Getting the gist of a long article
- Checking if a page contains relevant information

### When NOT To Use WebFetch
- When you need exact quotes, numbers, or full text
- For Google Docs (use `curl -sL "https://docs.google.com/document/d/DOC_ID/export?format=txt"`)
- For PDFs (use `curl` to download, then process)
- For raw data extraction

### WebFetch Best Practices
1. **Be specific in your prompt** — "Extract the pricing tiers and their features" not "summarize this page"
2. **Ask for structured output** — "List all board members with their titles" gets better results than "who's on the board?"
3. **Chain WebSearch → WebFetch** — Find URLs with WebSearch first, then deep-dive with WebFetch
4. **Handle failures gracefully** — Paywalls, login walls, and Cloudflare protection will block many URLs
5. **Note the URL as source** — Always record the URL in your provenance chain even if content extraction is partial

---

## Meta-Strategy: Search as Research

### Depth-Appropriate Search Intensity

| Depth | Queries | Sources | Verification |
|-------|---------|---------|-------------|
| skim | 1-2 | Top 3 | None |
| scan | 3-5 | Top 5 | Spot-check 1 |
| dig | 5-10 | Top 10 | Cross-reference 3+ |
| drill | 10-20 | All available | Full triangulation |
| siege | 20+ | Exhaustive + adjacent | Every claim verified |

### The Research Spiral

Don't search linearly. Spiral outward:

```
Round 1: Direct queries → establish baseline understanding
Round 2: Follow-up on gaps from Round 1 → deepen
Round 3: Counter-evidence → challenge findings
Round 4: Adjacent domains → find what you didn't know to look for
Round 5: Temporal → how has this changed over time?
```

### Source Quality Heuristic

| Source Type | Trust Tier | Evidence Label |
|-------------|-----------|---------------|
| Government (.gov), peer-reviewed | HIGH | Can support SOLID |
| Major news (Reuters, Bloomberg), official company pages | MEDIUM-HIGH | Can support SOLID with corroboration |
| Industry reports, reputable blogs | MEDIUM | Supports SOFT |
| Reddit, forums, unvetted blogs | LOW | SHAKY at best |
| Anonymous, no attribution | DISQUALIFIED | UNKNOWN |

### Competitive Intelligence Patterns

```
# How they position themselves
"[COMPETITOR]" "we help" OR "we enable" OR "our mission"

# What customers really think
"[COMPETITOR] review" site:g2.com
"[COMPETITOR]" site:reddit.com "honest" OR "switched to" OR "moved away"

# Pricing intel
"[COMPETITOR] pricing" OR "[COMPETITOR] cost" OR "[COMPETITOR] enterprise"

# Weakness signals
"[COMPETITOR] problem" OR "issue" OR "frustrated"
"cancelled [COMPETITOR]" OR "leaving [COMPETITOR]" OR "alternative to [COMPETITOR]"
```

---

## Quick Reference Card

```
ALWAYS:  Include year  |  3+ queries  |  site: for quality  |  Quote exact phrases
EXPAND:  Synonyms  |  Angle shifts  |  Counter-evidence  |  Adjacent domains
VERIFY:  Triangulate across sources  |  Check low-ranked results  |  Negate strong claims
AVOID:   Single query  |  Trusting one source  |  Ignoring WebFetch limitations
```
