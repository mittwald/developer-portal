import React from "react";
import styles from "./styles.module.css";
import clsx from "clsx";

export function NewBadge() {
  return (
    <div className={clsx("badge", styles.badgeNew)}>
      <span>NEW</span>
    </div>
  );
}
