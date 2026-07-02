---
title: OAuth Consent and Refresh Behavior
description: Expected lifecycle from first consent to background token refresh
---

## Expected Lifecycle {#expected-lifecycle}

1. Client discovers OAuth metadata from the MCP endpoint.
2. User completes browser consent.
3. Client stores access token and refresh token.
4. Client refreshes access token before/at expiry.
5. User is only re-prompted when refresh fails or consent is revoked.

## What should be automatic {#what-should-be-automatic}

- Access token refresh without additional user interaction.
- Retry of failed calls after successful refresh.
- Stable session across long-running agent workflows.

## Signals of a bug {#signals-of-a-bug}

- Re-auth required too frequently despite active usage.
- Refresh succeeds but subsequent tool calls still use expired token.
- Different clients behave inconsistently against the same server.

## Verification prompt {#verification-prompt}

```text
Show me authentication state for this MCP connection: whether OAuth is active, whether refresh has recently succeeded, and whether a new consent is required.
```
