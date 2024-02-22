import { PropsWithChildren } from "react";
import styles from "./Intro.module.css";

export default function Intro({ children }: PropsWithChildren<{}>) {
  return <div className={styles.intro}>{children}</div>;
}
