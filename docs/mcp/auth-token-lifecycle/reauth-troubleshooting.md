---
title: Re-auth Troubleshooting and Recovery
description: Diagnose repeated consent prompts and recover cleanly
---

## Common Symptoms

- MCP calls fail with `invalid_token`.
- Client repeatedly asks for browser login.
- Session works briefly, then fails during long runs.

## Fast Recovery

1. Confirm the MCP server config is correct (`mcp list/get` in your client).
2. Run explicit re-login for the server.
3. Retry a read-only call first.
4. Resume the interrupted workflow from the failed step.

## What to Capture for Bug Reports

- Timestamp of failure (UTC)
- Client and version
- Server endpoint
- Error payload (redacted)
- Whether refresh was expected but did not occur

## Resume Prompt

```text
Resume from the failed step using existing successful results from this session. Do not rerun completed steps.
```
