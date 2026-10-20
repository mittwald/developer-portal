import referenceSidebar from "@site/sidebar.reference.json";
import v1Sidebar from "@site/versioned_sidebars/version-v1-sidebars.json";
import { canonicalizeTitle } from "@site/generator/util/title";
import { OpenAPIV3 } from "openapi-types";
import { APIVersion } from "@site/src/openapi/specs";

type SummaryMap = Record<string, string>;

// The reference generator stores each operation's title (with the overlays
// applied) in the sidebar items; collected by operation ID
function collectSummaries(sidebar: unknown, summaries: SummaryMap = {}) {
  if (Array.isArray(sidebar)) {
    sidebar.forEach((item) => collectSummaries(item, summaries));
  } else if (sidebar && typeof sidebar === "object") {
    const item = sidebar as {
      type?: string;
      id?: string;
      customProps?: { summary?: string };
    };
    if (item.type === "doc" && item.id && item.customProps?.summary) {
      summaries[item.id.split("/").pop()!] = item.customProps.summary;
    }
    Object.values(sidebar).forEach((value) =>
      collectSummaries(value, summaries),
    );
  }
  return summaries;
}

const summaries: Partial<Record<APIVersion, SummaryMap>> = {
  v1: collectSummaries(v1Sidebar),
  v2: collectSummaries(referenceSidebar),
};

/**
 * The title of an operation as used in the sidebar and as page title, so that
 * lists and hints show the same title; operations without a reference page
 * (e.g. preview) get their summary canonicalized the same way
 */
export default function operationSummary(
  apiVersion: APIVersion,
  operation: OpenAPIV3.OperationObject,
): string {
  return (
    summaries[apiVersion]?.[operation.operationId ?? ""] ??
    canonicalizeTitle(operation.summary) ??
    operation.operationId ??
    ""
  );
}
