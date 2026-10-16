import React from "react";
import { Badge } from "@mittwald/flow-react-components";
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
    <Badge className={clsx(styles.method, className)} color={color}>
      {upperMethod}
    </Badge>
  );
}
