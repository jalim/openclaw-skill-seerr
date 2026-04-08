# OpenClaw Seerr Skill

Natural language movie & TV requests via Seerr for OpenClaw.

## Features

- Search Movies / TV
- Request Movies
- Request TV (full series or seasons)
- Check Request Status
- Natural language friendly

Examples:

“Request Bluey”

“Get me season 2 of Severance”

“Add Dune Part Two”

“What’s pending?”

—

## Requirements

- OpenClaw
- Seerr instance
- Seerr API key
- Node 18+

—

## Setup

Clone into OpenClaw skills:

```bash
cd ~/.openclaw/skills
git clone https://github.com/<yourusername>/openclaw-skill-seerr.git seerr

export SEERR_URL=“http://localhost:5055”
export SEERR_API_KEY=“your_api_key”