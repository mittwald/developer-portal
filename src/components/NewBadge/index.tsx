import React from "react";
import Translate from "@docusaurus/Translate";
import { Badge } from "@mittwald/flow-react-components";
import styles from "./styles.module.css";

/** Marks new features, styled like the "Neu" badge in the Flow docs */
export function NewBadge() {
  return (
    <Badge color="violet" className={styles.badgeNew}>
      <Translate id="component.newBadge.label">New</Translate>
    </Badge>
  );
}
