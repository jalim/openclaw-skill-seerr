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
      "primaryEnv": "SEERR_API_KEY",
      "optionalEnv": ["SEERR_USERS", "SEERR_SERVERS"]
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
- If the request is on behalf of someone else (e.g. "my wife wants X", "add Y for [name]"), pass `--user <name>` — the name must match a key configured in `SEERR_USERS`
- If `--user` is given but `SEERR_USERS` is not configured or the name is not found, the script will exit with an error — inform the user they need to configure `SEERR_USERS`
- If the user asks you to request something for themselves and SEERR_USERS is configured with a name for them, use `--user` for their account too so the request is attributed correctly
- If the user specifies a target library or server (e.g. "add to kids", "put it on the kids Radarr"), pass `--server <name>` — the name must match a key configured in `SEERR_SERVERS`
- If `--server` is given but `SEERR_SERVERS` is not configured or the name is not found, the script will exit with an error — inform the user they need to configure `SEERR_SERVERS`

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

# Multi-Server Requests

If `SEERR_SERVERS` is configured, you can route a request to a specific Radarr or Sonarr instance using `--server`:

```
node {baseDir}/scripts/request.mjs "Bluey" --type tv --server kids-tv
```

```
node {baseDir}/scripts/request.mjs "Moana 2" --type movie --server kids-movies
```

`SEERR_SERVERS` must be set as a comma-separated list of `name:id` pairs where the ID is the Seerr server ID for that Radarr/Sonarr instance:

```
SEERR_SERVERS=kids-movies:2,kids-tv:3
```

To find a server's ID, visit the Seerr admin panel under Settings → Radarr or Settings → Sonarr — the ID is shown next to each configured server.

`--server` and `--user` can be combined:

```
node {baseDir}/scripts/request.mjs "Moana 2" --type movie --server kids-movies --user wife
```

Detect the target server from conversational context:
- "Request Bluey" → no `--server` (uses Seerr default)
- "Add Bluey to kids" / "put it on kids Sonarr" → `--server kids-tv`
- "Request Moana for the kids library" → `--server kids-movies`
- "Add to the kids Radarr instead" → `--server kids-movies`

---

# Multi-User Requests

If `SEERR_USERS` is configured, you can attribute requests to a specific Seerr user using `--user`:

```
node {baseDir}/scripts/request.mjs "Bluey" --type tv --user wife
```

```
node {baseDir}/scripts/request.mjs --id 83053 --type tv --user me
```

`SEERR_USERS` must be set as a comma-separated list of `name:id` pairs where the ID is the Seerr user ID:

```
SEERR_USERS=me:1,wife:2
```

To find a user's Seerr ID, visit the Seerr admin panel under Users.

Detect who the request is for from conversational context:
- "Request Bluey" → no `--user` (or use the current user's configured name)
- "My wife wants Bluey" → `--user wife`
- "Add Dune for me" → `--user me`
- "Can you get Severance for [name]" → `--user [name]`

---

# Notes

- This skill uses the Seerr API
- Requires SEERR_URL and SEERR_API_KEY
- Always search before requesting
- `SEERR_USERS` is optional — omit it if you only have one user account
