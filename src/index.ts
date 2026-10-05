#!/usr/bin/env node
/**
 * gbppeak-mcp — stdio MCP bridge to the hosted GBP Peak MCP endpoint.
 *
 * GBP Peak runs a Streamable-HTTP MCP server at https://gbppeak.com/api/mcp,
 * authenticated with a per-account API token (Settings → AI access, `gbpk_…`).
 * This bridge lets any stdio MCP client (Claude Desktop, Claude Code, Cursor,
 * Windsurf…) use it:
 *
 *   {
 *     "mcpServers": {
 *       "gbp-peak": {
 *         "command": "npx",
 *         "args": ["-y", "gbppeak-mcp"],
 *         "env": { "GBPPEAK_TOKEN": "gbpk_…" }
 *       }
 *     }
 *   }
 *
 * Tools: list_analyses, find_keywords, list_scans, suggest_keywords,
 * keyword_graph_url, get_rank_map, rank_at_point, trigger_scan.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const REMOTE_URL = process.env.GBPPEAK_URL || "https://gbppeak.com/api/mcp";
const TOKEN = process.env.GBPPEAK_TOKEN || "";

if (!TOKEN) {
  console.error(
    "gbppeak-mcp: missing GBPPEAK_TOKEN. Create an API token at https://gbppeak.com (Settings → AI access)."
  );
  process.exit(1);
}

const upstream = new Client({ name: "gbppeak-mcp-bridge", version: "1.0.0" });
const transport = new StreamableHTTPClientTransport(new URL(REMOTE_URL), {
  requestInit: { headers: { Authorization: `Bearer ${TOKEN}` } },
});

try {
  await upstream.connect(transport);
} catch (err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`gbppeak-mcp: could not connect to ${REMOTE_URL}: ${msg}`);
  process.exit(1);
}

const bridge = new Server(
  { name: "gbp-peak", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

bridge.setRequestHandler(ListToolsRequestSchema, async () => {
  const res = await upstream.listTools();
  return { tools: res.tools };
});

bridge.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  return upstream.callTool({ name, arguments: args });
});

const stdio = new StdioServerTransport();
await bridge.connect(stdio);
console.error(`gbppeak-mcp: bridging stdio → ${REMOTE_URL}`);
