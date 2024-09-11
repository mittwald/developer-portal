import { PropsWithChildren } from "react";
import styles from "./Intro.module.css";

export function IntroHeader({ children }: PropsWithChildren<{}>) {
  return <div className={styles.introHeader}>{children}</div>;
}

export default function Intro({ children }: PropsWithChildren<{}>) {
  return <div className={styles.intro}>{children}</div>;
}
