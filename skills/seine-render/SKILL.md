---
name: seine-render
description: Generate an interactive HTML dossier from Seine research artifacts
triggers:
  - seine render
  - render dossier
  - html dossier
  - generate report
---

# Seine Render

Generate a self-contained interactive HTML dossier from an existing Seine artifact directory.

## Usage

```
/seine:seine-render research/artifacts/{slug}
```

If no artifact_dir argument is provided, find the most recent:

```javascript
Bash({ command: "ls -td research/artifacts/*/ 2>/dev/null | head -1" })
```

## Process

1. **Validate** — check that `{artifact_dir}/00-query.json` exists

2. **Spawn renderer:**

```javascript
Agent({ subagent_type: "seine-report-renderer", model: "sonnet",
        prompt: "Artifact directory: {artifact_dir}\n\nRead all JSON files in the artifact directory (00-query.json through 08-timeline.json, skip any that don't exist). Auto-detect chartable data from the findings. Generate a self-contained HTML dossier with Chart.js charts bundled inline. Write the output to {artifact_dir}/09-dossier.html." })
```

3. **Verify output:**

```javascript
Bash({ command: "ls -la {artifact_dir}/09-dossier.html && wc -c {artifact_dir}/09-dossier.html" })
```

4. **Report** — show file path and size to user. Suggest: "Open in browser to view the interactive dossier."
