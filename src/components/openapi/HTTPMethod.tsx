import React from "react";
import type { BadgeProps } from "@mittwald/flow-react-components";
import clsx from "clsx";
import styles from "./HTTPMethod.module.css";

const methodColors: Record<string, BadgeProps["color"]> = {
  GET: "blue",
  POST: "green",
  PUT: "violet",
  PATCH: "teal",
  DELETE: "red",
};

/**
 * The HTTP method as a Flow badge. Flow's Badge component renders `<div>`
 * elements, which are invalid in running text (e.g. an OperationLink in a
 * Markdown paragraph): the browser closes the paragraph before them, and the
 * page no longer matches React's server-side markup (hydration error). So the
 * badge markup is rendered with `<span>` elements and Flow's badge classes.
 */
export default function HTTPMethod({
  method,
  className,
}: {
  method: string;
  className?: string;
}) {
  const upperMethod = method.toUpperCase();
  const color = methodColors[upperMethod] ?? "neutral";
  return (
    <span
      className={clsx(
        "flow--badge",
        `flow--badge--${color}`,
        styles.method,
        className,
      )}
    >
      <span className="flow--badge--content">{upperMethod}</span>
    </span>
  );
}
