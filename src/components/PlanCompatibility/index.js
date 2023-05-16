import React from "react";
import styles from "./styles.module.css";
import Translate from "@docusaurus/Translate";
import clsx from "clsx";
import Link from "@docusaurus/Link";

const planNames = {
  psl: { name: "proSpace lite", url: "https://www.mittwald.de/prospace" },
  ps: { name: "proSpace", url: "https://www.mittwald.de/prospace" },
  ss: { name: "Space Server", url: "https://www.mittwald.de/space-server" },
};

export default function PlanCompatibility({ plans }) {
  const names = plans
    .map((plan) => (
      <Link to={planNames[plan].url} target="_blank">
        {planNames[plan].name}
      </Link>
    ))
    .map((n) => <span className={styles.compatName}>{n}</span>)
    .reduce((prev, curr) => [prev, ", ", curr]);

  return (
    <div className={clsx(styles.compatNotice, "alert", "alert--info")}>
      <div className={styles.compatNoticeTitle}>
        ⚠︎ <Translate id="compat.title">Compatibility notice</Translate>
      </div>
      <div>
        <Translate id="compat.body">
          This documentation applies only to the following plans
        </Translate>
        : {names}.
      </div>
    </div>
  );
}
