# gbppeak-mcp

**MCP server for [GBP Peak](https://gbppeak.com)** — Google Maps geo-grid rank scanning and local SEO data for AI agents.

This package is a small stdio bridge to the hosted GBP Peak MCP endpoint (`https://gbppeak.com/api/mcp`), so any stdio MCP client — Claude Desktop, Claude Code, Cursor, Windsurf, Cline — can use GBP Peak's local SEO tools directly. One API token covers both the REST API and MCP ([docs](https://gbppeak.com/api-docs)).

## Tools

| Tool | What it does |
|---|---|
| `list_analyses` | Your GBP Peak keyword analyses (businesses) |
| `find_keywords` | Local keyword research — measured demand × competition × intent scoring |
| `list_scans` | Geo-grid rank scans for one keyword or location |
| `suggest_keywords` | Generate new keyword candidates from a seed + research prompt |
| `keyword_graph_url` | Interactive keyword relationship graph for an analysis |
| `get_rank_map` | Full geo-grid rank map: stats, competitors, PNG map image |
| `rank_at_point` | "What's my rank at <place>?" — geocodes a place and reads the nearest grid point |
| `trigger_scan` | Run a new geo-grid scan (costs scan points, `confirm: true` required) |

## Setup

1. Get an API token: **gbppeak.com → Settings → AI access** (`gbpk_…`).
2. Add to your MCP client config:

```json
{
  "mcpServers": {
    "gbp-peak": {
      "command": "npx",
      "args": ["-y", "gbppeak-mcp"],
      "env": { "GBPPEAK_TOKEN": "gbpk_your_token_here" }
    }
  }
}
```

That's it — the bridge authenticates with your token and every tool is scoped to your GBP Peak account.

## What is GBP Peak?

GBP Peak scans Google Maps on a grid: instead of one averaged rank, you see your local pack position at every point on the map (grids up to 50×50), competitor leaderboards, rank history, and AI answer-engine visibility (ChatGPT, Gemini, Perplexity). Free public daily scans of Bangkok malls and districts at [gbppeak.com/free-maps](https://gbppeak.com/free-maps). Pricing from $29/month with a free trial.

REST API and webhooks: [gbppeak.com/api-docs](https://gbppeak.com/api-docs) · OpenAPI spec: `GET https://gbppeak.com/api/v1/openapi.json`

## Env

| Variable | Required | Default | Notes |
|---|---|---|---|
| `GBPPEAK_TOKEN` | yes | — | API token (`gbpk_…`) from Settings → AI access |
| `GBPPEAK_URL` | no | `https://gbppeak.com/api/mcp` | Override for self-hosted instances |

## License

MIT
