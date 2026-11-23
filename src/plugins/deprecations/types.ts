/*
 * Data the deprecations plugin hands to its page components (embedded in
 * the MDX it generates). Kept free of runtime imports, so that client code
 * can import it.
 */

/** "api" means all API versions */
export type DeprecationScope = "product" | "cli" | "api" | `api/v${number}`;

/** "active" until the sunset date has passed, "past" afterwards */
export type DeprecationStatus = "active" | "past";

export interface DeprecationSummary {
  slug: string;
  permalink: string;
  title: string;
  summary: string;
  /** At least one; sorted */
  scopes: DeprecationScope[];
  status: DeprecationStatus;
  /** ISO date (YYYY-MM-DD) */
  announced: string;
  /** ISO date (YYYY-MM-DD) */
  sunset?: string;
}

/** Global data of the plugin (`usePluginData("deprecations")`) */
export interface DeprecationsGlobalData {
  /** Base path of the deprecation pages, including the base URL */
  path: string;
  /** Docs sidebar the pages belong to */
  sidebar: string;
}
