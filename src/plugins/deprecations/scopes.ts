import type { DeprecationScope } from "./types";

/** Display name of a scope, e.g. "API v2" for "api/v2" (server and client) */
export function scopeLabel(scope: DeprecationScope): string {
  if (scope === "product") return "Product";
  if (scope === "cli") return "CLI";
  if (scope === "api") return "API";
  return `API ${scope.slice("api/".length)}`;
}
