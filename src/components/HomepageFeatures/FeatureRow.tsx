import { PropsWithChildren } from "react";
import styles from "./FeatureRow.module.css";

export default function FeatureRow({ children }: PropsWithChildren<{}>) {
  return <section className={styles.featureRow}>{children}</section>;
}
