import React from "react";
import { Badge, type BadgeProps } from "@mittwald/flow-react-components";
import clsx from "clsx";
import styles from "./HTTPMethod.module.css";

export const methodColors: Record<string, BadgeProps["color"]> = {
  GET: "blue",
  POST: "green",
  PUT: "violet",
  PATCH: "teal",
  DELETE: "red",
};

/** The HTTP method as a Flow badge, also usable in running text */
export default function HTTPMethod({
  method,
  className,
}: {
  method: string;
  className?: string;
}) {
  const upperMethod = method.toUpperCase();
  return (
    <Badge
      color={methodColors[upperMethod] ?? "neutral"}
      className={clsx(styles.method, className)}
    >
      {upperMethod}
    </Badge>
  );
}
