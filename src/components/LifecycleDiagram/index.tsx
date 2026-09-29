import React from "react";
import Translate from "@docusaurus/Translate";
import styles from "./styles.module.css";

function Arrow({ label }: { label: React.ReactNode }) {
  return (
    <div className={styles.arrow}>
      <svg width="28" height="46" viewBox="0 0 28 46" aria-hidden="true">
        <path
          d="M14 2 C11 14, 17 26, 14 40 M7 33 L14 42 L21 33"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{label}</span>
    </div>
  );
}

/** Whiteboard-style overview of the model lifecycle phases */
function LifecycleDiagram() {
  return (
    <figure className={styles.board}>
      <div className={`${styles.token} ${styles.tokenA}`}>
        <Translate id="lifecycle.diagram.testphase">Testphase</Translate>
      </div>
      <Arrow
        label={
          <Translate id="lifecycle.diagram.testphase.duration">
            at least 1 month
          </Translate>
        }
      />
      <div className={styles.row}>
        <div className={`${styles.token} ${styles.tokenB}`}>Stable</div>
        <div className={`${styles.token} ${styles.tokenA}`}>LTS</div>
      </div>
      <div className={styles.divider} />
      <div className={styles.row}>
        <Arrow
          label={
            <Translate id="lifecycle.diagram.stable.notice">
              3 months notice
            </Translate>
          }
        />
        <Arrow
          label={
            <Translate id="lifecycle.diagram.lts.notice">
              6 months notice
            </Translate>
          }
        />
      </div>
      <div className={styles.output}>
        <Translate id="lifecycle.diagram.deprecation">
          Shutdown date and replacement model
        </Translate>
      </div>
    </figure>
  );
}

export default LifecycleDiagram;
