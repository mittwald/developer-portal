import React, {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
} from "react";
import { AlertBadge } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/**
 * List items in the API changelog start breaking changes with
 * `⚠️ **Breaking:**`; this marker is rendered as a Flow warning alert badge
 * ("Breaking") instead of a warning icon and bold text.
 *
 * Returns the content with the marker replaced in place (also inside a
 * leading element like the paragraph of a loose list item), or `undefined`
 * if it does not start with the marker.
 */
export function replaceBreakingMarker(
  children: ReactNode,
): ReactNode | undefined {
  const nodes = Children.toArray(children);
  const index = nodes.findIndex(
    (node) => !(typeof node === "string" && !node.trim()),
  );
  const first = nodes[index];

  // The marker is a warning emoji followed by a bold label ending with ":".
  // The emoji is matched with and without its (invisible) emoji presentation
  // selector U+FE0F, as either may end up in hand-written content.
  if (
    typeof first === "string" &&
    first.replace(/\uFE0F/g, "").trim() === "\u26A0"
  ) {
    const label = nodes[index + 1];
    if (
      isValidElement<{ children?: ReactNode }>(label) &&
      label.type === "strong" &&
      typeof label.props.children === "string" &&
      label.props.children.endsWith(":")
    ) {
      nodes.splice(
        index,
        2,
        <BreakingBadge key="breakingBadge">
          {label.props.children.slice(0, -1)}
        </BreakingBadge>,
      );
      return nodes;
    }
    return undefined;
  }

  if (isValidElement<{ children?: ReactNode }>(first)) {
    const inner = replaceBreakingMarker(first.props.children);
    if (inner === undefined) {
      return undefined;
    }
    nodes[index] = cloneElement(first, undefined, inner);
    return nodes;
  }

  return undefined;
}

function BreakingBadge({ children }: { children: ReactNode }) {
  return (
    <AlertBadge status="warning" className={styles.breakingBadge}>
      {children}
    </AlertBadge>
  );
}
