---
name: seerr
description: Request movies and TV shows using Seerr with natural language
metadata:
  {
    "openclaw": {
      "requires": {
        "bins": ["node"],
        "env": ["SEERR_URL", "SEERR_API_KEY"]
      },
      "primaryEnv": "SEERR_API_KEY"
    }
  }
---

# Seerr

Use this skill when the user wants to:

- Request movies
- Request TV shows
- Request seasons
- Check request status
- Search for media availability

This skill interfaces with a Seerr server.

---

# When To Use

Use when the user says things like:

- "Request Bluey"
- "Add Dune Part Two"
- "Get me Severance"
- "Request season 2 of Bluey"
- "Add latest season of The Bear"
- "What's pending?"
- "What's been requested?"

---

# Rules

- Always search first before requesting
- Prefer exact title match
- If multiple distinct titles are returned (e.g. a franchise, remakes, or different shows with the same name), present the options to the user and ask which one they mean before requesting — include the title and year for each option
- Once the user picks, use `--id` with the TMDB ID from the search result to request exactly that item
- If results are clearly the same title (e.g. only quality variants), pick the best match without asking
- Support TV season requests
- Return request status after requesting

---

# Search

Search for media:

```
node {baseDir}/scripts/search.mjs "Bluey"
```

Search movies only:

```
node {baseDir}/scripts/search.mjs "Dune" --type movie
```

Search TV only:

```
node {baseDir}/scripts/search.mjs "Severance" --type tv
```

---

# Disambiguation

When a search returns multiple distinct titles, show the user the options (title + year) and ask which one they mean. Then use `--id` to request the exact item by its TMDB ID.

**Step 1 — Search:**
```
node {baseDir}/scripts/search.mjs "The Matrix" --type movie
```

**Step 2 — Present options to user:**
> "Which Matrix did you mean?
> 1. The Matrix (1999)
> 2. The Matrix Reloaded (2003)
> 3. The Matrix Revolutions (2003)
> 4. The Matrix Resurrections (2021)"

**Step 3 — Request by ID after user picks:**
```
node {baseDir}/scripts/request.mjs --id 603 --type movie
```

---

# Request Movie

```
node {baseDir}/scripts/request.mjs "Dune Part Two" --type movie
```

Request by TMDB ID (use after disambiguation):

```
node {baseDir}/scripts/request.mjs --id 603 --type movie
```

---

# Request TV Show

Request full series:

```
node {baseDir}/scripts/request.mjs "Bluey" --type tv
```

Request by TMDB ID (use after disambiguation):

```
node {baseDir}/scripts/request.mjs --id 83053 --type tv
```

Request specific season:

```
node {baseDir}/scripts/request.mjs "Severance" --type tv --seasons 2
```

Request multiple seasons:

```
node {baseDir}/scripts/request.mjs "The Bear" --type tv --seasons 1,2
```

Request all seasons:

```
node {baseDir}/scripts/request.mjs "Bluey" --type tv --seasons all
```

---

# Requests

List recent requests:

```
node {baseDir}/scripts/requests.mjs
```

---

# Request Status

Check request:

```
node {baseDir}/scripts/request-by-id.mjs 123
```

---

# Notes

- This skill uses the Seerr API
- Requires SEERR_URL and SEERR_API_KEY
- Always search before requesting
