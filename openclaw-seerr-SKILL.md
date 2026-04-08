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
- If multiple matches exist, prefer newest
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

# Request Movie

```
node {baseDir}/scripts/request.mjs "Dune Part Two" --type movie
```

---

# Request TV Show

Request full series:

```
node {baseDir}/scripts/request.mjs "Bluey" --type tv
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
