import React, { PropsWithChildren } from "react";
import { IllustratedMessage } from "@mittwald/flow-react-components";
import styles from "./Intro.module.css";

/**
 * Introduction of a feature row on the landing pages: a Flow illustrated
 * message with an icon, a heading and text.
 */
export default function Intro({ children }: PropsWithChildren<{}>) {
  return (
    <IllustratedMessage className={styles.intro}>{children}</IllustratedMessage>
  );
}
