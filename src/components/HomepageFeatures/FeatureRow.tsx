import { PropsWithChildren } from "react";
import styles from "./FeatureRow.module.css";
import clsx from "clsx";

export default function FeatureRow({
  children,
  variant,
}: PropsWithChildren<{ variant?: boolean }>) {
  return (
    <section
      className={clsx(styles.featureRow, variant ? styles.variant : undefined)}
    >
      {children}
    </section>
  );
}
