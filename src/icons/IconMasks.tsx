import React from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronDown,
  faSearch,
} from "@fortawesome/sharp-regular-svg-icons";
import { proIconSet } from "@mittwald/flow-icons-pro";

/** An icon as CSS `url()` for `mask` */
function maskUrl({ icon: [width, height, , , path] }: IconDefinition) {
  const d = Array.isArray(path) ? path.join(" ") : path;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path d="${d}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * Icons drawn by CSS (sidebar chevrons, search field magnifier) as masks from
 * the FontAwesome Pro icons Flow uses for them (`IconChevronDown`,
 * `IconSearch`). Built from the icon definitions instead of being written into
 * the stylesheets, which may not contain Pro icons. Without the Pro icons,
 * the stylesheets' default masks stay.
 */
export default function IconMasks() {
  if (!proIconSet) {
    return null;
  }
  return (
    <style>{`:root {
  --icon-mask--chevron-down: ${maskUrl(faChevronDown)};
  --icon-mask--search: ${maskUrl(faSearch)};
}`}</style>
  );
}
